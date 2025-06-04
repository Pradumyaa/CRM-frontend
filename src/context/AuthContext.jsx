import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Role levels for access control
const ROLE_LEVELS = {
  super_admin: 1,
  product_owner: 2,
  admin: 3,
  cxo_director: 4,
  senior_manager: 5,
  manager: 6,
  assistant_manager: 7,
  senior_team_lead: 8,
  team_lead: 9,
  assistant_team_lead: 10,
  senior_associate: 11,
  associate: 12,
  intern: 13,
  viewer: 14,
};

// Permission definitions
const PERMISSIONS = {
  ALL_ACCESS: "all_access",
  MANAGE_USERS: "manage_users",
  VIEW_USERS: "view_users",
  MANAGE_ROLES: "manage_roles",
  VIEW_ROLES: "view_roles",
  MANAGE_EMPLOYEES: "manage_employees",
  VIEW_EMPLOYEES: "view_employees",
  MANAGE_ATTENDANCE: "manage_attendance",
  VIEW_ATTENDANCE: "view_attendance",
  VIEW_OWN_ATTENDANCE: "view_own_attendance",
  MANAGE_DOCUMENTS: "manage_documents",
  VIEW_DOCUMENTS: "view_documents",
  VIEW_OWN_DOCUMENTS: "view_own_documents",
  VIEW_REPORTS: "view_reports",
  CREATE_REPORTS: "create_reports",
  VIEW_ANALYTICS: "view_analytics",
  VIEW_FINANCIAL_DATA: "view_financial_data",
  TRACK_ACTIVITIES: "track_activities",
  MANAGE_REQUESTS: "manage_requests",
  ACCESS_CHAT: "access_chat",
  ACCESS_WORKSPACES: "access_workspaces",
  MANAGE_DEPARTMENTS: "manage_departments",
  MANAGE_PERMISSIONS: "manage_permissions",
  MANAGE_SYSTEM: "manage_system",
  DELETE_USERS: "delete_users",
  VIEW_ALL_DATA: "view_all_data",
  STRATEGIC_DECISIONS: "strategic_decisions",
  APPROVE_REQUESTS: "approve_requests",
  MANAGE_TEAM: "manage_team",
  LEAD_TEAM: "lead_team",
  ADVANCED_TASKS: "advanced_tasks",
  BASIC_TASKS: "basic_tasks",
  LEARNING_ACCESS: "learning_access",
  READ_ONLY: "read_only",
};

