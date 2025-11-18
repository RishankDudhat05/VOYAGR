import pytest
import pytest_asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from backend.database import client, database, users_collection, get_database

@pytest_asyncio.fixture
async def test_db():
    """Return a test database instance."""
    return database

def test_client_connection():
    assert isinstance(client, AsyncIOMotorClient)

def test_database_name():
    assert database.name is not None
    assert isinstance(database.name, str)

def test_users_collection_exists():
    assert users_collection is not None
    assert users_collection.name == "users"

@pytest_asyncio.fixture
async def db_from_func():
    db = await get_database()
    return db


@pytest.mark.asyncio
async def test_get_database(db_from_func):
    assert db_from_func.name == database.name

@pytest.mark.asyncio
async def test_insert_and_find(test_db):
    test_document = {"name": "Prince", "email": "prince@example.com"}

    result = await users_collection.insert_one(test_document)
    assert result.inserted_id is not None

    found = await users_collection.find_one({"_id": result.inserted_id})
    assert found is not None
    assert found["name"] == "Prince"

    await users_collection.delete_one({"_id": result.inserted_id})
