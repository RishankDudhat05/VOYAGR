
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from auth import hash_password, verify_password, create_access_token
from jose import jwt
import os


@pytest.mark.unit
class TestPasswordStuff:
    
    def test_hashing_logic(self):
        
        password = "abcdefG1"
        hashed = hash_password(password)
        assert hashed is not None
        assert isinstance(hashed, str)
        assert hashed != password
        assert hashed.startswith("$argon2")
        
        hash1 = hash_password(password)
        hash2 = hash_password(password)
        assert hash1 != hash2
        
        assert verify_password(password, hashed) is True
        
        wrong_password = "abcdefG2"
        assert verify_password(wrong_password, hashed) is False
        
        assert verify_password("", hashed) is False
        
        special_pass = "p@ssw0rd!#$%^&*()"
        special_hash = hash_password(special_pass)
        assert verify_password(special_pass, special_hash) is True
        
        unicode_pass = "abc@gartu"
        unicode_hash = hash_password(unicode_pass)
        assert verify_password(unicode_pass, unicode_hash) is True
        
        long_pass = "a" * 1000
        long_hash = hash_password(long_pass)
        assert verify_password(long_pass, long_hash) is True


@pytest.mark.unit
class TestJWT:
    
    def test_token_creation(self):
        from jose import JWTError
        
        email = "test@example.com"
        data = {"sub": email}
        token = create_access_token(data)
        
        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0
        
        decoded = jwt.decode(
            token,
            os.getenv("SECRET_KEY"),
            algorithms=[os.getenv("ALGORITHM")]
        )
        assert decoded["sub"] == email
        assert "exp" in decoded
        
        data2 = {"sub": "test@example.com", "role": "admin", "user_id": 123}
        token2 = create_access_token(data2)
        decoded2 = jwt.decode(
            token2,
            os.getenv("SECRET_KEY"),
            algorithms=[os.getenv("ALGORITHM")]
        )
        assert decoded2["sub"] == "test@example.com"
        
        invalid_token = "invalid.token.here"
        with pytest.raises(JWTError):
            jwt.decode(
                invalid_token,
                os.getenv("SECRET_KEY"),
                algorithms=[os.getenv("ALGORITHM")]
            )
        
        tampered_token = token[:-10] + "xyz"
        with pytest.raises(JWTError):
            jwt.decode(
                tampered_token,
                os.getenv("SECRET_KEY"),
                algorithms=[os.getenv("ALGORITHM")]
            )
        
        with pytest.raises(JWTError):
            jwt.decode(
                token,
                "secret_leaked",
                algorithms=[os.getenv("ALGORITHM")]
            )


@pytest.mark.unit
class TestDBConnection:
    
    def test_connection_setup(self):
        import database
        import certifi
        from database import users_collection, get_database
        
        assert hasattr(database, "client")
        assert hasattr(database, "database")
        assert hasattr(database, "users_collection")
        
        assert users_collection is not None
        
        assert certifi.where() is not None
        
        db = get_database()
        assert db is not None
        assert db == database.database

@pytest.mark.unit
class TestSchemas:
    
    def test_validation(self):
        from schemas import UserCreate, Token, UserResponse, SearchHistoryItem, SendOtpRequest, VerifyOtpRequest
        from pydantic import ValidationError
        from datetime import datetime
        
        user_data = {
            "name": "testuser",
            "email_id": "test@example.com",
            "password": "password123"
        }
        user = UserCreate(**user_data)
        assert user.name == "testuser"
        assert user.email_id == "test@example.com"
        
        bad_email_data = {
            "name": "testuser",
            "email_id": "invalid-email",
            "password": "password123"
        }
        with pytest.raises(ValidationError):
            UserCreate(**bad_email_data)
        
        short_name_data = {
            "name": "usr",
            "email_id": "test@example.com",
            "password": "password123"
        }
        with pytest.raises(ValidationError):
            UserCreate(**short_name_data)
        
        short_pass_data = {
            "name": "testuser",
            "email_id": "test@example.com",
            "password": "12345"
        }
        with pytest.raises(ValidationError):
            UserCreate(**short_pass_data)
        
        token_data = {
            "access_token": "test_token_123",
            "token_type": "bearer"
        }
        token = Token(**token_data)
        assert token.access_token == "test_token_123"
        
        user_resp_data = {
            "_id": "507f1f77bcf86cd799439011",
            "name": "testuser",
            "email_id": "test@example.com",
            "search_history": []
        }
        user_resp = UserResponse(**user_resp_data)
        assert user_resp.id == "507f1f77bcf86cd799439011"
        
        item_data = {
            "query": "Best places in Paris",
            "timestamp": datetime.now(),
            "response_type": "places"
        }
        item = SearchHistoryItem(**item_data)
        assert item.query == "Best places in Paris"
        
        otp_req = SendOtpRequest(email="test@example.com")
        assert otp_req.email == "test@example.com"
        
        with pytest.raises(ValidationError):
            SendOtpRequest(email="invalid-email")
            
        verify_req = VerifyOtpRequest(email="test@example.com", otp="123456")
        assert verify_req.otp == "123456"