// Role-based permissions mapping
const ROLE_PERMISSIONS = {
  super_admin: [
    PERMISSIONS.ALL_ACCESS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.MANAGE_DEPARTMENTS,
    PERMISSIONS.MANAGE_PERMISSIONS,
    PERMISSIONS.MANAGE_SYSTEM,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.VIEW_ALL_DATA,
  ],
  product_owner: [
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.CREATE_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.TRACK_ACTIVITIES,
    PERMISSIONS.MANAGE_REQUESTS,
    PERMISSIONS.ACCESS_CHAT,
    PERMISSIONS.ACCESS_WORKSPACES,
    PERMISSIONS.MANAGE_DEPARTMENTS,
    PERMISSIONS.VIEW_ALL_DATA,
  ],
  admin: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_EMPLOYEES,
    PERMISSIONS.MANAGE_ATTENDANCE,
    PERMISSIONS.MANAGE_DOCUMENTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.CREATE_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_FINANCIAL_DATA,
    PERMISSIONS.TRACK_ACTIVITIES,
    PERMISSIONS.MANAGE_REQUESTS,
    PERMISSIONS.ACCESS_CHAT,
    PERMISSIONS.ACCESS_WORKSPACES,
  ],
  cxo_director: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.CREATE_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_FINANCIAL_DATA,
    PERMISSIONS.MANAGE_REQUESTS,
    PERMISSIONS.ACCESS_CHAT,
    PERMISSIONS.ACCESS_WORKSPACES,
    PERMISSIONS.STRATEGIC_DECISIONS,
  ],
  senior_manager: [
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.CREATE_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_REQUESTS,
    PERMISSIONS.ACCESS_CHAT,
    PERMISSIONS.ACCESS_WORKSPACES,
    PERMISSIONS.MANAGE_TEAM,
    PERMISSIONS.APPROVE_REQUESTS,
  ],
  manager: [
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.CREATE_REPORTS,
    PERMISSIONS.MANAGE_REQUESTS,
    PERMISSIONS.ACCESS_CHAT,
    PERMISSIONS.ACCESS_WORKSPACES,
    PERMISSIONS.MANAGE_TEAM,
  ],
  assistant_manager: [
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_REQUESTS,
    PERMISSIONS.ACCESS_CHAT,
    PERMISSIONS.ACCESS_WORKSPACES,
  ],
  senior_team_lead: [
    PERMISSIONS.VIEW_EMPLOYEES,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.TRACK_ACTIVITIES,
    PERMISSIONS.ACCESS_CHAT,
    PERMISSIONS.ACCESS_WORKSPACES,
    PERMISSIONS.LEAD_TEAM,
  ],
  team_lead: [
    PERMISSIONS.VIEW_OWN_ATTENDANCE,
    PERMISSIONS.VIEW_OWN_DOCUMENTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.TRACK_ACTIVITIES,
    PERMISSIONS.ACCESS_CHAT,
    PERMISSIONS.ACCESS_WORKSPACES,
    PERMISSIONS.LEAD_TEAM,
  ],
  assistant_team_lead: [
    PERMISSIONS.VIEW_OWN_ATTENDANCE,
    PERMISSIONS.VIEW_OWN_DOCUMENTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.ACCESS_CHAT,
    PERMISSIONS.ACCESS_WORKSPACES,
  ],
  senior_associate: [
    PERMISSIONS.VIEW_OWN_ATTENDANCE,
    PERMISSIONS.VIEW_OWN_DOCUMENTS,
    PERMISSIONS.ACCESS_CHAT,
    PERMISSIONS.ACCESS_WORKSPACES,
    PERMISSIONS.ADVANCED_TASKS,
  ],
  associate: [
    PERMISSIONS.VIEW_OWN_ATTENDANCE,
    PERMISSIONS.VIEW_OWN_DOCUMENTS,
    PERMISSIONS.ACCESS_CHAT,
    PERMISSIONS.BASIC_TASKS,
  ],
  intern: [
    PERMISSIONS.VIEW_OWN_ATTENDANCE,
    PERMISSIONS.VIEW_OWN_DOCUMENTS,
    PERMISSIONS.LEARNING_ACCESS,
  ],
  viewer: [PERMISSIONS.READ_ONLY],
};

