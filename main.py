from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional

app = FastAPI()

class users:
    id: int
    username: str
    password: str

    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

class UserModel(BaseModel):
    id: Optional[int] = Field(None, ge=1, description="User ID must be positive")
    username: str = Field(..., min_length=3, max_length=20, description="Username must be 3-20 characters long")
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long")

    model_config = {
        "json_schema_extra": {
            "example": {
                "id": 1,
                "username": "testuser",
                "password": "secret123"
            }
        }
    }

user_data = [users(1, "hello123", "hello"), users(2, "test123", "Test12")]

def get_next_id() -> int:
    return max(user.id for user in user_data) + 1 if user_data else 1

@app.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(data: UserModel):
    for user in user_data:
        if user.username == data.username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists"
            )
    new_id = data.id if data.id is not None else get_next_id()
    user_data.append(users(new_id, data.username, data.password))
    return {"id": new_id, "username": data.username, "message": "User created successfully"}

@app.post("/login", status_code=status.HTTP_200_OK)
async def login(data: UserModel):
    for user in user_data:
        if user.username == data.username and user.password == data.password:
            return {"message": "Login Successful"}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid username or password"
    )
