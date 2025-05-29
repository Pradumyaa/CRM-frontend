import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Filter,
  Search,
  Download,
  RefreshCw,
  Eye,
  MessageSquare,
  TrendingUp,
  BarChart3,
  PieChart,
  Settings,
  Bell,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  User,
  Building,
  Timer,
  Award,
  Target,
  Activity,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://getmax-backend.vercel.app/api";

class AttendanceAPI {
  constructor() {
    this.token = localStorage.getItem("token");
    this.adminId = localStorage.getItem("employeeId");
    if (!this.token) {
      console.error("No authentication token found");
    }
    if (!this.adminId) {
      console.error("No admin ID found");
    }
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            errorData.message ||
            `HTTP error! status: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Dashboard
  async getDashboard() {
    return this.request(`/calendar/dashboard?adminId=${this.adminId}`);
  }

  // Day off requests
  async getPendingRequests(filters = {}) {
    const params = new URLSearchParams({
      adminId: this.adminId,
      status: filters.status || "pending",
      ...filters,
    });
    return this.request(`/calendar/attendance/day-off/pending?${params}`);
  }

  async processRequest(employeeId, date, approved, comments = "") {
    return this.request("/calendar/attendance/day-off/approve", {
      method: "POST",
      body: JSON.stringify({
        adminId: this.adminId,
        employeeId,
        date,
        approved,
        comments,
        notifyEmployee: true,
      }),
    });
  }

  async bulkProcessRequests(requests, approved, comments = "") {
    return this.request("/calendar/attendance/day-off/bulk-process", {
      method: "POST",
      body: JSON.stringify({
        adminId: this.adminId,
        requests,
        approved,
        comments,
      }),
    });
  }

  // Analytics
  async getAnalytics(period = "month") {
    return this.request(
      `/calendar/analytics?adminId=${this.adminId}&period=${period}`
    );
  }

  // Employees
  async getAllEmployees() {
    return this.request("/employees");
  }

  // Employee attendance
  async getEmployeeAttendance(employeeId, startDate, endDate) {
    const params = new URLSearchParams({
      employeeId,
      startDate,
      endDate,
    });
    return this.request(`/calendar/attendance?${params}`);
  }

  // Today's attendance
  async getTodayAttendance(employeeId) {
    return this.request(`/calendar/attendance/today?employeeId=${employeeId}`);
  }

  // Attendance summary
  async getAttendanceSummary(employeeId, period = "month") {
    return this.request(
      `/calendar/attendance/summary?employeeId=${employeeId}&period=${period}`
    );
  }

  // Generate report
  async generateReport(employeeId, startDate, endDate, format = "json") {
    const params = new URLSearchParams({
      employeeId,
      startDate,
      endDate,
      format,
    });
    return this.request(`/calendar/report?${params}`);
  }
}

const api = new AttendanceAPI();

// Enhanced Admin Panel Component
const EnhancedAdminPanel = () => {
  // State management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [employeeAttendanceData, setEmployeeAttendanceData] = useState({});

  // Filters and search
  const [filters, setFilters] = useState({
    status: "pending",
    employeeId: "",
    startDate: "",
    endDate: "",
    requestType: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequests, setSelectedRequests] = useState(new Set());

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [processingRequests, setProcessingRequests] = useState(new Set());
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState(null);

  // Auto-refresh
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        if (activeTab === "dashboard") {
          loadDashboardData();
        } else if (activeTab === "requests") {
          loadPendingRequests();
        }
      }, 30000);

      setRefreshInterval(interval);
      return () => clearInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefresh, activeTab]);

  // Load initial data
  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadDashboardData(),
        loadEmployees(),
        loadPendingRequests(),
        loadAnalytics(),
      ]);
    } catch (error) {
      showError("Failed to load initial data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      const response = await api.getDashboard();
      if (response.success) {
        setDashboardData(response.dashboard);
      } else {
        throw new Error(response.error || "Failed to load dashboard");
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      showError("Failed to load dashboard data");
    }
  };

  // Load employees
  const loadEmployees = async () => {
    try {
      const response = await api.getAllEmployees();
      setEmployees(response.employees || []);
    } catch (error) {
      console.error("Error loading employees:", error);
      showError("Failed to load employees");
    }
  };

  // Load pending requests
  const loadPendingRequests = async () => {
    try {
      const response = await api.getPendingRequests(filters);
      if (response.success) {
        setPendingRequests(response.requests || []);
      } else {
        throw new Error(response.error || "Failed to load requests");
      }
    } catch (error) {
      console.error("Error loading requests:", error);
      showError("Failed to load pending requests");
    }
  };

  // Load analytics
  const loadAnalytics = async (period = "month") => {
    try {
      const response = await api.getAnalytics(period);
      if (response.success) {
        setAnalytics(response.analytics);
      } else {
        throw new Error(response.error || "Failed to load analytics");
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
      showError("Failed to load analytics");
    }
  };

  // Load employee details with attendance
  const loadEmployeeDetails = async (employee) => {
    try {
      setLoading(true);
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const [attendanceResponse, summaryResponse] = await Promise.all([
        api.getEmployeeAttendance(
          employee.employeeId,
          monthStart.toISOString().split("T")[0],
          monthEnd.toISOString().split("T")[0]
        ),
        api.getAttendanceSummary(employee.employeeId, "month"),
      ]);

      setEmployeeDetails({
        employee,
        attendance: attendanceResponse.success
          ? attendanceResponse.attendanceData
          : {},
        summary: summaryResponse.success ? summaryResponse.summary : null,
        stats: attendanceResponse.success ? attendanceResponse.stats : null,
      });
    } catch (error) {
      console.error("Error loading employee details:", error);
      showError("Failed to load employee details");
    } finally {
      setLoading(false);
    }
  };

  // Handle request processing
  const handleProcessRequest = async (request, approved, comments = "") => {
    const requestKey = `${request.employeeId}-${request.date}`;

    if (processingRequests.has(requestKey)) return;

    try {
      setProcessingRequests((prev) => new Set(prev).add(requestKey));

      const response = await api.processRequest(
        request.employeeId,
        request.date,
        approved,
        comments
      );

      if (response.success) {
        // Remove from pending requests
        setPendingRequests((prev) =>
          prev.filter(
            (req) =>
              !(
                req.employeeId === request.employeeId &&
                req.date === request.date
              )
          )
        );

        showSuccess(
          `Request ${approved ? "approved" : "rejected"} successfully`
        );
        loadDashboardData();
      } else {
        throw new Error(response.error || "Failed to process request");
      }
    } catch (error) {
      showError(
        `Failed to ${approved ? "approve" : "reject"} request: ${error.message}`
      );
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestKey);
        return newSet;
      });
    }
  };

  // Handle bulk processing
  const handleBulkProcess = async (approved, comments = "") => {
    if (selectedRequests.size === 0) {
      showError("Please select requests to process");
      return;
    }

    try {
      setLoading(true);

      const requestsToProcess = pendingRequests
        .filter((req) => selectedRequests.has(`${req.employeeId}-${req.date}`))
        .map((req) => ({
          employeeId: req.employeeId,
          date: req.date,
        }));

      const response = await api.bulkProcessRequests(
        requestsToProcess,
        approved,
        comments
      );

      if (response.success) {
        // Remove processed requests
        setPendingRequests((prev) =>
          prev.filter(
            (req) => !selectedRequests.has(`${req.employeeId}-${req.date}`)
          )
        );

        setSelectedRequests(new Set());
        showSuccess(
          `Bulk ${approved ? "approval" : "rejection"} completed: ${
            response.summary.successful
          } successful, ${response.summary.failed} failed`
        );

        loadDashboardData();
      } else {
        throw new Error(response.error || "Bulk processing failed");
      }
    } catch (error) {
      showError(`Bulk processing failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Update filters and reload data
  useEffect(() => {
    if (activeTab === "requests") {
      loadPendingRequests();
    }
  }, [filters]);

  // Utility functions
  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 5000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityColor = (priority) => {
    if (priority >= 100) return "text-red-600 bg-red-50";
    if (priority >= 80) return "text-orange-600 bg-orange-50";
    if (priority >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-blue-600 bg-blue-50";
  };

  const getPriorityLabel = (priority) => {
    if (priority >= 100) return "Urgent";
    if (priority >= 80) return "High";
    if (priority >= 60) return "Medium";
    return "Low";
  };

  // Filter requests based on search and filters
  const filteredRequests = pendingRequests.filter((request) => {
    const matchesSearch =
      searchTerm === "" ||
      request.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      (filters.status === "" ||
        filters.status === "all" ||
        request.status === filters.status) &&
      (filters.employeeId === "" ||
        request.employeeId === filters.employeeId) &&
      (filters.requestType === "" ||
        request.requestType === filters.requestType);

    return matchesSearch && matchesFilters;
  });

  if (loading && !dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Activity className="h-8 w-8 text-blue-600 mr-3" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage employee attendance and requests
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Auto-refresh toggle */}
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Auto-refresh</label>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoRefresh ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoRefresh ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Refresh button */}
              <button
                onClick={loadInitialData}
                className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="ml-auto text-green-400 hover:text-green-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              {
                id: "requests",
                label: "Requests",
                icon: Bell,
                badge: pendingRequests.filter((r) => r.status === "pending")
                  .length,
              },
              { id: "employees", label: "Employees", icon: Users },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
              { id: "reports", label: "Reports", icon: Download },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
                {tab.badge > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && dashboardData && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Total Employees
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardData.today?.totalEmployees || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Present Today
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardData.today?.stats?.present || 0}
                    </p>
                    <p className="text-xs text-green-600">
                      {dashboardData.today?.stats?.currentlyWorking || 0}{" "}
                      currently working
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Late Today
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardData.today?.stats?.late || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      On Leave
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardData.today?.stats?.onLeave || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Stats */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Monthly Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.monthly?.stats?.totalPresent || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total Present</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">
                    {dashboardData.monthly?.stats?.totalLate || 0}
                  </p>
                  <p className="text-sm text-gray-600">Late Arrivals</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {dashboardData.monthly?.stats?.totalOvertime || 0}
                  </p>
                  <p className="text-sm text-gray-600">Overtime</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {dashboardData.monthly?.stats?.totalDayOffs || 0}
                  </p>
                  <p className="text-sm text-gray-600">Day Offs</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {dashboardData.monthly?.stats?.averageWorkingHours || 0}h
                  </p>
                  <p className="text-sm text-gray-600">Avg. Hours</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {dashboardData.recentActivity?.length > 0 ? (
                  dashboardData.recentActivity
                    .slice(0, 8)
                    .map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div
                          className={`flex-shrink-0 w-3 h-3 rounded-full ${
                            activity.type === "clock_in"
                              ? "bg-green-400"
                              : "bg-red-400"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">
                              {activity.employeeName || activity.employeeId}
                            </span>
                            {activity.type === "clock_in"
                              ? " clocked in"
                              : " clocked out"}
                            {activity.isLate && (
                              <span className="text-red-600 ml-1">(Late)</span>
                            )}
                            {activity.hasOvertime && (
                              <span className="text-orange-600 ml-1">
                                (Overtime)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            {/* Request Management Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Day Off Requests
                  </h3>
                  <p className="text-sm text-gray-600">
                    {filteredRequests.length} requests found
                    {selectedRequests.size > 0 &&
                      ` • ${selectedRequests.size} selected`}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  {/* Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {showFilters ? (
                      <ChevronUp className="h-4 w-4 ml-2" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-2" />
                    )}
                  </button>

                  {/* Bulk Actions */}
                  {selectedRequests.size > 0 && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBulkProcess(true)}
                        className="flex items-center px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        disabled={loading}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Selected
                      </button>
                      <button
                        onClick={() => handleBulkProcess(false)}
                        className="flex items-center px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        disabled={loading}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Selected
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="all">All</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee
                      </label>
                      <select
                        value={filters.employeeId}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            employeeId: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All Employees</option>
                        {employees.map((emp) => (
                          <option key={emp.employeeId} value={emp.employeeId}>
                            {emp.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Request Type
                      </label>
                      <select
                        value={filters.requestType}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            requestType: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All Types</option>
                        <option value="personal">Personal</option>
                        <option value="medical">Medical</option>
                        <option value="family">Family</option>
                        <option value="emergency">Emergency</option>
                        <option value="vacation">Vacation</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={loadPendingRequests}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {filteredRequests.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No requests found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {filters.status === "pending"
                      ? "All requests have been processed"
                      : "Try adjusting your filters"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={
                              selectedRequests.size ===
                                filteredRequests.length &&
                              filteredRequests.length > 0
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRequests(
                                  new Set(
                                    filteredRequests.map(
                                      (req) => `${req.employeeId}-${req.date}`
                                    )
                                  )
                                );
                              } else {
                                setSelectedRequests(new Set());
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRequests.map((request) => {
                        const requestKey = `${request.employeeId}-${request.date}`;
                        const isProcessing = processingRequests.has(requestKey);
                        const isSelected = selectedRequests.has(requestKey);

                        return (
                          <tr
                            key={requestKey}
                            className={`hover:bg-gray-50 ${
                              isSelected ? "bg-blue-50" : ""
                            }`}
                          >
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  const newSelected = new Set(selectedRequests);
                                  if (e.target.checked) {
                                    newSelected.add(requestKey);
                                  } else {
                                    newSelected.delete(requestKey);
                                  }
                                  setSelectedRequests(newSelected);
                                }}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User className="h-5 w-5 text-gray-500" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {request.employeeName || request.employeeId}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {request.employeeId}
                                  </div>
                                  {request.employeeDepartment && (
                                    <div className="text-xs text-gray-400 flex items-center mt-1">
                                      <Building className="h-3 w-3 mr-1" />
                                      {request.employeeDepartment}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatDate(request.date)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {request.dayOfWeek ||
                                  new Date(request.date).toLocaleDateString(
                                    "en-US",
                                    { weekday: "long" }
                                  )}
                              </div>
                              {request.daysFromNow <= 3 &&
                                request.daysFromNow >= 0 && (
                                  <div className="text-xs text-orange-600 font-medium mt-1">
                                    {request.daysFromNow === 0
                                      ? "Today"
                                      : request.daysFromNow === 1
                                      ? "Tomorrow"
                                      : `In ${request.daysFromNow} days`}
                                  </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                {request.requestType || "personal"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                                  request.priority || 50
                                )}`}
                              >
                                {getPriorityLabel(request.priority || 50)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div
                                className="text-sm text-gray-900 max-w-xs truncate"
                                title={request.reason}
                              >
                                {request.reason || "No reason provided"}
                              </div>
                              {request.requestedAt && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Requested {formatDate(request.requestedAt)}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  request.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : request.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {request.status?.charAt(0).toUpperCase() +
                                  request.status?.slice(1) || "Pending"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {request.status === "pending" ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() =>
                                      handleProcessRequest(request, true)
                                    }
                                    disabled={isProcessing}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                  >
                                    {isProcessing ? (
                                      <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full mr-1"></div>
                                    ) : (
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                    )}
                                    Approve
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleProcessRequest(request, false)
                                    }
                                    disabled={isProcessing}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                  >
                                    {isProcessing ? (
                                      <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full mr-1"></div>
                                    ) : (
                                      <XCircle className="h-3 w-3 mr-1" />
                                    )}
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {request.status === "approved"
                                    ? "Approved"
                                    : "Rejected"}
                                  {(request.approvedAt ||
                                    request.rejectedAt) && (
                                    <span className="ml-1">
                                      {formatDate(
                                        request.approvedAt || request.rejectedAt
                                      )}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === "employees" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Employee Management
                </h3>
                <div className="flex space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees
                      .filter(
                        (emp) =>
                          searchTerm === "" ||
                          emp.name
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          emp.employeeId
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase())
                      )
                      .map((employee) => (
                        <tr
                          key={employee.employeeId}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-5 w-5 text-gray-500" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {employee.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {employee.employeeId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {employee.department || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.jobTitle}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                employee.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {employee.status || "Active"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{employee.email}</div>
                            <div>{employee.phoneNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedEmployee(employee);
                                loadEmployeeDetails(employee);
                                setShowEmployeeModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && analytics && (
          <div className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Requests
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analytics.overview?.totalRequests || 0}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Approval Rate
                    </p>
                    <p className="text-2xl font-semibold text-green-600">
                      {analytics.overview?.approvalRate || 0}%
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pending</p>
                    <p className="text-2xl font-semibold text-yellow-600">
                      {analytics.overview?.pending || 0}
                    </p>
                  </div>
                  <Timer className="h-8 w-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Avg. Processing
                    </p>
                    <p className="text-2xl font-semibold text-blue-600">
                      {analytics.overview?.averageProcessingTime || 0}d
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Request Types */}
            {analytics.byType && Object.keys(analytics.byType).length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Requests by Type
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(analytics.byType).map(([type, data]) => (
                    <div key={type} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-900 capitalize">
                          {type}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {data.total} total
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-600">Approved:</span>
                          <span>{data.approved}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-600">Rejected:</span>
                          <span>{data.rejected}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-yellow-600">Pending:</span>
                          <span>{data.pending}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insights */}
            {analytics.insights && analytics.insights.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Insights & Recommendations
                </h3>
                <div className="space-y-4">
                  {analytics.insights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        insight.type === "warning"
                          ? "bg-yellow-50 border-yellow-400"
                          : insight.type === "info"
                          ? "bg-blue-50 border-blue-400"
                          : "bg-gray-50 border-gray-400"
                      }`}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0">
                          {insight.type === "warning" ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-400" />
                          ) : (
                            <TrendingUp className="h-5 w-5 text-blue-400" />
                          )}
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900">
                            {insight.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {insight.message}
                          </p>
                          {insight.action && (
                            <p className="text-sm text-blue-600 mt-2 flex items-center">
                              <ArrowRight className="h-3 w-3 mr-1" />
                              {insight.action}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No analytics message */}
            {!analytics.overview && (
              <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">
                  No analytics data available
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Analytics will appear when day off requests are processed
                </p>
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Generate Reports
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">All Employees</option>
                      {employees.map((emp) => (
                        <option key={emp.employeeId} value={emp.employeeId}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="date"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Format
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="json">JSON</option>
                      <option value="csv">CSV</option>
                      <option value="pdf">PDF</option>
                    </select>
                  </div>

                  <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Quick Reports</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className="font-medium text-gray-900">
                        Today's Attendance
                      </div>
                      <div className="text-sm text-gray-500">
                        All employees - current day
                      </div>
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className="font-medium text-gray-900">
                        Monthly Summary
                      </div>
                      <div className="text-sm text-gray-500">
                        All employees - current month
                      </div>
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className="font-medium text-gray-900">
                        Late Arrivals
                      </div>
                      <div className="text-sm text-gray-500">
                        Employees with late arrivals
                      </div>
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className="font-medium text-gray-900">
                        Day Off Summary
                      </div>
                      <div className="text-sm text-gray-500">
                        All day off requests and status
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Employee Detail Modal */}
      {showEmployeeModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedEmployee.name}'s Details
                </h3>
                <button
                  onClick={() => {
                    setShowEmployeeModal(false);
                    setEmployeeDetails(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="ml-3 text-gray-600">
                    Loading employee details...
                  </p>
                </div>
              ) : employeeDetails ? (
                <div className="space-y-6">
                  {/* Employee Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-3">
                        Employee Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm">
                            <span className="font-medium">Name:</span>{" "}
                            {selectedEmployee.name}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm">
                            <span className="font-medium">ID:</span>{" "}
                            {selectedEmployee.employeeId}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm">
                            <span className="font-medium">Email:</span>{" "}
                            {selectedEmployee.email}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Building className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm">
                            <span className="font-medium">Department:</span>{" "}
                            {selectedEmployee.department || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm">
                            <span className="font-medium">Job Title:</span>{" "}
                            {selectedEmployee.jobTitle}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm">
                            <span className="font-medium">Phone:</span>{" "}
                            {selectedEmployee.phoneNumber || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-3">
                        Monthly Attendance Summary
                      </h4>
                      {employeeDetails.summary ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 p-3 rounded-lg">
                              <div className="text-lg font-semibold text-green-600">
                                {employeeDetails.summary.presentDays}
                              </div>
                              <div className="text-xs text-green-700">
                                Present Days
                              </div>
                            </div>
                            <div className="bg-red-50 p-3 rounded-lg">
                              <div className="text-lg font-semibold text-red-600">
                                {employeeDetails.summary.absentDays}
                              </div>
                              <div className="text-xs text-red-700">
                                Absent Days
                              </div>
                            </div>
                            <div className="bg-yellow-50 p-3 rounded-lg">
                              <div className="text-lg font-semibold text-yellow-600">
                                {employeeDetails.summary.lateDays}
                              </div>
                              <div className="text-xs text-yellow-700">
                                Late Days
                              </div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <div className="text-lg font-semibold text-blue-600">
                                {employeeDetails.summary.dayOffs}
                              </div>
                              <div className="text-xs text-blue-700">
                                Day Offs
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="text-sm">
                              <span className="font-medium">
                                Attendance Rate:
                              </span>{" "}
                              {employeeDetails.summary.attendancePercentage}%
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">
                                Punctuality Score:
                              </span>{" "}
                              {employeeDetails.summary.punctualityScore}%
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">
                                Avg. Working Hours:
                              </span>{" "}
                              {employeeDetails.summary.averageWorkingHours}h
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No attendance data available
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Recent Attendance */}
                  {employeeDetails.attendance &&
                    Object.keys(employeeDetails.attendance).length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-3">
                          Recent Attendance (This Month)
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  Date
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  Status
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  Clock In
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  Clock Out
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  Hours
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  Notes
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {Object.entries(employeeDetails.attendance)
                                .sort(([a], [b]) => new Date(b) - new Date(a))
                                .slice(0, 10)
                                .map(([date, record]) => (
                                  <tr key={date} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm text-gray-900">
                                      {formatDate(date)}
                                    </td>
                                    <td className="px-4 py-2">
                                      <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          record.status === "present"
                                            ? "bg-green-100 text-green-800"
                                            : record.dayOffRequested &&
                                              record.approved
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {record.dayOffRequested &&
                                        record.approved
                                          ? "Day Off"
                                          : record.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-900">
                                      {record.clockIn
                                        ? formatTime(record.clockIn)
                                        : "-"}
                                      {record.isLate && (
                                        <span className="ml-1 text-xs text-red-600">
                                          (Late)
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-900">
                                      {record.clockOut
                                        ? formatTime(record.clockOut)
                                        : "-"}
                                      {record.isEarly && (
                                        <span className="ml-1 text-xs text-orange-600">
                                          (Early)
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-900">
                                      {record.workingHours || 0}h
                                      {record.hasOvertime && (
                                        <span className="ml-1 text-xs text-blue-600">
                                          (OT)
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-500">
                                      {record.reason || record.notes || "-"}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Employee details not available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAdminPanel;
