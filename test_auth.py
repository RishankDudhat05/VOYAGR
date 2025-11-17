import pytest
from backend.auth import hash_password, verify_password, create_access_token
from jose import jwt
from datetime import datetime, timedelta
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES


def test_hash_password():
    password = "mypassword123"
    hashed = hash_password(password)


    assert hashed != password
    assert isinstance(hashed, str)


def test_verify_password_correct():
    password = "test123"
    hashed = hash_password(password)

    assert verify_password(password, hashed) is True


def test_verify_password_incorrect():
    password = "correct_password"
    hashed = hash_password(password)

    assert verify_password("wrong_password", hashed) is False


def test_create_access_token():
    data = {"sub": "user1"}

    token = create_access_token(data)
    assert isinstance(token, str)

    decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

  
    assert decoded["sub"] == "user1"
    assert "exp" in decoded

  
    expire_time = datetime.fromtimestamp(decoded["exp"])
    expected_exp = datetime.now() + timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))

    assert abs((expire_time - expected_exp).total_seconds()) < 5

