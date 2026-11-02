
import { useCallback, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  IndianRupee,
  TrendingUp,
  Bell,
  RefreshCw,
  CircleHelp,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  getDashboardSummary,
  getSalesByRegion,
  getProjectPerformance,
  getDashboardInsights,
  getDataQuality,
  getAccountIntegration,
} from "./services/api";

function App() {
  const [summary, setSummary] = useState(null);
  const [sales, setSales] = useState([]);
  const [projects, setProjects] = useState(null);
  const [insights, setInsights] = useState([]);
  const [dataQuality, setDataQuality] = useState(null);
  const [integration, setIntegration] = useState([]);

  const [region, setRegion] = useState("All");
  const [month, setMonth] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setError("");

      const [
        summaryRes,
        salesRes,
        projectRes,
        insightsRes,
        qualityRes,
        integrationRes,
      ] = await Promise.all([
        getDashboardSummary(region, month),
        getSalesByRegion(region, month),
        getProjectPerformance(),
        getDashboardInsights(region, month),
        getDataQuality(),
        getAccountIntegration(),
      ]);

      setSummary(summaryRes.data);
      setSales(salesRes.data);
      setProjects(projectRes.data);
      setInsights(insightsRes.data.insights);
      setDataQuality(qualityRes.data);
      setIntegration(integrationRes.data.records);

    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError("Unable to load dashboard data. Please check the backend.");

    } finally {
      setLoading(false);
    }
  }, [region, month]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const statusColors = ["#10b981", "#3b82f6", "#f59e0b"];
  const slaColors = ["#10b981", "#f59e0b", "#ef4444"];

  const cards = summary
    ? [
      {
        title: "Total Leads",
        value: summary.total_leads,
        icon: Users,
        color: "bg-blue-50 text-blue-600",
      },
      {
        title: "Won Revenue",
        value: formatCurrency(summary.won_revenue),
        icon: IndianRupee,
        color: "bg-green-50 text-green-600",
      },
      {
        title: "Open Pipeline",
        value: formatCurrency(summary.open_pipeline_value),
        icon: TrendingUp,
        color: "bg-purple-50 text-purple-600",
      },
      {
        title: "Win Rate",
        value: `${summary.win_rate}%`,
        icon: BriefcaseBusiness,
        color: "bg-orange-50 text-orange-600",
      },
    ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-white hidden md:flex flex-col p-5">
        <h1 className="text-xl font-bold mb-10">
          Sales<span className="text-blue-400">IQ</span>
        </h1>

        <p className="text-xs text-slate-500 uppercase mb-3">
          Main Menu
        </p>

        <div className="flex items-center gap-3 bg-blue-600 p-3 rounded-lg">
          <LayoutDashboard size={19} />
          <span className="text-sm font-medium">Dashboard</span>
        </div>

        <div className="flex items-center gap-3 p-3 mt-2 text-slate-400">
          <Users size={19} />
          <span className="text-sm">Sales Overview</span>
        </div>

        <div className="flex items-center gap-3 p-3 text-slate-400">
          <BriefcaseBusiness size={19} />
          <span className="text-sm">Operations</span>
        </div>

        <div className="mt-auto border-t border-slate-800 pt-5 text-sm text-slate-400 flex items-center gap-3">
          <CircleHelp size={18} />
          Help & Support
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">

        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-5 md:px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Dashboard
            </h2>
            <p className="text-sm text-slate-500">
              Sales & Operations Intelligence
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setLoading(true);
                loadDashboard();
              }}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
            >
              <RefreshCw size={17} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Bell size={19} className="text-slate-500" />

            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
              NK
            </div>
          </div>
        </header>

        <div className="p-5 md:p-8 space-y-7">

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Page Heading */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Business Overview
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Monitor your sales performance and project operations.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row gap-4 sm:items-end">

            <div className="w-full sm:w-56">
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Region
              </label>

              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="All">All Regions</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </select>
            </div>

            <div className="w-full sm:w-56">
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Month
              </label>

              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="All">All Months</option>
                <option value="2026-01">January 2026</option>
                <option value="2026-02">February 2026</option>
                <option value="2026-03">March 2026</option>
                <option value="2026-04">April 2026</option>
                <option value="2026-05">May 2026</option>
                <option value="2026-06">June 2026</option>
                <option value="2026-07">July 2026</option>
                <option value="2026-08">August 2026</option>
              </select>
            </div>

            <button
              onClick={() => {
                setRegion("All");
                setMonth("All");
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium py-2.5"
            >
              Reset Filters
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="bg-white rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-500">
                      {card.title}
                    </p>

                    <div className={`p-2 rounded-lg ${card.color}`}>
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-800 mt-4">
                    {card.value}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* Data Quality */}
          {dataQuality && (
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="mb-5">
                <h3 className="font-semibold text-slate-800">
                  Data Quality & Integration
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  CRM and Operations records matched using account ID.
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">CRM Leads</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-2">
                    {dataQuality.total_leads}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Operations Projects</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-2">
                    {dataQuality.total_projects}
                  </h3>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-700">Matched Accounts</p>
                  <h3 className="text-2xl font-bold text-green-700 mt-2">
                    {dataQuality.matched_accounts}
                  </h3>
                </div>

                <div className="bg-amber-50 rounded-lg p-4">
                  <p className="text-sm text-amber-700">Unmatched Accounts</p>
                  <h3 className="text-2xl font-bold text-amber-700 mt-2">
                    {dataQuality.unmatched_count}
                  </h3>
                </div>
              </div>

              {dataQuality.unmatched_count > 0 && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-amber-800">
                    Unmatched account IDs
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    {dataQuality.unmatched_accounts.join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Business Insights */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="mb-5">
              <h3 className="font-semibold text-slate-800">
                Business Insights
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Automated insights based on sales targets and project SLA performance.
                Sales insights follow selected filters; SLA checks are overall.
              </p>
            </div>

            {insights.length > 0 ? (
              <div className="space-y-3">
                {insights.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${item.type === "warning"
                        ? "bg-amber-50 border-amber-200"
                        : "bg-green-50 border-green-200"
                      }`}
                  >
                    <h4
                      className={`text-sm font-semibold ${item.type === "warning"
                          ? "text-amber-800"
                          : "text-green-800"
                        }`}
                    >
                      {item.title}
                    </h4>

                    <p className="text-sm text-slate-600 mt-1">
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No major issues detected for the selected filters.
              </p>
            )}
          </div>

          {/* CRM and Operations Integration Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="mb-5">
              <h3 className="font-semibold text-slate-800">
                CRM–Operations Account Integration
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Project records enriched with CRM account information using account ID.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Account ID</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Region</th>
                    <th className="px-4 py-3">Project</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Match</th>
                  </tr>
                </thead>

                <tbody>
                  {integration.map((item, index) => (
                    <tr
                      key={`${item.account_id}-${index}`}
                      className="border-b border-slate-100"
                    >
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {item.account_id}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {item.company}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {item.region}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {item.project_name}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {item.project_status}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.match_status === "Matched"
                              ? "bg-green-50 text-green-700"
                              : "bg-amber-50 text-amber-700"
                            }`}
                        >
                          {item.match_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500 mt-4">
              Total integrated project records: {integration.length}
            </p>
          </div>

          {/* Sales Chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="mb-6">
              <h3 className="font-semibold text-slate-800">
                Sales Performance by Region
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Won revenue compared with sales targets for selected filters
              </p>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />

                  <Bar
                    dataKey="won_revenue"
                    name="Won Revenue"
                    fill="#2563eb"
                    radius={[5, 5, 0, 0]}
                  />

                  <Bar
                    dataKey="sales_target"
                    name="Sales Target"
                    fill="#cbd5e1"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Project Charts */}
          {projects && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800">
                  Project Status
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Overall project distribution (not affected by sales filters)
                </p>

                <div className="h-72 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projects.by_status}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label
                      >
                        {projects.by_status.map((item, index) => (
                          <Cell
                            key={item.status}
                            fill={statusColors[index % statusColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800">
                  SLA Performance
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Overall project service-level status
                </p>

                <div className="h-72 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projects.by_sla}
                        dataKey="count"
                        nameKey="sla_status"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label
                      >
                        {projects.by_sla.map((item, index) => (
                          <Cell
                            key={item.sla_status}
                            fill={slaColors[index % slaColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;
