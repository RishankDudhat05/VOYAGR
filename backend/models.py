from pydantic import BaseModel, Field, ConfigDict
from pydantic_core import core_schema
from typing import Optional, List, Any
from bson import ObjectId
from datetime import datetime

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type: Any, handler):
        return core_schema.union_schema([
            core_schema.is_instance_schema(ObjectId),
            core_schema.chain_schema([
                core_schema.str_schema(),
                core_schema.no_info_plain_validator_function(cls.validate),
            ])
        ], serialization=core_schema.plain_serializer_function_ser_schema(str))

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str) and ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("Invalid ObjectId")

class SearchHistoryItem(BaseModel):
    query: str
    timestamp: datetime
    response_type: Optional[str] = None

class User(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )
    
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: str
    email_id: str
    hashed_password: str
    search_history: Optional[List[SearchHistoryItem]] = Field(default_factory=list)
