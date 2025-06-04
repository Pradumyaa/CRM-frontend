// src/utils/apiClient.js

// For Vite, use import.meta.env instead of process.env
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Enhanced Base API client for making requests to the backend
 */
const apiClient = {
  // Configuration
  maxRetries: 3,
  retryDelay: 1000,
  refreshToken: localStorage.getItem("refreshToken"),

  /**
   * Get the authorization headers with the token
   * @returns {Object} Headers object
   */
  getHeaders() {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  },

  /**
   * Update authentication tokens
   * @param {string} token - JWT access token
   * @param {string} refreshToken - Refresh token
   */
  setTokens(token, refreshToken = null) {
    if (refreshToken) {
      this.refreshToken = refreshToken;
      localStorage.setItem("refreshToken", refreshToken);
    }
    localStorage.setItem("token", token);
  },

  /**
   * Clear authentication tokens
   */
  clearTokens() {
    this.refreshToken = null;
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },

  /**
   * Refresh access token using refresh token
   * @returns {boolean} Success status
   */
  async refreshAccessToken() {
    try {
      if (!this.refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      this.setTokens(data.token, data.refreshToken);

      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.clearTokens();
      // Redirect to login page
      window.location.href = "/login";
      return false;
    }
  },

  /**
   * Delay helper for retry logic
   * @param {number} ms - Milliseconds to delay
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  /**
   * Enhanced request method with retry logic and token refresh
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @param {number} retryCount - Current retry count
   * @returns {Promise} Response data
   */
  async request(endpoint, options = {}, retryCount = 0) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const config = {
        headers: this.getHeaders(),
        ...options,
      };

      console.log(`API Request: ${config.method || "GET"} ${url}`);

      const response = await fetch(url, config);

      // Handle token expiration
      if (
        response.status === 401 &&
        this.refreshToken &&
        retryCount < this.maxRetries
      ) {
        console.log("Token expired, attempting to refresh...");
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.request(endpoint, options, retryCount + 1);
        }
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            message: `HTTP ${response.status}: ${response.statusText}`,
          };
        }

        const error = new Error(
          errorData.message ||
            errorData.error ||
            `API error: ${response.status}`
        );
        error.status = response.status;
        error.details = errorData.details;
        error.code = errorData.code;

        throw error;
      }

      const data = await response.json();
      console.log(`API Response: ${response.status}`, data);

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);

      // Retry logic for network errors
      if (
        retryCount < this.maxRetries &&
        (error.name === "NetworkError" || error.name === "TypeError")
      ) {
        console.log(
          `Retrying request (${retryCount + 1}/${this.maxRetries})...`
        );
        await this.delay(this.retryDelay * Math.pow(2, retryCount));
        return this.request(endpoint, options, retryCount + 1);
      }

      throw error;
    }
  },

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} - Response promise
   */
  async get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  },

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @returns {Promise} - Response promise
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @returns {Promise} - Response promise
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} - Response promise
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  },

  /**
   * Format date to API expected format
   * @param {Date|string} date - Date to format
   * @returns {string} Formatted date (YYYY-MM-DD)
   */
  formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  /**
   * Get current month date range
   * @returns {Object} Start and end dates for current month
   */
  getCurrentMonthRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      startDate: this.formatDate(start),
      endDate: this.formatDate(end),
    };
  },

  /**
   * Handle API error and provide user-friendly message
   * @param {Error} error - API error
   * @returns {string} User-friendly error message
   */
  getErrorMessage(error) {
    if (error.status === 401) {
      return "You are not authorized to perform this action. Please log in again.";
    } else if (error.status === 403) {
      return "You don't have permission to perform this action.";
    } else if (error.status === 404) {
      return "The requested resource was not found.";
    } else if (error.status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    } else if (error.status >= 500) {
      return "Server error. Please try again later or contact support.";
    } else if (error.message) {
      return error.message;
    } else {
      return "An unexpected error occurred. Please try again.";
    }
  },
};

