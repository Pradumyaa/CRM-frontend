import apiClient from "./apiClient";

// Calendar API service providing methods for attendance-related operations

export const calendarApiService = {

    // Get attendance data for an employee in a specific date range
    async getAttendance(employeeId, startDate, endDate) {
        try {
            const response = await apiClient.get(`/calendar/attendance?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`);

            return response;
        } catch (error) {
            console.error("Error fetching attendance: ", error);
            throw error;
        }
    },

    // Get attendance data for all employees (admin only)
    async getAllEmployeesAttendance(startDate, endDate) {
        try {
            const response = await apiClient.get(
                `/calendar/attendance/all?startDate=${startDate}&endDate=${endDate}`
            );
            return response;
        } catch (error) {
            console.error("Error fetching all employees attendance: ", error);
            throw error;
        }
    },

    // Clock in an employee
    async clockIn(employeeId) {
        try {
            const response = await apiClient.post('/calendar/attendance/clock-in', { employeeId });
            return response;
        } catch (error) {
            console.error("Error clocking in: ", error);
            throw error;
        }
    },

    // Clock out an employee
    async clockOut(employeeId, isAutoLogout = false) {
        try {
            const response = await apiClient.post('/calendar/attendance/clock-out', {
                employeeId,
                isAutoLogout
            });
            return response;
        } catch (error) {
            console.error('Error clocking out:', error);
            throw error;
        }
    },

    // Request day off
    async requestDayOff(employeeId, date, reason) {
        try {
            const response = await apiClient.post('/calendar/attendance/day-off', {
                employeeId,
                date,
                reason
            });
            return response;
        } catch (error) {
            console.error('Error requesting day off:', error);
            throw error;
        }
    },

    // Process a day off request
    async processDayOffRequest(adminId, employeeId, date, approved) {
        try {
            const response = await apiClient.post('/calendar/attendance/day-off/approve', { adminId, employeeId, date, approved });
            return response;
        } catch (error) {
            console.error("Error processing day off request: ", error);
            throw error;
        }
    }
    /**
   * Fetch pending day off requests (admin only)
   * @param {string} adminId - Admin's employee ID
   * @returns {Promise} - List of pending requests
   */
  async getPendingRequests(adminId) {
        try {
            const response = await apiClient.get(`/attendance/pending-requests?adminId=${adminId}`);
            return response;
        } catch (error) {
            console.error('Error fetching pending requests:', error);
            throw error;
        }
    },

    /**
     * Get holidays for a specified date range
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Promise} - Holidays in the date range
     */
    async getHolidays(startDate, endDate) {
        try {
            const response = await apiClient.get(`/calendar/holidays?startDate=${startDate}&endDate=${endDate}`);
            return response;
        } catch (error) {
            console.error('Error fetching holidays:', error);
            throw error;
        }
    },

    /**
     * Check if an employee is an admin
     * @param {string} employeeId - Employee ID
     * @returns {Promise<boolean>} - Whether the employee is an admin
     */
    async checkAdminStatus(employeeId) {
        try {
            const response = await apiClient.get(`/employees/${employeeId}`);
            return response.employee && response.employee.isAdmin;
        } catch (error) {
            console.error('Error checking admin status:', error);
            return false;
        }
    }
};

/**
 * Utility function to format a Date object to YYYY-MM-DD string
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Format time to display format
 * @param {string|Date} time - Time string or Date object
 * @returns {string} - Formatted time string (HH:MM)
 */
export const formatTimeDisplay = (time) => {
    if (!time) return '';

    const date = typeof time === 'string' ? new Date(time) : time;
    if (isNaN(date.getTime())) return '';

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Format seconds to time display format
 * @param {number} seconds - Total seconds
 * @returns {string} - Formatted time string (HH:MM:SS)
 */
export const formatSecondsToTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Get today's date at midnight (for comparisons)
 * @returns {Date} - Today's date at 00:00:00
 */
export const getTodayAtMidnight = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

export default calendarApiService;
