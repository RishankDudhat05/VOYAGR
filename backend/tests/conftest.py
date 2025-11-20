import pytest
import asyncio
from typing import AsyncGenerator, Generator
from httpx import AsyncClient, ASGITransport
from motor.motor_asyncio import AsyncIOMotorClient
from unittest.mock import MagicMock, AsyncMock, patch
import os
from datetime import datetime

# Set test environment variables before importing app modules
os.environ["SECRET_KEY"] = "abcdefghijklmnopqrstuvwxyz"
os.environ["ALGORITHM"] = "HS256"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"
os.environ["GROQ_API_KEY"] = "api_key"
os.environ["MONGODB_URL"] = "mongodb+srv://202301076:hey_Mongo_0211@cluster0.ya0ymet.mongodb.net/?appName=Cluster0"
os.environ["DATABASE_NAME"] = "voyagr"
os.environ["SENDGRID_API_KEY"] = "SG.fake_key"
os.environ["SENDGRID_SENDER_EMAIL"] = "test@voyagr.com"

from main import app
from database import users_collection


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def mock_users_collection():
    
    mock_collection = AsyncMock()
    
    # Mock data storage
    mock_collection._data = {}
    mock_collection._id_counter = 1
    
    async def mock_insert_one(document):
        doc_id = mock_collection._id_counter
        mock_collection._id_counter += 1
        mock_collection._data[doc_id] = {**document, "_id": doc_id}
        result = MagicMock()
        result.inserted_id = doc_id
        return result
    
    async def mock_find_one(filter_dict):
        for doc_id, doc in mock_collection._data.items():
            if all(doc.get(k) == v for k, v in filter_dict.items()):
                return doc.copy()
        return None
    
    async def mock_update_one(filter_dict, update_dict):
        for doc_id, doc in mock_collection._data.items():
            if all(doc.get(k) == v for k, v in filter_dict.items()):
                if "$push" in update_dict:
                    for field, value in update_dict["$push"].items():
                        if isinstance(value, dict) and "$each" in value:
                            items = value["$each"]
                            slice_value = value.get("$slice", None)
                            if field not in doc:
                                doc[field] = []
                            doc[field].extend(items)
                            if slice_value:
                                doc[field] = doc[field][slice_value:]
                        else:
                            if field not in doc:
                                doc[field] = []
                            doc[field].append(value)
                if "$set" in update_dict:
                    doc.update(update_dict["$set"])
                result = MagicMock()
                result.modified_count = 1
                return result
        result = MagicMock()
        result.modified_count = 0
        return result
    
    async def mock_delete_one(filter_dict):
        for doc_id, doc in list(mock_collection._data.items()):
            if all(doc.get(k) == v for k, v in filter_dict.items()):
                del mock_collection._data[doc_id]
                result = MagicMock()
                result.deleted_count = 1
                return result
        result = MagicMock()
        result.deleted_count = 0
        return result
    
    mock_collection.insert_one = mock_insert_one
    mock_collection.find_one = mock_find_one
    mock_collection.update_one = mock_update_one
    mock_collection.delete_one = mock_delete_one
    
    return mock_collection


@pytest.fixture
async def test_client(mock_users_collection) -> AsyncGenerator[AsyncClient, None]:
    
    with patch("database.users_collection", mock_users_collection):
        with patch("router.auth_routes.users_collection", mock_users_collection):
            with patch("router.tripai.users_collection", mock_users_collection):
                with patch("router.recommendations.users_collection", mock_users_collection):
                    transport = ASGITransport(app=app)
                    async with AsyncClient(transport=transport, base_url="http://test") as client:
                        yield client


@pytest.fixture
def sample_user_data():
    
    return {
        "name": "testuser",
        "email_id": "test@example.com",
        "password": "password123"
    }


@pytest.fixture
def sample_user_data_short_password():
    
    return {
        "name": "testuser",
        "email_id": "test@example.com",
        "password": "12345"
    }


@pytest.fixture
def sample_user_data_invalid_email():
    
    return {
        "name": "testuser",
        "email_id": "invalid-email",
        "password": "password123"
    }


@pytest.fixture
def sample_user_data_short_name():
    
    return {
        "name": "usr",
        "email_id": "test@example.com",
        "password": "password123"
    }


@pytest.fixture
async def authenticated_user(test_client: AsyncClient, sample_user_data, mock_users_collection):
    
    # Register user 
    response = await test_client.post("/auth/signup", json=sample_user_data)
    assert response.status_code == 200
    
    # Login to get token
    login_data = {
        "username": sample_user_data["email_id"],
        "password": sample_user_data["password"]
    }
    response = await test_client.post(
        "/auth/token",
        data=login_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 200
    token_data = response.json()
    
    return {
        "token": token_data["access_token"],
        "user_data": sample_user_data
    }


@pytest.fixture
def mock_groq_llm():
    
    with patch("router.tripai.chain") as mock_chain:
        async def mock_ainvoke(input_dict):
            prompt = input_dict.get("user_prompt", "").lower()
            
            if "paris" in prompt:
                return {
                    "type": "itinerary",
                    "country": "France",
                    "cities": ["Paris"],
                    "days": [
                        {
                            "day": 1,
                            "plan": ["Visit Eiffel Tower", "Louvre Museum", "Seine River Cruise"]
                        },
                        {
                            "day": 2,
                            "plan": ["Notre-Dame Cathedral", "Montmartre", "Sacré-Cœur"]
                        },
                        {
                            "day": 3,
                            "plan": ["Versailles Palace", "Champs-Élysées", "Arc de Triomphe"]
                        }
                    ]
                }
            elif "food" in prompt or "spicy" in prompt:
                return {
                    "type": "places",
                    "location": "India",
                    "category": "Spicy Foods",
                    "places": [
                        {"name": "Vindaloo", "speciality": "Extremely spicy curry", "address": "Goa"},
                        {"name": "Phaal", "speciality": "One of the hottest curries", "address": "UK Indian restaurants"},
                        {"name": "Ghost Pepper Chicken", "speciality": "Ghost pepper infused", "address": "Northeast India"}
                    ]
                }
            elif "programming" in prompt or "math" in prompt:
                return {
                    "type": "unsupported",
                    "message": "My circuits are buzzing for travel, not that! I can only help with travel, food, and lifestyle questions."
                }
            else:
                return {
                    "type": "general",
                    "message": "That sounds like fun! Could you give me a few more details to help plan the perfect trip?"
                }
        
        mock_chain.ainvoke = mock_ainvoke
        yield mock_chain


@pytest.fixture
def sample_search_history():
    
    return [
        {
            "query": "Best places in Paris",
            "timestamp": datetime.now(),
            "response_type": "places"
        },
        {
            "query": "3-day Paris itinerary",
            "timestamp": datetime.now(),
            "response_type": "itinerary"
        },
        {
            "query": "Romantic restaurants Paris",
            "timestamp": datetime.now(),
            "response_type": "places"
        }
    ]