// Enhanced Calendar-specific API methods
export const calendarApi = {
  // ===============================
  // ATTENDANCE METHODS
  // ===============================

  /**
   * Get attendance data for an employee
   * @param {string} employeeId - Employee ID
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {Promise} Attendance data
   */
  getAttendance(employeeId, startDate, endDate) {
    return apiClient.get(
      `/calendar/attendance?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`
    );
  },

  /**
   * Get all attendance data (Admin only)
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {Promise} All attendance data
   */
  getAllAttendance(startDate, endDate) {
    return apiClient.get(
      `/calendar/attendance/all?startDate=${startDate}&endDate=${endDate}`
    );
  },

  /**
   * Get attendance summary
   * @param {string} employeeId - Employee ID
   * @param {string} period - Period (week|month|year)
   * @returns {Promise} Attendance summary
   */
  getAttendanceSummary(employeeId, period = "month") {
    return apiClient.get(
      `/calendar/attendance/summary?employeeId=${employeeId}&period=${period}`
    );
  },

  /**
   * Clock in for employee
   * @param {string} employeeId - Employee ID
   * @returns {Promise} Clock in response
   */
  clockIn(employeeId) {
    return apiClient.post("/calendar/attendance/clock-in", { employeeId });
  },

  /**
   * Clock out for employee
   * @param {string} employeeId - Employee ID
   * @param {boolean} isAutoLogout - Is auto logout
   * @returns {Promise} Clock out response
   */
  clockOut(employeeId, isAutoLogout = false) {
    return apiClient.post("/calendar/attendance/clock-out", {
      employeeId,
      isAutoLogout,
    });
  },

  // ===============================
  // DAY OFF REQUEST METHODS
  // ===============================

  /**
   * Request a day off (Enhanced version)
   * @param {string} employeeId - Employee ID
   * @param {string} date - Date
   * @param {string} reason - Reason
   * @param {string} requestType - Type of request
   * @returns {Promise} Request response
   */
  async requestDayOff(employeeId, date, reason, requestType = "personal") {
    try {
      const response = await fetch(
        `${API_BASE_URL}/calendar/attendance/day-off/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            employeeId,
            date,
            reason,
            requestType,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            errorData.error ||
            `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error requesting day off:", error);
      throw error;
    }
  },

  /**
   * Process day off request (Approve/Reject) - Enhanced version
   * @param {string} adminId - Admin ID
   * @param {string} employeeId - Employee ID
   * @param {string} date - Date
   * @param {boolean} approved - Approval status
   * @param {string} comments - Comments
   * @returns {Promise} Process response
   */
  async processDayOffRequest(
    adminId,
    employeeId,
    date,
    approved,
    comments = ""
  ) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/calendar/attendance/day-off/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            adminId,
            employeeId,
            date,
            approved,
            comments,
            notifyEmployee: true,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            errorData.error ||
            `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error processing day off request:", error);
      throw error;
    }
  },

  /**
   * Get pending day off requests (Enhanced version)
   * @param {string} adminId - Admin ID
   * @param {Object} filters - Filter options
   * @returns {Promise} Pending requests
   */
  async getPendingRequests(adminId, filters = {}) {
    try {
      const params = new URLSearchParams({
        adminId,
        ...filters,
      });

      const response = await fetch(
        `${API_BASE_URL}/calendar/attendance/day-off/pending?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            errorData.error ||
            `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching pending day off requests:", error);
      throw error;
    }
  },

  /**
   * Bulk process day off requests (NEW)
   * @param {string} adminId - Admin ID
   * @param {Array} requests - Array of requests
   * @param {boolean} approved - Approval status
   * @param {string} comments - Comments
   * @returns {Promise} Bulk process response
   */
  async bulkProcessRequests(adminId, requests, approved, comments = "") {
    try {
      const response = await fetch(
        `${API_BASE_URL}/calendar/attendance/day-off/bulk-process`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            adminId,
            requests,
            approved,
            comments,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            errorData.error ||
            `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error bulk processing requests:", error);
      throw error;
    }
  },

  /**
   * Get day off request details (NEW)
   * @param {string} requestId - Request ID
   * @param {string} adminId - Admin ID
   * @returns {Promise} Request details
   */
  async getDayOffRequestDetails(requestId, adminId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/calendar/attendance/day-off/details/${requestId}?adminId=${adminId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            errorData.error ||
            `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching request details:", error);
      throw error;
    }
  },

  // ===============================
  // DASHBOARD & ANALYTICS METHODS (NEW)
  // ===============================

  /**
   * Get admin dashboard data (NEW)
   * @param {string} adminId - Admin ID
   * @returns {Promise} Dashboard data
   */
  async getDashboard(adminId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/calendar/dashboard?adminId=${adminId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            errorData.error ||
            `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  },

  /**
   * Get analytics data (NEW)
   * @param {string} adminId - Admin ID
   * @param {string} period - Period
   * @returns {Promise} Analytics data
   */
  async getAnalytics(adminId, period = "month") {
    try {
      const response = await fetch(
        `${API_BASE_URL}/calendar/analytics?adminId=${adminId}&period=${period}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            errorData.error ||
            `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  },

  /**
   * Get statistics overview (NEW)
   * @param {string} period - Period
   * @param {Object} filters - Additional filters
   * @returns {Promise} Statistics overview
   */
  async getStatsOverview(period = "month", filters = {}) {
    try {
      const params = new URLSearchParams({
        period,
        ...filters,
      });

      const response = await fetch(
        `${API_BASE_URL}/calendar/stats/overview?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            errorData.error ||
            `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching stats overview:", error);
      throw error;
    }
  },

  // ===============================
  // EMPLOYEE & ADMIN METHODS
  // ===============================

  /**
   * Check if employee is admin
   * @param {string} employeeId - Employee ID
   * @returns {Promise} Admin status
   */
  async checkAdminStatus(employeeId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/employees/admin/${employeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            errorData.error ||
            `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error checking admin status:", error);
      throw error;
    }
  },

  /**
   * Get all employees (NEW)
   * @returns {Promise} Employees data
   */
  async getAllEmployees() {
    return apiClient.get("/employees");
  },

  // ===============================
  // HOLIDAY METHODS
  // ===============================

  /**
   * Get holidays
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {Promise} Holidays data
   */
  getHolidays(startDate, endDate) {
    return apiClient.get(
      `/calendar/holidays?startDate=${startDate}&endDate=${endDate}`
    );
  },

  /**
   * Set holiday (Admin only)
   * @param {string} date - Date
   * @param {string} description - Description
   * @param {boolean} isHoliday - Is holiday
   * @param {string} type - Holiday type
   * @returns {Promise} Set holiday response
   */
  setHoliday(date, description, isHoliday = true, type = "public") {
    return apiClient.post("/calendar/holidays", {
      date,
      description,
      isHoliday,
      type,
    });
  },

  // ===============================
  // REPORT METHODS (NEW)
  // ===============================

  /**
   * Generate attendance report (NEW)
   * @param {Object} reportParams - Report parameters
   * @returns {Promise} Report data
   */
  async generateReport(reportParams) {
    const params = new URLSearchParams(reportParams);
    return apiClient.get(`/calendar/report?${params}`);
  },

  /**
   * Export attendance data (NEW)
   * @param {string} format - Export format
   * @param {Object} exportParams - Export parameters
   * @returns {Promise} Export response
   */
  async exportAttendanceData(format, exportParams) {
    const params = new URLSearchParams(exportParams);
    return apiClient.get(`/calendar/report/export/${format}?${params}`);
  },

  // ===============================
  // NOTIFICATION METHODS (NEW)
  // ===============================

  /**
   * Send notification (Admin only) (NEW)
   * @param {Object} notificationData - Notification data
   * @returns {Promise} Send response
   */
  async sendNotification(notificationData) {
    return apiClient.post("/calendar/notifications/send", notificationData);
  },

  /**
   * Get notification templates (Admin only) (NEW)
   * @returns {Promise} Notification templates
   */
  async getNotificationTemplates() {
    return apiClient.get("/calendar/notifications/templates");
  },

  // ===============================
  // UTILITY METHODS (NEW)
  // ===============================

  /**
   * Get comprehensive calendar data for a month (NEW)
   * @param {string} employeeId - Employee ID
   * @param {number} year - Year
   * @param {number} month - Month (1-12)
   * @returns {Promise} Calendar data with attendance, holidays, and requests
   */
  async getCalendarData(employeeId, year, month) {
    const startDate = apiClient.formatDate(new Date(year, month - 1, 1));
    const endDate = apiClient.formatDate(new Date(year, month, 0));

    const [attendance, holidays] = await Promise.all([
      this.getAttendance(employeeId, startDate, endDate),
      this.getHolidays(startDate, endDate),
    ]);

    return {
      year,
      month,
      dateRange: { startDate, endDate },
      attendance: attendance.attendanceData || {},
      holidays: holidays.holidays || {},
      stats: attendance.stats || {},
    };
  },

  /**
   * Get today's status for an employee (NEW)
   * @param {string} employeeId - Employee ID
   * @returns {Promise} Today's attendance status
   */
  async getTodayStatus(employeeId) {
    const today = apiClient.formatDate(new Date());
    const data = await this.getAttendance(employeeId, today, today);

    return {
      date: today,
      attendance: data.attendanceData[today] || null,
      isWorkingDay: true,
    };
  },

  /**
   * Check API health (NEW)
   * @returns {Promise} Health status
   */
  async checkHealth() {
    return apiClient.get("/calendar/health");
  },
};

// ===============================
// ADMIN API HELPER METHODS (NEW)
// ===============================

/**
 * Admin-specific API helper methods
 */
export const adminApi = {
  /**
   * Get comprehensive admin dashboard
   * @returns {Promise} Complete admin dashboard data
   */
  async getCompleteDashboard() {
    const adminId = localStorage.getItem("employeeId");

    const [dashboard, pendingRequests, analytics] = await Promise.all([
      calendarApi
        .getDashboard(adminId)
        .catch((err) => ({ dashboard: null, error: err.message })),
      calendarApi
        .getPendingRequests(adminId)
        .catch((err) => ({ requests: [], error: err.message })),
      calendarApi
        .getAnalytics(adminId)
        .catch((err) => ({ analytics: null, error: err.message })),
    ]);

    return {
      dashboard: dashboard.dashboard,
      pendingRequests: pendingRequests.requests || [],
      analytics: analytics.analytics,
      requestsSummary: pendingRequests.summary,
      errors: {
        dashboard: dashboard.error,
        requests: pendingRequests.error,
        analytics: analytics.error,
      },
    };
  },

  /**
   * Process multiple requests with progress tracking
   * @param {Array} requests - Requests to process
   * @param {boolean} approved - Approval status
   * @param {string} comments - Comments
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} Processing results
   */
  async processRequestsWithProgress(requests, approved, comments, onProgress) {
    const adminId = localStorage.getItem("employeeId");
    const results = [];
    const total = requests.length;

    for (let i = 0; i < requests.length; i++) {
      const request = requests[i];

      try {
        const result = await calendarApi.processDayOffRequest(
          adminId,
          request.employeeId,
          request.date,
          approved,
          comments
        );

        results.push({
          ...request,
          success: true,
          result,
        });
      } catch (error) {
        results.push({
          ...request,
          success: false,
          error: error.message,
        });
      }

      // Call progress callback
      if (onProgress) {
        onProgress({
          completed: i + 1,
          total,
          percentage: Math.round(((i + 1) / total) * 100),
          currentRequest: request,
        });
      }
    }

    return {
      total,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };
  },
};

// ===============================
// UTILITY FUNCTIONS (NEW)
// ===============================

/**
 * Setup API client with authentication
 * @param {string} token - Access token
 * @param {string} refreshToken - Refresh token
 */
export function setupAPI(token, refreshToken = null) {
  apiClient.setTokens(token, refreshToken);
}

/**
 * Clear all API authentication
 */
export function clearAPIAuth() {
  apiClient.clearTokens();
}

/**
 * Check if APIs are authenticated
 * @returns {boolean} Authentication status
 */
export function isAPIAuthenticated() {
  return !!localStorage.getItem("token");
}

/**
 * Handle API errors globally
 * @param {Error} error - API error
 * @param {Object} options - Error handling options
 */
export function handleAPIError(error, options = {}) {
  const {
    showNotification = true,
    redirectOnAuth = true,
    logError = true,
  } = options;

  if (logError) {
    console.error("API Error:", error);
  }

  // Handle authentication errors
  if (error.status === 401 && redirectOnAuth) {
    clearAPIAuth();
    window.location.href = "/login";
    return;
  }

  // Show user notification
  if (showNotification && window.showNotification) {
    const message = apiClient.getErrorMessage(error);
    const type = error.status >= 500 ? "error" : "warning";
    window.showNotification(message, type);
  }

  return error;
}

export default apiClient;
