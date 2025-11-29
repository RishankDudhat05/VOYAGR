from pydantic import BaseModel, Field
from typing import Optional, List
from bson import ObjectId
from datetime import datetime

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

class SearchHistoryItem(BaseModel):
    query: str
    timestamp: datetime
    response_type: Optional[str] = None

class User(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: str
    email_id: str
    hashed_password: str
    search_history: Optional[List[SearchHistoryItem]] = Field(default_factory=list)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


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

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class RecommendationRequest(BaseModel):
    trip_name: str
    notes: str | None = ""
    selected_places: List[str]
    city: str
