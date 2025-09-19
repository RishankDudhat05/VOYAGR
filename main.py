from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()

class users:
    id: int
    username: str
    password: str

    def _init_(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

class UserModel(BaseModel):
    id: int = Field(..., gt=0, description="User ID must be a positive integer")
    username: str = Field(..., min_length=3, max_length=20, description="Username must be 3-20 characters long")
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long")

user_data = [users(1, "hello123", "hello"), users(2, "test123", "Test12")]

@app.post("/signup")
async def signup(data: UserModel):
    user_data.append(users(data.id, data.username, data.password))
    return {"status": "accepted", "data": data}

@app.post("/login")
async def login(data: UserModel):
    check = users(data.id, data.username, data.password)
    for user in user_data:
        if user.username == check.username and user.password == check.password:
            return {"message": "Login Successful"}
    return {"message": "User not found"}
