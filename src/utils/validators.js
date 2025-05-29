// utils/validators.js
export const validators = {
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  phone: (phone) => {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ""));
  },

  required: (value) => {
    return value !== null && value !== undefined && value !== "";
  },

  minLength: (value, min) => {
    return value && value.length >= min;
  },

  maxLength: (value, max) => {
    return !value || value.length <= max;
  },

  numeric: (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value));
  },

  positiveNumber: (value) => {
    return validators.numeric(value) && parseFloat(value) > 0;
  },

  employeeId: (id) => {
    // Customize based on your employee ID format
    const re = /^[A-Z]{2,3}\d{3,6}$/;
    return re.test(id);
  },
};
