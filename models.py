from pydantic import BaseModel, Field, GetJsonSchemaHandler
from pydantic.json_schema import JsonSchemaValue
from typing import Optional, List
from bson import ObjectId
from datetime import datetime


# ------------ FIXED: Pydantic v2 compatible PyObjectId ------------
class PyObjectId(ObjectId):

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(
        cls,
        core_schema,
        handler: GetJsonSchemaHandler
    ) -> JsonSchemaValue:
        json_schema = handler(core_schema)
        json_schema.update(type="string")
        return json_schema


# ------------ SEARCH HISTORY ------------
class SearchHistoryItem(BaseModel):
    query: str
    timestamp: datetime
    response_type: Optional[str] = None


# ------------ USER MODEL ------------
class User(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: str
    email_id: str
    hashed_password: str
    search_history: Optional[List[SearchHistoryItem]] = Field(default_factory=list)

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str},
    }


# ------------ TRIP MODELS ------------
class PlaceItem(BaseModel):
    name: str
    address: str
    duration: str


class DayPlan(BaseModel):
    day: int
    places: List[PlaceItem]


class ManualTrip(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user_email: Optional[str] = None
    trip_name: str
    notes: Optional[str] = None
    days: List[DayPlan]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str},
    }


# ------------ RECOMMENDATION REQUEST ------------
class RecommendationRequest(BaseModel):
    trip_name: str
    notes: Optional[str] = ""
    selected_places: List[str]
    city: str
