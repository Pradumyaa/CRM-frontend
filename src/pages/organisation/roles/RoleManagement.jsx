import React, { useState, useEffect } from "react";
import {
  Shield,
  Users,
  Key,
  Award,
  Target,
  UserCheck,
  Activity,
  Monitor,
  UserCog,
  Briefcase,
  Book,
  Eye,
  Star,
  Zap,
  Database,
  Lock,
  Settings,
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  X,
  Save,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  UserPlus,
  Loader,
} from "lucide-react";
const API_BASE_URL = "http://localhost:3000/api";

// API Service
class RoleService {
  static getAuthToken() {
    return localStorage.getItem("token");
  }

  static getCurrentUser() {
    const userData = localStorage.getItem("userData");
    return userData
      ? JSON.parse(userData)
      : { employeeId: localStorage.getItem("employeeId") };
  }

  static async request(endpoint, options = {}) {
    const token = this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  static async getAllRoles(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/roles${queryString ? `?${queryString}` : ""}`);
  }

  static async createRole(roleData) {
    return this.request("/roles", {
      method: "POST",
      body: JSON.stringify(roleData),
    });
  }

  static async updateRole(roleId, roleData) {
    return this.request(`/roles/${roleId}`, {
      method: "PUT",
      body: JSON.stringify(roleData),
    });
  }

  static async deleteRole(roleId) {
    return this.request(`/roles/${roleId}`, {
      method: "DELETE",
    });
  }

  static async getRoleHierarchy() {
    return this.request("/roles/hierarchy");
  }

  static async assignRoleToEmployee(employeeId, roleId) {
    return this.request(`/roles/employees/${employeeId}/assign`, {
      method: "POST",
      body: JSON.stringify({ roleId }),
    });
  }

  static async getEmployeesByRole(roleId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(
      `/roles/${roleId}/employees${queryString ? `?${queryString}` : ""}`
    );
  }

  static async bulkRoleOperations(operation, roleIds, data = {}) {
    return this.request("/roles/bulk", {
      method: "POST",
      body: JSON.stringify({ operation, roleIds, data }),
    });
  }

  static async getEmployees() {
    return this.request("/employees");
  }
}

// Predefined permissions
const AVAILABLE_PERMISSIONS = [
  {
    id: "all",
    name: "All Permissions",
    description: "Complete system access (Super Admin only)",
    category: "system",
    critical: true,
  },
  {
    id: "manage_users",
    name: "Manage Users",
    description: "Create, edit, delete user accounts",
    category: "user",
  },
  {
    id: "view_users",
    name: "View Users",
    description: "View user information and profiles",
    category: "user",
  },
  {
    id: "manage_roles",
    name: "Manage Roles",
    description: "Create and modify role permissions",
    category: "system",
    critical: true,
  },
  {
    id: "manage_team",
    name: "Manage Team",
    description: "Manage team members and assignments",
    category: "team",
  },
  {
    id: "view_team",
    name: "View Team",
    description: "View team information and structure",
    category: "team",
  },
  {
    id: "view_analytics",
    name: "View Analytics",
    description: "Access to system analytics and reports",
    category: "analytics",
  },
  {
    id: "manage_attendance",
    name: "Manage Attendance",
    description: "Approve/reject attendance requests",
    category: "attendance",
  },
  {
    id: "view_attendance",
    name: "View Attendance",
    description: "View attendance records and summaries",
    category: "attendance",
  },
  {
    id: "manage_documents",
    name: "Manage Documents",
    description: "Upload, edit, delete documents",
    category: "documents",
  },
  {
    id: "view_documents",
    name: "View Documents",
    description: "View and download documents",
    category: "documents",
  },
  {
    id: "view_own",
    name: "View Own Data",
    description: "View own information and records only",
    category: "personal",
  },
  {
    id: "manage_settings",
    name: "System Settings",
    description: "Configure system settings and preferences",
    category: "system",
    critical: true,
  },
];

const COLOR_OPTIONS = [
  { name: "Blue", value: "blue", class: "bg-blue-500" },
  { name: "Green", value: "green", class: "bg-green-500" },
  { name: "Purple", value: "purple", class: "bg-purple-500" },
  { name: "Orange", value: "orange", class: "bg-orange-500" },
  { name: "Red", value: "red", class: "bg-red-500" },
  { name: "Indigo", value: "indigo", class: "bg-indigo-500" },
  { name: "Pink", value: "pink", class: "bg-pink-500" },
  { name: "Teal", value: "teal", class: "bg-teal-500" },
  { name: "Yellow", value: "yellow", class: "bg-yellow-500" },
  { name: "Gray", value: "gray", class: "bg-gray-500" },
];

// Utility functions
const validateRoleData = (roleData) => {
  const errors = {};

  if (!roleData.name?.trim()) {
    errors.name = "Role name is required";
  } else if (roleData.name.length < 2) {
    errors.name = "Role name must be at least 2 characters";
  }

  if (!roleData.level || roleData.level < 1 || roleData.level > 15) {
    errors.level = "Role level must be between 1 and 15";
  }

  if (!roleData.permissions?.length) {
    errors.permissions = "At least one permission is required";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

const groupPermissionsByCategory = (permissions) => {
  const grouped = {};
  permissions.forEach((perm) => {
    const category = perm.category || "other";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(perm);
  });
  return grouped;
};

// Components
const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader
      className={`${sizeClasses[size]} animate-spin text-blue-600 ${className}`}
    />
  );
};

const NotificationMessage = ({ type, message, onClose }) => {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: AlertCircle,
  };

  const Icon = icons[type];

  return (
    <div className={`${styles[type]} border rounded-lg p-4 mb-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">{message}</span>
        </div>
        <button onClick={onClose} className="text-current hover:opacity-75">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const RoleCard = ({
  role,
  onEdit,
  onDelete,
  onViewEmployees,
  ROLE_ICONS,
  loading = false,
}) => {
  const IconComponent = ROLE_ICONS?.[role.icon] || ROLE_ICONS?.Shield || Shield;

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full" />
            <div>
              <div className="h-4 bg-gray-300 rounded w-24 mb-2" />
              <div className="h-3 bg-gray-300 rounded w-16" />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded" />
            <div className="w-8 h-8 bg-gray-300 rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-8 bg-gray-300 rounded w-16" />
          <div className="h-4 bg-gray-300 rounded w-20" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-sm border-2 border-${role.color}-200 hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-full bg-${role.color}-100`}>
            <IconComponent className={`h-6 w-6 text-${role.color}-600`} />
          </div>
          <div>
            <h3 className={`font-semibold text-${role.color}-900`}>
              {role.name}
            </h3>
            <p className={`text-sm text-${role.color}-700`}>
              Level {role.level}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(role)}
            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            title="Edit Role"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(role)}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            title="Delete Role"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewEmployees(role)}
            className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
            title="View Employees"
          >
            <Users className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className={`text-3xl font-bold text-${role.color}-700`}>
          {role.userCount || 0}
        </span>
        <span className="text-sm text-gray-500">employees assigned</span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-xs text-gray-600 font-medium mb-2">
            Description:
          </div>
          <p className="text-sm text-gray-700 line-clamp-2">
            {role.description || "No description provided"}
          </p>
        </div>

        <div>
          <div className="text-xs text-gray-600 font-medium mb-2">
            Permissions:
          </div>
          <div className="flex flex-wrap gap-1">
            {role.permissions?.slice(0, 3).map((perm, i) => (
              <span
                key={i}
                className={`px-2 py-1 text-xs rounded-full bg-${role.color}-100 text-${role.color}-700`}
              >
                {perm.replace("_", " ")}
              </span>
            ))}
            {role.permissions?.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                +{role.permissions.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Created:{" "}
            {role.createdAt
              ? new Date(role.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
          <span
            className={`inline-flex items-center ${
              role.isActive ? "text-green-600" : "text-red-600"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-1 ${
                role.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {role.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
};

const RoleModal = ({
  role,
  isOpen,
  onClose,
  onSave,
  ROLE_ICONS,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    level: 1,
    color: "blue",
    icon: "Shield",
    permissions: [],
    description: "",
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (role) {
        setFormData({
          name: role.name || "",
          level: role.level || 1,
          color: role.color || "blue",
          icon: role.icon || "Shield",
          permissions: role.permissions || [],
          description: role.description || "",
          isActive: role.isActive !== undefined ? role.isActive : true,
        });
      } else {
        setFormData({
          name: "",
          level: 1,
          color: "blue",
          icon: "Shield",
          permissions: [],
          description: "",
          isActive: true,
        });
      }
      setFormErrors({});

      // Expand all categories by default
      const categories = [
        ...new Set(AVAILABLE_PERMISSIONS.map((p) => p.category)),
      ];
      const expanded = {};
      categories.forEach((cat) => (expanded[cat] = true));
      setExpandedCategories(expanded);
    }
  }, [isOpen, role]);

  const handleSubmit = () => {
    const { isValid, errors } = validateRoleData(formData);

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    const roleData = {
      ...formData,
      level: parseInt(formData.level),
    };

    onSave(roleData);
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const selectAllInCategory = (category, permissions) => {
    const categoryPermIds = permissions.map((p) => p.id);
    const hasAll = categoryPermIds.every((id) =>
      formData.permissions.includes(id)
    );

    if (hasAll) {
      // Remove all category permissions
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.filter(
          (p) => !categoryPermIds.includes(p)
        ),
      }));
    } else {
      // Add all category permissions
      setFormData((prev) => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...categoryPermIds])],
      }));
    }
  };

  const groupedPermissions = groupPermissionsByCategory(AVAILABLE_PERMISSIONS);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {role ? "Edit Role" : "Create New Role"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Basic Information
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter role name"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role Level *
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          level: parseInt(e.target.value),
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.level ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      {Array.from({ length: 15 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Level {i + 1}{" "}
                          {i === 0 ? "(Lowest)" : i === 14 ? "(Highest)" : ""}
                        </option>
                      ))}
                    </select>
                    {formErrors.level && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.level}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Describe the role responsibilities and scope..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isActive: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isActive"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Role is active and can be assigned
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appearance Settings */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Appearance
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Theme
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              color: color.value,
                            }))
                          }
                          className={`w-8 h-8 rounded-full ${
                            color.class
                          } hover:ring-2 hover:ring-offset-2 hover:ring-${
                            color.value
                          }-300 transition-all ${
                            formData.color === color.value
                              ? `ring-2 ring-offset-2 ring-${color.value}-400`
                              : ""
                          }`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {Object.entries(ROLE_ICONS || {}).map(
                        ([iconName, IconComponent]) => (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                icon: iconName,
                              }))
                            }
                            className={`p-2 rounded-lg border-2 hover:bg-gray-50 transition-colors ${
                              formData.icon === iconName
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                            }`}
                            title={iconName}
                          >
                            <IconComponent className="h-5 w-5 text-gray-600" />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Permissions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Permissions *
                </h4>
                <span className="text-sm text-gray-500">
                  {formData.permissions.length} selected
                </span>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(groupedPermissions).map(
                  ([category, permissions]) => (
                    <div
                      key={category}
                      className="border border-gray-200 rounded-lg"
                    >
                      <button
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            {expandedCategories[category] ? (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900 capitalize">
                            {category} Permissions
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {
                              permissions.filter((p) =>
                                formData.permissions.includes(p.id)
                              ).length
                            }
                            /{permissions.length}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectAllInCategory(category, permissions);
                            }}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            Toggle All
                          </button>
                        </div>
                      </button>

                      {expandedCategories[category] && (
                        <div className="px-4 pb-3 space-y-2">
                          {permissions.map((permission) => (
                            <label
                              key={permission.id}
                              className={`flex items-start space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer ${
                                permission.critical ? "bg-yellow-50" : ""
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.permissions.includes(
                                  permission.id
                                )}
                                onChange={() =>
                                  handlePermissionToggle(permission.id)
                                }
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-sm text-gray-900">
                                    {permission.name}
                                  </span>
                                  {permission.critical && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      Critical
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {permission.description}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>

              {formErrors.permissions && (
                <p className="text-red-500 text-sm mt-2">
                  {formErrors.permissions}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {role ? "Update Role" : "Create Role"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeesModal = ({ role, isOpen, onClose, loading = false }) => {
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    if (isOpen && role) {
      loadEmployees();
      loadAllEmployees();
    }
  }, [isOpen, role]);

  const loadEmployees = async () => {
    try {
      setEmployeesLoading(true);
      const response = await RoleService.getEmployeesByRole(role.id);
      if (response.success) {
        setEmployees(response.employees || []);
      }
    } catch (error) {
      console.error("Failed to load employees:", error);
    } finally {
      setEmployeesLoading(false);
    }
  };

  const loadAllEmployees = async () => {
    try {
      const response = await RoleService.getEmployees();
      setAllEmployees(response.employees || []);
    } catch (error) {
      console.error("Failed to load all employees:", error);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedEmployee) return;

    try {
      setAssignLoading(true);
      await RoleService.assignRoleToEmployee(selectedEmployee, role.id);
      setSelectedEmployee("");
      loadEmployees();
    } catch (error) {
      console.error("Failed to assign role:", error);
    } finally {
      setAssignLoading(false);
    }
  };

  const unassignedEmployees = allEmployees.filter(
    (emp) =>
      !employees.some(
        (assignedEmp) => assignedEmp.employeeId === emp.employeeId
      )
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Employees with {role?.name} Role
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Assign New Employee */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Assign Role to Employee
            </h4>
            <div className="flex items-center space-x-3">
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select an employee...</option>
                {unassignedEmployees.map((emp) => (
                  <option key={emp.employeeId} value={emp.employeeId}>
                    {emp.name} ({emp.employeeId}) - {emp.jobTitle}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssignRole}
                disabled={!selectedEmployee || assignLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {assignLoading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                Assign Role
              </button>
            </div>
          </div>

          {/* Current Employees */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Current Employees ({employees.length})
            </h4>

            {employeesLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No employees assigned to this role yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {employees.map((employee) => (
                  <div
                    key={employee.employeeId}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {employee.name?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.jobTitle} • {employee.employeeId}
                        </div>
                        {employee.email && (
                          <div className="text-sm text-gray-400">
                            {employee.email}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const RoleManagement = () => {
  // Define icons inside component to ensure proper scope
  const ROLE_ICONS = {
    Shield,
    Users,
    Key,
    Award,
    Target,
    UserCheck,
    Activity,
    Monitor,
    UserCog,
    Briefcase,
    Book,
    Eye,
    Star,
    Zap,
    Database,
    Lock,
    Settings,
  };

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [showEmployeesModal, setShowEmployeesModal] = useState(false);
  const [selectedRoleForEmployees, setSelectedRoleForEmployees] =
    useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [viewMode, setViewMode] = useState("cards"); // cards or hierarchy

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        sortBy: "level",
        sortOrder: "asc",
      };

      if (statusFilter !== "all") {
        params.isActive = statusFilter === "active";
      }

      const response = await RoleService.getAllRoles(params);

      if (response.success) {
        setRoles(response.roles || []);
      }
    } catch (err) {
      setError(`Failed to load roles: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (roleData) => {
    try {
      setActionLoading(true);
      const response = await RoleService.createRole(roleData);

      if (response.success) {
        setRoles((prev) => [...prev, response.role]);
        setShowCreateModal(false);
        setSuccess("Role created successfully!");
      }
    } catch (err) {
      setError(`Failed to create role: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateRole = async (roleData) => {
    try {
      setActionLoading(true);
      const response = await RoleService.updateRole(editingRole.id, roleData);

      if (response.success) {
        setRoles((prev) =>
          prev.map((role) =>
            role.id === editingRole.id ? { ...role, ...response.role } : role
          )
        );
        setEditingRole(null);
        setSuccess("Role updated successfully!");
      }
    } catch (err) {
      setError(`Failed to update role: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRole = async (role) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the "${role.name}" role? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      await RoleService.deleteRole(role.id);

      setRoles((prev) => prev.filter((r) => r.id !== role.id));
      setSuccess("Role deleted successfully!");
    } catch (err) {
      setError(`Failed to delete role: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRoles.length === 0) {
      setError("Please select roles to perform bulk action");
      return;
    }

    try {
      setActionLoading(true);
      await RoleService.bulkRoleOperations(action, selectedRoles);

      setSelectedRoles([]);
      setSuccess(`Bulk ${action} completed successfully!`);
      loadRoles();
    } catch (err) {
      setError(`Failed to perform bulk ${action}: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewEmployees = (role) => {
    setSelectedRoleForEmployees(role);
    setShowEmployeesModal(true);
  };

  const handleSelectRole = (roleId, checked) => {
    if (checked) {
      setSelectedRoles((prev) => [...prev, roleId]);
    } else {
      setSelectedRoles((prev) => prev.filter((id) => id !== roleId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRoles(filteredRoles.map((role) => role.id));
    } else {
      setSelectedRoles([]);
    }
  };

  // Filter roles
  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !levelFilter || role.level.toString() === levelFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && role.isActive) ||
      (statusFilter === "inactive" && !role.isActive);

    return matchesSearch && matchesLevel && matchesStatus;
  });

  useEffect(() => {
    loadRoles();
  }, [statusFilter]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Shield className="h-8 w-8 text-blue-600 mr-3" />
                Role Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage organizational roles, permissions, and access control
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === "cards"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode("hierarchy")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === "hierarchy"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Hierarchy
                </button>
              </div>

              <button
                onClick={loadRoles}
                disabled={loading}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                disabled={actionLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Notifications */}
        {error && (
          <NotificationMessage
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {success && (
          <NotificationMessage
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
          />
        )}

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Levels</option>
                {Array.from({ length: 15 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Level {i + 1}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {filteredRoles.length} of {roles.length} roles
              </div>

              {selectedRoles.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedRoles.length} selected
                  </span>
                  <button
                    onClick={() => handleBulkAction("activate")}
                    className="px-3 py-1 text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction("deactivate")}
                    className="px-3 py-1 text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    Deactivate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Selection */}
        {viewMode === "cards" && filteredRoles.length > 0 && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedRoles.length === filteredRoles.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Select all visible roles
              </label>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <RoleCard key={i} loading={true} />
            ))}
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No roles found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || levelFilter || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first organizational role"}
            </p>
            {!searchTerm && !levelFilter && statusFilter === "all" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create First Role
              </button>
            )}
          </div>
        ) : viewMode === "cards" ? (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoles.map((role) => (
              <div key={role.id} className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.id)}
                    onChange={(e) =>
                      handleSelectRole(role.id, e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <RoleCard
                  role={role}
                  onEdit={setEditingRole}
                  onDelete={handleDeleteRole}
                  onViewEmployees={handleViewEmployees}
                  ROLE_ICONS={ROLE_ICONS}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Hierarchy View */
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Role Hierarchy
            </h3>
            <div className="space-y-2">
              {filteredRoles
                .sort((a, b) => a.level - b.level)
                .map((role) => {
                  const IconComponent =
                    ROLE_ICONS?.[role.icon] || ROLE_ICONS?.Shield || Shield;
                  return (
                    <div
                      key={role.id}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                      style={{ marginLeft: `${role.level * 20}px` }}
                    >
                      <div className="flex items-center space-x-4">
                        <IconComponent
                          className={`h-5 w-5 text-${role.color}-600`}
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {role.name}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs rounded-full bg-${role.color}-100 text-${role.color}-800`}
                            >
                              Level {role.level}
                            </span>
                            <span
                              className={`inline-flex items-center ${
                                role.isActive
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full mr-1 ${
                                  role.isActive ? "bg-green-500" : "bg-red-500"
                                }`}
                              />
                              {role.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {role.userCount || 0} employees •{" "}
                            {role.permissions?.length || 0} permissions
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewEmployees(role)}
                          className="p-1 text-gray-400 hover:text-purple-600 rounded"
                          title="View Employees"
                        >
                          <Users className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingRole(role)}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded"
                          title="Edit Role"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                          title="Delete Role"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <RoleModal
        role={editingRole}
        isOpen={showCreateModal || !!editingRole}
        onClose={() => {
          setShowCreateModal(false);
          setEditingRole(null);
        }}
        onSave={editingRole ? handleUpdateRole : handleCreateRole}
        ROLE_ICONS={ROLE_ICONS}
        loading={actionLoading}
      />

      <EmployeesModal
        role={selectedRoleForEmployees}
        isOpen={showEmployeesModal}
        onClose={() => {
          setShowEmployeesModal(false);
          setSelectedRoleForEmployees(null);
        }}
        loading={actionLoading}
      />
    </div>
  );
};

export default RoleManagement;
