import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  Building,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Search,
  Filter,
  ChevronDown,
  Star,
  UserCheck,
  Settings,
  Eye,
  AlertTriangle,
} from "lucide-react";
// Using fetch API instead of axios

const API_BASE = "https://getmax-backend.vercel.app/api";

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

// Role permissions configuration
const PERMISSIONS = {
  all: "Full System Access",
  manage_users: "Manage Users",
  manage_roles: "Manage Roles",
  manage_permissions: "Manage Permissions",
  manage_settings: "System Settings",
  manage_team: "Team Management",
  view_team: "View Team",
  view_analytics: "View Analytics",
  view_reports: "View Reports",
  manage_attendance: "Manage Attendance",
  view_attendance: "View Attendance",
  manage_payroll: "Manage Payroll",
  view_payroll: "View Payroll",
  manage_documents: "Manage Documents",
  view_documents: "View Documents",
  view_own: "View Own Data Only",
};

// Predefined roles hierarchy
const ROLE_HIERARCHY = [
  {
    name: "Super Admin",
    level: 1,
    color: "red",
    icon: "star",
    permissions: ["all"],
  },
  {
    name: "Product Owner",
    level: 2,
    color: "purple",
    icon: "shield",
    permissions: [
      "manage_users",
      "manage_roles",
      "view_analytics",
      "view_reports",
    ],
  },
  {
    name: "Admin",
    level: 3,
    color: "blue",
    icon: "shield",
    permissions: ["manage_users", "manage_team", "view_analytics"],
  },
  {
    name: "Leadership (CXO / Director)",
    level: 4,
    color: "indigo",
    icon: "star",
    permissions: ["view_analytics", "view_reports", "manage_team"],
  },
  {
    name: "Senior Manager",
    level: 5,
    color: "green",
    icon: "users",
    permissions: ["manage_team", "view_team", "view_analytics"],
  },
  {
    name: "Manager",
    level: 6,
    color: "emerald",
    icon: "users",
    permissions: ["manage_team", "view_team"],
  },
  {
    name: "Assistant Manager",
    level: 7,
    color: "teal",
    icon: "user-check",
    permissions: ["view_team", "manage_attendance"],
  },
  {
    name: "Senior Team Lead",
    level: 8,
    color: "cyan",
    icon: "user-check",
    permissions: ["view_team", "view_attendance"],
  },
  {
    name: "Team Lead",
    level: 9,
    color: "sky",
    icon: "user-check",
    permissions: ["view_team", "view_attendance"],
  },
  {
    name: "Assistant Team Lead",
    level: 10,
    color: "blue",
    icon: "user-check",
    permissions: ["view_team"],
  },
  {
    name: "Senior Associate",
    level: 11,
    color: "violet",
    icon: "user",
    permissions: ["view_own"],
  },
  {
    name: "Associate",
    level: 12,
    color: "gray",
    icon: "user",
    permissions: ["view_own"],
  },
  {
    name: "Intern",
    level: 13,
    color: "slate",
    icon: "user",
    permissions: ["view_own"],
  },
  {
    name: "Viewer / Auditor",
    level: 14,
    color: "gray",
    icon: "eye",
    permissions: ["view_reports", "view_analytics"],
  },
];

// Predefined departments
const DEPARTMENTS = [
  "Sales",
  "Marketing",
  "Human Resources (HR)",
  "Finance",
  "Operations",
  "Information Technology (IT)",
  "Research & Development (R&D)",
  "Learning & Development (L&D)",
  "Accounts",
  "Legal",
  "Customer Support",
  "Admin & Facilities",
  "Compliance",
];

