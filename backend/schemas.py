from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str = Field(..., min_length=4, max_length=20)
    email_id: EmailStr
    password: str = Field(..., min_length=6, max_length=20)

class SearchHistoryItem(BaseModel):
    query: str
    timestamp: datetime
    response_type: Optional[str] = None

class UserResponse(BaseModel):
    id: str = Field(..., alias="_id")
    name: str            
    email_id: str
    search_history: Optional[List[SearchHistoryItem]] = []

    class Config:
        populate_by_name = True
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class SearchHistoryResponse(BaseModel):
    email_id: str
    search_history: List[SearchHistoryItem]

class RecommendationResponse(BaseModel):
    recommendations: List[dict]
    based_on_searches: List[str]
    summary: str
