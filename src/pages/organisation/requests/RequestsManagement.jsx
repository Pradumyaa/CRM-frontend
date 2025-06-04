import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  FileText,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Check,
  X,
  Plus,
  Send,
  Download,
  Settings,
  Users,
  Building,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Bell,
  Loader,
  Star,
  Archive,
  BookOpen,
  Zap,
  Target,
  TrendingUp,
  Activity,
} from "lucide-react";

const API_BASE_URL = "http://localhost:3000/api";

// API Service
class RequestsService {
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

  static async getPendingDayOffRequests(
    status = "all",
    limit = 50,
    offset = 0
  ) {
    const user = this.getCurrentUser();
    const params = new URLSearchParams({
      adminId: user.employeeId,
      status,
      limit: limit.toString(),
      offset: offset.toString(),
    });
    return this.request(`/calendar/attendance/day-off/pending?${params}`);
  }

  static async approveDayOffRequest(
    employeeId,
    date,
    approved,
    comments = "",
    notifyEmployee = true
  ) {
    const user = this.getCurrentUser();
    return this.request("/calendar/attendance/day-off/approve", {
      method: "POST",
      body: JSON.stringify({
        adminId: user.employeeId,
        employeeId,
        date,
        approved,
        comments,
        notifyEmployee,
      }),
    });
  }

  static async bulkProcessDayOffRequests(requests, approved, comments = "") {
    const user = this.getCurrentUser();
    return this.request("/calendar/attendance/day-off/bulk-process", {
      method: "POST",
      body: JSON.stringify({
        adminId: user.employeeId,
        requests,
        approved,
        comments,
      }),
    });
  }

  static async getDayOffRequestDetails(requestId) {
    try {
      const user = this.getCurrentUser();
      return this.request(
        `/calendar/attendance/day-off/details/${requestId}?adminId=${user.employeeId}`
      );
    } catch (error) {
      console.warn("Request details not available:", error);
      // Return basic structure when details endpoint fails
      return {
        success: false,
        requestDetails: {
          employee: {},
          request: {},
          processing: {},
          context: { attendanceStats: {} },
        },
      };
    }
  }

  static async getDayOffAnalytics(period = "month") {
    try {
      const user = this.getCurrentUser();
      return this.request(
        `/calendar/analytics?adminId=${user.employeeId}&period=${period}`
      );
    } catch (error) {
      console.warn("Analytics not available:", error);
      return {
        success: false,
        analytics: {
          overview: { totalRequests: 0, approved: 0, rejected: 0, pending: 0 },
        },
      };
    }
  }

