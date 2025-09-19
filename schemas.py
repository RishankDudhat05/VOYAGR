from pydantic import BaseModel
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    name: str = Field(..., min_length=4, max_length=20)  # min/max length constraints
    email_id: EmailStr
    password: str = Field(..., min_length=6, max_length=20)  # min/max length constraints

class UserResponse(BaseModel):
    id: int
    name: str            # New field
    email_id: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
