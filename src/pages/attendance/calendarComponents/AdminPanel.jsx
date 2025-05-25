import React, { useState, useEffect } from "react";
import {
  Shield,
  Bell,
  Check,
  X,
  Calendar,
  User,
  RefreshCw,
  Filter,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { calendarApi } from "../../../utils/apiClient";
import { formatDateToString } from "../../../utils/calendarStyles";
import Spinner from "./Spinner";

const AdminPanel = ({
  isAdmin,
  employeeId,
  onApproveRequest,
  onRejectRequest,
  refreshData,
  className = "",
}) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingRequests, setProcessingRequests] = useState(new Set());

  // Fetch pending day off requests
  const fetchPendingRequests = async () => {
    if (!isAdmin || !employeeId) return;

    try {
      setIsLoading(true);
      setError("");

      console.log("Fetching pending requests for admin:", employeeId);
      const response = await calendarApi.getPendingRequests(employeeId);

      console.log("API Response:", response);

      // Handle different response formats
      const requests = response.requests || response.pendingRequests || [];
      setPendingRequests(requests);

      if (requests.length === 0) {
        console.log("No pending requests found");
      }
    } catch (error) {
      console.error("Error fetching pending day off requests:", error);
      setError(`Failed to fetch pending requests: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch requests when admin status changes or component mounts
  useEffect(() => {
    if (isAdmin && showPendingRequests) {
      fetchPendingRequests();
    }
  }, [isAdmin, showPendingRequests]);

  // Handle request refresh
  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    await fetchPendingRequests();

    // Show refresh animation for a moment
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Handle request approval
  const handleApproveRequest = async (request) => {
    const requestKey = `${request.employeeId}-${request.date}`;

    if (processingRequests.has(requestKey)) return;

    try {
      setProcessingRequests((prev) => new Set(prev).add(requestKey));
      setError("");

      console.log("Approving request:", request);

      // Call the API to approve the request
      await calendarApi.processDayOffRequest(
        employeeId, // Admin ID
        request.employeeId, // Employee ID
        request.date, // Date
        true // Approved
      );

      // Remove approved request from the list
      setPendingRequests((prevRequests) =>
        prevRequests.filter(
          (req) =>
            !(
              req.employeeId === request.employeeId && req.date === request.date
            )
        )
      );

      // Call parent callback if provided
      if (onApproveRequest) {
        await onApproveRequest(request.date, request.employeeId, true);
      }

      // Refresh attendance data
      if (refreshData) {
        refreshData();
      }

      console.log("Request approved successfully");
    } catch (error) {
      console.error("Error approving request:", error);
      setError(`Failed to approve request: ${error.message}`);
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestKey);
        return newSet;
      });
    }
  };

  // Handle request rejection
  const handleRejectRequest = async (request) => {
    const requestKey = `${request.employeeId}-${request.date}`;

    if (processingRequests.has(requestKey)) return;

    try {
      setProcessingRequests((prev) => new Set(prev).add(requestKey));
      setError("");

      console.log("Rejecting request:", request);

      // Call the API to reject the request
      await calendarApi.processDayOffRequest(
        employeeId, // Admin ID
        request.employeeId, // Employee ID
        request.date, // Date
        false // Rejected
      );

      // Remove rejected request from the list
      setPendingRequests((prevRequests) =>
        prevRequests.filter(
          (req) =>
            !(
              req.employeeId === request.employeeId && req.date === request.date
            )
        )
      );

      // Call parent callback if provided
      if (onRejectRequest) {
        await onRejectRequest(request.date, request.employeeId, false);
      }

      // Refresh attendance data
      if (refreshData) {
        refreshData();
      }

      console.log("Request rejected successfully");
    } catch (error) {
      console.error("Error rejecting request:", error);
      setError(`Failed to reject request: ${error.message}`);
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestKey);
        return newSet;
      });
    }
  };

  // Get filtered requests based on status
  const getFilteredRequests = () => {
    if (filterStatus === "all") return pendingRequests;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStr = formatDateToString(today);

    return pendingRequests.filter((request) => {
      if (filterStatus === "today") {
        return request.date === todayStr;
      }
      if (filterStatus === "upcoming") {
        return new Date(request.date) > today;
      }
      return true;
    });
  };

  // If not admin, don't render anything
  if (!isAdmin) return null;

  // Get filtered requests
  const filteredRequests = getFilteredRequests();

  return (
    <div
      className={`mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 overflow-hidden shadow-md transition-all duration-300 ${className}`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-3 flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          <Shield className="mr-2" size={20} />
          Admin Panel
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
        >
          <ChevronDown
            size={18}
            className={`transform transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
            <h4 className="font-medium text-blue-800">Attendance Management</h4>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className={`p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors ${
                  isRefreshing ? "animate-spin" : ""
                }`}
                disabled={isRefreshing}
                title="Refresh"
              >
                <RefreshCw size={18} />
              </button>

              <div className="relative">
                <div className="flex items-center gap-1 px-3 py-1.5 bg-white text-blue-600 rounded-md hover:bg-blue-50 border border-blue-300 shadow-sm cursor-pointer">
                  <Filter size={14} />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none bg-transparent border-none outline-none cursor-pointer pr-4 text-sm"
                  >
                    <option value="all">All Requests</option>
                    <option value="today">Today</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowPendingRequests(!showPendingRequests);
                  if (!showPendingRequests) fetchPendingRequests();
                }}
                className="px-3 py-1.5 bg-white text-blue-600 rounded-md hover:bg-blue-50 border border-blue-300 shadow-sm flex items-center"
              >
                <Bell size={16} className="mr-2" />
                {showPendingRequests ? "Hide" : "Show"} Pending Requests
                {pendingRequests.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {showPendingRequests && (
            <div className="mt-3 transition-all duration-300">
              {isLoading ? (
                <Spinner
                  message="Loading pending requests..."
                  size="sm"
                  className="min-h-24"
                />
              ) : filteredRequests.length === 0 ? (
                <div className="text-center p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
                  <Calendar className="h-12 w-12 text-blue-300 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">
                    No pending requests
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    All day off requests have been processed
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-blue-100 overflow-hidden shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRequests.map((request) => {
                        const requestKey = `${request.employeeId}-${request.date}`;
                        const isProcessing = processingRequests.has(requestKey);

                        return (
                          <tr
                            key={requestKey}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">
                                    {request.employeeName}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {request.employeeId}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-900">
                                  {new Date(request.date).toLocaleDateString(
                                    undefined,
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(request.date).toLocaleDateString(
                                    undefined,
                                    {
                                      weekday: "short",
                                    }
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 max-w-xs">
                              <div className="truncate" title={request.reason}>
                                {request.reason || "No reason provided"}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleApproveRequest(request)}
                                  disabled={isProcessing}
                                  className={`px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded text-xs hover:from-green-600 hover:to-green-700 transition-colors flex items-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  {isProcessing ? (
                                    <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full mr-1"></div>
                                  ) : (
                                    <Check size={12} className="mr-1" />
                                  )}
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(request)}
                                  disabled={isProcessing}
                                  className={`px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded text-xs hover:from-red-600 hover:to-red-700 transition-colors flex items-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  {isProcessing ? (
                                    <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full mr-1"></div>
                                  ) : (
                                    <X size={12} className="mr-1" />
                                  )}
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
