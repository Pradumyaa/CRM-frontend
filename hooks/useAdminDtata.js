// hooks/useAdminData.js - Custom hook for admin data management
import { useState, useEffect, useCallback } from "react";
import adminApiService from "../services/adminApiService";
import { useAuth } from "../context/AuthContext";

export const useAdminData = () => {
  const { user, hasRoleLevel } = useAuth();
  const [data, setData] = useState({
    employees: [],
    departments: [],
    attendance: {},
    analytics: {},
    notifications: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user has admin access
  const hasAdminAccess = useCallback(() => {
    return hasRoleLevel(3); // Admin level or higher
  }, [hasRoleLevel]);

  // Fetch all admin data
  const fetchAdminData = useCallback(async () => {
    if (!hasAdminAccess()) {
      setError("Insufficient permissions");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [employeesResponse, attendanceResponse] = await Promise.all([
        adminApiService.getAllEmployees(),
        adminApiService.getAttendanceDashboard(user?.employeeId || user?.id),
      ]);

      setData((prevData) => ({
        ...prevData,
        employees: employeesResponse.employees || [],
        attendance: attendanceResponse.dashboard || {},
      }));
    } catch (err) {
      setError(adminApiService.formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [user, hasAdminAccess]);

  // Fetch employees with filters
  const fetchEmployees = useCallback(
    async (filters = {}) => {
      if (!hasAdminAccess()) return;

      try {
        const response = await adminApiService.getAllEmployees();
        let employees = response.employees || [];

        // Apply filters
        if (filters.search) {
          employees = employees.filter(
            (emp) =>
              emp.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
              emp.email?.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        if (filters.role && filters.role !== "all") {
          employees = employees.filter((emp) =>
            emp.jobTitle?.toLowerCase().includes(filters.role.toLowerCase())
          );
        }
        if (filters.department && filters.department !== "all") {
          employees = employees.filter((emp) =>
            emp.department
              ?.toLowerCase()
              .includes(filters.department.toLowerCase())
          );
        }
        if (filters.status && filters.status !== "all") {
          employees = employees.filter((emp) => emp.status === filters.status);
        }

        setData((prevData) => ({
          ...prevData,
          employees,
        }));
      } catch (err) {
        setError(adminApiService.formatErrorMessage(err));
      }
    },
    [hasAdminAccess]
  );

  // Create employee
  const createEmployee = useCallback(
    async (employeeData) => {
      if (!hasAdminAccess())
        return { success: false, error: "Insufficient permissions" };

      try {
        const response = await adminApiService.createEmployee(employeeData);
        await fetchEmployees(); // Refresh employee list
        return { success: true, data: response };
      } catch (err) {
        const error = adminApiService.formatErrorMessage(err);
        setError(error);
        return { success: false, error };
      }
    },
    [hasAdminAccess, fetchEmployees]
  );

  // Update employee
  const updateEmployee = useCallback(
    async (employeeId, employeeData) => {
      if (!hasAdminAccess())
        return { success: false, error: "Insufficient permissions" };

      try {
        const response = await adminApiService.updateEmployee(
          employeeId,
          employeeData
        );
        await fetchEmployees(); // Refresh employee list
        return { success: true, data: response };
      } catch (err) {
        const error = adminApiService.formatErrorMessage(err);
        setError(error);
        return { success: false, error };
      }
    },
    [hasAdminAccess, fetchEmployees]
  );

  // Delete employee
  const deleteEmployee = useCallback(
    async (employeeId) => {
      if (!hasAdminAccess())
        return { success: false, error: "Insufficient permissions" };

      try {
        await adminApiService.deleteEmployee(employeeId);
        await fetchEmployees(); // Refresh employee list
        return { success: true };
      } catch (err) {
        const error = adminApiService.formatErrorMessage(err);
        setError(error);
        return { success: false, error };
      }
    },
    [hasAdminAccess, fetchEmployees]
  );

  // Bulk operations
  const bulkUpdateEmployees = useCallback(
    async (updates) => {
      if (!hasAdminAccess())
        return { success: false, error: "Insufficient permissions" };

      try {
        const results = await Promise.all(
          updates.map(({ employeeId, data }) =>
            adminApiService.updateEmployee(employeeId, data)
          )
        );
        await fetchEmployees(); // Refresh employee list
        return { success: true, results };
      } catch (err) {
        const error = adminApiService.formatErrorMessage(err);
        setError(error);
        return { success: false, error };
      }
    },
    [hasAdminAccess, fetchEmployees]
  );

  // Export data
  const exportData = useCallback(
    async (format = "csv", filters = {}) => {
      if (!hasAdminAccess())
        return { success: false, error: "Insufficient permissions" };

      try {
        const blob = await adminApiService.exportEmployees(format, filters);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `employees_export_${
          new Date().toISOString().split("T")[0]
        }.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        return { success: true };
      } catch (err) {
        const error = adminApiService.formatErrorMessage(err);
        setError(error);
        return { success: false, error };
      }
    },
    [hasAdminAccess]
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize data on mount
  useEffect(() => {
    if (hasAdminAccess()) {
      fetchAdminData();
    }
  }, [fetchAdminData, hasAdminAccess]);

  return {
    data,
    loading,
    error,
    hasAdminAccess,
    fetchAdminData,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    bulkUpdateEmployees,
    exportData,
    clearError,
  };
};
