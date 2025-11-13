import os
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.environ["MONGODB_URL"]
DB_NAME = "travel_rag"
COLL_NAME = "places"
VECTOR_INDEX_NAME = "vector_index"

client = MongoClient(MONGO_URI)
col = client[DB_NAME][COLL_NAME]
model = SentenceTransformer("all-MiniLM-L6-v2")

def semantic_search(query, top_k=5):
    q_emb = model.encode(query).tolist()
    pipeline = [
        {
            "$vectorSearch": {
                "index": VECTOR_INDEX_NAME,
                "path": "embedding",
                "queryVector": q_emb,
                "numCandidates": 100,
                "limit": top_k,
            }
        },
        {
            "$project": {
                "name": 1,
                "city": 1,
                "country": 1,
                "category": 1,
                "description": 1,
                "score": {"$meta": "vectorSearchScore"},
            }
        }
    ]
    results = list(col.aggregate(pipeline))
    return results