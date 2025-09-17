from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth
from app.db.session import engine, Base

# For dev: create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="TukoMarket API (Auth MVP)")

# CORS - adjust origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])

@app.get("/")
def root():
    return {"msg": "TukoMarket backend up — auth module loaded"}