const DepartmentManagement = () => {
  const [activeTab, setActiveTab] = useState("roles");
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch data on component mount
  useEffect(() => {
    fetchRoles();
    fetchEmployees();
    initializeDepartments();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`${API_BASE}/roles`);
      setRoles(response.roles || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setError("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await apiRequest(
        `${API_BASE}/employees`,
        getAuthHeaders()
      );
      setEmployees(response?.data?.employees || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  const initializeDepartments = () => {
    setDepartments(
      DEPARTMENTS.map((dept, index) => ({
        id: dept.toLowerCase().replace(/[^a-z0-9]/g, "_"),
        name: dept,
        employeeCount: Math.floor(Math.random() * 50) + 5, // Mock data
        isActive: true,
      }))
    );
  };

  const initializeSystemRoles = async () => {
    try {
      setLoading(true);
      for (const roleData of ROLE_HIERARCHY) {
        try {
          await apiRequest(`${API_BASE}/roles`, {
            method: "POST",
            body: JSON.stringify({
              name: roleData.name,
              level: roleData.level,
              color: roleData.color,
              icon: roleData.icon,
              permissions: roleData.permissions,
              description: `${roleData.name} - System generated role`,
              isActive: true,
            }),
          });
        } catch (error) {
          // Role might already exist, continue with next
          console.log(`Role ${roleData.name} might already exist`);
        }
      }
      setSuccess("System roles initialized successfully");
      fetchRoles();
    } catch (error) {
      setError("Failed to initialize system roles");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRole = async (roleData) => {
    try {
      setLoading(true);
      if (editingRole) {
        await apiRequest(`${API_BASE}/roles/${editingRole.id}`, {
          method: "PUT",
          body: JSON.stringify(roleData),
        });
        setSuccess("Role updated successfully");
      } else {
        await apiRequest(`${API_BASE}/roles`, {
          method: "POST",
          body: JSON.stringify(roleData),
        });
        setSuccess("Role created successfully");
      }
      setShowRoleModal(false);
      setEditingRole(null);
      fetchRoles();
    } catch (error) {
      setError(error.message || "Failed to save role");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    try {
      setLoading(true);
      await apiRequest(`${API_BASE}/roles/${roleId}`, {
        method: "DELETE",
      });
      setSuccess("Role deleted successfully");
      fetchRoles();
    } catch (error) {
      setError(error.message || "Failed to delete role");
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = roles.filter((role) => {
    const matchesSearch = role.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLevel =
      filterLevel === "all" || role.level <= parseInt(filterLevel);
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Role & Department Management
              </h1>
              <p className="text-gray-600">
                Manage organizational structure and permissions
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={initializeSystemRoles}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
              >
                <Settings className="h-4 w-4 mr-2" />
                Initialize System Roles
              </button>
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
                onClick={() => setActiveTab("roles")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "roles"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Shield className="h-4 w-4 inline mr-2" />
                Roles ({roles.length})
              </button>
              <button
                onClick={() => setActiveTab("departments")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "departments"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Building className="h-4 w-4 inline mr-2" />
                Departments ({departments.length})
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "roles" && (
              <RolesTab
                roles={filteredRoles}
                onCreateRole={() => {
                  setEditingRole(null);
                  setShowRoleModal(true);
                }}
                onEditRole={(role) => {
                  setEditingRole(role);
                  setShowRoleModal(true);
                }}
                onDeleteRole={handleDeleteRole}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterLevel={filterLevel}
                setFilterLevel={setFilterLevel}
                loading={loading}
              />
            )}

            {activeTab === "departments" && (
              <DepartmentsTab
                departments={departments}
                employees={employees}
                onCreateDepartment={() => {
                  setEditingDepartment(null);
                  setShowDepartmentModal(true);
                }}
                onEditDepartment={(dept) => {
                  setEditingDepartment(dept);
                  setShowDepartmentModal(true);
                }}
              />
            )}
          </div>
        </div>

        {/* Role Modal */}
        {showRoleModal && (
          <RoleModal
            role={editingRole}
            onSave={handleSaveRole}
            onClose={() => {
              setShowRoleModal(false);
              setEditingRole(null);
            }}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

// Roles Tab Component
const RolesTab = ({
  roles,
  onCreateRole,
  onEditRole,
  onDeleteRole,
  searchTerm,
  setSearchTerm,
  filterLevel,
  setFilterLevel,
  loading,
}) => (
  <div>
    {/* Filters */}
    <div className="flex justify-between items-center mb-6">
      <div className="flex space-x-4">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Levels</option>
          <option value="5">Level 1-5 (Leadership)</option>
          <option value="10">Level 6-10 (Management)</option>
          <option value="15">Level 11+ (Associates)</option>
        </select>
      </div>
      <button
        onClick={onCreateRole}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Role
      </button>
    </div>

    {/* Roles Grid */}
    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading roles...</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            onEdit={() => onEditRole(role)}
            onDelete={() => onDeleteRole(role.id)}
          />
        ))}
      </div>
    )}
  </div>
);

// Role Card Component
const RoleCard = ({ role, onEdit, onDelete }) => {
  const getLevelColor = (level) => {
    if (level <= 3) return "bg-red-100 text-red-800";
    if (level <= 6) return "bg-blue-100 text-blue-800";
    if (level <= 10) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-lg bg-${
              role.color || "blue"
            }-100 flex items-center justify-center mr-3`}
          >
            <Shield className={`h-5 w-5 text-${role.color || "blue"}-600`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{role.name}</h3>
            <span
              className={`inline-block px-2 py-1 text-xs rounded-full ${getLevelColor(
                role.level
              )}`}
            >
              Level {role.level}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-indigo-600 rounded"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600 rounded"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3">{role.description}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Users</span>
          <span className="text-sm font-medium">{role.userCount || 0}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Permissions</span>
          <span className="text-sm font-medium">
            {role.permissions?.length || 0}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Status</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              role.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {role.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {role.permissions && role.permissions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {role.permissions.slice(0, 3).map((perm) => (
              <span
                key={perm}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {PERMISSIONS[perm] || perm}
              </span>
            ))}
            {role.permissions.length > 3 && (
              <span className="text-xs text-gray-500">
                +{role.permissions.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Departments Tab Component
const DepartmentsTab = ({
  departments,
  employees,
  onCreateDepartment,
  onEditDepartment,
}) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Company Departments
      </h3>
      <button
        onClick={onCreateDepartment}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Department
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((dept) => (
        <div
          key={dept.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <Building className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                <p className="text-sm text-gray-600">
                  {dept.employeeCount} employees
                </p>
              </div>
            </div>
            <button
              onClick={() => onEditDepartment(dept)}
              className="p-1 text-gray-400 hover:text-indigo-600 rounded"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Role Modal Component
const RoleModal = ({ role, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    name: role?.name || "",
    level: role?.level || 1,
    color: role?.color || "blue",
    icon: role?.icon || "shield",
    permissions: role?.permissions || [],
    description: role?.description || "",
    isActive: role?.isActive !== false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePermissionToggle = (permission) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {role ? "Edit Role" : "Create New Role"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level (1-20) *
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <select
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {[
                  "blue",
                  "red",
                  "green",
                  "purple",
                  "indigo",
                  "teal",
                  "gray",
                ].map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="mr-2"
                />
                Active Role
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Permissions
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {Object.entries(PERMISSIONS).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(key)}
                    onChange={() => handlePermissionToggle(key)}
                    className="mr-2"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {role ? "Update Role" : "Create Role"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement;
