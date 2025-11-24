import os
import pandas as pd
from tqdm import tqdm
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import certifi

load_dotenv()

MONGO_URL = os.environ["MONGODB_URL"]  
DB_NAME = "travel_rag"
COLL_NAME = "places"
CSV_PATH = "dataset/global_travel_sample_6000.csv"

model = SentenceTransformer("all-MiniLM-L6-v2")

df = pd.read_csv(CSV_PATH)

def build_text(row):
    return (
        f"Name: {row['name']}. "
        f"Type: {row['type']} in {row['city']}, {row['country']}. "
        f"Description: {row['description']}. "
        f"Amenities: {row['amenities']}. "
        f"Category: {row['category']}. "
        f"Nearby: {row['nearby_destinations']}."
    )

df["text"] = df.apply(build_text, axis=1)

embeddings = model.encode(df["text"].tolist(), show_progress_bar=True)

client = MongoClient(
    MONGO_URL,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=30000,
    connectTimeoutMS=30000,
    socketTimeoutMS=30000
)
col = client[DB_NAME][COLL_NAME]

docs = []
for idx, (i, row) in enumerate(tqdm(df.iterrows(), total=len(df))):
    doc = {
        "_id": row["id"],
        "name": row["name"],
        "type": row["type"],
        "country": row["country"],
        "city": row["city"],
        "latitude": float(row["latitude"]),
        "longitude": float(row["longitude"]),
        "average_price_usd": float(row["average_price_usd"]),
        "rating": float(row["rating"]),
        "rating_count": int(row["rating_count"]),
        "amenities": row["amenities"],
        "description": row["description"],
        "popularity_score": float(row["popularity_score"]),
        "category": row["category"],
        "nearby_destinations": row["nearby_destinations"],
        "generated_at": row["generated_at"],
        "embedding": embeddings[idx].tolist(),
    }
    docs.append(doc)

col.insert_many(docs)