// src/utils/apiClient.js

// For Vite, use import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Base API client for making requests to the backend
 */
const apiClient = {
  /**
   * Get the authorization headers with the token
   * @returns {Object} Headers object
   */
  getHeaders() {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  },

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} - Response promise
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  },

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @returns {Promise} - Response promise
   */
  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  },

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @returns {Promise} - Response promise
   */
  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  },

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} - Response promise
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  },
};

// Calendar-specific API methods
export const calendarApi = {
  
  getAttendance(employeeId, startDate, endDate) {
    return apiClient.get(`/calendar/attendance?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`);
  },

  
  getAllAttendance(startDate, endDate) {
    return apiClient.get(`/calendar/attendance/all?startDate=${startDate}&endDate=${endDate}`);
  },

  clockIn(employeeId) {
    return apiClient.post('/calendar/attendance/clock-in', { employeeId });
  },

  clockOut(employeeId, isAutoLogout = false) {
    return apiClient.post('/calendar/attendance/clock-out', {
      employeeId,
      isAutoLogout
    });
  },

  requestDayOff(employeeId, date, reason) {
    return apiClient.post('/calendar/attendance/day-off', {
      employeeId,
      date,
      reason
    });
  },

  processDayOffRequest(adminId, employeeId, date, approved) {
    return apiClient.post('/calendar/attendance/day-off/approve', {
      adminId,
      employeeId,
      date,
      approved
    });
  },

  getPendingRequests(adminId) {
    return apiClient.get(`/attendance/pending-requests?adminId=${adminId}`);
  },

  checkAdminStatus(employeeId) {
    return apiClient.get(`/employees/${employeeId}`);
  },

  getHolidays(startDate, endDate) {
    return apiClient.get(`/calendar/holidays?startDate=${startDate}&endDate=${endDate}`);
  },

  setHoliday(date, description, isHoliday = true) {
    return apiClient.post('/calendar/holidays', {
      date,
      description,
      isHoliday
    });
  }
};

export default apiClient;