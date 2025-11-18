import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "voyagr")

if not isinstance(DATABASE_NAME, str):
    DATABASE_NAME = "voyagr"

client = AsyncIOMotorClient(MONGO_URL)

try:
    database = client[DATABASE_NAME]
except Exception:
    # Prevent pytest crash
    database = client["voyagr_test"]

users_collection = database.get_collection("users")

def get_database():
    return database
