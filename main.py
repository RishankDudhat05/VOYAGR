from fastapi import FastAPI
from pydantic import BaseModel

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
    id: int
    username: str
    password: str

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
