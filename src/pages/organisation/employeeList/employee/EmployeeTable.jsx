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
} from "lucide-react";
import Pagination from "@/pages/components/Pagination";

const EmployeeTable = ({ employees, onEdit, onDelete, onView }) => {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showDropdown, setShowDropdown] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  // Handle sort changes
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
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

  // Sort employees
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle undefined values
    if (aValue === undefined || aValue === null) {
      aValue = "";
    }
    if (bValue === undefined || bValue === null) {
      bValue = "";
    }

    // Handle numeric values
    if (sortField === "salary") {
      aValue = Number(aValue) || 0;
      bValue = Number(bValue) || 0;
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    // Handle dates
    if (sortField === "joiningDate") {
      const dateA = aValue ? new Date(aValue) : new Date(0);
      const dateB = bValue ? new Date(bValue) : new Date(0);
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    // Handle strings
    aValue = String(aValue).toLowerCase();
    bValue = String(bValue).toLowerCase();
    return sortDirection === "asc"
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

  // No employees case
  if (employees.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">
          No employees found. Add some employees to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-200 p-4 rounded-lg border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">
                Total Employees
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {totalEmployees}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-600 font-medium">
            Overall workforce count
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-200 p-4 rounded-lg border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">
                Active Employees
              </p>
              <p className="text-2xl font-bold text-green-700">
                {activeEmployees}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-green-600 font-medium">
            {((activeEmployees / (employees.length || 1)) * 100).toFixed(0)}% of
            total workforce
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-200 p-4 rounded-lg border border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">
                Inactive Employees
              </p>
              <p className="text-2xl font-bold text-red-700">
                {inactiveEmployees}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-200 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-red-600 font-medium">
            {((inactiveEmployees / (employees.length || 1)) * 100).toFixed(0)}%
            of total workforce
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-200/70 p-4 rounded-lg border border-yellow-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">
                Employees on Leave
              </p>
              <p className="text-2xl font-bold text-yellow-700">
                {employeesOnLeave}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-yellow-200 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-yellow-600 font-medium">
            {((employeesOnLeave / (employees.length || 1)) * 100).toFixed(0)}%
            currently on leave
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
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
      </div>

      {/* Advanced Filters Panel */}
      {isFilterOpen && (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
          <h3 className="text-gray-700 font-medium mb-3">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300"
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
                className="w-full p-2 rounded-md border border-gray-300"
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

      {/* Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Employee
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Contact
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("location")}
                >
                  Location/Dept
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("joiningDate")}
                >
                  Joining/Salary
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
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
                />
              ))}

              {/* Tooltip styles */}
              <style jsx>{`
                .custom-scrollbar {
                  scrollbar-width: thin;
                  scrollbar-color: rgba(99, 102, 241, 0.5)
                    rgba(243, 244, 246, 0.3);
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
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 flex justify-between items-center">
          <div className="text-gray-700 text-sm">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, sortedEmployees.length)} of{" "}
            {sortedEmployees.length} entries
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
