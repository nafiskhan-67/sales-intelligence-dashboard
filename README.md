# Sales & Operations Intelligence Dashboard

## About the Project

I built this project to bring sales and operations data together in one dashboard.

The main idea is to make it easier for a business to understand its sales performance, track ongoing projects, and identify areas that need attention.

For this prototype, I used sample data to represent three different sources:

- CRM Leads
- Operations Projects
- Sales Targets

The dashboard connects CRM and Operations records using account IDs and displays useful information through KPI cards, charts, tables, and business insights.

I also added basic data quality checks to identify records that could not be matched between CRM and Operations.

This is a prototype built for the assignment. It uses synthetic data and does not connect to any live company system.

---

## Main Features

### 1. Business Overview

The dashboard displays important business information in one place.

It includes the following KPIs:

- **Total Leads:** Total number of leads available in the CRM data.
- **Won Revenue:** Total revenue from deals marked as Won.
- **Open Pipeline:** Total value of deals that are still open.
- **Win Rate:** Percentage of closed deals that were successfully won.

### 2. Filters

I added two filters to make it easier to view sales data.

- Region: All Regions, North, South, East, and West.
- Month: All Months and January to August 2026.

When a filter is selected, the sales summary, regional performance, and sales insights update based on the selected values.

The project and SLA charts show overall operations performance and are not affected by sales filters.

### 3. Data Quality and Integration

This section shows how many CRM and Operations records are available and how many accounts could be matched.

It displays:

- Total CRM Leads
- Total Operations Projects
- Matched Accounts
- Unmatched Accounts

The dashboard also displays unmatched account IDs so that missing connections can be identified easily.

### 4. Business Insights

I added a simple rule-based insight system to highlight areas that need attention.

It checks sales target achievement and project SLA performance.

For example:

- If sales achievement is below 50%, the dashboard shows an attention message.
- If sales achievement reaches 100% or more, the dashboard shows a positive message.
- If projects have breached their SLA targets, the dashboard displays a warning.

These insights are generated using backend logic. No external AI API is used in this prototype.

### 5. CRM–Operations Account Integration

This section shows how Operations project records are connected with CRM account information.

The system uses the account ID to find the matching company and region from CRM data.

It displays:

- Account ID
- Company Name
- Region
- Project Name
- Project Status
- Match Status

If an account ID is not available in CRM, the company is displayed as "Not Found" and its match status is shown as "Unmatched".

### 6. Sales and Operations Charts

The dashboard includes charts to make business performance easier to understand.

**Sales Performance by Region**

Shows won revenue compared with sales targets for each region.

**Project Status**

Shows the overall distribution of projects based on their current status.

**SLA Performance**

Shows how many projects have Met, At Risk, or Breached SLA status.

---

## Technologies Used

### Frontend

- React.js – Used to build the dashboard interface.
- Vite – Used for frontend development and running the application.
- Tailwind CSS – Used for styling and responsive layouts.
- Recharts – Used to display sales and operations charts.
- Axios – Used to communicate with backend APIs.
- Lucide React – Used for icons.

### Backend

- Python – Main backend programming language.
- FastAPI – Used to create REST APIs.
- SQLAlchemy – Used to communicate with the database.
- Pandas – Used to read and process CSV files.

### Database

- SQLite – Used to store CRM leads, operations projects, and sales targets.

### Data Formats

- JSON – Used for CRM lead data.
- CSV – Used for operations projects and sales targets.

---

## Project Structure

