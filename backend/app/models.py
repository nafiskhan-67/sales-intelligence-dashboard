
from sqlalchemy import Column, Integer, String, Float
from app.database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(String, unique=True, index=True)
    account_id = Column(String, index=True)
    company = Column(String)
    created_date = Column(String)
    source = Column(String)
    owner = Column(String)
    region = Column(String)
    stage = Column(String)
    deal_value = Column(Float)
    status = Column(String)
    last_activity_date = Column(String)


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String, unique=True, index=True)
    client_id = Column(String)
    account_id = Column(String, index=True)
    project_name = Column(String)
    service_type = Column(String)
    status = Column(String)
    created_date = Column(String)
    due_date = Column(String)
    completed_date = Column(String, nullable=True)
    amount = Column(Float)
    assigned_team = Column(String)
    sla_status = Column(String)


class SalesTarget(Base):
    __tablename__ = "sales_targets"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String)
    region = Column(String)
    sales_target = Column(Float)
    segment = Column(String)
    campaign = Column(String)
