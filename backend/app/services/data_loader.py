
import json
from pathlib import Path

import pandas as pd

from app.database import SessionLocal
from app.models import Lead, Project, SalesTarget


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"


def load_data():
    db = SessionLocal()

    try:
        # Clear old data before loading again
        db.query(Lead).delete()
        db.query(Project).delete()
        db.query(SalesTarget).delete()

        # Load CRM leads
        with open(DATA_DIR / "crm_leads.json", "r", encoding="utf-8") as file:
            leads = json.load(file)

        # Load operations projects
        projects = pd.read_csv(
            DATA_DIR / "operations_projects.csv"
        ).fillna("").to_dict(orient="records")

        # Load sales targets
        targets = pd.read_csv(
            DATA_DIR / "sales_targets.csv"
        ).fillna("").to_dict(orient="records")

        db.add_all([Lead(**item) for item in leads])
        db.add_all([Project(**item) for item in projects])
        db.add_all([SalesTarget(**item) for item in targets])

        db.commit()

        return {
            "message": "Data loaded successfully",
            "leads": len(leads),
            "projects": len(projects),
            "sales_targets": len(targets)
        }

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()
