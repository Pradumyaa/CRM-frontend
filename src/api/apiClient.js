// api/apiClient.js
import axios from "axios";

// Base URL for API requests - dynamically set based on environment
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Create Axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (token expired)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // If we're not on the login page, redirect there
      if (!window.location.pathname.includes("/login")) {
        localStorage.removeItem("token");
        localStorage.removeItem("employeeId");
        localStorage.removeItem("isAdmin");

        // Keep remember me preference if set
        const rememberMe = localStorage.getItem("rememberMe") === "true";
        const rememberedId = localStorage.getItem("employeeId");
        if (rememberMe && rememberedId) {
          localStorage.setItem("rememberedEmployeeId", rememberedId);
        }

        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// API service functions
const authService = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      if (!employeeId) return null;

      const response = await apiClient.get(`/employees/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error("Auth check failed:", error);
      return null;
    }
  },

  checkIsAdmin: async (employeeId) => {
    try {
      if (!employeeId) return false;

      const response = await apiClient.get(`/employees/admin/${employeeId}`);
      return response.data.isAdmin;
    } catch (error) {
      console.error("Admin check failed:", error);
      return false;
    }
  },
};

const employeeService = {
  getEmployee: async (id) => {
    try {
      const response = await apiClient.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllEmployees: async () => {
    try {
      const response = await apiClient.get("/employees");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createEmployee: async (employeeData) => {
    try {
      const response = await apiClient.post("/employees", employeeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateEmployee: async (id, employeeData) => {
    try {
      const response = await apiClient.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteEmployee: async (id) => {
    try {
      const response = await apiClient.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchEmployees: async (name) => {
    try {
      const response = await apiClient.post("/employees/search", { name });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

const attendanceService = {
  getAttendance: async (employeeId, startDate, endDate) => {
    try {
      const params = { employeeId };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await apiClient.get("/calendar/attendance", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  clockIn: async (employeeId) => {
    try {
      const response = await apiClient.post("/calendar/attendance/clock-in", {
        employeeId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  clockOut: async (employeeId, isAutoLogout = false) => {
    try {
      const response = await apiClient.post("/calendar/attendance/clock-out", {
        employeeId,
        isAutoLogout,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  requestDayOff: async (employeeId, date, reason) => {
    try {
      const response = await apiClient.post(
        "/calendar/attendance/day-off/request",
        {
          employeeId,
          date,
          reason,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPendingDayOffRequests: async (adminId) => {
    try {
      const response = await apiClient.get(
        "/calendar/attendance/day-off/pending",
        {
          params: { adminId },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  approveDayOffRequest: async (adminId, employeeId, date, approved) => {
    try {
      const response = await apiClient.post(
        "/calendar/attendance/day-off/approve",
        {
          adminId,
          employeeId,
          date,
          approved,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getHolidays: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await apiClient.get("/calendar/holidays", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

const dashboardService = {
  // Get dashboard metrics for admin
  getAdminMetrics: async () => {
    try {
      // For a real implementation, you'd have an endpoint for this
      // For now, we'll compute admin metrics from existing endpoints

      // Get total employees
      const employeesResponse = await employeeService.getAllEmployees();
      const totalEmployees = employeesResponse.employees.length;

      // Get active employees
      const activeEmployees = employeesResponse.employees.filter(
        (employee) => employee.status === "Active"
      ).length;

      // Calculate active rate
      const activeRate = Math.round((activeEmployees / totalEmployees) * 100);

      return {
        totalEmployees,
        activeEmployees,
        activeRate,
      };
    } catch (error) {
      console.error("Error fetching admin metrics:", error);
      return {
        totalEmployees: 0,
        activeEmployees: 0,
        activeRate: 0,
      };
    }
  },

  // Get dashboard metrics for employees
  getEmployeeMetrics: async (employeeId) => {
    try {
      // For a real implementation, you'd have specific endpoints for these metrics
      // For now, we'll get attendance data

      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      const attendanceResponse = await attendanceService.getAttendance(
        employeeId,
        firstDayOfMonth.toISOString().split("T")[0],
        today.toISOString().split("T")[0]
      );

      return {
        ...attendanceResponse.stats,
        totalDaysWorked: Object.values(
          attendanceResponse.attendanceData
        ).filter((day) => day.status === "present").length,
        totalDaysOff: Object.values(attendanceResponse.attendanceData).filter(
          (day) => day.status === "dayoff" || day.isHoliday
        ).length,
      };
    } catch (error) {
      console.error("Error fetching employee metrics:", error);
      return {
        dayOff: 0,
        lateClockIn: 0,
        earlyClockOut: 0,
        overTime: 0,
        absent: 0,
        totalDaysWorked: 0,
        totalDaysOff: 0,
      };
    }
  },
};

// Export the services
export {
  apiClient,
  authService,
  employeeService,
  attendanceService,
  dashboardService,
};

export default apiClient;
