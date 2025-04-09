// utils/holidayAPI.js

/**
 * Fetch holidays from the server API for a specific month and year
 * @param {number} year - Year to fetch holidays for
 * @param {number} month - Month to fetch holidays for (1-12)
 * @returns {Promise<Object>} - Object with date keys and holiday descriptions
 */
export const fetchIndianHolidays = async (year, month) => {
    try {
      // Format month to ensure it's two digits (e.g., 01, 02, etc.)
      const monthStr = month.toString().padStart(2, '0');
      
      // Calculate first and last day of the month
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      
      const startDate = formatDateToString(firstDay);
      const endDate = formatDateToString(lastDay);
      
      // Call the API endpoint
      const response = await fetch(
        `/api/calendar/holidays?startDate=${startDate}&endDate=${endDate}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch holidays: ${response.status}`);
      }
      
      const data = await response.json();
      return data.holidays || {};
    } catch (error) {
      console.error('Error fetching holidays:', error);
      return {}; // Return empty object on error
    }
  };
  
  /**
   * Format date to YYYY-MM-DD string
   * @param {Date} date - Date object
   * @returns {string} - Formatted date string
   */
  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };