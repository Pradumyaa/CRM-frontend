import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Briefcase,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  Shield,
  Building,
  Key,
  Users,
  CheckCircle,
} from "lucide-react";

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

// Permission labels for display
const PERMISSION_LABELS = {
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

const AddEmployeeModal = ({
  isOpen,
  onClose,
  employeeData = {},
  setEmployeeData,
  onSave,
  isEditing,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPermissions, setShowPermissions] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Fetch roles on component mount
  useEffect(() => {
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  // Initialize employee data when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmployeeData((prevData) => {
        const safeData = prevData || {};
        return {
          ...safeData,
          status: safeData.status || "Active",
          department: safeData.department || "",
          roleId: safeData.roleId || "",
          roleName: safeData.roleName || "",
          permissions: safeData.permissions || [],
          address: safeData.address || {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
        };
      });
      setErrors({});
    }
  }, [isOpen, setEmployeeData]);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await apiRequest(`${API_BASE}/roles`);
      const activeRoles = (response.roles || []).filter(
        (role) => role.isActive
      );
      setRoles(activeRoles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...(prevData || {}),
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...(prevData || {}),
      address: {
        ...(prevData?.address || {}),
        [name]: value,
      },
    }));

    if (errors[`address.${name}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`address.${name}`];
        return newErrors;
      });
    }
  };

  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    const role = roles.find((r) => r.id === roleId);

    setSelectedRole(role);
    setEmployeeData((prevData) => ({
      ...(prevData || {}),
      roleId: roleId,
      roleName: role?.name || "",
      roleLevel: role?.level || 0,
      permissions: role?.permissions || [],
    }));

    if (errors.roleId) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.roleId;
        return newErrors;
      });
    }
  };

  // Generate employee ID
  const generateEmployeeId = () => {
    const timestamp = new Date().getTime().toString().slice(-4);
    const department =
      employeeData.department?.split(" ")[0]?.toUpperCase()?.slice(0, 3) ||
      "EMP";
    return `${department}${timestamp}`;
  };

  // Generate password
  const generatePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "@#$%^&*";

    const allChars = lowercase + uppercase + numbers + symbols;
    let password = "";

    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = 0; i < 4; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  const validateEmployeeData = () => {
    const newErrors = {};

    // Required fields
    const requiredFields = [
      { key: "name", label: "Full Name" },
      { key: "jobTitle", label: "Job Title" },
      { key: "department", label: "Department" },
      { key: "roleId", label: "Role" },
      { key: "salary", label: "Salary" },
      { key: "phoneNumber", label: "Phone Number" },
      { key: "email", label: "Email" },
      { key: "status", label: "Status" },
    ];

    requiredFields.forEach((field) => {
      if (
        !employeeData[field.key] ||
        String(employeeData[field.key]).trim() === ""
      ) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });

    // Address required fields
    const addressFields = [
      { key: "street", label: "Street" },
      { key: "city", label: "City" },
      { key: "state", label: "State" },
      { key: "zipCode", label: "Zip Code" },
      { key: "country", label: "Country" },
    ];

    addressFields.forEach((field) => {
      if (
        !employeeData.address ||
        !employeeData.address[field.key] ||
        String(employeeData.address[field.key]).trim() === ""
      ) {
        newErrors[`address.${field.key}`] = `${field.label} is required`;
      }
    });

    // Email validation
    if (
      employeeData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (
      employeeData.phoneNumber &&
      !/^\+?[\d\s-]{10,}$/.test(employeeData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // Salary validation
    if (
      employeeData.salary &&
      (isNaN(Number(employeeData.salary)) || Number(employeeData.salary) <= 0)
    ) {
      newErrors.salary = "Salary must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatEmployeeData = (data) => {
    const credentials = !isEditing
      ? {
          employeeId: generateEmployeeId(),
          password: generatePassword(),
        }
      : {};

    return {
      ...data,
      ...credentials,
      salary: Number(data.salary),
      status: data.status || "Active",
      joiningDate: data.joiningDate || new Date().toISOString().split("T")[0],
      isAdmin: data.roleLevel <= 3, // Auto-set admin status based on role level
    };
  };

  const handleSave = async () => {
    if (!validateEmployeeData()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const formattedData = formatEmployeeData(employeeData);

      const apiEndpoint = isEditing
        ? `${API_BASE}/employees/${employeeData.employeeId}`
        : `${API_BASE}/employees`;

      const method = isEditing ? "PUT" : "POST";

      await apiRequest(apiEndpoint, {
        method,
        body: JSON.stringify(formattedData),
      });

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving employee:", error);
      alert(error.message || "Error saving employee.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div
        className="relative bg-white rounded-xl shadow-2xl overflow-hidden max-w-5xl w-full"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="bg-indigo-600 p-4 flex justify-between items-center">
          <h2 className="text-white text-xl font-medium">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div
          className="p-6 overflow-y-auto custom-scrollbar"
          style={{ maxHeight: "calc(90vh - 130px)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
                  <User className="h-4 w-4 text-indigo-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700">
                    Basic Information
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={employeeData.name || ""}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        errors.name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50"
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Job Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      placeholder="Software Engineer"
                      value={employeeData.jobTitle || ""}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        errors.jobTitle
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50"
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.jobTitle && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />{" "}
                        {errors.jobTitle}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        placeholder="john.doe@example.com"
                        value={employeeData.email || ""}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                          errors.email
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-gray-50"
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="+1 123-456-7890"
                        value={employeeData.phoneNumber || ""}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                          errors.phoneNumber
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-gray-50"
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />{" "}
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* Salary */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salary <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="salary"
                        placeholder="50000"
                        value={employeeData.salary || ""}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                          errors.salary
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-gray-50"
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                    </div>
                    {errors.salary && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" /> {errors.salary}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
                  <MapPin className="h-4 w-4 text-indigo-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700">
                    Address Information
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      placeholder="123 Main St"
                      value={employeeData.address?.street || ""}
                      onChange={handleAddressChange}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        errors["address.street"]
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50"
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors["address.street"] && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />{" "}
                        {errors["address.street"]}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="New York"
                        value={employeeData.address?.city || ""}
                        onChange={handleAddressChange}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          errors["address.city"]
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-gray-50"
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors["address.city"] && (
                        <p className="mt-1 text-xs text-red-600 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />{" "}
                          {errors["address.city"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        placeholder="NY"
                        value={employeeData.address?.state || ""}
                        onChange={handleAddressChange}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          errors["address.state"]
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-gray-50"
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors["address.state"] && (
                        <p className="mt-1 text-xs text-red-600 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />{" "}
                          {errors["address.state"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zip Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="10001"
                        value={employeeData.address?.zipCode || ""}
                        onChange={handleAddressChange}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          errors["address.zipCode"]
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-gray-50"
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors["address.zipCode"] && (
                        <p className="mt-1 text-xs text-red-600 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />{" "}
                          {errors["address.zipCode"]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="country"
                        placeholder="USA"
                        value={employeeData.address?.country || ""}
                        onChange={handleAddressChange}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          errors["address.country"]
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-gray-50"
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors["address.country"] && (
                        <p className="mt-1 text-xs text-red-600 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />{" "}
                          {errors["address.country"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Department & Role */}
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
                  <Building className="h-4 w-4 text-indigo-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700">
                    Department & Role
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="department"
                      value={employeeData.department || ""}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg appearance-none border ${
                        errors.department
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50"
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                    >
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    {errors.department && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />{" "}
                        {errors.department}
                      </p>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role <span className="text-red-500">*</span>
                    </label>
                    {loadingRoles ? (
                      <div className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                        Loading roles...
                      </div>
                    ) : (
                      <select
                        name="roleId"
                        value={employeeData.roleId || ""}
                        onChange={handleRoleChange}
                        className={`w-full px-3 py-2 rounded-lg appearance-none border ${
                          errors.roleId
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-gray-50"
                        } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                      >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name} (Level {role.level})
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.roleId && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" /> {errors.roleId}
                      </p>
                    )}
                  </div>

                  {/* Selected Role Info */}
                  {selectedRole && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <Shield
                            className={`h-5 w-5 text-${
                              selectedRole.color || "blue"
                            }-600 mr-2`}
                          />
                          <div>
                            <h4 className="font-medium text-blue-900">
                              {selectedRole.name}
                            </h4>
                            <p className="text-sm text-blue-700">
                              Level {selectedRole.level}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowPermissions(!showPermissions)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {showPermissions ? "Hide" : "Show"} Permissions
                        </button>
                      </div>

                      {showPermissions && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <h5 className="text-sm font-medium text-blue-900 mb-2">
                            Permissions:
                          </h5>
                          <div className="grid grid-cols-1 gap-1">
                            {selectedRole.permissions?.map((permission) => (
                              <div
                                key={permission}
                                className="flex items-center text-sm text-blue-800"
                              >
                                <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                                {PERMISSION_LABELS[permission] || permission}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Employment Details */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
                  <Briefcase className="h-4 w-4 text-indigo-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700">
                    Employment Details
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={employeeData.status || ""}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-lg appearance-none border ${
                        errors.status
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50"
                      } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                    {errors.status && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" /> {errors.status}
                      </p>
                    )}
                  </div>

                  {/* Work Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Work Location
                    </label>
                    <select
                      name="location"
                      value={employeeData.location || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg appearance-none border border-gray-300 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Location</option>
                      <option value="In-Office">In-Office</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  {/* Manager */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manager
                    </label>
                    <input
                      type="text"
                      name="manager"
                      placeholder="Jane Smith"
                      value={employeeData.manager || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Joining Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Joining Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="joiningDate"
                        value={
                          employeeData.joiningDate
                            ? (() => {
                                try {
                                  const date = new Date(
                                    employeeData.joiningDate
                                  );
                                  if (isNaN(date.getTime())) {
                                    return new Date()
                                      .toISOString()
                                      .split("T")[0];
                                  }
                                  return date.toISOString().split("T")[0];
                                } catch (error) {
                                  return new Date().toISOString().split("T")[0];
                                }
                              })()
                            : new Date().toISOString().split("T")[0]
                        }
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-6">
              {/* Employee ID if editing */}
              {isEditing && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
                    <User className="h-4 w-4 text-indigo-500 mr-2" />
                    <h3 className="text-sm font-medium text-gray-700">
                      Employee ID
                    </h3>
                  </div>
                  <div className="p-4">
                    <input
                      type="text"
                      disabled
                      value={employeeData.employeeId || ""}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Employee ID cannot be changed
                    </p>
                  </div>
                </div>
              )}

              {/* Permission Summary */}
              {employeeData.permissions &&
                employeeData.permissions.length > 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
                      <Key className="h-4 w-4 text-indigo-500 mr-2" />
                      <h3 className="text-sm font-medium text-gray-700">
                        Assigned Permissions
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {employeeData.permissions.map((permission) => (
                          <div
                            key={permission}
                            className="flex items-center p-2 bg-green-50 border border-green-200 rounded-lg"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-sm text-green-800">
                              {PERMISSION_LABELS[permission] || permission}
                            </span>
                          </div>
                        ))}
                      </div>
                      {employeeData.roleLevel <= 3 && (
                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 text-yellow-600 mr-2" />
                            <span className="text-sm text-yellow-800 font-medium">
                              Admin Privileges Enabled
                            </span>
                          </div>
                          <p className="text-xs text-yellow-700 mt-1">
                            This role has administrative access to the system
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Description */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center p-3 border-b border-gray-100 bg-gray-50">
                  <Users className="h-4 w-4 text-indigo-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-700">
                    Additional Information
                  </h3>
                </div>
                <div className="p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Brief description about the employee"
                    value={employeeData.description || ""}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* System Generated Info for New Employees */}
              {!isEditing && (
                <div className="border border-green-200 rounded-lg overflow-hidden bg-green-50">
                  <div className="flex items-center p-3 border-b border-green-200 bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <h3 className="text-sm font-medium text-green-800">
                      Auto-Generated Credentials
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Employee ID:</span>
                        <span className="font-mono text-green-800">
                          Auto-generated
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Password:</span>
                        <span className="font-mono text-green-800">
                          Auto-generated
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Admin Status:</span>
                        <span className="font-medium text-green-800">
                          {employeeData.roleLevel <= 3 ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-green-600 mt-3">
                      Credentials will be sent via email upon successful
                      registration
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
              )}
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Add Employee"}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default AddEmployeeModal;
