import React, { useState, useEffect } from "react";
import {
  Key,
  Shield,
  Users,
  Settings,
  Search,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Eye,
  Lock,
  Unlock,
  Crown,
  UserCheck,
} from "lucide-react";

const API_BASE = "http://localhost:3000/api";

// API helper functions
const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
};

// All available permissions in the system
const SYSTEM_PERMISSIONS = {
  // System Administration
  all: {
    label: "Full System Access",
    description: "Complete access to all system features and data",
    category: "System",
    level: "critical",
    icon: Crown,
  },
  manage_permissions: {
    label: "Manage Permissions",
    description: "Create, modify, and delete permission sets",
    category: "System",
    level: "critical",
    icon: Key,
  },
  manage_settings: {
    label: "System Settings",
    description: "Configure system-wide settings and preferences",
    category: "System",
    level: "high",
    icon: Settings,
  },

  // User Management
  manage_users: {
    label: "Manage Users",
    description: "Create, edit, and delete user accounts",
    category: "Users",
    level: "high",
    icon: Users,
  },
  manage_roles: {
    label: "Manage Roles",
    description: "Create and modify user roles and hierarchies",
    category: "Users",
    level: "high",
    icon: Shield,
  },
  view_users: {
    label: "View Users",
    description: "View user profiles and basic information",
    category: "Users",
    level: "medium",
    icon: Eye,
  },

  // Team Management
  manage_team: {
    label: "Team Management",
    description: "Manage team assignments and structures",
    category: "Team",
    level: "medium",
    icon: UserCheck,
  },
  view_team: {
    label: "View Team",
    description: "View team information and member details",
    category: "Team",
    level: "low",
    icon: Users,
  },

  // Analytics & Reports
  view_analytics: {
    label: "View Analytics",
    description: "Access system analytics and dashboards",
    category: "Analytics",
    level: "medium",
    icon: Eye,
  },
  view_reports: {
    label: "View Reports",
    description: "Generate and view system reports",
    category: "Analytics",
    level: "medium",
    icon: Eye,
  },

  // Attendance Management
  manage_attendance: {
    label: "Manage Attendance",
    description: "Modify attendance records and policies",
    category: "Attendance",
    level: "medium",
    icon: UserCheck,
  },
  view_attendance: {
    label: "View Attendance",
    description: "View attendance records and summaries",
    category: "Attendance",
    level: "low",
    icon: Eye,
  },

  // Payroll Management
  manage_payroll: {
    label: "Manage Payroll",
    description: "Process payroll and manage compensation",
    category: "Payroll",
    level: "high",
    icon: Settings,
  },
  view_payroll: {
    label: "View Payroll",
    description: "View payroll information and reports",
    category: "Payroll",
    level: "medium",
    icon: Eye,
  },

  // Document Management
  manage_documents: {
    label: "Manage Documents",
    description: "Upload, edit, and delete documents",
    category: "Documents",
    level: "medium",
    icon: Settings,
  },
  view_documents: {
    label: "View Documents",
    description: "Access and download documents",
    category: "Documents",
    level: "low",
    icon: Eye,
  },

  // Personal Access
  view_own: {
    label: "View Own Data",
    description: "Access only personal data and information",
    category: "Personal",
    level: "low",
    icon: Eye,
  },
};

