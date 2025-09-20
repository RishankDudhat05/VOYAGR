import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = "abcdefghijklmnopqrstuvwxyz"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
