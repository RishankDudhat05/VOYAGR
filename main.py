from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import users_collection, client
from router import auth_routes, tripai, recommendations ,manual

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    client.close()

app = FastAPI(lifespan=lifespan)

app.include_router(tripai.router)
app.include_router(auth_routes.router)
app.include_router(recommendations.router)
app.include_router(manual.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "http://voyagrf16.vercel.app"
                  ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