// Permission Matrix Tab Component
const PermissionMatrix = ({
  permissions,
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const getPermissionsByCategory = () => {
    const categorized = {};
    Object.entries(permissions).forEach(([key, permission]) => {
      const category = permission.category;
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push({ key, ...permission });
    });
    return categorized;
  };

  const permissionsByCategory = getPermissionsByCategory();
  const displayCategories =
    selectedCategory === "all"
      ? Object.keys(permissionsByCategory)
      : [selectedCategory];

  const getLevelColor = (level) => {
    switch (level) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div>
      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedCategory === "all"
                ? "bg-purple-100 text-purple-800 border border-purple-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedCategory === category
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="space-y-6">
        {displayCategories.map((category) => (
          <div
            key={category}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {category} Permissions
              </h3>
              <p className="text-sm text-gray-600">
                {permissionsByCategory[category]?.length || 0} permissions in
                this category
              </p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(permissionsByCategory[category] || []).map((permission) => {
                  const IconComponent = permission.icon;
                  return (
                    <div
                      key={permission.key}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <IconComponent className="h-5 w-5 text-purple-600 mr-3" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {permission.label}
                            </h4>
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full border ${getLevelColor(
                                permission.level
                              )}`}
                            >
                              {permission.level}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {permission.description}
                      </p>
                      <div className="mt-3 text-xs text-gray-500">
                        Permission Key:{" "}
                        <code className="bg-gray-100 px-1 rounded">
                          {permission.key}
                        </code>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Role Permissions Tab Component
const RolePermissions = ({
  roles,
  permissions,
  searchTerm,
  setSearchTerm,
  onUpdatePermissions,
  loading,
}) => {
  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Roles List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading roles...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Shield
                    className={`h-6 w-6 text-${role.color || "blue"}-600 mr-3`}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {role.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Level {role.level} • {role.userCount || 0} users
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onUpdatePermissions(role)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Permissions
                </button>
              </div>

              {/* Current Permissions */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Current Permissions:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {(role.permissions || []).map((permKey) => {
                    const permission = permissions[permKey];
                    return permission ? (
                      <div
                        key={permKey}
                        className="flex items-center p-2 bg-green-50 border border-green-200 rounded"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm text-green-800">
                          {permission.label}
                        </span>
                      </div>
                    ) : (
                      <div
                        key={permKey}
                        className="flex items-center p-2 bg-gray-50 border border-gray-200 rounded"
                      >
                        <AlertTriangle className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">{permKey}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Access Audit Tab Component
const AccessAudit = ({ employees, roles, permissions }) => {
  const [auditData, setAuditData] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState("all");

  useEffect(() => {
    generateAuditData();
  }, [employees, roles, selectedPermission]);

  const generateAuditData = () => {
    const audit = employees.map((employee) => {
      const role = roles.find((r) => r.id === employee.roleId);
      const employeePermissions = employee.permissions || [];

      return {
        employeeId: employee.employeeId,
        name: employee.name,
        role: role?.name || "No Role",
        department: employee.department,
        permissions: employeePermissions,
        isAdmin: employee.isAdmin,
        status: employee.status,
      };
    });

    if (selectedPermission !== "all") {
      setAuditData(
        audit.filter((emp) => emp.permissions.includes(selectedPermission))
      );
    } else {
      setAuditData(audit);
    }
  };

  const getPermissionStats = () => {
    const stats = {};
    Object.keys(permissions).forEach((key) => {
      stats[key] = employees.filter((emp) =>
        emp.permissions?.includes(key)
      ).length;
    });
    return stats;
  };

  const permissionStats = getPermissionStats();

  return (
    <div>
      {/* Permission Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Permission:
        </label>
        <select
          value={selectedPermission}
          onChange={(e) => setSelectedPermission(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Employees</option>
          {Object.entries(permissions).map(([key, permission]) => (
            <option key={key} value={key}>
              {permission.label} ({permissionStats[key] || 0} users)
            </option>
          ))}
        </select>
      </div>

      {/* Audit Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditData.map((employee) => (
                <tr key={employee.employeeId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.employeeId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {employee.isAdmin && (
                        <Crown className="h-4 w-4 text-yellow-500 mr-1" />
                      )}
                      <span className="text-sm text-gray-900">
                        {employee.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {employee.permissions.slice(0, 3).map((permKey) => {
                        const permission = permissions[permKey];
                        return permission ? (
                          <span
                            key={permKey}
                            className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded"
                          >
                            {permission.label}
                          </span>
                        ) : null;
                      })}
                      {employee.permissions.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{employee.permissions.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : employee.status === "Inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {auditData.length === 0 && (
        <div className="text-center py-8">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No employees found with the selected permission.
          </p>
        </div>
      )}
    </div>
  );
};

// Permission Assignment Modal Component
const PermissionAssignModal = ({
  role,
  permissions,
  onSave,
  onClose,
  loading,
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState(
    role?.permissions || []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handlePermissionToggle = (permissionKey) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permissionKey)) {
        return prev.filter((p) => p !== permissionKey);
      } else {
        // If selecting 'all', remove other permissions
        if (permissionKey === "all") {
          return ["all"];
        }
        // If selecting other permissions while 'all' is selected, remove 'all'
        const newPerms = prev.filter((p) => p !== "all");
        return [...newPerms, permissionKey];
      }
    });
  };

  const handleSelectAll = () => {
    const allPermissionKeys = Object.keys(permissions);
    setSelectedPermissions(allPermissionKeys);
  };

  const handleClearAll = () => {
    setSelectedPermissions([]);
  };

  const handleSave = () => {
    if (selectedPermissions.length === 0) {
      alert("Please select at least one permission");
      return;
    }
    onSave(role?.id, selectedPermissions);
  };

  const filteredPermissions = Object.entries(permissions).filter(
    ([key, permission]) => {
      const matchesSearch =
        permission.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || permission.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }
  );

  const categories = [
    ...new Set(Object.values(permissions).map((p) => p.category)),
  ];

  const getPermissionStats = () => {
    const total = Object.keys(permissions).length;
    const selected = selectedPermissions.length;
    const critical = selectedPermissions.filter(
      (key) => permissions[key]?.level === "critical"
    ).length;
    const high = selectedPermissions.filter(
      (key) => permissions[key]?.level === "high"
    ).length;
    return { total, selected, critical, high };
  };

  const stats = getPermissionStats();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-purple-600 p-4 flex justify-between items-center">
          <div>
            <h3 className="text-white text-lg font-semibold">
              Edit Permissions: {role?.name}
            </h3>
            <p className="text-purple-100 text-sm">
              Level {role?.level} • {stats.selected} of {stats.total}{" "}
              permissions selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="bg-purple-50 border-b border-purple-200 p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-900">
                {stats.selected}
              </div>
              <div className="text-sm text-purple-600">Selected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-900">
                {stats.critical}
              </div>
              <div className="text-sm text-red-600">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-900">
                {stats.high}
              </div>
              <div className="text-sm text-orange-600">High Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk Actions */}
            <div className="flex space-x-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-sm"
              >
                Select All
              </button>
              <button
                onClick={handleClearAll}
                className="px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Permission List */}
        <div className="p-4 overflow-y-auto max-h-96">
          {selectedPermissions.includes("all") && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <Crown className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <h4 className="font-medium text-red-900">
                    Super Admin Access Enabled
                  </h4>
                  <p className="text-sm text-red-700">
                    This role has complete system access. All other permissions
                    are automatically included.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredPermissions.map(([key, permission]) => {
              const IconComponent = permission.icon;
              const isSelected = selectedPermissions.includes(key);
              const isDisabled =
                selectedPermissions.includes("all") && key !== "all";

              const getLevelColor = (level) => {
                switch (level) {
                  case "critical":
                    return "border-red-300 bg-red-50";
                  case "high":
                    return "border-orange-300 bg-orange-50";
                  case "medium":
                    return "border-yellow-300 bg-yellow-50";
                  case "low":
                    return "border-green-300 bg-green-50";
                  default:
                    return "border-gray-300 bg-gray-50";
                }
              };

              const getSelectedColor = () => {
                switch (permission.level) {
                  case "critical":
                    return "border-red-500 bg-red-100";
                  case "high":
                    return "border-orange-500 bg-orange-100";
                  case "medium":
                    return "border-yellow-500 bg-yellow-100";
                  case "low":
                    return "border-green-500 bg-green-100";
                  default:
                    return "border-purple-500 bg-purple-100";
                }
              };

              return (
                <label
                  key={key}
                  className={`relative flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? getSelectedColor()
                      : getLevelColor(permission.level)
                  } ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-md"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => !isDisabled && handlePermissionToggle(key)}
                    disabled={isDisabled}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <IconComponent className="h-4 w-4 mr-2 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        {permission.label}
                      </span>
                      {key === "all" && (
                        <Crown className="h-4 w-4 ml-2 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {permission.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {permission.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          permission.level === "critical"
                            ? "bg-red-100 text-red-800"
                            : permission.level === "high"
                            ? "bg-orange-100 text-orange-800"
                            : permission.level === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {permission.level}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-green-600" />
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {selectedPermissions.length > 0 ? (
                <span>
                  {selectedPermissions.length} permission
                  {selectedPermissions.length !== 1 ? "s" : ""} selected
                  {stats.critical > 0 && (
                    <span className="ml-2 text-red-600 font-medium">
                      ({stats.critical} critical)
                    </span>
                  )}
                </span>
              ) : (
                "No permissions selected"
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading || selectedPermissions.length === 0}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main PermissionsCenter Component
const PermissionsCenter = () => {
  const [activeTab, setActiveTab] = useState("permissions");
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchRoles(), fetchEmployees()]);
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await apiRequest(`${API_BASE}/roles`);
      setRoles(response.roles || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await apiRequest(`${API_BASE}/employees`);
      setEmployees(response.employees || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleBulkPermissionUpdate = async (roleId, newPermissions) => {
    try {
      setLoading(true);
      await apiRequest(`${API_BASE}/roles/${roleId}`, {
        method: "PUT",
        body: JSON.stringify({ permissions: newPermissions }),
      });

      setSuccess("Permissions updated successfully");
      setShowAssignModal(false);
      setSelectedRole(null);
      fetchRoles();
    } catch (error) {
      setError(error.message || "Failed to update permissions");
    } finally {
      setLoading(false);
    }
  };

  const getPermissionsByCategory = () => {
    const categories = {};
    Object.entries(SYSTEM_PERMISSIONS).forEach(([key, permission]) => {
      const category = permission.category;
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({ key, ...permission });
    });
    return categories;
  };

  const filteredRoles = roles.filter((role) => {
    const matchesSearch = role.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      role.permissions?.some(
        (perm) => SYSTEM_PERMISSIONS[perm]?.category === selectedCategory
      );
    return matchesSearch && matchesCategory;
  });

  const categories = Object.keys(getPermissionsByCategory());

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Key className="h-7 w-7 text-purple-500 mr-3" />
                Permissions Center
              </h1>
              <p className="text-gray-600">
                Configure system permissions and access control settings
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                Total Roles: {roles.length}
              </span>
              <span className="text-sm text-gray-500">
                Total Employees: {employees.length}
              </span>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
            {success}
            <button onClick={() => setSuccess("")} className="float-right">
              ×
            </button>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            {error}
            <button onClick={() => setError("")} className="float-right">
              ×
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("permissions")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "permissions"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Key className="h-4 w-4 inline mr-2" />
                Permission Matrix
              </button>
              <button
                onClick={() => setActiveTab("roles")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "roles"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Shield className="h-4 w-4 inline mr-2" />
                Role Permissions
              </button>
              <button
                onClick={() => setActiveTab("audit")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "audit"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Eye className="h-4 w-4 inline mr-2" />
                Access Audit
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "permissions" && (
              <PermissionMatrix
                permissions={SYSTEM_PERMISSIONS}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            )}

            {activeTab === "roles" && (
              <RolePermissions
                roles={filteredRoles}
                permissions={SYSTEM_PERMISSIONS}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onUpdatePermissions={(role) => {
                  setSelectedRole(role);
                  setShowAssignModal(true);
                }}
                loading={loading}
              />
            )}

            {activeTab === "audit" && (
              <AccessAudit
                employees={employees}
                roles={roles}
                permissions={SYSTEM_PERMISSIONS}
              />
            )}
          </div>
        </div>

        {/* Permission Assignment Modal */}
        {showAssignModal && selectedRole && (
          <PermissionAssignModal
            role={selectedRole}
            permissions={SYSTEM_PERMISSIONS}
            onSave={handleBulkPermissionUpdate}
            onClose={() => {
              setShowAssignModal(false);
              setSelectedRole(null);
            }}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default PermissionsCenter;
