
from fastapi import FastAPI
from app.database import engine, Base
from app import models
from app.services.data_loader import load_data
from app.routes.dashboard import router as dashboard_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sales Intelligence Dashboard")

app.include_router(dashboard_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Sales Intelligence Dashboard API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/load-data")
def load_dashboard_data():
    return load_data()
