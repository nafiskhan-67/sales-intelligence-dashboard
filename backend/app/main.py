
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base, SessionLocal
from app import models
from app.services.data_loader import load_data
from app.routes.dashboard import router as dashboard_router


Base.metadata.create_all(bind=engine)


def check_and_load_data():
    db = SessionLocal()

    try:
        leads_count = db.query(models.Lead).count()
        projects_count = db.query(models.Project).count()
        targets_count = db.query(models.SalesTarget).count()

    finally:
        db.close()

    # Load data if any table is empty
    if leads_count == 0 or projects_count == 0 or targets_count == 0:
        print("Database is empty. Loading sample data...")
        result = load_data()
        print(result)
    else:
        print("Database already contains data. Skipping data loading.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    check_and_load_data()
    yield


app = FastAPI(
    title="Sales Intelligence Dashboard",
    lifespan=lifespan
)

app.include_router(dashboard_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://sales-intelligence-dashboard-henna.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Sales Intelligence Dashboard API is running"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/load-data")
def load_dashboard_data():
    return load_data()
