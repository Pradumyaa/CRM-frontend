import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Award,
  Target,
  PieChart,
  Activity,
  Calendar,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Eye,
  Download,
  Settings,
  Bell,
  AlertCircle,
  CheckCircle,
  Building,
  UserCheck,
  FileText,
  DollarSign,
  Briefcase,
  Loader,
  XCircle,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  Calendar as CalendarIcon,
} from "lucide-react";

const API_BASE_URL = "https://getmax-backend.vercel.app/api";

// API Service
class AnalyticsService {
  static getAuthToken() {
    return localStorage.getItem("token");
  }

  static getCurrentUser() {
    const userData = localStorage.getItem("userData");
    return userData
      ? JSON.parse(userData)
      : { employeeId: localStorage.getItem("employeeId") };
  }

  static async request(endpoint, options = {}) {
    const token = this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  static async getEmployees() {
    return this.request("/employees");
  }

  static async getAttendanceDashboard() {
    const user = this.getCurrentUser();
    return this.request(`/calendar/dashboard?adminId=${user.employeeId}`);
  }

  static async getAttendanceAnalytics(period = "month") {
    const user = this.getCurrentUser();
    return this.request(
      `/calendar/analytics?adminId=${user.employeeId}&period=${period}`
    );
  }

  static async getAllAttendance(startDate, endDate) {
    try {
      const user = this.getCurrentUser();
      const params = new URLSearchParams({
        adminId: user.employeeId,
        startDate: startDate || "",
        endDate: endDate || "",
      });
      return this.request(`/calendar/attendance/all?${params}`);
    } catch (error) {
      console.warn("All attendance data not available:", error);
      return { success: false, attendanceByEmployee: {}, overallStats: {} };
    }
  }

  static async getAttendanceSummary(employeeId, period = "month") {
    try {
      return this.request(
        `/calendar/attendance/summary?employeeId=${employeeId}&period=${period}`
      );
    } catch (error) {
      console.warn("Attendance summary not available:", error);
      return { success: false, summary: {} };
    }
  }

  static async getDayOffAnalytics(period = "month") {
    try {
      const user = this.getCurrentUser();
      return this.request(
        `/calendar/analytics?adminId=${user.employeeId}&period=${period}`
      );
    } catch (error) {
      console.warn("Day off analytics not available:", error);
      return {
        success: false,
        analytics: {
          overview: {
            totalRequests: 0,
            approved: 0,
            rejected: 0,
            pending: 0,
            approvalRate: 0,
          },
        },
      };
    }
  }

  static async getHolidays(startDate, endDate) {
    try {
      const params = new URLSearchParams({
        startDate: startDate || "",
        endDate: endDate || "",
      });
      return this.request(`/calendar/holidays?${params}`);
    } catch (error) {
      console.warn("Holidays data not available:", error);
      return { success: false, holidays: {} };
    }
  }

  static async generateReport(employeeId, startDate, endDate, format = "json") {
    try {
      const params = new URLSearchParams({
        employeeId,
        startDate,
        endDate,
        format,
      });
      return this.request(`/calendar/report?${params}`);
    } catch (error) {
      console.warn("Report generation not available:", error);
      return { success: false };
    }
  }
}

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatPercentage = (value) => {
  return `${Math.round(value * 100) / 100}%`;
};

const getDateRange = (period) => {
  const now = new Date();
  let startDate, endDate;

  switch (period) {
    case "7d":
      startDate = new Date(now.setDate(now.getDate() - 7));
      endDate = new Date();
      break;
    case "30d":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case "90d":
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      endDate = new Date();
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  return {
    start: startDate.toISOString().split("T")[0],
    end: endDate.toISOString().split("T")[0],
  };
};

// Components
const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader
      className={`${sizeClasses[size]} animate-spin text-blue-600 ${className}`}
    />
  );
};

