from fastapi import FastAPI, Body

app = FastAPI()

class users:
    id : int
    username : str
    password : str

    def _init_(self,id,username,password):
        self.id=id
        self.username=username
        self.password=password

user_data=[users(1,'hello123','hello'),users(2,'test123','Test12')]

@app.post("/signup")
async def signup(data=Body()):
    
    user_data.append(users(data["id"],data["username"],data["password"]))
    return {'status' : 'accepted', 'data' : data}

@app.post("/login")
async def login(data=Body()):
    check = users(data["id"],data["username"],data["password"])
    for user in user_data:
        if user.username==check.username and user.password==check.password:
            return {"message": "Login Successful"}
    return {"message": "User not found"}
