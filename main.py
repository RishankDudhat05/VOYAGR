from fastapi import FastAPI, Body

app = FastAPI()

user_data=[]

@app.post("/signup")
async def signup(data=Body()):
    
    user_data.append(data)
    return {'status' : 'accepted', 'data' : data}

@app.post("/login")
async def login(data=Body()):
    for user in user_data:
        if user['username']==data['username']:
            return {'login Sucessfull'}
    return {'user not found'}