@pytest.mark.unit
class TestModels:
    
    def test_model_classes(self):
        from models import User, SearchHistoryItem, PyObjectId
        from datetime import datetime
        from bson import ObjectId
        import pytest
        
        user_data = {
            "name": "testuser",
            "email_id": "test@example.com",
            "hashed_password": "$argon2id$v=19$m=65536$...",
            "search_history": []
        }
        user = User(**user_data)
        assert user.name == "testuser"
        
        user_data2 = {
            "name": "testuser",
            "email_id": "test@example.com",
            "hashed_password": "$argon2id$v=19$m=65536$...",
            "search_history": [
                {
                    "query": "Paris travel",
                    "timestamp": datetime.now(),
                    "response_type": "itinerary"
                }
            ]
        }
        user2 = User(**user_data2)
        assert len(user2.search_history) == 1
        
        valid_oid = ObjectId()
        validated_oid = PyObjectId.validate(valid_oid)
        assert validated_oid == valid_oid
        
        valid_str = "507f1f77bcf86cd799439011"
        validated_from_str = PyObjectId.validate(valid_str)
        assert isinstance(validated_from_str, ObjectId)
        
        with pytest.raises(ValueError):
            PyObjectId.validate("invalid_id_string")
        
        with pytest.raises(ValueError):
            PyObjectId.validate(12345)
        
        with pytest.raises(ValueError):
            PyObjectId.validate(None)
        
        user_with_id = User(
            id=ObjectId(),
            name="usertest",
            email_id="user@test.com",
            hashed_password="hashed_pass",
            search_history=[]
        )
        assert user_with_id.id is not None
        
        search_item = SearchHistoryItem(
            query="test query",
            timestamp=datetime.now(),
            response_type="recommendation"
        )
        assert search_item.response_type == "recommendation"
        
        search_item2 = SearchHistoryItem(
            query="another query",
            timestamp=datetime.now()
        )
        assert search_item2.response_type is None
        
        user_with_history = User(
            name="historyuser",
            email_id="history@test.com",
            hashed_password="hash123",
            search_history=[
                SearchHistoryItem(query="q1", timestamp=datetime.now(), response_type="type1"),
                SearchHistoryItem(query="q2", timestamp=datetime.now()),
                SearchHistoryItem(query="q3", timestamp=datetime.now(), response_type="type3")
            ]
        )
        assert len(user_with_history.search_history) == 3


@pytest.mark.integration
class TestDBOperations:
    
    async def test_crud_operations(self, mock_users_collection):
        
        doc = {
            "name": "testuser",
            "email_id": "test@example.com",
            "hashed_password": "hashed123"
        }
        result = await mock_users_collection.insert_one(doc)
        assert result.inserted_id is not None
        
        found = await mock_users_collection.find_one({"email_id": "test@example.com"})
        assert found is not None
        assert found["name"] == "testuser"
        
        
        update_result = await mock_users_collection.update_one(
            {"email_id": "test@example.com"},
            {"$set": {"name": "updateduser"}}
        )
        assert update_result.modified_count == 1
        
        found_updated = await mock_users_collection.find_one({"email_id": "test@example.com"})
        assert found_updated["name"] == "updateduser"
        
        delete_result = await mock_users_collection.delete_one({"email_id": "test@example.com"})
        assert delete_result.deleted_count == 1
        
        found_after_delete = await mock_users_collection.find_one({"email_id": "test@example.com"})
        assert found_after_delete is None


@pytest.mark.unit
class TestOTPLogic:
    
    def test_otp_generation_and_validation(self):
        from auth import generate_otp, save_otp, check_otp, OTP_STORE
        import time
        
        otp = generate_otp()
        assert len(otp) == 6
        assert otp.isdigit()
        
        email = "otp_test@example.com"
        
        save_otp(email, otp, ttl_seconds=10)
        assert email in OTP_STORE
        assert OTP_STORE[email]["otp"] == otp
        
        assert check_otp(email, otp) is True
        assert email not in OTP_STORE
        
        save_otp(email, otp, ttl_seconds=10)
        assert check_otp(email, "000000") is False
        assert email in OTP_STORE
        
        save_otp(email, otp, ttl_seconds=-1) 
        assert check_otp(email, otp) is False
        assert email not in OTP_STORE