// Department permissions mapping
const DEPARTMENT_PERMISSIONS = {
  sales: ["view_sales_data", "manage_leads", "sales_reports"],
  marketing: ["view_marketing_data", "manage_campaigns", "marketing_analytics"],
  hr: ["view_hr_data", "manage_employees", "hr_reports"],
  finance: ["view_finance_data", "manage_budgets", "financial_reports"],
  operations: [
    "view_operations_data",
    "manage_processes",
    "operations_reports",
  ],
  it: ["view_it_data", "manage_systems", "technical_reports"],
  rnd: ["view_research_data", "manage_projects", "research_reports"],
  learning: ["view_learning_data", "manage_training", "learning_reports"],
  accounts: ["view_accounts_data", "manage_transactions", "accounting_reports"],
  legal: ["view_legal_data", "manage_contracts", "legal_reports"],
  support: ["view_support_data", "manage_tickets", "support_reports"],
  admin_facilities: ["view_admin_data", "manage_facilities", "admin_reports"],
  compliance: ["view_compliance_data", "manage_audits", "compliance_reports"],
};

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("viewer");
  const [userDepartment, setUserDepartment] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const employeeId = localStorage.getItem("employeeId");
      const userData = localStorage.getItem("userData");
      const userName = localStorage.getItem("userName");
      const roleData = localStorage.getItem("userRole");
      const departmentData = localStorage.getItem("userDepartment");
      const isAdminData = localStorage.getItem("isAdmin") === "true";

      if (token && (employeeId || userData)) {
        let parsedUser;

        // Handle both storage formats
        if (userData) {
          parsedUser = JSON.parse(userData);
        } else {
          // Fallback to individual stored values
          parsedUser = {
            employeeId,
            name: userName || "User",
            isAdmin: isAdminData,
          };
        }

        // Determine role - prioritize explicit role, then admin status, then default
        // let currentRole = roleData || parsedUser.role || parsedUser.roleId;
        // if (!currentRole) {
        //   currentRole = parsedUser.isAdmin || isAdminData ? "admin" : "viewer";
        // }
        // FORCED ROLE FOR TESTING PURPOSE
        let currentRole = "super_admin"; // force super_admin role always

        const currentDepartment = departmentData || parsedUser.department;

        setUser({
          ...parsedUser,
          roleLevel: ROLE_LEVELS[currentRole] || 14,
        });
        setUserRole(currentRole);
        setUserDepartment(currentDepartment);
        setUserPermissions(
          calculatePermissions(currentRole, currentDepartment)
        );
        setIsAuthenticated(true);

        // Verify token validity if we have an API endpoint
        if (token) {
          await verifyToken(token);
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (token) => {
    try {
      const response = await fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Token verification failed with status: ${response.status}`
        );
      }

      // Check if the response is actually JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn("Token verification endpoint returned non-JSON response");
        return; // Exit gracefully if API doesn't return JSON
      }

      // Get the response text first to check if it's empty
      const responseText = await response.text();
      if (!responseText.trim()) {
        console.warn("Token verification endpoint returned empty response");
        return; // Exit gracefully if response is empty
      }

      // Now try to parse the JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.warn(
          "Failed to parse token verification response:",
          parseError
        );
        console.warn("Response text:", responseText);
        return; // Exit gracefully if JSON parsing fails
      }

      // Update user data if token is valid and data has changed
      if (data && (data.user || data.employee)) {
        updateUserData(data.user || data.employee);
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      // Don't logout on verification failure - API might not be available
      // You could optionally set a flag to indicate verification failed
    }
  };

  const calculatePermissions = (role, department) => {
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    const departmentPermissions = department
      ? DEPARTMENT_PERMISSIONS[department] || []
      : [];
    const basicPermissions = ["view_own_profile", "edit_own_profile"];

    return [
      ...new Set([
        ...basicPermissions,
        ...rolePermissions,
        ...departmentPermissions,
      ]),
    ];
  };

  const login = async (employeeId, password, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId, password }),
      });

      // Check if response is ok first
      if (!response.ok) {
        // Handle different error status codes
        if (response.status === 404) {
          throw new Error(
            "Login endpoint not found. Please check your API configuration."
          );
        }
        if (response.status === 500) {
          throw new Error("Server error. Please try again later.");
        }
        if (response.status === 401) {
          throw new Error(
            "Invalid credentials. Please check your employee ID and password."
          );
        }

        // Try to parse error response, but handle JSON parsing errors
        try {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Login failed with status: ${response.status}`
          );
        } catch (parseError) {
          // If we can't parse the error response, throw a generic error
          throw new Error(`Login failed with status: ${response.status}`);
        }
      }

      // Check if response has content before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "Server returned invalid response format. Expected JSON."
        );
      }

      // Get response text first to check if it's empty
      const responseText = await response.text();
      if (!responseText.trim()) {
        throw new Error("Server returned empty response.");
      }

      // Now try to parse the JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Response Text:", responseText);
        throw new Error("Invalid response from server. Please try again.");
      }

      // Validate that we have the expected data structure
      if (!data || !data.employee) {
        throw new Error("Invalid response format from server.");
      }

      const employee = data.employee;

      // Determine user role from response or default
      const currentRole =
        employee.roleId ||
        employee.role ||
        (employee.isAdmin ? "admin" : "viewer");

      // Store auth data in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      localStorage.setItem("employeeId", employee.employeeId);
      localStorage.setItem("userName", employee.name || "User");
      localStorage.setItem(
        "userData",
        JSON.stringify({ ...employee, role: currentRole })
      );
      localStorage.setItem("userRole", currentRole);
      localStorage.setItem("isAdmin", (ROLE_LEVELS[currentRole] || 14) <= 3);

      if (employee.department) {
        localStorage.setItem("userDepartment", employee.department);
      }

      // Store remember me preference
      localStorage.setItem("rememberMe", rememberMe);
      if (rememberMe) {
        localStorage.setItem("rememberedEmployeeId", employee.employeeId);
      }

      // Update state
      const updatedEmployee = {
        ...employee,
        role: currentRole,
        roleLevel: ROLE_LEVELS[currentRole] || 14,
        permissions: calculatePermissions(currentRole, employee.department),
      };

      setUser(updatedEmployee);
      setUserRole(currentRole);
      setUserDepartment(employee.department);
      setUserPermissions(
        calculatePermissions(currentRole, employee.department)
      );
      setIsAuthenticated(true);

      // REDIRECT AFTER SUCCESSFUL LOGIN
      navigate("/dashboard");

      return { success: true, user: updatedEmployee, data };
    } catch (error) {
      const errorMessage = error.message || "Login failed. Please try again.";
      setError(errorMessage);
      console.error("Login error:", error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Save remember me preference
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    const rememberedId = rememberMe ? localStorage.getItem("employeeId") : null;

    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userDepartment");
    localStorage.removeItem("isAdmin");

    // Restore remembered ID if needed
    if (rememberMe && rememberedId) {
      localStorage.setItem("rememberedEmployeeId", rememberedId);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("rememberedEmployeeId");
    }

    // Reset state
    setUser(null);
    setUserRole("viewer");
    setUserDepartment(null);
    setUserPermissions([]);
    setIsAuthenticated(false);
    setError(null);

    // Redirect to login if navigate is available
    if (navigate) {
      navigate("/login");
    }
  };

  // Update user role
  const updateUserRole = (newRole, newDepartment = null) => {
    setUserRole(newRole);
    if (newDepartment !== null) {
      setUserDepartment(newDepartment);
    }

    const newPermissions = calculatePermissions(
      newRole,
      newDepartment || userDepartment
    );
    setUserPermissions(newPermissions);

    // Update localStorage
    localStorage.setItem("userRole", newRole);
    if (newDepartment !== null) {
      localStorage.setItem("userDepartment", newDepartment);
    }

    // Update user object
    const updatedUser = {
      ...user,
      role: newRole,
      roleId: newRole,
      roleLevel: ROLE_LEVELS[newRole] || 14,
      permissions: newPermissions,
      ...(newDepartment !== null && { department: newDepartment }),
    };
    setUser(updatedUser);
    localStorage.setItem("userData", JSON.stringify(updatedUser));
  };

  // Update user data
  const updateUser = (updates) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...updates,
      roleLevel:
        ROLE_LEVELS[
          updates.roleId || updates.role || user.roleId || user.role
        ] || user.roleLevel,
      permissions: calculatePermissions(
        updates.roleId || updates.role || user.roleId || user.role,
        updates.department || user.department
      ),
    };

    setUser(updatedUser);
    setUserRole(updatedUser.roleId || updatedUser.role || userRole);
    if (updates.department) {
      setUserDepartment(updates.department);
    }
    setUserPermissions(updatedUser.permissions);
    localStorage.setItem("userData", JSON.stringify(updatedUser));
  };

  // Permission checking functions
  const hasPermission = (permission) => {
    if (!user) return false;
    if (
      userRole === "super_admin" ||
      userPermissions.includes(PERMISSIONS.ALL_ACCESS)
    )
      return true;
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    if (!user) return false;
    if (
      userRole === "super_admin" ||
      userPermissions.includes(PERMISSIONS.ALL_ACCESS)
    )
      return true;
    return permissions.some((permission) => hasPermission(permission));
  };

  const hasRoleLevel = (requiredLevel) => {
    if (!user) return false;
    const currentLevel = ROLE_LEVELS[userRole] || 14;
    return currentLevel <= requiredLevel;
  };

  const canManageUser = (targetUserRole) => {
    if (!user) return false;
    const currentLevel = ROLE_LEVELS[userRole] || 14;
    const targetLevel = ROLE_LEVELS[targetUserRole] || 14;
    return currentLevel < targetLevel;
  };

  const canManageRole = (targetRole) => {
    return canManageUser(targetRole);
  };

  const canAccessDepartment = (department) => {
    // Super admin and product owner can access all departments
    if (hasRoleLevel(2)) return true;
    // CXO/Directors can access all departments
    if (hasRoleLevel(4)) return true;
    // Others can only access their own department
    return userDepartment === department;
  };

  // Check if user can access specific feature
  const canAccessFeature = (feature) => {
    if (!user) return false;

    const featurePermissions = {
      employeeList: [PERMISSIONS.VIEW_EMPLOYEES, PERMISSIONS.MANAGE_EMPLOYEES],
      superAdminPanel: [PERMISSIONS.ALL_ACCESS],
      roleManagement: [PERMISSIONS.MANAGE_ROLES],
      documents: [PERMISSIONS.VIEW_DOCUMENTS, PERMISSIONS.VIEW_OWN_DOCUMENTS],
      activityTracker: [PERMISSIONS.TRACK_ACTIVITIES],
      analytics: [PERMISSIONS.VIEW_ANALYTICS],
      reports: [PERMISSIONS.VIEW_REPORTS],
      requests: [PERMISSIONS.MANAGE_REQUESTS],
      departments: [PERMISSIONS.MANAGE_DEPARTMENTS],
      permissions: [PERMISSIONS.ALL_ACCESS, PERMISSIONS.MANAGE_PERMISSIONS],
      chat: [PERMISSIONS.ACCESS_CHAT],
      workspaces: [PERMISSIONS.ACCESS_WORKSPACES],
      income: [PERMISSIONS.VIEW_FINANCIAL_DATA],
    };

    const requiredPermissions = featurePermissions[feature];
    if (!requiredPermissions) return false;

    return hasAnyPermission(requiredPermissions);
  };

  // Get user's accessible features
  const getAccessibleFeatures = () => {
    const features = [
      "employeeList",
      "superAdminPanel",
      "roleManagement",
      "documents",
      "activityTracker",
      "analytics",
      "reports",
      "requests",
      "departments",
      "permissions",
      "chat",
      "workspaces",
      "income",
    ];

    return features.filter((feature) => canAccessFeature(feature));
  };

  // Get role display name
  const getRoleDisplayName = (roleId) => {
    const roleNames = {
      super_admin: "Super Administrator",
      product_owner: "Product Owner",
      admin: "Administrator",
      cxo_director: "CXO/Director",
      senior_manager: "Senior Manager",
      manager: "Manager",
      assistant_manager: "Assistant Manager",
      senior_team_lead: "Senior Team Lead",
      team_lead: "Team Lead",
      assistant_team_lead: "Assistant Team Lead",
      senior_associate: "Senior Associate",
      associate: "Associate",
      intern: "Intern",
      viewer: "Viewer/Auditor",
    };

    return roleNames[roleId] || "Unknown Role";
  };

  // API helper with authentication
  const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...options, ...defaultOptions });

    // Handle token expiration
    if (response.status === 401) {
      logout();
      throw new Error("Session expired. Please log in again.");
    }

    return response;
  };

  // Computed properties
  const isAdmin = hasRoleLevel(3); // admin level or higher
  const isSuperAdmin = userRole === "super_admin";
  const isManager = hasRoleLevel(6); // manager level or higher
  const isTeamLead = hasRoleLevel(9); // team lead level or higher
  const userRoleDisplayName = getRoleDisplayName(userRole);

  const value = {
    // Core auth state
    user,
    userRole,
    userDepartment,
    userPermissions,
    loading,
    isAuthenticated,
    error,

    // Auth actions
    login,
    logout,
    updateUser,
    updateUserRole,
    setUser,
    setIsAdmin: (isAdmin) => {
      const newRole = isAdmin ? "admin" : "viewer";
      updateUserRole(newRole);
    },

    // Permission checking
    hasPermission,
    hasAnyPermission,
    hasRoleLevel,
    canManageUser,
    canManageRole,
    canAccessDepartment,
    canAccessFeature,
    getAccessibleFeatures,

    // Computed properties
    isAdmin,
    isSuperAdmin,
    isManager,
    isTeamLead,
    userRoleDisplayName,

    // Utility methods
    getRoleDisplayName,
    authenticatedFetch,

    // Role and permission constants
    ROLE_LEVELS,
    PERMISSIONS,
    ROLE_PERMISSIONS,
    DEPARTMENT_PERMISSIONS,

    // Utility functions
    getRoleLevel: (role) => ROLE_LEVELS[role] || 14,
    getRolePermissions: (role) => ROLE_PERMISSIONS[role] || [],
    getDepartmentPermissions: (dept) => DEPARTMENT_PERMISSIONS[dept] || [],

    // Helper functions for UI components
    getRememberedEmployeeId: () => localStorage.getItem("rememberedEmployeeId"),
    getRememberMe: () => localStorage.getItem("rememberMe") === "true",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Higher-order component for protected routes
export const withAuth = (WrappedComponent, options = {}) => {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();
    const {
      requireAuth = true,
      requiredLevel,
      requiredPermissions = [],
    } = options;

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (requireAuth && !user) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
            <div className="text-red-500 text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

// Hook for permission-based rendering
export const usePermissions = () => {
  const { hasPermission, hasAnyPermission, hasRoleLevel, canAccessFeature } =
    useAuth();

  const PermissionGate = ({
    children,
    permission,
    permissions,
    roleLevel,
    feature,
    fallback = null,
  }) => {
    let hasAccess = true;

    if (permission && !hasPermission(permission)) hasAccess = false;
    if (permissions && !hasAnyPermission(permissions)) hasAccess = false;
    if (roleLevel && !hasRoleLevel(roleLevel)) hasAccess = false;
    if (feature && !canAccessFeature(feature)) hasAccess = false;

    return hasAccess ? children : fallback;
  };

  return {
    PermissionGate,
    hasPermission,
    hasAnyPermission,
    hasRoleLevel,
    canAccessFeature,
  };
};

export default AuthContext;
