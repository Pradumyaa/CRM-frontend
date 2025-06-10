import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  BriefcaseBusiness,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Search,
  Grid,
  List,
  ChevronDown,
  TrendingUp,
  Star,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  FileText,
  Settings,
  Bell,
  Activity,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext.jsx";
import SearchBar from "@/pages/components/SearchBar.jsx";
import EmployeeTable from "./employee/EmployeeTable.jsx";
import AddEmployeeModal from "./employee/AddEmployeeModal.jsx";
import ViewEmployeeModal from "./employee/ViewEmployeeModal.jsx";

const EmployeeListPage = () => {
  const auth = useAuth();

  // State Management
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Advanced Features State
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    status: "all",
    department: "all",
    location: "all",
    role: "all",
  });

  // Sorting
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  // User permissions based on your AuthContext
  const userPermissions = useMemo(
    () => ({
      canCreate:
        auth.hasPermission?.("manage_employees") ||
        auth.hasRoleLevel?.(3) ||
        auth.isSuperAdmin,
      canEdit:
        auth.hasPermission?.("manage_employees") ||
        auth.hasRoleLevel?.(6) ||
        auth.isSuperAdmin,
      canDelete:
        auth.hasPermission?.("manage_employees") ||
        auth.hasRoleLevel?.(3) ||
        auth.isSuperAdmin,
      canView:
        auth.hasPermission?.("view_employees") ||
        auth.hasRoleLevel?.(14) ||
        auth.isSuperAdmin,
      canViewDocuments:
        auth.hasPermission?.("view_documents") ||
        auth.hasRoleLevel?.(6) ||
        auth.isSuperAdmin,
      canViewAttendance:
        auth.hasPermission?.("view_attendance") ||
        auth.hasRoleLevel?.(9) ||
        auth.isSuperAdmin,
      canExport: auth.hasRoleLevel?.(6) || auth.isSuperAdmin,
      canBulkActions: auth.hasRoleLevel?.(3) || auth.isSuperAdmin,
    }),
    [auth]
  );

  // Get username from localStorage or auth context
  const username =
    auth.user?.name || localStorage.getItem("userName") || "Admin";

  // Setup axios with auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Enhanced fetch employees with error handling
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://getmax-backend.vercel.app/api/employees",
        getAuthHeaders()
      );

      console.log("Employees data:", response.data);
      const employeeData = response.data.employees || [];
      setEmployees(employeeData);
      setFilteredEmployees(employeeData);
    } catch (error) {
      console.error("Error fetching employees:", error);

      if (error.response) {
        if (error.response.status === 401) {
          setError("Authentication required. Please login again.");
        } else {
          setError(
            `Failed to load employees: ${error.response.status} ${error.response.statusText}`
          );
        }
      } else {
        setError("Network error when trying to fetch employees");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh data with loading state
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEmployees();
    setRefreshing(false);
  };

  // Enhanced search and filter logic
  const applyFiltersAndSearch = useCallback(() => {
    let filtered = [...employees];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(query) ||
          emp.email?.toLowerCase().includes(query) ||
          emp.employeeId?.toLowerCase().includes(query) ||
          emp.department?.toLowerCase().includes(query) ||
          emp.jobTitle?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.status !== "all") {
      filtered = filtered.filter((emp) => emp.status === filters.status);
    }

    if (filters.department !== "all") {
      filtered = filtered.filter(
        (emp) => emp.department === filters.department
      );
    }

    if (filters.location !== "all") {
      filtered = filtered.filter((emp) => emp.location === filters.location);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle undefined/null values
      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;

      // Handle different data types
      if (sortConfig.key === "salary") {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else if (sortConfig.key === "joiningDate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredEmployees(filtered);
  }, [employees, searchQuery, filters, sortConfig]);

  // CRUD Operations
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsEditing(true);
    setIsAddModalOpen(true);
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setIsViewModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setIsEditing(false);
    setSelectedEmployee(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleDelete = async (employeeId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this employee? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `https://getmax-backend.vercel.app/api/employees/${employeeId}`,
        getAuthHeaders()
      );

      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
      setFilteredEmployees((prev) =>
        prev.filter((emp) => emp.id !== employeeId)
      );

      // Show success notification
      alert("Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert(
        "Failed to delete employee: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Export Functions
  const handleExport = (format) => {
    const dataToExport = filteredEmployees.map((emp) => ({
      "Employee ID": emp.employeeId,
      Name: emp.name,
      Email: emp.email,
      Phone: emp.phoneNumber,
      Department: emp.department,
      "Job Title": emp.jobTitle,
      Status: emp.status,
      Salary: emp.salary,
      "Joining Date": emp.joiningDate,
    }));

    if (format === "csv") {
      const csv = [
        Object.keys(dataToExport[0]).join(","),
        ...dataToExport.map((row) =>
          Object.values(row)
            .map((val) => `"${val}"`)
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `employees_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (format === "json") {
      const json = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `employees_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  // Bulk Actions
  const handleBulkAction = async (action) => {
    if (selectedEmployees.length === 0) {
      alert("Please select employees first");
      return;
    }

    switch (action) {
      case "delete":
        if (
          !window.confirm(
            `Are you sure you want to delete ${selectedEmployees.length} employees?`
          )
        ) {
          return;
        }
        // Implement bulk delete logic here
        console.log("Bulk delete:", selectedEmployees);
        break;

      case "export":
        const selectedData = employees.filter((emp) =>
          selectedEmployees.includes(emp.employeeId)
        );
        // Export selected employees
        handleExport("csv");
        break;

      case "activate":
        // Implement bulk activate
        console.log("Bulk activate:", selectedEmployees);
        break;

      case "deactivate":
        // Implement bulk deactivate
        console.log("Bulk deactivate:", selectedEmployees);
        break;

      default:
        console.log("Unknown bulk action:", action);
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((emp) => emp.status === "Active").length;
    const inactive = employees.filter(
      (emp) => emp.status === "Inactive"
    ).length;
    const onLeave = employees.filter((emp) => emp.status === "On Leave").length;

    return { total, active, inactive, onLeave };
  }, [employees]);

  // Get unique departments for filter
  const departments = useMemo(
    () => [...new Set(employees.map((emp) => emp.department).filter(Boolean))],
    [employees]
  );

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Get today's date in a nice format
  const getTodayDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Effects
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [applyFiltersAndSearch]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Loading Employees
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch the employee data...
          </p>
        </div>
      </div>
    );
  }

  // Display an error screen if authentication failed
  if (error && error.includes("Authentication required")) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                {getGreeting()}, {username}
                <Star className="w-6 h-6 ml-2 text-yellow-300" />
              </h1>
              <p className="opacity-80 text-lg">{getTodayDate()}</p>
              <p className="text-indigo-200 text-sm mt-1">
                Managing {stats.total} employees across the organization
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-2 flex-wrap gap-2">
              {/* Export Dropdown */}
              {userPermissions.canExport && (
                <div className="relative group">
                  <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center transition-all backdrop-blur-sm border border-white/20">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="py-1">
                      <button
                        onClick={() => handleExport("csv")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Export as CSV
                      </button>
                      <button
                        onClick={() => handleExport("json")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Export as JSON
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center transition-all backdrop-blur-sm border border-white/20 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>

              {/* Add Employee Button */}
              {userPermissions.canCreate && (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedEmployee(null);
                    setIsAddModalOpen(true);
                  }}
                  className="bg-white text-indigo-700 px-6 py-2 rounded-lg flex items-center font-medium transition-all hover:bg-gray-100 shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Employee
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">
                    Total Employees
                  </p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-white/60 text-xs mt-1">
                    Overall workforce
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Active</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.active}
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    {stats.total > 0
                      ? Math.round((stats.active / stats.total) * 100)
                      : 0}
                    % of total
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-400/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Inactive</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.inactive}
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    {stats.total > 0
                      ? Math.round((stats.inactive / stats.total) * 100)
                      : 0}
                    % of total
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-400/20 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-300" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">On Leave</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.onLeave}
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    {stats.total > 0
                      ? Math.round((stats.onLeave / stats.total) * 100)
                      : 0}
                    % on leave
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {/* Enhanced Toolbar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <BriefcaseBusiness className="mr-2 h-5 w-5 text-indigo-600" />
                  Employee Management
                  {auth.isSuperAdmin && (
                    <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                      Super Admin
                    </span>
                  )}
                </h2>
                <p className="text-gray-500 text-sm">
                  Manage your organization's workforce efficiently
                </p>
              </div>

              <div className="w-full lg:w-auto flex flex-wrap items-center gap-3">
                {/* Enhanced Search Bar */}
                <div className="relative lg:w-64">
                  <SearchBar
                    setFilteredEmployees={setFilteredEmployees}
                    setSearchQuery={setSearchQuery}
                    employees={employees}
                  />
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded ${
                      viewMode === "table"
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    title="Table View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid"
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>

                {/* Advanced Filters Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                    showFilters
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  <ChevronDown
                    className={`w-4 h-4 ml-1 transform transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status Filter
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Filter
                    </label>
                    <select
                      value={filters.department}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          department: e.target.value,
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Departments</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location Filter
                    </label>
                    <select
                      value={filters.location}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Locations</option>
                      <option value="In-Office">In-Office</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quick Actions
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setFilters({
                            status: "all",
                            department: "all",
                            location: "all",
                            role: "all",
                          });
                          setSearchQuery("");
                        }}
                        className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex-1"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Actions */}
            {selectedEmployees.length > 0 && userPermissions.canBulkActions && (
              <div className="mt-4 flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-sm text-indigo-700 font-medium">
                    {selectedEmployees.length} employees selected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction("export")}
                    className="px-3 py-1 text-sm bg-white border border-indigo-300 text-indigo-700 rounded hover:bg-indigo-50"
                  >
                    Export Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction("activate")}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction("deactivate")}
                    className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && !error.includes("Authentication required") && (
            <div className="p-4 bg-red-50 border-b border-red-200">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-red-800">{error}</span>
                <button
                  onClick={handleRefresh}
                  className="ml-auto text-red-600 hover:text-red-800 underline"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Content Area */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-500">Loading employees...</p>
              </div>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No employees found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || Object.values(filters).some((f) => f !== "all")
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first employee"}
              </p>
              {userPermissions.canCreate && (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedEmployee(null);
                    setIsAddModalOpen(true);
                  }}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center mx-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </button>
              )}
            </div>
          ) : (
            <EmployeeTable
              employees={filteredEmployees}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              selectedEmployees={selectedEmployees}
              setSelectedEmployees={setSelectedEmployees}
              userPermissions={userPermissions}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              viewMode={viewMode}
            />
          )}
        </div>
      </div>

      {/* Enhanced Modals */}
      {isAddModalOpen && (
        <AddEmployeeModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          employeeData={selectedEmployee || {}}
          setEmployeeData={setSelectedEmployee}
          onSave={() => {
            handleCloseAddModal();
            handleRefresh(); // Refresh the list after saving
          }}
          isEditing={isEditing}
          getAuthHeaders={getAuthHeaders}
        />
      )}

      {isViewModalOpen && (
        <ViewEmployeeModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          employee={selectedEmployee}
          getAuthHeaders={getAuthHeaders}
        />
      )}

      {/* Floating Action Button for Mobile */}
      {userPermissions.canCreate && (
        <div className="fixed bottom-6 right-6 lg:hidden z-40">
          <button
            onClick={() => {
              setIsEditing(false);
              setSelectedEmployee(null);
              setIsAddModalOpen(true);
            }}
            className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Success/Error Toast Notifications */}
      {/* You can add toast notifications here if needed */}
    </div>
  );
};

export default EmployeeListPage;
