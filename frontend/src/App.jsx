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

/* ---------- Design tokens (look only) ---------- */
const pageBg =
  "min-h-screen flex bg-gradient-to-br from-slate-200 via-slate-100 to-blue-100 text-slate-800";

// frosted white panel, big rounded corners, soft shadow
const panel =
  "bg-white/70 backdrop-blur-xl border border-white rounded-[28px] shadow-[0_10px_40px_-15px_rgba(15,23,42,0.18)]";

// inner soft tile
const tile = "bg-white rounded-2xl shadow-[0_4px_16px_-8px_rgba(15,23,42,0.15)]";

// round icon button
const roundBtn =
  "w-10 h-10 rounded-full bg-white/80 border border-white shadow-sm flex items-center justify-center text-slate-600 hover:bg-white";

const selectCls =
  "w-full bg-white border border-white shadow-sm rounded-full px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-900/20";

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

  const statusColors = ["#0f172a", "#64748b", "#cbd5e1"];
  const slaColors = ["#10b981", "#f59e0b", "#ef4444"];

  const cards = summary
    ? [
      {
        title: "Total Leads",
        value: summary.total_leads,
        icon: Users,
        color: "bg-slate-900 text-white",
      },
      {
        title: "Won Revenue",
        value: formatCurrency(summary.won_revenue),
        icon: IndianRupee,
        color: "bg-slate-900 text-white",
      },
      {
        title: "Open Pipeline",
        value: formatCurrency(summary.open_pipeline_value),
        icon: TrendingUp,
        color: "bg-slate-900 text-white",
      },
      {
        title: "Win Rate",
        value: `${summary.win_rate}%`,
        icon: BriefcaseBusiness,
        color: "bg-slate-900 text-white",
      },
    ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-blue-100">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={pageBg}>

      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col p-5 m-4 mr-0 rounded-[28px] bg-white/70 backdrop-blur-xl border border-white shadow-[0_10px_40px_-15px_rgba(15,23,42,0.18)]">
        <h1 className="text-xl font-bold mb-10 text-slate-900">
          Sales<span className="text-slate-400">IQ</span>
        </h1>

        <p className="text-xs text-slate-400 uppercase mb-3">
          Main Menu
        </p>

        <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-full shadow-lg">
          <LayoutDashboard size={19} />
          <span className="text-sm font-medium">Dashboard</span>
        </div>

        <div className="mt-auto border-t border-slate-200 pt-5 text-sm text-slate-500 flex items-center gap-3">
          <span className={`${roundBtn} w-9 h-9`}>
            <CircleHelp size={17} />
          </span>
          Help & Support
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">

        {/* Topbar */}
        <header className="px-5 md:px-8 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Dashboard
            </h2>
            <p className="text-sm text-slate-500">
              Sales & Operations Intelligence
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setLoading(true);
                loadDashboard();
              }}
              className="flex items-center gap-2 text-sm text-slate-700 bg-white/80 border border-white shadow-sm rounded-full px-4 h-10 hover:bg-white"
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <span className={roundBtn}>
              <Bell size={18} />
            </span>

            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold shadow-md">
              NK
            </div>
          </div>
        </header>

        <div className="px-5 md:px-8 pb-8 space-y-6">

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100">
              {error}
            </div>
          )}

          {/* Page Heading */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Business Overview
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Monitor your sales performance and project operations.
            </p>
          </div>

          {/* Filters */}
          <div className={`${panel} p-5 flex flex-col sm:flex-row gap-4 sm:items-end`}>

            <div className="w-full sm:w-56">
              <label className="block text-sm font-medium text-slate-600 mb-2 ml-2">
                Region
              </label>

              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className={selectCls}
              >
                <option value="All">All Regions</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </select>
            </div>

            <div className="w-full sm:w-56">
              <label className="block text-sm font-medium text-slate-600 mb-2 ml-2">
                Month
              </label>

              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className={selectCls}
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
              className="text-sm text-white bg-slate-900 hover:bg-slate-700 font-medium px-5 py-2.5 rounded-full shadow-md"
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
                  className={`${panel} p-5`}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-500">
                      {card.title}
                    </p>

                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${card.color}`}>
                      <Icon size={19} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mt-4">
                    {card.value}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* Data Quality */}
          {dataQuality && (
            <div className={`${panel} p-6`}>
              <div className="mb-5">
                <h3 className="font-semibold text-slate-900">
                  Data Quality & Integration
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  CRM and Operations records matched using account ID.
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`${tile} p-4`}>
                  <p className="text-sm text-slate-500">CRM Leads</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2">
                    {dataQuality.total_leads}
                  </h3>
                </div>

                <div className={`${tile} p-4`}>
                  <p className="text-sm text-slate-500">Operations Projects</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2">
                    {dataQuality.total_projects}
                  </h3>
                </div>

                <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                  <p className="text-sm text-green-700">Matched Accounts</p>
                  <h3 className="text-2xl font-bold text-green-700 mt-2">
                    {dataQuality.matched_accounts}
                  </h3>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                  <p className="text-sm text-amber-700">Unmatched Accounts</p>
                  <h3 className="text-2xl font-bold text-amber-700 mt-2">
                    {dataQuality.unmatched_count}
                  </h3>
                </div>
              </div>

              {dataQuality.unmatched_count > 0 && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
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
          <div className={`${panel} p-6`}>
            <div className="mb-5">
              <h3 className="font-semibold text-slate-900">
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
                    className={`p-4 rounded-2xl border ${item.type === "warning"
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
          <div className={`${panel} p-6`}>
            <div className="mb-5">
              <h3 className="font-semibold text-slate-900">
                CRM–Operations Account Integration
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Project records enriched with CRM account information using account ID.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl bg-white shadow-[0_4px_16px_-8px_rgba(15,23,42,0.15)]">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100/80 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Account ID</th>
                    <th className="px-4 py-3 font-medium">Company</th>
                    <th className="px-4 py-3 font-medium">Region</th>
                    <th className="px-4 py-3 font-medium">Project</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Match</th>
                  </tr>
                </thead>

                <tbody>
                  {integration.map((item, index) => (
                    <tr
                      key={`${item.account_id}-${index}`}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                    >
                      <td className="px-4 py-3 font-medium text-slate-800">
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
                          className={`px-3 py-1 rounded-full text-xs font-medium ${item.match_status === "Matched"
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
          <div className={`${panel} p-6`}>
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900">
                Sales Performance by Region
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Won revenue compared with sales targets for selected filters
              </p>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="region" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      borderRadius: 16,
                      border: "none",
                      boxShadow: "0 10px 30px -10px rgba(15,23,42,0.25)",
                    }}
                  />

                  <Bar
                    dataKey="won_revenue"
                    name="Won Revenue"
                    fill="#0f172a"
                    radius={[10, 10, 0, 0]}
                  />

                  <Bar
                    dataKey="sales_target"
                    name="Sales Target"
                    fill="#cbd5e1"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Project Charts */}
          {projects && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              <div className={`${panel} p-6`}>
                <h3 className="font-semibold text-slate-900">
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
                        stroke="#ffffff"
                        strokeWidth={3}
                        label
                      >
                        {projects.by_status.map((item, index) => (
                          <Cell
                            key={item.status}
                            fill={statusColors[index % statusColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 16,
                          border: "none",
                          boxShadow: "0 10px 30px -10px rgba(15,23,42,0.25)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`${panel} p-6`}>
                <h3 className="font-semibold text-slate-900">
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
                        stroke="#ffffff"
                        strokeWidth={3}
                        label
                      >
                        {projects.by_sla.map((item, index) => (
                          <Cell
                            key={item.sla_status}
                            fill={slaColors[index % slaColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 16,
                          border: "none",
                          boxShadow: "0 10px 30px -10px rgba(15,23,42,0.25)",
                        }}
                      />
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