sales-intelligence-dashboard/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   └── dashboard.py
│   │   │
│   │   ├── services/
│   │   │   └── data_loader.py
│   │   │
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── database.py
│   │   └── models.py
│   │
│   ├── data/
│   │   ├── crm_leads.json
│   │   ├── operations_projects.csv
│   │   └── sales_targets.csv
│   │
│   ├── requirements.txt
│   └── sales_dashboard.db
│
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── index.html
│
└── README.md
```

### Important Files

- `main.py`: Creates the FastAPI application and registers API routes.
- `database.py`: Handles the SQLite database connection and database sessions.
- `models.py`: Defines the database tables using SQLAlchemy.
- `data_loader.py`: Reads JSON and CSV files and loads the records into the database.
- `dashboard.py`: Contains the APIs used to calculate dashboard metrics, integration results, and business insights.
- `api.js`: Contains frontend API functions used to communicate with the backend.
- `App.jsx`: Contains the main dashboard interface and its functionality.

---

## How the Project Works

The application follows a simple data flow.

### Step 1: Data Collection

I created three sample data files to represent different business systems.

- CRM data is stored in a JSON file.
- Operations data is stored in a CSV file.
- Sales target data is stored in another CSV file.

### Step 2: Data Loading

The backend reads these files using Python, JSON, and Pandas.

After reading the files, the records are inserted into SQLite using SQLAlchemy.

Before loading new records, the existing records in the three tables are cleared. This prevents duplicate records when the sample data is loaded again.

The loading process uses a database transaction. If an error occurs, the transaction is rolled back.

### Step 3: Data Processing

The backend processes the stored records to calculate sales KPIs, regional performance, project status, and SLA performance.

It also checks CRM and Operations account IDs to identify matching and unmatched accounts.

### Step 4: API Response

FastAPI provides the processed information through REST API endpoints.

The frontend calls these APIs using Axios.

### Step 5: Dashboard Display

React receives the API responses and displays the information using KPI cards, charts, tables, and business insight messages.

---

## Data Sources

For this assignment, I used synthetic data instead of connecting to actual company systems.

| Data Source | File | Records |
|---|---|---:|
| CRM Leads | crm_leads.json | 10 |
| Operations Projects | operations_projects.csv | 8 |
| Sales Targets | sales_targets.csv | 16 |
| **Total** | | **34** |

### CRM Leads

The CRM file contains sample lead information such as:

- Lead ID
- Account ID
- Company Name
- Created Date
- Lead Source
- Owner
- Region
- Deal Stage
- Deal Value
- Status
- Last Activity Date

### Operations Projects

The Operations file contains project information such as:

- Project ID
- Client ID
- Account ID
- Project Name
- Service Type
- Project Status
- Created Date
- Due Date
- Completed Date
- Project Amount
- Assigned Team
- SLA Status

### Sales Targets

The sales target file contains:

- Month
- Region
- Sales Target
- Segment
- Campaign

---

## Data Integration and Mapping

One of the important parts of this project is connecting CRM and Operations data.

For this integration, I used `account_id` as the common field.

### CRM and Operations Join

The backend compares account IDs from both sources.

For every Operations project, it checks whether the same account ID exists in the CRM data.

If a match is found, the company name and region are taken from the CRM record.

If no match is found, the system returns:

- Company: Not Found
- Region: Unknown
- Match Status: Unmatched

### Example

| Account ID | CRM Company | Integration Result |
|---|---|---|
| AC001 | TechNova Solutions | Matched |
| AC002 | Bright Future Ltd | Matched |
| AC003 | Global Tech | Matched |
| AC010 | Not Found | Unmatched |

In the sample data, AC010 exists in Operations but does not exist in CRM.

This is intentional. I added this record to demonstrate how the application identifies unmatched records.

### Sales Target Mapping

Sales targets are grouped by month and region.

The sales performance API uses the selected month and region to calculate target achievement.

### Important Mapping Assumptions

- `lead_id` identifies a CRM lead.
- `project_id` identifies an Operations project.
- `client_id` identifies a client in the Operations data.
- `account_id` is used to connect CRM and Operations records.
- One account can have multiple leads.
- The integration table displays one row per Operations project.
- If multiple CRM leads belong to the same account, the first CRM lead is used to get the company name and region.
- Sales targets are compared with won revenue for the selected period and region.

---

## KPI Definitions and Calculations

The following calculations are used in the dashboard.

### 1. Total Leads

Counts all CRM leads after applying the selected region and month filters.
Total Leads = Count of CRM Leads


### 2. Won Revenue

Calculates the total deal value of leads marked as Won.
Won Revenue = Sum of Deal Value where Status = Won


### 3. Open Pipeline

Calculates the total deal value of leads that are still Open.
Open Pipeline = Sum of Deal Value where Status = Open


### 4. Win Rate

Shows the percentage of closed deals that were won.
Win Rate = (Won Leads / (Won Leads + Lost Leads)) * 100


Open deals are not included in this calculation.

If there are no closed deals, the win rate is treated as 0%.

### 5. Sales Target Achievement

Shows how much of the sales target has been achieved.
Achievement % = (Won Revenue / Sales Target) * 100


If the sales target is zero, the system avoids division by zero.

### 6. Project Status

Counts projects based on their current status, such as:

- Completed
- In Progress
- On Hold

### 7. SLA Performance

Counts projects based on their SLA status:

- Met
- At Risk
- Breached

---

## Data Quality Checks

I added basic data quality checks to identify issues in the sample data.

The current checks include:

1. Counting total CRM leads.
2. Counting total Operations projects.
3. Finding unique account IDs in both sources.
4. Identifying account IDs that exist in Operations but are missing from CRM.
5. Displaying unmatched records in the integration table.

### Current Sample Data Result

| Check | Result |
|---|---:|
| Total CRM Leads | 10 |
| Total Operations Projects | 8 |
| Unique CRM Accounts | 9 |
| Unique Operations Accounts | 8 |
| Matched Accounts | 7 |
| Unmatched Accounts | 1 |

The unmatched account is:
AC010


This helps demonstrate how the application handles missing account mappings.

---

## Business Insights Logic

The project includes a basic rule-based insight system.

It checks sales target achievement for each region and generates a message based on the result.

### Sales Target Rules

| Condition | Insight |
|---|---|
| Achievement below 50% | Sales need attention |
| Achievement between 50% and 99.99% | Target progress is below 100% |
| Achievement 100% or above | Sales target achieved |

### SLA Rule

The system also checks the number of projects with a Breached SLA status.

If any project has breached its SLA, the dashboard displays a warning.

These insights are generated using Python conditions in the backend. They are not generated by an external AI model.

Sales insights follow the selected region and month filters. SLA insights currently show overall project performance and are not affected by sales filters.

---

## API Endpoints

The backend provides the following API endpoints.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Checks whether the API is running |
| GET | `/health` | Checks backend health |
| POST | `/load-data` | Loads sample data into the database |
| GET | `/dashboard/summary` | Returns sales summary KPIs |
| GET | `/dashboard/sales-by-region` | Returns regional sales performance |
| GET | `/dashboard/project-performance` | Returns project status and SLA performance |
| GET | `/dashboard/insights` | Returns rule-based business insights |
| GET | `/dashboard/data-quality` | Returns data quality information |
| GET | `/dashboard/account-integration` | Returns CRM and Operations integration records |

### Filter Parameters

The following endpoints support region and month filters:

- `/dashboard/summary`
- `/dashboard/sales-by-region`
- `/dashboard/insights`

Example:
/dashboard/summary?region=North&month=2026-01


The default value for both filters is All.

---

## Installation and Setup

Follow these steps to run the project locally.

### Requirements

Make sure you have installed:

- Python 3.12
- Node.js and npm
- Git

### 1. Clone the Repository
git clone YOUR_GITHUB_REPOSITORY_URL


Move into the project folder:
cd sales-intelligence-dashboard


### 2. Backend Setup

Open a terminal and move into the backend folder.
cd backend

Create a virtual environment:
python -m venv venv


Activate the virtual environment on Windows:
venv\Scripts\activate


Install the required packages:
pip install -r requirements.txt


### 3. Start the Backend

Run the following command from the backend folder:
uvicorn app.main:app --reload


The backend will run at:
http://127.0.0.1:8000


To open the API documentation:
http://127.0.0.1:8000/docs


### 4. Load Sample Data

After starting the backend, open the Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

Find the `POST /load-data` endpoint and execute it.

This will load the sample JSON and CSV data into the SQLite database.

### 5. Frontend Setup

Open another terminal and move into the frontend folder.

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

Open this URL in your browser to use the dashboard.

---

## Assumptions and Limitations

Since this is an assignment prototype, I made a few assumptions.

- All data used in the project is synthetic.
- No live CRM, operations system, or Google Sheets account is connected.
- Account ID is treated as the common key between CRM and Operations.
- The first CRM lead for an account is used to get company and region information.
- Sales target achievement is calculated using won revenue from the available sample data.
- Sales filters do not change the overall project and SLA charts.
- SLA insights currently show overall project performance.
- SQLite is used for this prototype instead of a production database.
- The rule-based insight system uses predefined conditions and does not use a machine learning model.

The current data is limited and is mainly used to demonstrate the dashboard functionality and integration logic.

---

## Security Considerations

For this prototype:

- Only synthetic data is used.
- The database is stored locally using SQLite.
- The frontend communicates with the backend through API endpoints.
- CORS is configured for the local frontend development URL.
- No external API credentials are required for the current functionality.

For a production application, I would add proper authentication, role-based access control, secure environment configuration, input validation, and more detailed API security.

---

## Future Improvements

If I continue developing this project, I would like to add the following features:

1. Connect actual CRM and operations systems through their APIs.
2. Integrate Google Sheets for automatic sales target updates.
3. Add scheduled data synchronization.
4. Add authentication and role-based access for different users.
5. Move from SQLite to PostgreSQL for better production database support.
6. Add more detailed sales and project reports.
7. Improve data validation and duplicate record detection.
8. Add historical performance tracking and trend analysis.
9. Add more advanced AI-based insights using historical business data.
10. Add export options for reports in Excel and PDF formats.

---

## Project Status

**Current Status:** Prototype Completed

The current version includes:

- Sales dashboard with KPI cards.
- Region and month filters.
- Sales performance charts.
- Project status and SLA charts.
- CRM and Operations account integration.
- Unmatched account detection.
- Rule-based business insights.
- SQLite database with synthetic sample data.

The project is built to demonstrate how data from different business sources can be combined and presented in a single dashboard.

---


**Tech Stack:** React.js, Tailwind CSS, Python, FastAPI, SQLAlchemy, Pandas, and SQLite.