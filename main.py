from fastapi import FastAPI,Body

app = FastAPI()

@app.post("/signup")
async def signup(data: Body()):
  return {"status": "accepted", "data": data}
