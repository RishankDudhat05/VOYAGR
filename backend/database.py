from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import certifi

load_dotenv()

# MongoDB connection URL - update this with your MongoDB connection string
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# Async client for FastAPI with SSL configuration for MongoDB Atlas
client = AsyncIOMotorClient(
    MONGODB_URL,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=30000,
    connectTimeoutMS=30000,
    socketTimeoutMS=30000
)
database = client[DATABASE_NAME]

# Collections
users_collection = database.get_collection("users")

# Function to get database (for dependency injection)
def get_database():
    return database
