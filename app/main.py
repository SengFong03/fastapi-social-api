from fastapi import FastAPI
from . import models
from .database import engine
from .routers import post, user, auth, vote
from .config import settings
from fastapi.middleware.cors import CORSMiddleware

# Create the database tables
# Commented out to use Alembic for migrations
# models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]  # Allow all origins; adjust for production use
                 # e.g., ["https://yourdomain.com"] for specific domains

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(post.router)
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(vote.router)


@app.get("/")
def root():
    return {"message": "Welcome to my API!"}
