import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";

// Base API URL from environment variable
const API_BASE_URL = "https://getmax-backend.vercel.app/api";

const AdminPanel = () => {
  const [employees, setEmployees] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    lateToday: 0,
    onLeave: 0,
  });

  const inspectDatabase = async () => {
    const token = localStorage.getItem("token");
    const API_BASE_URL = "https://getmax-backend.vercel.app/api";

    console.log("=== DATABASE INSPECTION ===");

    try {
      // Get current user's attendance data to see what day off requests look like
      const employeeId = localStorage.getItem("employeeId");
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];

      console.log("Fetching attendance data for employee:", employeeId);
      console.log("Date range:", startDate, "to", endDate);

      const response = await fetch(
        `${API_BASE_URL}/calendar/attendance?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Attendance data:", data);

        // Look for day off requests
        const dayOffRequests = [];
        Object.entries(data.attendanceData || {}).forEach(([date, dayData]) => {
          if (dayData.dayOffRequested) {
            dayOffRequests.push({
              date,
              status: dayData.status,
              approved: dayData.approved,
              reason: dayData.reason,
              dayOffRequested: dayData.dayOffRequested,
            });
          }
        });

        console.log("Day off requests found:", dayOffRequests);

        if (dayOffRequests.length === 0) {
          console.log(
            "❌ No day off requests found. Try submitting one first!"
          );
        } else {
          console.log("✅ Found", dayOffRequests.length, "day off requests");
          dayOffRequests.forEach((req, index) => {
            console.log(`Request ${index + 1}:`, req);
          });
        }
      } else {
        console.error("Failed to fetch attendance data:", response.status);
      }
    } catch (error) {
      console.error("Database inspection error:", error);
    }
  };
  const debugAdminStatus = async () => {
    const token = localStorage.getItem("token");
    const employeeId = localStorage.getItem("employeeId");

    console.log("=== ADMIN DEBUG INFO ===");
    console.log("Token:", token ? "Present" : "Missing");
    console.log("Employee ID:", employeeId);

    if (!employeeId) {
      console.error("❌ No employee ID found in localStorage");
      return;
    }

    try {
      // Check admin status using the employee endpoint
      const response = await fetch(
        `${API_BASE_URL}/employees/admin/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Admin check response:", data);
        console.log("Is Admin:", data.isAdmin);

        if (!data.isAdmin) {
          console.warn(
            "⚠️ User is not an admin. Make sure isAdmin: true in Firebase"
          );
        }
      } else {
        const errorData = await response.json();
        console.error("❌ Admin check failed:", response.status, errorData);
      }
    } catch (error) {
      console.error("❌ Admin check error:", error);
    }

    // Also check the Firebase document directly
    try {
      console.log("Checking Firebase document path...");
      console.log("Expected path: /test/employees/data/" + employeeId);
    } catch (error) {
      console.error("Firebase check error:", error);
    }
  };

  // Get current employee ID (admin)
  const currentEmployeeId = localStorage.getItem("employeeId");

  // Fetch all employee data
  const fetchEmployees = async () => {
    try {
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No auth token found. Please login.");
      }

      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch employees: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setEmployees(data.employees || []);
      setStats((prev) => ({
        ...prev,
        totalEmployees: (data.employees || []).length,
      }));
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employee data. Please try again later.");
    }
  };

  // Fetch pending day off requests using the correct endpoint
  const fetchPendingRequests = async () => {
    try {
      setError(null);

      if (!currentEmployeeId) {
        throw new Error("Admin ID not found. Please login again.");
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/calendar/attendance/day-off/pending?adminId=${currentEmployeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setPendingRequests(data.requests || data.pendingRequests || []);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      setError(`Failed to load pending requests: ${error.message}`);
    }
  };

  // Calculate today's stats from employee attendance data
  const fetchTodayStats = async () => {
    try {
      setError(null);

      const token = localStorage.getItem("token");
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      // Get attendance data for today for all employees
      let presentCount = 0;
      let lateCount = 0;
      let onLeaveCount = 0;

      // For each employee, check their attendance for today
      for (const employee of employees) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/calendar/attendance?employeeId=${employee.employeeId}&startDate=${todayStr}&endDate=${todayStr}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const todayData = data.attendanceData?.[todayStr];

            if (todayData) {
              if (todayData.dayOffRequested || todayData.status === "dayoff") {
                onLeaveCount++;
              } else if (todayData.clockIn) {
                presentCount++;
                if (todayData.isLate) {
                  lateCount++;
                }
              }
            }
          }
        } catch (err) {
          console.warn(
            `Failed to fetch attendance for employee ${employee.employeeId}:`,
            err
          );
        }
      }

      setStats((prev) => ({
        ...prev,
        presentToday: presentCount,
        lateToday: lateCount,
        onLeave: onLeaveCount,
      }));
    } catch (error) {
      console.error("Error calculating today stats:", error);
      setError(
        "Failed to calculate today's statistics. Please try again later."
      );
    }
  };

  // Handle day off approval/rejection using the correct endpoint
  const handleRequestAction = async (request, action) => {
    try {
      setError(null);

      if (!currentEmployeeId) {
        throw new Error("Admin ID not found. Please login again.");
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/calendar/attendance/day-off/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            adminId: currentEmployeeId,
            employeeId: request.employeeId,
            date: request.date,
            approved: action === "approve",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Remove the processed request from the list
      setPendingRequests((prevRequests) =>
        prevRequests.filter(
          (req) =>
            !(
              req.employeeId === request.employeeId && req.date === request.date
            )
        )
      );

      // Refresh data after successful action
      await Promise.all([fetchPendingRequests(), fetchEmployees()]);
    } catch (error) {
      console.error("Error processing request:", error);
      setError(`Failed to ${action} request: ${error.message}`);
    }
  };

  // Function to fetch employee attendance details
  const fetchEmployeeAttendance = async (employeeId) => {
    try {
      setError(null);
      // Get current month's date range
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/calendar/attendance?employeeId=${employeeId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch attendance: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Format the data for display
      const recentAttendance = Object.entries(data.attendanceData || {})
        .map(([date, details]) => ({
          date,
          status: details.status,
          clockIn: details.clockIn,
          clockOut: details.clockOut,
          isLate: details.isLate,
          isEarly: details.isEarly,
          notes: details.notes || details.reason || "",
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      // Update the selected employee with attendance data
      setSelectedEmployee((prev) => ({
        ...prev,
        recentAttendance: recentAttendance.slice(0, 10), // Show only last 10 days
        stats: data.stats || {},
      }));
    } catch (error) {
      console.error("Error fetching employee attendance:", error);
      setError("Failed to load attendance details. Please try again later.");
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // First fetch employees
        await fetchEmployees();
      } catch (err) {
        setError("Failed to load dashboard data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    debugAdminStatus();
    loadData();
  }, []);

  // Fetch stats after employees are loaded
  useEffect(() => {
    if (employees.length > 0) {
      fetchTodayStats();
    }
  }, [employees]);

  // Fetch employee attendance when an employee is selected
  useEffect(() => {
    if (selectedEmployee && !selectedEmployee.recentAttendance) {
      fetchEmployeeAttendance(
        selectedEmployee.employeeId || selectedEmployee.id
      );
    }
  }, [selectedEmployee]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError(null)}
                    className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Employees
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.totalEmployees}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Present Today
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.presentToday}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Late Today
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.lateToday}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    On Leave
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.onLeave}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`${
                activeTab === "dashboard"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("employees")}
              className={`${
                activeTab === "employees"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Employee Management
            </button>
            <button
              onClick={() => {
                setActiveTab("requests");
                fetchPendingRequests();
              }}
              className={`${
                activeTab === "requests"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Pending Requests
              {pendingRequests.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {employees.slice(0, 5).map((employee) => (
                <div
                  key={employee.employeeId || employee.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {employee.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.jobTitle || employee.position}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {employee.lastActivity || "No recent activity"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "employees" && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Employee Attendance
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                View and manage employee attendance records.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Position
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Employee ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr
                      key={employee.employeeId || employee.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {employee.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.jobTitle || employee.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.employeeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            employee.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {employee.status || "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedEmployee(employee)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "requests" && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Pending Day Off Requests
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Approve or reject employee day off requests.
              </p>
            </div>
            {pendingRequests.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No pending day off requests
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {pendingRequests.map((request) => (
                  <div
                    key={`${request.employeeId}-${request.date}`}
                    className="p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {request.employeeName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">
                              {request.employeeName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {request.employeeId}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 ml-14">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Request Date:</span>{" "}
                            {format(new Date(request.date), "MMMM d, yyyy")}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Reason:</span>{" "}
                            {request.reason}
                          </p>
                          {request.createdAt && (
                            <p className="text-sm text-gray-500 mt-1">
                              Submitted on{" "}
                              {format(
                                new Date(request.createdAt),
                                "MMMM d, yyyy"
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleRequestAction(request, "approve")
                          }
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRequestAction(request, "reject")}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedEmployee.name}'s Details
                </h3>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Employee Information
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span>{" "}
                      {selectedEmployee.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Position:</span>{" "}
                      {selectedEmployee.jobTitle || selectedEmployee.position}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email:</span>{" "}
                      {selectedEmployee.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Employee ID:</span>{" "}
                      {selectedEmployee.employeeId || selectedEmployee.id}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedEmployee.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedEmployee.status || "Active"}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Attendance Summary
                  </h4>
                  <div className="space-y-2">
                    {selectedEmployee.stats ? (
                      <>
                        <p className="text-sm">
                          <span className="font-medium">Present Days:</span>{" "}
                          {selectedEmployee.stats.present || 0}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Late Arrivals:</span>{" "}
                          {selectedEmployee.stats.lateClockIn || 0}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Early Departures:</span>{" "}
                          {selectedEmployee.stats.earlyClockOut || 0}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Days Off:</span>{" "}
                          {selectedEmployee.stats.dayOff || 0}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Overtime:</span>{" "}
                          {selectedEmployee.stats.overTime || 0}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Absences:</span>{" "}
                          {selectedEmployee.stats.absent || 0}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Loading attendance summary...
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={inspectDatabase}
                className="px-4 py-2 bg-orange-500 text-white rounded mb-4 hover:bg-orange-600"
              >
                🔍 Inspect Database
              </button>
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Recent Attendance
                </h4>
                {selectedEmployee.recentAttendance ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Clock In
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Clock Out
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedEmployee.recentAttendance.map((record) => (
                          <tr
                            key={record.date}
                            className={`hover:bg-gray-50 ${
                              record.isLate ? "bg-red-50" : ""
                            }`}
                          >
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                              {format(new Date(record.date), "MMM d, yyyy")}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  record.status === "present"
                                    ? "bg-green-100 text-green-800"
                                    : record.status === "absent"
                                    ? "bg-red-100 text-red-800"
                                    : record.status === "dayoff"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {record.status
                                  ? record.status.charAt(0).toUpperCase() +
                                    record.status.slice(1)
                                  : "Unknown"}
                              </span>
                              {record.isLate && (
                                <span className="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Late
                                </span>
                              )}
                              {record.isEarly && (
                                <span className="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  Left Early
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {record.clockIn
                                ? format(new Date(record.clockIn), "h:mm a")
                                : "-"}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {record.clockOut
                                ? format(new Date(record.clockOut), "h:mm a")
                                : "-"}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {record.notes || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-4 text-sm text-gray-500">
                    Loading attendance data...
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedEmployee(null)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
