import pytest
from pydantic import ValidationError
from backend.schemas import UserCreate, UserResponse, Token


def test_user_create_valid():
    user = UserCreate(
        name="Prince",
        email_id="test@example.com",
        password="strongpass"
    )
    assert user.name == "Prince"
    assert user.email_id == "test@example.com"
    assert user.password == "strongpass"

def test_user_create_invalid_short_name():
    with pytest.raises(ValidationError):
        UserCreate(
            name="abc",  
            email_id="test@example.com",
            password="strongpass"
        )

def test_user_create_invalid_long_name():
    long_name = "a" * 21  
    with pytest.raises(ValidationError):
        UserCreate(
            name=long_name,
            email_id="test@example.com",
            password="strongpass"
        )

def test_user_create_invalid_email():
    with pytest.raises(ValidationError):
        UserCreate(
            name="Prince",
            email_id="notanemail",
            password="strongpass"
        )

def test_user_create_password_length():
    with pytest.raises(ValidationError):
        UserCreate(
            name="Prince",
            email_id="test@example.com",
            password="123" 
        )

def test_user_response_alias_support():
    payload = {
        "_id": "12345",
        "name": "Prince",
        "email_id": "test@example.com",
    }

    user = UserResponse(**payload)

    assert user.id == "12345"
    assert user.name == "Prince"
    assert user.email_id == "test@example.com"

    assert user.model_dump(by_alias=True)["_id"] == "12345"

def test_token_schema_valid():
    token = Token(
        access_token="abc123",
        token_type="bearer"
    )
    assert token.access_token == "abc123"
    assert token.token_type == "bearer"

def test_token_schema_missing_fields():
    with pytest.raises(ValidationError):
        Token(access_token="abc123")  

    with pytest.raises(ValidationError):
        Token(token_type="bearer")  