  static async getEmployees() {
    return this.request("/employees");
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

const formatTime = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTimeAgo = (dateString) => {
  if (!dateString) return "N/A";
  const now = new Date();
  const date = new Date(dateString);
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
};

const getPriorityLevel = (daysFromNow, requestType) => {
  let priority = 0;

  // Urgency based on date
  if (daysFromNow <= 1) priority += 100; // Today or tomorrow
  else if (daysFromNow <= 3) priority += 80; // Within 3 days
  else if (daysFromNow <= 7) priority += 60; // Within a week
  else if (daysFromNow <= 14) priority += 40; // Within 2 weeks
  else priority += 20; // More than 2 weeks

  // Type-based priority
  const typePriorities = {
    emergency: 50,
    medical: 40,
    family: 30,
    personal: 20,
    vacation: 10,
  };

  priority += typePriorities[requestType] || 15;
  return priority;
};

const getPriorityColor = (priority) => {
  if (priority >= 100) return "red";
  if (priority >= 80) return "orange";
  if (priority >= 60) return "yellow";
  return "green";
};

const getPriorityLabel = (priority) => {
  if (priority >= 100) return "Urgent";
  if (priority >= 80) return "High";
  if (priority >= 60) return "Medium";
  return "Low";
};

const getStatusColor = (status) => {
  const colors = {
    pending: "yellow",
    approved: "green",
    rejected: "red",
  };
  return colors[status] || "gray";
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

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = "blue",
  loading = false,
}) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm text-gray-600">{title}</p>
        {loading ? (
          <div className="mt-2">
            <LoadingSpinner size="sm" />
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {change !== undefined && (
              <div
                className={`flex items-center mt-1 text-sm ${
                  change > 0
                    ? "text-green-600"
                    : change < 0
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {change > 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : change < 0 ? (
                  <ArrowDown className="h-3 w-3 mr-1" />
                ) : null}
                {change !== 0
                  ? `${Math.abs(change)}% from last week`
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
const RequestCard = ({
  request,
  onApprove,
  onReject,
  onViewDetails,
  loading = false,
}) => {
  // Add null/undefined check at the beginning
  if (!request) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-center text-gray-500">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>Request data not available</p>
        </div>
      </div>
    );
  }

  const priority = getPriorityLevel(
    request.daysFromNow || 0,
    request.requestType || "personal"
  );
  const priorityColor = getPriorityColor(priority);
  const priorityLabel = getPriorityLabel(priority);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="flex items-start space-x-4">
          <div className="h-10 w-10 bg-gray-300 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-3 bg-gray-300 rounded w-1/2" />
            <div className="h-3 bg-gray-300 rounded w-2/3" />
          </div>
          <div className="flex space-x-2">
            <div className="h-8 w-16 bg-gray-300 rounded" />
            <div className="h-8 w-16 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-orange-600 font-medium text-sm">
              {request.employeeName?.charAt(0) || "?"}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-gray-900 truncate">
                {request.employeeName || "Unknown Employee"}
              </h4>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${priorityColor}-100 text-${priorityColor}-800`}
              >
                {priorityLabel}
              </span>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                  {request.employeeJobTitle || "Unknown Position"}
                </span>
                <span className="flex items-center">
                  <Building className="h-4 w-4 mr-1 text-gray-400" />
                  {request.employeeDepartment || "Unknown Dept"}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  {formatDate(request.date)}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  {request.daysFromNow !== undefined
                    ? `${request.daysFromNow} days away`
                    : getTimeAgo(request.requestedAt)}
                </span>
              </div>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-700 line-clamp-2">
                <span className="font-medium">Reason:</span>{" "}
                {request.reason || "No reason provided"}
              </p>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(
                    request.status
                  )}-100 text-${getStatusColor(request.status)}-800`}
                >
                  {request.status === "pending" && (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {request.status === "approved" && (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  {request.status === "rejected" && (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  {request.status?.charAt(0).toUpperCase() +
                    request.status?.slice(1)}
                </span>

                {request.requestType && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {request.requestType}
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-500">
                Requested {getTimeAgo(request.requestedAt)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2 ml-4">
          <button
            onClick={() => onViewDetails && onViewDetails(request)}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            <Eye className="h-3 w-3 mr-1" />
            Details
          </button>

          {request.status === "pending" && (
            <div className="flex space-x-1">
              <button
                onClick={() => onApprove && onApprove(request)}
                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <Check className="h-3 w-3 mr-1" />
                Approve
              </button>
              <button
                onClick={() => onReject && onReject(request)}
                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <X className="h-3 w-3 mr-1" />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const RequestDetailsModal = ({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
  loading = false,
}) => {
  const [comments, setComments] = useState("");
  const [notifyEmployee, setNotifyEmployee] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [requestDetails, setRequestDetails] = useState(null);

  useEffect(() => {
    if (isOpen && request) {
      loadRequestDetails();
    }
  }, [isOpen, request]);

  const loadRequestDetails = async () => {
    try {
      setDetailsLoading(true);
      const response = await RequestsService.getDayOffRequestDetails(
        request.id
      );
      if (response.success) {
        setRequestDetails(response.requestDetails);
      }
    } catch (error) {
      console.error("Failed to load request details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleApprove = () => {
    onApprove(request, comments, notifyEmployee);
    onClose();
  };

  const handleReject = () => {
    onReject(request, comments, notifyEmployee);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Request Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {detailsLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Employee Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Employee Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-orange-600 font-medium text-xl">
                        {request.employeeName?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {request.employeeName}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {request.employeeEmail}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID: {request.employeeId}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {request.employeeJobTitle || "Unknown Position"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {request.employeeDepartment || "Unknown Department"}
                      </span>
                    </div>
                    {requestDetails?.employee?.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {requestDetails.employee.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Request Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Request Date
                      </label>
                      <div className="mt-1 flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {formatDate(request.date)}
                        </span>
                        <span className="text-xs text-gray-500">
                          (
                          {request.dayOfWeek ||
                            new Date(request.date).toLocaleDateString("en-US", {
                              weekday: "long",
                            })}
                          )
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Days Until
                      </label>
                      <div className="mt-1 flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {request.daysFromNow !== undefined
                            ? `${request.daysFromNow} days`
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Request Type
                      </label>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {request.requestType || "Personal"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Priority
                      </label>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getPriorityColor(
                            getPriorityLevel(
                              request.daysFromNow || 0,
                              request.requestType || "personal"
                            )
                          )}-100 text-${getPriorityColor(
                            getPriorityLevel(
                              request.daysFromNow || 0,
                              request.requestType || "personal"
                            )
                          )}-800`}
                        >
                          {getPriorityLabel(
                            getPriorityLevel(
                              request.daysFromNow || 0,
                              request.requestType || "personal"
                            )
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Status & Timeline
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Current Status
                      </label>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(
                            request.status
                          )}-100 text-${getStatusColor(request.status)}-800`}
                        >
                          {request.status === "pending" && (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {request.status === "approved" && (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          {request.status === "rejected" && (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {request.status?.charAt(0).toUpperCase() +
                            request.status?.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Requested
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {getTimeAgo(request.requestedAt)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(request.requestedAt)} at{" "}
                        {formatTime(request.requestedAt)}
                      </p>
                    </div>

                    {request.approvedAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Approved
                        </label>
                        <p className="text-sm text-gray-900 mt-1">
                          {getTimeAgo(request.approvedAt)}
                        </p>
                        <p className="text-xs text-gray-500">
                          by {request.approvedBy}
                        </p>
                      </div>
                    )}

                    {request.rejectedAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Rejected
                        </label>
                        <p className="text-sm text-gray-900 mt-1">
                          {getTimeAgo(request.rejectedAt)}
                        </p>
                        <p className="text-xs text-gray-500">
                          by {request.rejectedBy}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Request Reason
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {request.reason || "No reason provided"}
                  </p>
                </div>
              </div>

              {/* Employee Context */}
              {requestDetails?.context && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    Employee Context
                  </h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {requestDetails.context.attendanceStats
                            ?.attendanceRate || 0}
                          %
                        </div>
                        <div className="text-xs text-blue-700">
                          Attendance Rate
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {requestDetails.context.attendanceStats
                            ?.presentDays || 0}
                        </div>
                        <div className="text-xs text-green-700">
                          Present Days
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {requestDetails.context.attendanceStats?.lateDays ||
                            0}
                        </div>
                        <div className="text-xs text-yellow-700">Late Days</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {requestDetails.context.attendanceStats?.dayOffs || 0}
                        </div>
                        <div className="text-xs text-purple-700">
                          Previous Day Offs
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Section */}
              {request.status === "pending" && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Process Request
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comments (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Add any comments for the employee..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notifyEmployee"
                        checked={notifyEmployee}
                        onChange={(e) => setNotifyEmployee(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="notifyEmployee"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Send notification to employee
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={handleReject}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Request
                      </button>
                      <button
                        onClick={handleApprove}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-green-300 rounded-lg text-green-700 bg-green-50 hover:bg-green-100 focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Request
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Existing Comments */}
              {request.approvalComments && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    Admin Comments
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {request.approvalComments}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Component
const RequestsManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  const loadRequestsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await RequestsService.getPendingDayOffRequests(
        statusFilter
      );

      if (response.success) {
        setRequests(response.requests || []);

        // Calculate stats
        const allRequests = response.requests || [];
        const pending = allRequests.filter(
          (r) => r.status === "pending"
        ).length;
        const approved = allRequests.filter(
          (r) => r.status === "approved"
        ).length;
        const rejected = allRequests.filter(
          (r) => r.status === "rejected"
        ).length;

        setStats({
          pending,
          approved,
          rejected,
          total: allRequests.length,
        });
      }
    } catch (err) {
      setError(`Failed to load requests: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (
    request,
    comments = "",
    notifyEmployee = true
  ) => {
    try {
      await RequestsService.approveDayOffRequest(
        request.employeeId,
        request.date,
        true,
        comments,
        notifyEmployee
      );
      setSuccess("Request approved successfully!");
      loadRequestsData();
    } catch (err) {
      setError(`Failed to approve request: ${err.message}`);
    }
  };

  const handleRejectRequest = async (
    request,
    comments = "",
    notifyEmployee = true
  ) => {
    try {
      await RequestsService.approveDayOffRequest(
        request.employeeId,
        request.date,
        false,
        comments,
        notifyEmployee
      );
      setSuccess("Request rejected successfully!");
      loadRequestsData();
    } catch (err) {
      setError(`Failed to reject request: ${err.message}`);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRequests.length === 0) {
      setError("Please select requests to process");
      return;
    }

    try {
      const requestsToProcess = selectedRequests.map((id) => {
        const request = requests.find((r) => r.id === id);
        return {
          employeeId: request.employeeId,
          date: request.date,
        };
      });

      await RequestsService.bulkProcessDayOffRequests(
        requestsToProcess,
        action === "approve",
        `Bulk ${action} by admin`
      );

      setSuccess(
        `${selectedRequests.length} requests ${action}d successfully!`
      );
      setSelectedRequests([]);
      loadRequestsData();
    } catch (err) {
      setError(`Failed to ${action} requests: ${err.message}`);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleSelectRequest = (requestId, checked) => {
    if (checked) {
      setSelectedRequests([...selectedRequests, requestId]);
    } else {
      setSelectedRequests(selectedRequests.filter((id) => id !== requestId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const pendingRequests = filteredRequests
        .filter((r) => r.status === "pending")
        .map((r) => r.id);
      setSelectedRequests(pendingRequests);
    } else {
      setSelectedRequests([]);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" || request.requestType === typeFilter;

    return matchesSearch && matchesType;
  });

  useEffect(() => {
    loadRequestsData();
  }, [statusFilter]);

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
                <MessageSquare className="h-8 w-8 text-orange-600 mr-3" />
                Requests Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage employee requests, approvals, and workflow processes
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={loadRequestsData}
                disabled={loading}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="ml-auto">
                <X className="h-4 w-4 text-red-400" />
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
              <button onClick={() => setSuccess(null)} className="ml-auto">
                <X className="h-4 w-4 text-green-400" />
              </button>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Pending Requests"
            value={stats.pending}
            change={5.2}
            icon={Clock}
            color="yellow"
            loading={loading}
          />
          <StatCard
            title="Approved Today"
            value={stats.approved}
            change={12.1}
            icon={CheckCircle}
            color="green"
            loading={loading}
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            change={-2.3}
            icon={XCircle}
            color="red"
            loading={loading}
          />
          <StatCard
            title="Total Requests"
            value={stats.total}
            change={8.7}
            icon={FileText}
            color="blue"
            loading={loading}
          />
        </div>

        {/* Filters and Actions */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Types</option>
                <option value="personal">Personal</option>
                <option value="medical">Medical</option>
                <option value="family">Family</option>
                <option value="vacation">Vacation</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Showing {filteredRequests.length} of {requests.length}
              </div>

              {selectedRequests.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedRequests.length} selected
                  </span>
                  <button
                    onClick={() => handleBulkAction("approve")}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Approve All
                  </button>
                  <button
                    onClick={() => handleBulkAction("reject")}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Reject All
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Selection Header */}
        {statusFilter === "pending" &&
          filteredRequests.some((r) => r.status === "pending") && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={
                    selectedRequests.length ===
                    filteredRequests.filter((r) => r.status === "pending")
                      .length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Select all pending requests
                </label>
              </div>
            </div>
          )}

        {/* Requests List */}
        <div className="space-y-4">
          {loading ? (
            [...Array(5)].map((_, i) => <RequestCard key={i} loading={true} />)
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No requests found
              </h3>
              <p className="text-gray-500">
                {searchTerm || typeFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No requests have been submitted yet"}
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="flex items-center space-x-4">
                {request.status === "pending" && (
                  <input
                    type="checkbox"
                    checked={selectedRequests.includes(request.id)}
                    onChange={(e) =>
                      handleSelectRequest(request.id, e.target.checked)
                    }
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                )}
                <div className="flex-1">
                  <RequestCard
                    request={request}
                    onApprove={handleApproveRequest}
                    onReject={handleRejectRequest}
                    onViewDetails={handleViewDetails}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedRequest(null);
        }}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
        loading={loading}
      />
    </div>
  );
};

export default RequestsManagement;
