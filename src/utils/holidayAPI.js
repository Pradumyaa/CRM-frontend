// src/utils/holidayAPI.js
import { formatDateToString } from './calendarStyles';
import { calendarApi } from './apiClient';

/**
 * Fetch holidays from the server API for a specific month and year
 * @param {number} year - Year to fetch holidays for
 * @param {number} month - Month to fetch holidays for (1-12)
 * @returns {Promise<Object>} - Object with date keys and holiday descriptions
 */
export const fetchHolidays = async (year, month) => {
  try {
    // Format month to ensure it's two digits (e.g., 01, 02, etc.)
    const monthStr = month.toString().padStart(2, '0');

    // Calculate first and last day of the month
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const startDate = formatDateToString(firstDay);
    const endDate = formatDateToString(lastDay);

    // Call the API endpoint
    const data = await calendarApi.getHolidays(startDate, endDate);
    return data.holidays || {};
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return {}; // Return empty object on error
  }
};

/**
 * Get predefined holidays for India
 * This can be used as a fallback if the API fails
 * @param {number} year - Year to get holidays for
 * @returns {Object} - Object with date keys and holiday descriptions
 */
export const getIndianHolidays = (year) => {
  // Basic set of Indian holidays
  const holidays = {
    [`${year}-01-26`]: { description: 'Republic Day' },
    [`${year}-08-15`]: { description: 'Independence Day' },
    [`${year}-10-02`]: { description: 'Gandhi Jayanti' },
  };

  return holidays;
};

/**
 * Check if a date is a weekend (Saturday or Sunday)
 * @param {Date} date - Date to check
 * @returns {boolean} - True if weekend, false otherwise
 */
export const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

/**
 * Check if a date is a holiday (from provided holidays object)
 * @param {Date} date - Date to check
 * @param {Object} holidays - Object with date keys and holiday descriptions
 * @returns {boolean} - True if holiday, false otherwise
 */
export const isHoliday = (date, holidays) => {
  const dateKey = formatDateToString(date);
  return holidays[dateKey] !== undefined;
};

/**
 * Get holiday description for a date
 * @param {Date} date - Date to get description for
 * @param {Object} holidays - Object with date keys and holiday descriptions
 * @returns {string|null} - Holiday description or null if not a holiday
 */
export const getHolidayDescription = (date, holidays) => {
  const dateKey = formatDateToString(date);
  return holidays[dateKey]?.description || null;
};

export default {
  fetchHolidays,
  getIndianHolidays,
  isWeekend,
  isHoliday,
  getHolidayDescription
};