// utils/auth.js

/**
 * Check if user is authenticated
 * @returns {boolean} - Whether the user is authenticated
 */
export const isAuthenticated = () => {
    if (typeof window === 'undefined') {
      return false; // Not authenticated on server-side
    }
    return localStorage.getItem('employeeId') !== null;
  };
  
  /**
   * Get the current employee ID
   * @returns {string|null} - The employee ID or null if not authenticated
   */
  export const getEmployeeId = () => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('employeeId');
  };
  
  /**
   * Set the employee ID in localStorage
   * @param {string} id - The employee ID to store
   */
  export const setEmployeeId = (id) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('employeeId', id);
    }
  };
  
  /**
   * Clear the employee ID from localStorage (logout)
   */
  export const clearAuth = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('employeeId');
    }
  };