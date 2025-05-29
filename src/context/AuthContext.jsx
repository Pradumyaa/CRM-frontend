// src/context/AuthContext.jsx - Integrated Auth Context with Role-Based Permissions
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

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

  // Role hierarchy for permission checking
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

  // Permission definitions based on roles
  const ROLE_PERMISSIONS = {
    super_admin: [
      "all_access",
      "manage_users",
      "manage_roles",
      "manage_departments",
      "manage_permissions",
      "view_analytics",
      "manage_system",
      "delete_users",
      "view_all_data",
    ],
    product_owner: [
      "manage_users",
      "view_analytics",
      "manage_roles",
      "view_reports",
      "manage_departments",
      "view_all_data",
    ],
    admin: [
      "manage_users",
      "view_analytics",
      "manage_attendance",
      "view_reports",
      "manage_documents",
      "view_department_data",
    ],
    cxo_director: [
      "view_analytics",
      "view_reports",
      "view_users",
      "manage_departments",
      "view_all_analytics",
      "strategic_decisions",
    ],
    senior_manager: [
      "view_analytics",
      "manage_team",
      "view_reports",
      "manage_department",
      "approve_requests",
    ],
    manager: [
      "manage_team",
      "view_team_analytics",
      "approve_team_requests",
      "view_team_reports",
    ],
    assistant_manager: [
      "view_team",
      "basic_reports",
      "view_team_analytics",
      "assist_management",
    ],
    senior_team_lead: [
      "view_team",
      "basic_reports",
      "lead_team",
      "track_activities",
    ],
    team_lead: ["view_team", "basic_reports", "lead_small_team"],
    assistant_team_lead: ["view_team", "assist_lead"],
    senior_associate: ["view_own_data", "advanced_tasks"],
    associate: ["view_own_data", "basic_tasks"],
    intern: ["view_own_data", "learning_access"],
    viewer: ["read_only", "view_own_data"],
  };

  // Department permissions mapping
  const DEPARTMENT_PERMISSIONS = {
    sales: ["view_sales_data", "manage_leads", "sales_reports"],
    marketing: [
      "view_marketing_data",
      "manage_campaigns",
      "marketing_analytics",
    ],
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
    accounts: [
      "view_accounts_data",
      "manage_transactions",
      "accounting_reports",
    ],
    legal: ["view_legal_data", "manage_contracts", "legal_reports"],
    support: ["view_support_data", "manage_tickets", "support_reports"],
    admin_facilities: ["view_admin_data", "manage_facilities", "admin_reports"],
    compliance: ["view_compliance_data", "manage_audits", "compliance_reports"],
  };

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

      if (token && employeeId) {
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
        let currentRole = roleData || parsedUser.role;
        if (!currentRole) {
          currentRole = parsedUser.isAdmin || isAdminData ? "admin" : "viewer";
        }

        const currentDepartment = departmentData || parsedUser.department;

        setUser(parsedUser);
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
      const response = await fetch(
        "https://getmax-backend.vercel.app/api/auth/verify",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Token verification failed");
      }

      const data = await response.json();

      // Update user data if token is valid but data has changed
      if (data.user || data.employee) {
        updateUserData(data.user || data.employee);
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      // Don't logout on verification failure - API might not be available
      // logout();
    }
  };

  const calculatePermissions = (role, department) => {
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    const departmentPermissions = department
      ? DEPARTMENT_PERMISSIONS[department] || []
      : [];

    return [...new Set([...rolePermissions, ...departmentPermissions])];
  };

  const login = async (employeeId, password, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://getmax-backend.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeId, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      const employee = data.employee;

      // Force super_admin role for all successful logins
      let userRole = "super_admin";

      // Store auth data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("employeeId", employee.employeeId);
      localStorage.setItem("userName", employee.name || "User");
      localStorage.setItem(
        "userData",
        JSON.stringify({ ...employee, role: userRole })
      );
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("isAdmin", true); // Super admin is always admin

      if (employee.department) {
        localStorage.setItem("userDepartment", employee.department);
      }

      // Store remember me preference
      localStorage.setItem("rememberMe", rememberMe);
      if (rememberMe) {
        localStorage.setItem("rememberedEmployeeId", employee.employeeId);
      }

      // Update state
      const updatedEmployee = { ...employee, role: userRole, isAdmin: true };
      setUser(updatedEmployee);
      setUserRole(userRole);
      setUserDepartment(employee.department);
      setUserPermissions(calculatePermissions(userRole, employee.department));
      setIsAuthenticated(true);

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

    // Redirect to login
    navigate("/login");
  };

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
      ...(newDepartment !== null && { department: newDepartment }),
    };
    setUser(updatedUser);
    localStorage.setItem("userData", JSON.stringify(updatedUser));
  };

  const updateUserData = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("userData", JSON.stringify(newUserData));

    if (newUserData.role && newUserData.role !== userRole) {
      updateUserRole(newUserData.role, newUserData.department);
    }
  };

  // Permission checking functions
  const hasPermission = (permission) => {
    if (userRole === "super_admin") return true;
    return (
      userPermissions.includes(permission) ||
      userPermissions.includes("all_access")
    );
  };

  const hasAnyPermission = (permissions) => {
    if (userRole === "super_admin") return true;
    return permissions.some((permission) => hasPermission(permission));
  };

  const hasRoleLevel = (requiredLevel) => {
    const currentLevel = ROLE_LEVELS[userRole] || 14;
    return currentLevel <= requiredLevel;
  };

  const canManageRole = (targetRole) => {
    const currentLevel = ROLE_LEVELS[userRole] || 14;
    const targetLevel = ROLE_LEVELS[targetRole] || 14;

    // Can only manage roles at same level or below
    return currentLevel < targetLevel;
  };

  const canAccessDepartment = (department) => {
    // Super admin and product owner can access all departments
    if (hasRoleLevel(2)) return true;

    // CXO/Directors can access all departments
    if (hasRoleLevel(4)) return true;

    // Others can only access their own department
    return userDepartment === department;
  };

  // Computed properties for backward compatibility
  const isAdmin = hasRoleLevel(3); // admin level or higher
  const isSuperAdmin = userRole === "super_admin";
  const isManager = hasRoleLevel(6); // manager level or higher
  const isTeamLead = hasRoleLevel(9); // team lead level or higher

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
    updateUserRole,
    updateUserData,
    setUser,
    setIsAdmin: (isAdmin) => {
      const newRole = isAdmin ? "admin" : "viewer";
      updateUserRole(newRole);
    },

    // Permission checking
    hasPermission,
    hasAnyPermission,
    hasRoleLevel,
    canManageRole,
    canAccessDepartment,

    // Computed properties
    isAdmin,
    isSuperAdmin,
    isManager,
    isTeamLead,

    // Role and permission data
    ROLE_LEVELS,
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

export default AuthContext;
