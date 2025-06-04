import React, { useState, useEffect } from "react";
import {
  Activity,
  Users,
  Clock,
  Eye,
  Filter,
  Search,
  RefreshCw,
  MapPin,
  Calendar,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Play,
  Pause,
  Square,
  Monitor,
  Smartphone,
  Globe,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Settings,
  Download,
  Bell,
  X,
} from "lucide-react";

const LiveActivityTracker = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [stats, setStats] = useState({
    totalActive: 0,
    totalOnline: 0,
    clockedIn: 0,
    onBreak: 0,
    productivity: 85,
  });

  // Get auth token and user
  const getAuthToken = () => localStorage.getItem("token");
  const getCurrentUser = () =>
    JSON.parse(localStorage.getItem("userData") || "{}");

  // API call wrapper
  const apiCall = async (url, options = {}) => {
    const token = getAuthToken();
    const response = await fetch(`http://localhost:3000/api${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API call failed");
    }

    return response.json();
  };

  // Fetch all employees for online status
  const fetchEmployees = async () => {
    try {
      const response = await apiCall("/employees");
      return response.employees || [];
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      return [];
    }
  };

  // Fetch attendance dashboard for activity data
  const fetchAttendanceDashboard = async () => {
    try {
      const currentUser = getCurrentUser();
      const response = await apiCall(
        `/calendar/dashboard?adminId=${currentUser.employeeId}`
      );

      if (response.success) {
        return {
          recentActivity: response.dashboard.recentActivity || [],
          todayStats: response.dashboard.today.stats || {},
          totalEmployees: response.dashboard.today.totalEmployees || 0,
        };
      }
      return { recentActivity: [], todayStats: {}, totalEmployees: 0 };
    } catch (error) {
      console.error("Failed to fetch attendance dashboard:", error);
      return { recentActivity: [], todayStats: {}, totalEmployees: 0 };
    }
  };

  // Fetch today's attendance for all employees
  const fetchTodayAttendance = async () => {
    try {
      const currentUser = getCurrentUser();
      const response = await apiCall(
        `/calendar/attendance/all?adminId=${currentUser.employeeId}&startDate=${
          new Date().toISOString().split("T")[0]
        }&endDate=${new Date().toISOString().split("T")[0]}`
      );

      if (response.success) {
        return response.attendanceByEmployee || {};
      }
      return {};
    } catch (error) {
      console.error("Failed to fetch today attendance:", error);
      return {};
    }
  };

  // Load all activity data
  const loadActivityData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [employees, dashboardData, todayAttendance] = await Promise.all([
        fetchEmployees(),
        fetchAttendanceDashboard(),
        fetchTodayAttendance(),
      ]);

      // Process activities from recent activity and attendance data
      const processedActivities = [];

      // Add recent activities
      dashboardData.recentActivity.forEach((activity) => {
        processedActivities.push({
          id: `activity_${Date.now()}_${Math.random()}`,
          employeeId: activity.employeeId || "unknown",
          employeeName: activity.employeeName || "Unknown User",
          type: activity.type || "unknown",
          timestamp: new Date(activity.timestamp || Date.now()),
          status: getActivityStatus(activity.type),
          device: getRandomDevice(),
          location: "Office", // Mock location
          duration: Math.floor(Math.random() * 120) + 5, // Mock duration in minutes
          isLate: activity.isLate || false,
          isEarly: activity.isEarly || false,
          hasOvertime: activity.hasOvertime || false,
        });
      });

      // Add current online users from today's attendance
      const onlineUsersList = [];
      Object.entries(todayAttendance).forEach(
        ([employeeId, attendanceData]) => {
          const employee = employees.find(
            (emp) => emp.employeeId === employeeId
          );
          const todayData = Object.values(attendanceData.attendanceData)[0];

          if (todayData && todayData.clockIn && !todayData.clockOut) {
            onlineUsersList.push({
              employeeId,
              name: employee?.name || employeeId,
              email: employee?.email || "",
              jobTitle: employee?.jobTitle || "",
              department: employee?.department || "",
              clockInTime: todayData.clockIn,
              status: "online",
              isLate: todayData.isLate || false,
              device: getRandomDevice(),
              location: employee?.location || "Office",
            });
          }
        }
      );

      // Calculate stats
      const totalActive = processedActivities.filter(
        (a) => new Date() - a.timestamp < 30 * 60 * 1000 // Active in last 30 minutes
      ).length;

      const clockedInCount = onlineUsersList.length;
      const onBreakCount = Math.floor(clockedInCount * 0.1); // Mock break data

      setActivities(processedActivities);
      setOnlineUsers(onlineUsersList);
      setStats({
        totalActive,
        totalOnline: onlineUsersList.length,
        clockedIn: clockedInCount,
        onBreak: onBreakCount,
        productivity: Math.floor(Math.random() * 20) + 80, // Mock productivity
      });
    } catch (error) {
      setError(`Failed to load activity data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getActivityStatus = (type) => {
    const statusMap = {
      clock_in: "active",
      clock_out: "offline",
      break_start: "break",
      break_end: "active",
      meeting: "busy",
      document: "active",
    };
    return statusMap[type] || "active";
  };

  const getRandomDevice = () => {
    const devices = ["Desktop", "Mobile", "Tablet"];
    return devices[Math.floor(Math.random() * devices.length)];
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "green",
      offline: "gray",
      break: "yellow",
      busy: "red",
      online: "green",
    };
    return colors[status] || "gray";
  };

  const getDeviceIcon = (device) => {
    switch (device) {
      case "Desktop":
        return Monitor;
      case "Mobile":
        return Smartphone;
      case "Tablet":
        return Globe;
      default:
        return Monitor;
    }
  };

  // Filter activities
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || activity.status === filterStatus;

    let matchesTimeRange = true;
    const now = new Date();
    const activityTime = new Date(activity.timestamp);

    switch (selectedTimeRange) {
      case "today":
        matchesTimeRange = activityTime.toDateString() === now.toDateString();
        break;
      case "hour":
        matchesTimeRange = now - activityTime < 60 * 60 * 1000;
        break;
      case "live":
        matchesTimeRange = now - activityTime < 5 * 60 * 1000;
        break;
    }

    return matchesSearch && matchesStatus && matchesTimeRange;
  });

  // Auto refresh
  useEffect(() => {
    loadActivityData();

    let interval;
    if (autoRefresh) {
      interval = setInterval(loadActivityData, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // Clear messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Format time ago
  const timeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Activity className="h-8 w-8 text-green-600 mr-3" />
              Live Activity Tracker
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time monitoring of employee activities and presence
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="autoRefresh" className="text-sm text-gray-600">
                Auto Refresh
              </label>
            </div>

            <button
              onClick={loadActivityData}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalActive}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Online Now</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalOnline}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Clocked In</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.clockedIn}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">On Break</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.onBreak}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Productivity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.productivity}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="lg:col-span-2 bg-white rounded-lg border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Activity Feed
                </h3>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="offline">Offline</option>
                  <option value="break">On Break</option>
                  <option value="busy">Busy</option>
                </select>

                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="live">Last 5 minutes</option>
                  <option value="hour">Last hour</option>
                  <option value="today">Today</option>
                </select>

                <div className="text-sm text-gray-600">
                  {filteredActivities.length} activities
                </div>
              </div>
            </div>

            {/* Activity List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Loading activities...</p>
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="p-8 text-center">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No activities found</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredActivities.map((activity) => {
                    const DeviceIcon = getDeviceIcon(activity.device);
                    return (
                      <div
                        key={activity.id}
                        className="p-4 hover:bg-gray-50 border-b"
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full bg-${getStatusColor(
                              activity.status
                            )}-500 mt-2`}
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {activity.employeeName}
                              </p>
                              <div className="flex items-center space-x-2">
                                <DeviceIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {timeAgo(activity.timestamp)}
                                </span>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 capitalize">
                              {activity.type.replace("_", " ")}
                              {activity.isLate && " (Late)"}
                              {activity.isEarly && " (Early)"}
                              {activity.hasOvertime && " (Overtime)"}
                            </p>

                            <div className="flex items-center mt-1 space-x-4">
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPin className="h-3 w-3 mr-1" />
                                {activity.location}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {activity.duration}m
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Online Users */}
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Currently Online
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {onlineUsers.length} employees active
              </p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {onlineUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No one is currently online</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {onlineUsers.map((user) => {
                    const DeviceIcon = getDeviceIcon(user.device);
                    return (
                      <div
                        key={user.employeeId}
                        className="p-4 hover:bg-gray-50 border-b"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-green-600 font-medium text-sm">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {user.name}
                              </p>
                              <DeviceIcon className="h-4 w-4 text-gray-400" />
                            </div>

                            <p className="text-xs text-gray-600 truncate">
                              {user.jobTitle} • {user.department}
                            </p>

                            <div className="flex items-center mt-1 space-x-2">
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                Clocked in {timeAgo(user.clockInTime)}
                              </div>
                              {user.isLate && (
                                <span className="text-xs text-yellow-600 font-medium">
                                  Late
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveActivityTracker;
