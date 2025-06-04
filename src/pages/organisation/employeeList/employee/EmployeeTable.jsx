/* eslint-disable react/prop-types */
import { useState } from "react";
import EmployeeRow from "./EmployeeRow";
import {
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  ChevronDown,
  Users,
  SortAsc,
  SortDesc,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone,
  FileText,
  Calendar as CalendarIcon,
  Download,
  ExternalLink,
  TrendingUp,
  BarChart3,
  Activity,
  Crown,
  Shield,
  Star,
} from "lucide-react";
import Pagination from "@/pages/components/Pagination";

const EmployeeTable = ({
  employees,
  onEdit,
  onDelete,
  onView,
  selectedEmployees = [],
  setSelectedEmployees = () => {},
  userPermissions = {},
  sortConfig = { key: "name", direction: "asc" },
  setSortConfig = () => {},
  viewMode = "table",
}) => {
  const [showDropdown, setShowDropdown] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [bulkActionDropdown, setBulkActionDropdown] = useState(false);

  // Calculate employee statistics
  const totalEmployees = employees ? employees.length : 0;
  const activeEmployees = employees.filter(
    (emp) => emp.status === "Active"
  ).length;
  const inactiveEmployees = employees.filter(
    (emp) => emp.status === "Inactive"
  ).length;
  const employeesOnLeave = employees.filter(
    (emp) => emp.status === "On Leave"
  ).length;

  // Handle sort changes with enhanced visual feedback
  const handleSort = (field) => {
    if (sortConfig.key === field) {
      setSortConfig({
        key: field,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({
        key: field,
        direction: "asc",
      });
    }
  };

  // Apply filters and sort
  const filteredEmployees = employees.filter((emp) => {
    if (statusFilter !== "all" && emp.status !== statusFilter) {
      return false;
    }
    if (departmentFilter !== "all" && emp.department !== departmentFilter) {
      return false;
    }
    return true;
  });

  // Sort employees with enhanced logic
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle undefined values
    if (aValue === undefined || aValue === null) {
      aValue = "";
    }
    if (bValue === undefined || bValue === null) {
      bValue = "";
    }

    // Handle numeric values
    if (sortConfig.key === "salary") {
      aValue = Number(aValue) || 0;
      bValue = Number(bValue) || 0;
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    // Handle dates
    if (sortConfig.key === "joiningDate") {
      const dateA = aValue ? new Date(aValue) : new Date(0);
      const dateB = bValue ? new Date(bValue) : new Date(0);
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    // Handle strings
    aValue = String(aValue).toLowerCase();
    bValue = String(bValue).toLowerCase();
    return sortConfig.direction === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = sortedEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

  // Get unique departments for filter
  const departments = [
    ...new Set(employees.map((emp) => emp.department).filter(Boolean)),
  ];

  // Handle bulk select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedEmployees(
        currentEmployees.map((emp) => emp.employeeId || emp._id)
      );
    } else {
      setSelectedEmployees([]);
    }
  };

  // Handle individual selection
  const handleSelectEmployee = (employeeId, checked) => {
    if (checked) {
      setSelectedEmployees((prev) => [...prev, employeeId]);
    } else {
      setSelectedEmployees((prev) => prev.filter((id) => id !== employeeId));
    }
  };

  // Quick actions for individual employees
  const handleQuickAction = async (employee, action) => {
    switch (action) {
      case "email":
        const subject = encodeURIComponent(`Regarding: ${employee.name}`);
        const body = encodeURIComponent(`Dear ${employee.name},\n\n`);
        window.open(
          `mailto:${employee.email}?subject=${subject}&body=${body}`,
          "_blank"
        );
        break;

      case "call":
        window.open(`tel:${employee.phoneNumber}`, "_self");
        break;

      case "documents":
        // You can integrate with your document viewing logic here
        console.log("View documents for:", employee.name);
        break;

      case "attendance":
        // You can integrate with your attendance viewing logic here
        console.log("View attendance for:", employee.name);
        break;

      default:
        console.log("Unknown action:", action);
    }
    setShowDropdown(null);
  };

  // Enhanced Employee Card for Grid View
  const EmployeeCard = ({ employee, index }) => {
    const [cardDropdown, setCardDropdown] = useState(false);

    const getStatusColor = (status) => {
      switch (status) {
        case "Active":
          return "bg-green-100 text-green-700 border-green-300";
        case "Inactive":
          return "bg-red-100 text-red-700 border-red-300";
        case "On Leave":
          return "bg-yellow-100 text-yellow-700 border-yellow-300";
        default:
          return "bg-gray-100 text-gray-700 border-gray-300";
      }
    };

    const getAvatarGradient = (name) => {
      const colors = [
        "from-purple-400 to-pink-400",
        "from-blue-400 to-indigo-400",
        "from-green-400 to-teal-400",
        "from-yellow-400 to-orange-400",
        "from-red-400 to-pink-400",
        "from-indigo-400 to-purple-400",
      ];
      const index = name ? name.charCodeAt(0) % colors.length : 0;
      return colors[index];
    };

    const formatSalary = (salary) => {
      if (!salary) return "N/A";
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(salary);
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group relative">
        {/* Card Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {userPermissions.canBulkActions && (
                <input
                  type="checkbox"
                  checked={selectedEmployees.includes(
                    employee.employeeId || employee._id
                  )}
                  onChange={(e) =>
                    handleSelectEmployee(
                      employee.employeeId || employee._id,
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              )}
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-r ${getAvatarGradient(
                  employee.name
                )} flex items-center justify-center text-white font-semibold text-sm shadow-sm`}
              >
                {employee.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 flex items-center">
                  {employee.name || "N/A"}
                  {employee.isAdmin && (
                    <Crown
                      className="w-4 h-4 text-yellow-500 ml-2"
                      title="Administrator"
                    />
                  )}
                </h3>
                <p className="text-sm text-gray-500">
                  {employee.jobTitle || "N/A"}
                </p>
                <p className="text-xs text-gray-400">{employee.employeeId}</p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setCardDropdown(!cardDropdown)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>

              {cardDropdown && (
                <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onView(employee);
                        setCardDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </button>

                    {userPermissions.canEdit && (
                      <button
                        onClick={() => {
                          onEdit(employee);
                          setCardDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Employee
                      </button>
                    )}

                    <button
                      onClick={() => handleQuickAction(employee, "email")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </button>

                    <button
                      onClick={() => handleQuickAction(employee, "call")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Employee
                    </button>

                    {userPermissions.canViewDocuments && (
                      <button
                        onClick={() => handleQuickAction(employee, "documents")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Documents
                      </button>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>

                    {userPermissions.canDelete && (
                      <button
                        onClick={() => {
                          onDelete(employee.employeeId);
                          setCardDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Employee
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2 text-indigo-500" />
              <span className="truncate">{employee.email || "N/A"}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2 text-indigo-500" />
              <span>{employee.phoneNumber || "N/A"}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 text-indigo-500" />
              <span>{employee.department || "N/A"}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 mr-2 text-indigo-500" />
              <span>{formatSalary(employee.salary)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  employee.status
                )}`}
              >
                {employee.status || "Active"}
              </span>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onView(employee)}
                  className="p-1 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
                  title="View Profile"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {userPermissions.canEdit && (
                  <button
                    onClick={() => onEdit(employee)}
                    className="p-1 rounded-full hover:bg-green-100 text-green-600 transition-colors"
                    title="Edit Employee"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // No employees case
  if (employees.length === 0) {
    return (
      <div className="p-8 text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No employees found
        </h3>
        <p className="text-gray-500">
          No employees found. Add some employees to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">
                Total Employees
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {totalEmployees}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-600 font-medium">
            Overall workforce count
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">
                Active Employees
              </p>
              <p className="text-2xl font-bold text-green-700">
                {activeEmployees}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-green-600 font-medium">
            {((activeEmployees / (employees.length || 1)) * 100).toFixed(0)}% of
            total workforce
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">
                Inactive Employees
              </p>
              <p className="text-2xl font-bold text-red-700">
                {inactiveEmployees}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-200 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-red-600 font-medium">
            {((inactiveEmployees / (employees.length || 1)) * 100).toFixed(0)}%
            of total workforce
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">
                Employees on Leave
              </p>
              <p className="text-2xl font-bold text-yellow-700">
                {employeesOnLeave}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-200 flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-yellow-600 font-medium">
            {((employeesOnLeave / (employees.length || 1)) * 100).toFixed(0)}%
            currently on leave
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 px-6">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center text-indigo-600 font-medium text-sm px-3 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          <ChevronDown
            className={`ml-1 h-4 w-4 transform transition-transform ${
              isFilterOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Bulk Actions Dropdown */}
        {selectedEmployees.length > 0 && userPermissions.canBulkActions && (
          <div className="relative">
            <button
              onClick={() => setBulkActionDropdown(!bulkActionDropdown)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Activity className="w-4 h-4 mr-2" />
              Bulk Actions ({selectedEmployees.length})
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>

            {bulkActionDropdown && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                <div className="py-1">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />
                    Export Selected
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activate Selected
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <XCircle className="w-4 h-4 mr-2" />
                    Deactivate Selected
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {isFilterOpen && (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4 mx-6">
          <h3 className="text-gray-700 font-medium mb-3">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                setStatusFilter("all");
                setDepartmentFilter("all");
              }}
              className="text-sm text-indigo-600 hover:text-indigo-900 px-3 py-2 mr-2 border border-indigo-300 hover:bg-indigo-50 rounded-xl"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      {viewMode === "grid" ? (
        // Grid View
        <div className="px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentEmployees.map((employee, index) => (
              <EmployeeCard
                key={employee._id || employee.employeeId || index}
                employee={employee}
                index={index}
              />
            ))}
          </div>
        </div>
      ) : (
        // Table View
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr>
                  {userPermissions.canBulkActions && (
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedEmployees.length ===
                            currentEmployees.length &&
                          currentEmployees.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                  )}

                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Employee
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "asc" ? (
                          <SortAsc className="w-4 h-4 ml-1 text-indigo-600" />
                        ) : (
                          <SortDesc className="w-4 h-4 ml-1 text-indigo-600" />
                        ))}
                    </div>
                  </th>

                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center">
                      Contact
                      {sortConfig.key === "email" &&
                        (sortConfig.direction === "asc" ? (
                          <SortAsc className="w-4 h-4 ml-1 text-indigo-600" />
                        ) : (
                          <SortDesc className="w-4 h-4 ml-1 text-indigo-600" />
                        ))}
                    </div>
                  </th>

                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort("department")}
                  >
                    <div className="flex items-center">
                      Location/Dept
                      {sortConfig.key === "department" &&
                        (sortConfig.direction === "asc" ? (
                          <SortAsc className="w-4 h-4 ml-1 text-indigo-600" />
                        ) : (
                          <SortDesc className="w-4 h-4 ml-1 text-indigo-600" />
                        ))}
                    </div>
                  </th>

                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort("joiningDate")}
                  >
                    <div className="flex items-center">
                      Joining/Salary
                      {sortConfig.key === "joiningDate" &&
                        (sortConfig.direction === "asc" ? (
                          <SortAsc className="w-4 h-4 ml-1 text-indigo-600" />
                        ) : (
                          <SortDesc className="w-4 h-4 ml-1 text-indigo-600" />
                        ))}
                    </div>
                  </th>

                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === "status" &&
                        (sortConfig.direction === "asc" ? (
                          <SortAsc className="w-4 h-4 ml-1 text-indigo-600" />
                        ) : (
                          <SortDesc className="w-4 h-4 ml-1 text-indigo-600" />
                        ))}
                    </div>
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentEmployees.map((employee, index) => (
                  <EmployeeRow
                    key={employee._id || employee.employeeId || index}
                    employee={employee}
                    index={index}
                    showDropdown={showDropdown}
                    setShowDropdown={setShowDropdown}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                    onQuickAction={handleQuickAction}
                    userPermissions={userPermissions}
                    selectedEmployees={selectedEmployees}
                    setSelectedEmployees={setSelectedEmployees}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-t border-gray-200 rounded-b-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-700 text-sm">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, sortedEmployees.length)} of{" "}
              {sortedEmployees.length} entries
              {selectedEmployees.length > 0 && (
                <span className="ml-2 text-indigo-600 font-medium">
                  ({selectedEmployees.length} selected)
                </span>
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(99, 102, 241, 0.5) rgba(243, 244, 246, 0.3);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(243, 244, 246, 0.3);
          border-radius: 8px;
          margin: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.6);
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 70, 229, 0.8);
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default EmployeeTable;
