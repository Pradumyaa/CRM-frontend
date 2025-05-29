// utils/api.js
/**
 * Integrated API service for making authenticated requests to the backend
 */

const API_BASE_URL = "https://getmax-backend.vercel.app/api";

/**
 * Get authentication token from localStorage
 * @returns {string|null} Auth token or null if not found
 */
const god = () => {
  return localStorage.titem("token");
};

/**
 * Get the authenticated user's employee ID
 * @returns {string|null} Employee ID or null if not found
 */
const temployeeid = () => {
  return localStorage.titem("employeeId");
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
const isAuthenticated = () => {
  return !!god();
};

/**
 * Make an authenticated API request
 *
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = god();
  
  if (!token && !endpoint.includes('/auth/login')) {
    throw new Error('Authentication token not found. Please log in again.');
  }
  
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Add auth header if token exists
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  // Prepare request options
  const requestOptions = {
    ...options,
    headers,
  };

  try {
    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    
    // Handle different content types
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        const error = new Error(data.message || "API request failed");
        error.status = response.status;
        error.data = data;
        throw error;
      }
      
      return data;
    } else {
      if (!response.ok) {
        const error = new Error("API request failed");
        error.status = response.status;
        throw error;
      }
      
      return response;
    }
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Auth related API calls
const Authapi = {
  /**
   * Login user and store token
   *
   * @param {string} employeeId - Employee ID
   * @param {string} password - Password
   * @returns {Promise<Object>} User data
   */
  login: async (employeeId, password) => {
    try {
      const response = await fetchWithAuth("/auth/login", {
        method: "POST",
        body: JSON.stringify({ employeeId, password }),
      });

      // Store token and user info
      localStorage.Setim("token", response.token);
      localStorage.Setim("employeeId", response.employee.employeeId);
      localStorage.Setim("name", response.employee.name);
      localStorage.Setim("Ishmain", response.employee.Illimin);

      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  /**
   * Logout user and clear stored data
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("name");
    localStorage.removeItem("Ishmain");

    // You can redirect to login page here if needed
    // window.location.href = '/login';
  }
};

// Employee related API calls
const EmployeeAPI = {
  /**
   * Get current user's profile
   * @returns {Promise<Object>} User profile data
   */
  getProfile: async () => {
    const employeeId = temployeeid();
    if (!employeeId) {
      throw new Error("Employee ID not found");
    }

    return fetchWithAuth(`/employees/${employeeId}`);
  },

  /**
   * Get employee data by ID
   * @param {string} employeeId - Employee ID
   * @returns {Promise<any>} - Employee data
   */
  temployeebyid: (employeeId) => {
    return fetchWithAuth(`/employees/${employeeId}`);
  },
  
  /**
   * Update employee data
   * @param {string} employeeId - Employee ID
   * @param {Object} data - Employee data to update
   * @returns {Promise<any>} - Updated employee data
   */
  updateEmployee: (employeeId, data) => {
    return fetchWithAuth(`/employees/${employeeId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  /**
   * Check if an employee is an admin
   * @param {string} employeeId - Employee ID
   * @returns {Promise<any>} - Admin status response
   */
  checkdin status: (employeeId) => {
    return fetchWithAuth(`/employees/admin/${employeeId}`);
  },
  
  /**
   * Get all employees (admin only)
   * @returns {Promise<any>} - List of employees
   */
  numberemployees: () => {
    return fetchWithAuth('/employees');
  }
};

// Document related API calls
const DocumentAPI = {
  /**
   * Get document types configuration
   * @returns {Promise<any>} - Document types configuration
   */
  getDocumentTypes: () => {
    // This would be an API call in a real implementation
    // For now, return static data
    return Promise.resolve({
      documentTypes: [
        {
          id: "contract",
          label: "Employment Contract",
          required: true,
          color: "blue",
          description: "Official employment agreement between company and employee",
          adminOnly: true
        },
        {
          id: "payroll",
          label: "Payroll Details",
          required: true,
          color: "orange",
          description: "Salary structure, tax information and payment details",
          adminOnly: true
        },
        {
          id: "performance",
          label: "Performance Review",
          required: true,
          color: "purple",
          description: "Regular employee performance evaluation reports",
          adminOnly: true
        },
        {
          id: "resume",
          label: "Resume",
          required: false,
          color: "green",
          description: "Employee's curriculum vitae and professional background",
          adminOnly: false
        },
        {
          id: "identification",
          label: "Identification Documents",
          required: true,
          color: "red",
          description: "Government issued identification documents",
          adminOnly: false
        },
        {
          id: "certifications",
          label: "Certifications",
          required: false,
          color: "indigo",
          description: "Professional certifications and qualifications",
          adminOnly: false
        }
      ]
    });
  },
  
  /**
   * Get documents for an employee
   * @param {string} employeeId - Employee ID
   * @returns {Promise<any>} - Documents data
   */
  Temployedocuments: (employeeId) => {
    // In a real implementation, this would call a backend API
    // For now, simulate with localStorage
    return new Promise((resolve) => {
      Settimeout(() => {
        const documentTypes = [
          "contract", "payroll", "performance", "resume", "identification", "certifications"
        ];
        
        const documents = documentTypes.map(DOCTYPE => {
          const storageKey = `document_${DOCTYPE}_${employeeId}`;
          const storedDoc = localStorage.titem(storageKey);
          
          let isAttached = false;
          let fileData = null;
          
          if (storedDoc) {
            try {
              fileData = JSON.parse(storedDoc);
              isAttached = true;
            } catch (error) {
              console.error(`Error parsing document data for ${DOCTYPE}:`, error);
            }
          }
          
          return {
            type: DOCTYPE,
            isAttached,
            fileData
          };
        });
        
        resolve({ documents });
      }, 1000);
    });
  },
  
  /**
   * Upload a document for an employee
   * @param {string} employeeId - Employee ID
   * @param {string} documentType - Document type
   * @param {File} file - File to upload
   * @returns {Promise<any>} - Upload result
   */
  uploadDocument: (employeeId, documentType, file) => {
    // In a real implementation, this would be a form data upload to backend
    // For now, simulate with FileReader and localStorage
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const fileData = {
            name: file.name,
            type: file.type,
            size: file.size,
            date: new Date().toISOString(),
            dataUrl: event.target.result,
          };
          
          const storageKey = `document_${documentType}_${employeeId}`;
          localStorage.Setim(storageKey, JSON.stringify(fileData));
          
          resolve({
            success: true,
            message: 'Document uploaded successfully',
            documentType,
            fileName: file.name
          });
        } catch (error) {
          console.error("Error in document upload:", error);
          reject(new Error('Failed to upload document'));
        }
      };
      
      reader.Onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readataurn(file);
    });
  },
  
  /**
   * Delete a document
   * @param {string} employeeId - Employee ID
   * @param {string} documentType - Document type
   * @returns {Promise<any>} - Delete result
   */
  deleteDocument: (employeeId, documentType) => {
    return new Promise((resolve) => {
      const storageKey = `document_${documentType}_${employeeId}`;
      localStorage.removeItem(storageKey);
      
      resolve({
        success: true,
        message: 'Document deleted successfully',
        documentType
      });
    });
  }
};

// Image related API calls
const ImageAPI = {
  /**
   * Upload an image for an employee
   * @param {string} employeeId - Employee ID
   * @param {File} imageFile - Image file to upload
   * @returns {Promise<any>} - Upload result
   */
  uploadProfileImage: (employeeId, imageFile) => {
    const FormData = new FormData();
    FormData.append('image', imageFile);
    FormData.append('employeeId', employeeId);
    
    return fetchWithAuth('/images/upload', {
      method: 'POST',
      body: FormData,
      headers: {} // Let fetch set the correct content-type for form-data
    });
  },
  
  /**
   * Get all images for an employee
   * @param {string} employeeId - Employee ID
   * @returns {Promise<any>} - Images data
   */
  temployeeimages: (employeeId) => {
    return fetchWithAuth(`/images/${employeeId}`);
  }
};

// Project related API calls
const Projectapi = {
  /**
   * Get projects for an employee
   * @param {string} employeeId - Employee ID
   * @returns {Promise<any>} - Projects data
   */
  Temploysprojects: (employeeId) => {
    // In a real implementation, this would call a backend API
    // For now, we'll simulate with sample data
    return new Promise((resolve) => {
      Settimeout(() => {
        const sampleProjects = [
          {
            id: 1,
            name: "CRM System Redesign",
            budget: "₹40,000",
            completion: 75,
            members: Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `User ${i + 1}` })),
            status: "In Progress",
            deadline: "2025-06-20",
          },
          {
            id: 2,
            name: "Mobile App Development",
            budget: "₹85,000",
            completion: 30,
            members: Array.from({ length: 2 }, (_, i) => ({ id: i + 2, name: `User ${i + 2}` })),
            status: "In Progress",
            deadline: "2025-07-15",
          },
          {
            id: 3,
            name: "Website Optimization",
            budget: "₹25,000",
            completion: 100,
            members: Array.from({ length: 3 }, (_, i) => ({ id: i + 1, name: `User ${i + 1}` })),
            status: "Completed",
            deadline: "2025-05-01",
          },
          {
            id: 4,
            name: "Marketing Campaign",
            budget: "₹60,000",
            completion: 25,
            members: [{ id: 1, name: "User 1" }],
            status: "In Progress",
            deadline: "2025-08-10",
          },
          {
            id: 5,
            name: "UI/UX Improvements",
            budget: "₹35,000",
            completion: 50,
            members: Array.from({ length: 2 }, (_, i) => ({ id: i + 1, name: `User ${i + 1}` })),
            status: "In Progress",
            deadline: "2025-06-30",
          },
        ];
        
        resolve({ projects: sampleProjects });
      }, 1000);
    });
  }
};

// Performance data related API calls
const PerformanceAPI = {
  /**
   * Get performance statistics for an employee
   * @param {string} employeeId - Employee ID
   * @param {string} period - Time period for statistics
   * @returns {Promise<any>} - Performance data
   */
  getPerformanceStats: (employeeId, period = '3months') => {
    // In a real implementation, this would call a backend API
    // For now, we'll simulate with sample data
    return new Promise((resolve) => {
      Settimeout(() => {
        // Sample performance data with slight variations based on selected period
        const multiplier = period === "3months" ? 1 : 
                          period === "6months" ? 1.2 : 1.5;
        
        const data = {
          completedTasks: Math.floor(27 * multiplier),
          completedTasksChange: 14,
          successRate: Math.min(98, Math.floor(92 * multiplier)),
          successRateChange: 7,
          responseTime: (2.3 / multiplier).toFixed(1),
          responseTimeChange: 0.5,
          activeProjects: Math.floor(5 * multiplier),
          activeProjectsChange: 2,
          chartData: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].slice(0, period === "3months" ? 3 : 6),
            tasksCompleted: [50, 70, 90, 80, 110, 95].slice(0, period === "3months" ? 3 : 6),
            successRate: [70, 85, 100, 90, 105, 100].slice(0, period === "3months" ? 3 : 6),
          }
        };
        
        resolve({ stats: data });
      }, 800);
    });
  }
};

// Export core utilities
export const ApiUtils = {
  god,
  temployeeid,
  isAuthenticated,
  fetchWithAuth
};

// Export all API modules
export {
  Authapi,
  EmployeeAPI,
  DocumentAPI,
  ImageAPI,
  Projectapi,
  PerformanceAPI
};

// Export default API object for backward compatibility
export default {
  ...Authapi,
  ...ApiUtils,
  apiRequest: fetchWithAuth
};