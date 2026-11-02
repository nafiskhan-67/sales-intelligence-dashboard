
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Lead, Project, SalesTarget

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])



@router.get("/summary")
def get_dashboard_summary(
    region: str = Query(default="All"),
    month: str = Query(default="All"),
    db: Session = Depends(get_db)
):
    query = db.query(Lead)

    if region != "All":
        query = query.filter(Lead.region == region)

    if month != "All":
        query = query.filter(Lead.created_date.like(f"{month}%"))

    leads = query.all()

    total_leads = len(leads)

    won_leads = sum(
        1 for lead in leads
        if (lead.status or "").lower() == "won"
    )

    lost_leads = sum(
        1 for lead in leads
        if (lead.status or "").lower() == "lost"
    )

    open_pipeline = sum(
        lead.deal_value or 0 for lead in leads
        if (lead.status or "").lower() == "open"
    )

    won_revenue = sum(
        lead.deal_value or 0 for lead in leads
        if (lead.status or "").lower() == "won"
    )

    total_decided = won_leads + lost_leads

    win_rate = (
        round(won_leads / total_decided * 100, 2)
        if total_decided else 0
    )

    return {
        "total_leads": total_leads,
        "won_leads": won_leads,
        "lost_leads": lost_leads,
        "open_pipeline_value": open_pipeline,
        "won_revenue": won_revenue,
        "win_rate": win_rate
    }




@router.get("/sales-by-region")
def get_sales_by_region(
    region: str = Query(default="All"),
    month: str = Query(default="All"),
    db: Session = Depends(get_db)
):
    lead_query = db.query(Lead)
    target_query = db.query(SalesTarget)

    if region != "All":
        lead_query = lead_query.filter(Lead.region == region)
        target_query = target_query.filter(SalesTarget.region == region)

    if month != "All":
        lead_query = lead_query.filter(
            Lead.created_date.like(f"{month}%")
        )
        target_query = target_query.filter(
            SalesTarget.month == month
        )

    leads = lead_query.all()
    targets = target_query.all()

    region_data = {}

    for lead in leads:
        name = lead.region or "Unknown"

        if name not in region_data:
            region_data[name] = {
                "region": name,
                "total_leads": 0,
                "won_revenue": 0,
                "sales_target": 0
            }

        region_data[name]["total_leads"] += 1

        if (lead.status or "").lower() == "won":
            region_data[name]["won_revenue"] += lead.deal_value or 0

    for target in targets:
        name = target.region or "Unknown"

        if name not in region_data:
            region_data[name] = {
                "region": name,
                "total_leads": 0,
                "won_revenue": 0,
                "sales_target": 0
            }

        region_data[name]["sales_target"] += target.sales_target or 0

    result = []

    for item in region_data.values():
        target = item["sales_target"]

        item["achievement_percent"] = (
            round(item["won_revenue"] / target * 100, 2)
            if target else 0
        )

        result.append(item)

    return result


@router.get("/project-performance")
def get_project_performance(db: Session = Depends(get_db)):

    total_projects = db.query(Project).count()

    status_data = (
        db.query(Project.status, func.count(Project.id))
        .group_by(Project.status)
        .all()
    )

    sla_data = (
        db.query(Project.sla_status, func.count(Project.id))
        .group_by(Project.sla_status)
        .all()
    )

    return {
        "total_projects": total_projects,
        "by_status": [
            {"status": status, "count": count}
            for status, count in status_data
        ],
        "by_sla": [
            {"sla_status": sla, "count": count}
            for sla, count in sla_data
        ]
    }



@router.get("/insights")
def get_dashboard_insights(
    region: str = Query(default="All"),
    month: str = Query(default="All"),
    db: Session = Depends(get_db)
):
    insights = []

    # Get filtered sales data
    lead_query = db.query(Lead)
    target_query = db.query(SalesTarget)

    if region != "All":
        lead_query = lead_query.filter(Lead.region == region)
        target_query = target_query.filter(SalesTarget.region == region)

    if month != "All":
        lead_query = lead_query.filter(
            Lead.created_date.like(f"{month}%")
        )
        target_query = target_query.filter(
            SalesTarget.month == month
        )

    leads = lead_query.all()
    targets = target_query.all()

    revenue_by_region = {}

    for lead in leads:
        name = lead.region or "Unknown"

        if name not in revenue_by_region:
            revenue_by_region[name] = {
                "revenue": 0,
                "target": 0
            }

        if (lead.status or "").lower() == "won":
            revenue_by_region[name]["revenue"] += lead.deal_value or 0

    for target in targets:
        name = target.region or "Unknown"

        if name not in revenue_by_region:
            revenue_by_region[name] = {
                "revenue": 0,
                "target": 0
            }

        revenue_by_region[name]["target"] += target.sales_target or 0

    # Check sales performance
    for name, data in revenue_by_region.items():
        target = data["target"]
        revenue = data["revenue"]

        if target > 0:
            achievement = revenue / target * 100

            if achievement < 50:
                insights.append({
                    "type": "warning",
                    "title": f"{name} sales need attention",
                    "message": f"{name} has achieved {achievement:.2f}% of its sales target."
                })

            elif achievement >= 100:
                insights.append({
                    "type": "success",
                    "title": f"{name} achieved its target",
                    "message": f"{name} has achieved {achievement:.2f}% of its sales target."
                })

    # Check project SLA performance
    breached_projects = db.query(Project).filter(
        Project.sla_status == "Breached"
    ).count()

    if breached_projects > 0:
        insights.append({
            "type": "warning",
            "title": "SLA breaches detected",
            "message": f"{breached_projects} projects have breached their service-level targets."
        })

    return {
        "total_insights": len(insights),
        "insights": insights
    }

@router.get("/data-quality")
def get_data_quality(db: Session = Depends(get_db)):

    leads = db.query(Lead).all()
    projects = db.query(Project).all()

    crm_accounts = {
        lead.account_id for lead in leads
        if lead.account_id
    }

    operations_accounts = {
        project.account_id for project in projects
        if project.account_id
    }

    matched_accounts = crm_accounts.intersection(operations_accounts)
    unmatched_accounts = operations_accounts - crm_accounts

    return {
        "total_leads": len(leads),
        "total_projects": len(projects),
        "crm_accounts": len(crm_accounts),
        "operations_accounts": len(operations_accounts),
        "matched_accounts": len(matched_accounts),
        "unmatched_accounts": list(unmatched_accounts),
        "unmatched_count": len(unmatched_accounts)
    }

@router.get("/account-integration")
def get_account_integration(db: Session = Depends(get_db)):

    leads = db.query(Lead).order_by(Lead.id).all()
    projects = db.query(Project).order_by(Project.project_id).all()

    # Create a lookup using CRM account IDs
    crm_accounts = {}

    for lead in leads:
        if lead.account_id and lead.account_id not in crm_accounts:
            crm_accounts[lead.account_id] = {
                "company": lead.company,
                "region": lead.region
            }

    # Match each operations project with its CRM account
    integration_data = []

    for project in projects:
        account = crm_accounts.get(project.account_id)

        integration_data.append({
            "account_id": project.account_id,
            "company": account["company"] if account else "Not Found",
            "region": account["region"] if account else "Unknown",
            "project_name": project.project_name,
            "project_status": project.status,
            "match_status": "Matched" if account else "Unmatched"
        })

    return {
        "total_records": len(integration_data),
        "records": integration_data
    }