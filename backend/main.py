from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import users_collection, client
from router import auth_routes, tripai, recommendations

@asynccontextmanager
async def lifespan(app: FastAPI):
    await users_collection.create_index("email_id", unique=True)
    yield
    client.close()

app = FastAPI(lifespan=lifespan)

app.include_router(tripai.router)
app.include_router(auth_routes.router)
app.include_router(recommendations.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
