from fastapi import FastAPI

app=FastAPI()

@app.get("/me")
async def is_check():
  return "end point is working"
