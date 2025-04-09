// utils/apiClient.js

// For Vite, use import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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
        throw new Error(`API error: ${response.status}`);
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
        throw new Error(`API error: ${response.status}`);
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
        throw new Error(`API error: ${response.status}`);
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
        throw new Error(`API error: ${response.status}`);
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
  /**
   * Get attendance data for an employee
   * @param {string} employeeId - Employee ID
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise} - Response promise
   */
  getAttendance(employeeId, startDate, endDate) {
    return apiClient.get(`/calendar/attendance?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`);
  },
  
  /**
   * Clock in an employee
   * @param {string} employeeId - Employee ID
   * @returns {Promise} - Response promise
   */
  clockIn(employeeId) {
    return apiClient.post('/calendar/attendance/clock-in', { employeeId });
  },
  
  /**
   * Clock out an employee
   * @param {string} employeeId - Employee ID
   * @param {boolean} isAutoLogout - Whether this is an automatic logout
   * @returns {Promise} - Response promise
   */
  clockOut(employeeId, isAutoLogout = false) {
    return apiClient.post('/calendar/attendance/clock-out', { 
      employeeId,
      isAutoLogout
    });
  },
  
  /**
   * Request a day off
   * @param {string} employeeId - Employee ID
   * @param {string} date - Date (YYYY-MM-DD)
   * @param {string} reason - Reason for day off
   * @returns {Promise} - Response promise
   */
  requestDayOff(employeeId, date, reason) {
    return apiClient.post('/calendar/attendance/day-off', {
      employeeId,
      date,
      reason
    });
  },
  
  /**
   * Get holidays for a date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise} - Response promise
   */
  getHolidays(startDate, endDate) {
    return apiClient.get(`/calendar/holidays?startDate=${startDate}&endDate=${endDate}`);
  },
  
  /**
   * Set a holiday
   * @param {string} date - Date (YYYY-MM-DD)
   * @param {string} description - Holiday description
   * @param {boolean} isHoliday - Whether to set or remove the holiday
   * @returns {Promise} - Response promise
   */
  setHoliday(date, description, isHoliday = true) {
    return apiClient.post('/calendar/holidays', {
      date,
      description,
      isHoliday
    });
  }
};

export default apiClient;