import pytest
from bson import ObjectId
from backend.models import PyObjectId, User


def test_pyobjectid_valid():
    valid_id = str(ObjectId())
    result = PyObjectId.validate(valid_id)
    assert isinstance(result, ObjectId)


def test_pyobjectid_invalid():
    with pytest.raises(ValueError):
        PyObjectId.validate("not-a-valid-object-id")


def test_pyobjectid_json_schema():
    schema = {}
    PyObjectId.__get_pydantic_json_schema__(schema)
    assert schema["type"] == "string"


def test_user_model_creation():
    user = User(
        name="John Doe",
        email_id="john@example.com",
        hashed_password="hashed123"
    )
    assert user.name == "John Doe"
    assert user.email_id == "john@example.com"
    assert user.hashed_password == "hashed123"
    assert user.id is None


def test_user_model_with_id_alias():
    oid = str(ObjectId())
    user = User(
        _id=oid,
        name="Alice",
        email_id="alice@example.com",
        hashed_password="pwd123"
    )

    assert str(user.id) == oid
    assert user.model_dump(by_alias=True)["_id"] == oid


def test_user_json_encoding():
    oid = str(ObjectId())  
    user = User(
        _id=oid,
        name="Test User",
        email_id="t@example.com",
        hashed_password="testpwd"
    )

    dumped = user.model_dump()
    assert dumped["id"] == oid
