from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    name: str = Field(..., min_length=4, max_length=20)
    email_id: EmailStr
    password: str = Field(..., min_length=6, max_length=20)

class UserResponse(BaseModel):
    id: str = Field(..., alias="_id")
    name: str            
    email_id: str

    class Config:
        populate_by_name = True
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str


class SendOtpRequest(BaseModel):
    email: EmailStr


class VerifyOtpRequest(BaseModel):
    email: EmailStr
    otp: str
