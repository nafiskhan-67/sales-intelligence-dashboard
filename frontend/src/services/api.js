
import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
});

export const getDashboardSummary = (region = "All", month = "All") =>
    API.get("/dashboard/summary", {
        params: { region, month },
    });

export const getSalesByRegion = (region = "All", month = "All") =>
    API.get("/dashboard/sales-by-region", {
        params: { region, month },
    });

export const getProjectPerformance = () =>
    API.get("/dashboard/project-performance");


export const getDashboardInsights = (region = "All", month = "All") =>
    API.get("/dashboard/insights", {
        params: { region, month },
    });

export const getDataQuality = () =>
    API.get("/dashboard/data-quality");

export const getAccountIntegration = () =>
    API.get("/dashboard/account-integration");