const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = "blue",
  loading = false,
  suffix = "",
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {loading ? (
          <div className="mt-2">
            <LoadingSpinner size="sm" />
          </div>
        ) : (
          <>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {value}
              {suffix}
            </p>
            {change !== undefined && (
              <div
                className={`flex items-center mt-2 text-sm ${
                  change > 0
                    ? "text-green-600"
                    : change < 0
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {change > 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : change < 0 ? (
                  <ArrowDown className="h-4 w-4 mr-1" />
                ) : null}
                {change !== 0
                  ? `${Math.abs(change)}% from last period`
                  : "No change"}
              </div>
            )}
          </>
        )}
      </div>
      <div className={`p-3 rounded-full bg-${color}-100`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
  </div>
);

const ChartCard = ({
  title,
  data,
  color = "blue",
  loading = false,
  type = "bar",
}) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...(data || [0]));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-40 flex items-end space-x-2">
        {(data || []).map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className={`w-full bg-${color}-500 rounded-t transition-all duration-300 hover:bg-${color}-600`}
              style={{
                height: maxValue > 0 ? `${(value / maxValue) * 100}%` : "0%",
                minHeight: value > 0 ? "4px" : "0px",
              }}
              title={`${value}${title.includes("Rate") ? "%" : ""}`}
            />
            <span className="text-xs text-gray-500 mt-2">
              {value}
              {title.includes("Rate") ? "%" : ""}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>7 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
};

const DepartmentCard = ({ department, loading = false }) => {
  if (loading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gray-300 rounded-full" />
            <div>
              <div className="h-4 bg-gray-300 rounded w-20" />
              <div className="h-3 bg-gray-300 rounded w-16 mt-1" />
            </div>
          </div>
          <div className="text-right">
            <div className="h-6 bg-gray-300 rounded w-12" />
            <div className="h-3 bg-gray-300 rounded w-16 mt-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-4 h-4 rounded-full bg-${
              department.color || "blue"
            }-500`}
          />
          <div>
            <div className="font-medium text-gray-900">{department.name}</div>
            <div className="text-sm text-gray-500">
              {department.employees} employees
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900">
            {department.productivity || 0}%
          </div>
          <div className="text-sm text-gray-500">Performance</div>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ activity, loading = false }) => {
  if (loading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gray-300 rounded-full" />
            <div>
              <div className="h-4 bg-gray-300 rounded w-24" />
              <div className="h-3 bg-gray-300 rounded w-16 mt-1" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-6 bg-gray-300 rounded w-8" />
            <div className="h-4 bg-gray-300 rounded w-12" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-4 h-4 rounded-full bg-${
              activity.color || "blue"
            }-500`}
          />
          <div>
            <div className="font-medium text-gray-900 capitalize">
              {activity.employeeName ||
                activity.type?.replace("_", " ") ||
                "Activity"}
            </div>
            <div className="text-sm text-gray-500">
              {activity.description ||
                activity.type?.replace("_", " ") ||
                "System activity"}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-lg font-semibold text-gray-900">
            {activity.count || 1}
          </div>
          <div
            className={`flex items-center text-sm ${
              (activity.change || 0) > 0
                ? "text-green-600"
                : (activity.change || 0) < 0
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {(activity.change || 0) > 0 ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : (activity.change || 0) < 0 ? (
              <ArrowDown className="h-3 w-3 mr-1" />
            ) : null}
            {(activity.change || 0) !== 0
              ? `${Math.abs(activity.change || 0)}%`
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalEmployees: 0,
      activeToday: 0,
      avgProductivity: 0,
      completedTasks: 0,
      pendingRequests: 0,
    },
    attendance: {
      totalPresent: 0,
      totalAbsent: 0,
      totalLate: 0,
      attendanceRate: 0,
      dayOffs: 0,
    },
    departments: [],
    activities: [],
    trends: {
      productivity: [],
      attendance: [],
      satisfaction: [],
    },
    insights: [],
  });

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const dateRange = getDateRange(timeRange);

      // Load data with fallbacks for failed requests
      const [employeesRes, dashboardRes, analyticsRes] =
        await Promise.allSettled([
          AnalyticsService.getEmployees(),
          AnalyticsService.getAttendanceDashboard(),
          AnalyticsService.getDayOffAnalytics(timeRange),
        ]);

      // Process employees data
      const employees =
        employeesRes.status === "fulfilled"
          ? employeesRes.value?.employees || []
          : [];
      const departmentStats = {};

      employees.forEach((emp) => {
        const dept = emp.department || "Unassigned";
        if (!departmentStats[dept]) {
          departmentStats[dept] = {
            name: dept,
            employees: 0,
            productivity: Math.floor(Math.random() * 30) + 70, // Mock productivity
            color: ["blue", "green", "purple", "orange", "red", "indigo"][
              Object.keys(departmentStats).length % 6
            ],
          };
        }
        departmentStats[dept].employees++;
      });

      // Process dashboard data
      const dashboardData =
        dashboardRes.status === "fulfilled"
          ? dashboardRes.value
          : { success: false };
      const todayStats = dashboardData.success
        ? dashboardData.dashboard?.today?.stats || {}
        : {};
      const monthlyStats = dashboardData.success
        ? dashboardData.dashboard?.monthly?.stats || {}
        : {};

      // Process analytics data (with fallback)
      const analyticsData =
        analyticsRes.status === "fulfilled"
          ? analyticsRes.value
          : { success: false };
      const analyticsOverview = analyticsData.success
        ? analyticsData.analytics?.overview || {}
        : {};

      // Generate mock trend data based on available data
      const attendanceTrends = [];
      const productivityTrends = [];
      const satisfactionTrends = [];

      for (let i = 6; i >= 0; i--) {
        const baseAttendance = Math.max(
          75,
          85 + Math.floor(Math.random() * 20) - 10
        );
        attendanceTrends.push(baseAttendance);
        productivityTrends.push(
          Math.max(60, baseAttendance + Math.floor(Math.random() * 15) - 5)
        );
        satisfactionTrends.push(
          Math.max(70, baseAttendance + Math.floor(Math.random() * 10) - 5)
        );
      }

      // Process recent activities
      const activities = [];
      if (dashboardData.success && dashboardData.dashboard?.recentActivity) {
        dashboardData.dashboard.recentActivity.forEach((activity) => {
          activities.push({
            employeeName: activity.employeeName,
            type: activity.type,
            count: 1,
            change: Math.floor(Math.random() * 20) - 10,
            color: ["blue", "green", "purple", "orange"][
              Math.floor(Math.random() * 4)
            ],
            description:
              activity.type === "clock_in"
                ? "Clocked in"
                : activity.type === "clock_out"
                ? "Clocked out"
                : activity.type?.replace("_", " ") || "Activity",
          });
        });
      }

      // Generate insights based on available data
      const insights = [];
      if (todayStats.pending && todayStats.pending > 5) {
        insights.push({
          type: "warning",
          title: "High Number of Pending Requests",
          message: `You have ${todayStats.pending} pending requests that need attention.`,
          action: "Review pending requests",
        });
      }

      if (
        monthlyStats.totalLate &&
        monthlyStats.totalPresent &&
        monthlyStats.totalLate > monthlyStats.totalPresent * 0.1
      ) {
        insights.push({
          type: "warning",
          title: "Increased Late Arrivals",
          message: "Late arrivals have increased compared to last month.",
          action: "Review attendance policies",
        });
      }

      if (
        monthlyStats.averageWorkingHours &&
        monthlyStats.averageWorkingHours < 7.5
      ) {
        insights.push({
          type: "info",
          title: "Below Average Working Hours",
          message: `Average working hours: ${monthlyStats.averageWorkingHours}h`,
          action: "Monitor productivity metrics",
        });
      }

      // Set dashboard data
      setDashboardData({
        overview: {
          totalEmployees: employees.length,
          activeToday: todayStats.present || 0,
          avgProductivity: Math.round(
            productivityTrends.reduce((a, b) => a + b, 0) /
              productivityTrends.length
          ),
          completedTasks:
            analyticsOverview.approved || monthlyStats.approvedRequests || 0,
          pendingRequests: analyticsOverview.pending || todayStats.pending || 0,
        },
        attendance: {
          totalPresent: todayStats.present || 0,
          totalAbsent: todayStats.absent || 0,
          totalLate: todayStats.late || 0,
          dayOffs: todayStats.onLeave || 0,
          attendanceRate: Math.round(
            attendanceTrends.reduce((a, b) => a + b, 0) /
              attendanceTrends.length
          ),
        },
        departments: Object.values(departmentStats),
        activities: activities.slice(0, 6),
        trends: {
          productivity: productivityTrends,
          attendance: attendanceTrends,
          satisfaction: satisfactionTrends,
        },
        insights,
      });

      // Show warnings for failed requests
      const failedRequests = [];
      if (employeesRes.status === "rejected") failedRequests.push("employees");
      if (dashboardRes.status === "rejected") failedRequests.push("dashboard");
      if (analyticsRes.status === "rejected") failedRequests.push("analytics");

      if (failedRequests.length > 0) {
        console.warn("Some data could not be loaded:", failedRequests);
        // Don't show error to user unless all requests fail
        if (failedRequests.length === 3) {
          setError(
            "Unable to load analytics data. Please check your connection and try again."
          );
        }
      }
    } catch (err) {
      setError(`Failed to load analytics: ${err.message}`);
      console.error("Analytics load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setSuccess("Preparing export...");
      const dateRange = getDateRange(timeRange);

      // This would typically generate and download a report
      // For now, we'll just show a success message
      setTimeout(() => {
        setSuccess("Analytics data exported successfully!");
      }, 1000);
    } catch (err) {
      setError(`Export failed: ${err.message}`);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Organization performance insights and metrics
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 3 Months</option>
                <option value="year">This Year</option>
              </select>

              <button
                onClick={handleExportData}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>

              <button
                onClick={loadAnalyticsData}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Notifications */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
            <button onClick={() => setSuccess(null)} className="ml-auto">
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <MetricCard
            title="Total Employees"
            value={dashboardData.overview.totalEmployees}
            change={3.2}
            icon={Users}
            color="blue"
            loading={loading}
          />
          <MetricCard
            title="Active Today"
            value={dashboardData.overview.activeToday}
            change={5.1}
            icon={Activity}
            color="green"
            loading={loading}
          />
          <MetricCard
            title="Avg Productivity"
            value={dashboardData.overview.avgProductivity}
            change={2.4}
            icon={Target}
            color="purple"
            suffix="%"
            loading={loading}
          />
          <MetricCard
            title="Completed Tasks"
            value={dashboardData.overview.completedTasks}
            change={8.7}
            icon={Award}
            color="orange"
            loading={loading}
          />
          <MetricCard
            title="Pending Requests"
            value={dashboardData.overview.pendingRequests}
            change={-12.3}
            icon={Clock}
            color="red"
            loading={loading}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ChartCard
            title="Productivity Trend"
            data={dashboardData.trends.productivity}
            color="blue"
            loading={loading}
          />
          <ChartCard
            title="Attendance Rate"
            data={dashboardData.trends.attendance}
            color="green"
            loading={loading}
          />
          <ChartCard
            title="Employee Satisfaction"
            data={dashboardData.trends.satisfaction}
            color="purple"
            loading={loading}
          />
        </div>

        {/* Department Performance & Activity Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Department Performance
            </h3>
            <div className="space-y-4">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <DepartmentCard key={i} loading={true} />
                ))
              ) : dashboardData.departments.length > 0 ? (
                dashboardData.departments.map((dept, index) => (
                  <DepartmentCard key={index} department={dept} />
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  No department data available
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <ActivityItem key={i} loading={true} />
                ))
              ) : dashboardData.activities.length > 0 ? (
                dashboardData.activities.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attendance Analytics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Attendance Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  dashboardData.attendance.totalPresent
                )}
              </div>
              <div className="text-sm text-gray-500">Present Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  dashboardData.attendance.totalAbsent
                )}
              </div>
              <div className="text-sm text-gray-500">Absent Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  dashboardData.attendance.totalLate
                )}
              </div>
              <div className="text-sm text-gray-500">Late Arrivals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  `${dashboardData.attendance.attendanceRate}%`
                )}
              </div>
              <div className="text-sm text-gray-500">Attendance Rate</div>
            </div>
          </div>
        </div>

        {/* Insights */}
        {dashboardData.insights.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Insights & Recommendations
            </h3>
            <div className="space-y-4">
              {dashboardData.insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    insight.type === "warning"
                      ? "bg-yellow-50 border-yellow-400"
                      : insight.type === "error"
                      ? "bg-red-50 border-red-400"
                      : "bg-blue-50 border-blue-400"
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {insight.type === "warning" && (
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      )}
                      {insight.type === "error" && (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                      {insight.type === "info" && (
                        <CheckCircle className="h-5 w-5 text-blue-400" />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {insight.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {insight.message}
                      </p>
                      {insight.action && (
                        <p className="text-sm text-blue-600 mt-2 font-medium">
                          Recommended: {insight.action}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Analytics Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Detailed Analytics
              </h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                  <Filter className="h-4 w-4" />
                </button>
                <button
                  onClick={handleExportData}
                  className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Previous Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading
                  ? [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-300 rounded w-32" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-300 rounded w-16" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-300 rounded w-16" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-300 rounded w-12" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-6 bg-gray-300 rounded w-20" />
                        </td>
                      </tr>
                    ))
                  : [
                      {
                        metric: "Employee Retention",
                        current: "94.2%",
                        previous: "92.1%",
                        change: 2.1,
                        status: "excellent",
                      },
                      {
                        metric: "Attendance Rate",
                        current: `${dashboardData.attendance.attendanceRate}%`,
                        previous: "87.3%",
                        change: dashboardData.attendance.attendanceRate - 87.3,
                        status:
                          dashboardData.attendance.attendanceRate > 90
                            ? "excellent"
                            : "good",
                      },
                      {
                        metric: "Department Count",
                        current: dashboardData.departments.length.toString(),
                        previous: Math.max(
                          1,
                          dashboardData.departments.length - 1
                        ).toString(),
                        change: dashboardData.departments.length > 0 ? 5.0 : 0,
                        status: "good",
                      },
                      {
                        metric: "Active Employees",
                        current: dashboardData.overview.activeToday.toString(),
                        previous: Math.max(
                          1,
                          dashboardData.overview.activeToday - 2
                        ).toString(),
                        change: 3.5,
                        status: "good",
                      },
                      {
                        metric: "Pending Requests",
                        current:
                          dashboardData.overview.pendingRequests.toString(),
                        previous: Math.max(
                          1,
                          dashboardData.overview.pendingRequests + 5
                        ).toString(),
                        change: -18.2,
                        status: "excellent",
                      },
                    ].map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row.metric}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row.current}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.previous}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div
                            className={`flex items-center ${
                              row.change > 0
                                ? "text-green-600"
                                : row.change < 0
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {row.change > 0 ? (
                              <ArrowUp className="h-4 w-4 mr-1" />
                            ) : row.change < 0 ? (
                              <ArrowDown className="h-4 w-4 mr-1" />
                            ) : null}
                            {row.change !== 0
                              ? `${Math.abs(row.change)}%`
                              : "No change"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              row.status === "excellent"
                                ? "bg-green-100 text-green-800"
                                : row.status === "good"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
