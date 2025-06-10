import React, { useState, useEffect } from "react";
import {
  Building,
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  BarChart3,
  TrendingUp,
  UserPlus,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Crown,
  Shield,
  Eye,
  MapPin,
  Calendar,
  DollarSign,
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

// Predefined departments with additional metadata
const DEPARTMENT_TEMPLATES = [
  {
    name: "Sales",
    description: "Revenue generation and client acquisition",
    color: "green",
    icon: TrendingUp,
    budget: 500000,
    targets: ["Revenue Growth", "Client Acquisition", "Market Expansion"],
  },
  {
    name: "Marketing",
    description: "Brand promotion and market research",
    color: "purple",
    icon: BarChart3,
    budget: 300000,
    targets: ["Brand Awareness", "Lead Generation", "Digital Presence"],
  },
  {
    name: "Human Resources (HR)",
    description: "Employee management and organizational development",
    color: "blue",
    icon: Users,
    budget: 200000,
    targets: ["Employee Satisfaction", "Recruitment", "Training Programs"],
  },
  {
    name: "Finance",
    description: "Financial planning and management",
    color: "emerald",
    icon: DollarSign,
    budget: 150000,
    targets: ["Cost Control", "Financial Reporting", "Budget Planning"],
  },
  {
    name: "Operations",
    description: "Daily business operations and process optimization",
    color: "orange",
    icon: Building,
    budget: 400000,
    targets: ["Process Efficiency", "Quality Control", "Cost Optimization"],
  },
  {
    name: "Information Technology (IT)",
    description: "Technology infrastructure and system management",
    color: "indigo",
    icon: Building,
    budget: 600000,
    targets: ["System Reliability", "Security", "Innovation"],
  },
  {
    name: "Research & Development (R&D)",
    description: "Innovation and product development",
    color: "cyan",
    icon: Building,
    budget: 800000,
    targets: ["Product Innovation", "Research Excellence", "Patent Filing"],
  },
  {
    name: "Learning & Development (L&D)",
    description: "Employee training and skill development",
    color: "pink",
    icon: Building,
    budget: 250000,
    targets: ["Skill Development", "Training Programs", "Career Growth"],
  },
  {
    name: "Accounts",
    description: "Accounting and financial record keeping",
    color: "yellow",
    icon: Building,
    budget: 120000,
    targets: ["Accurate Reporting", "Compliance", "Audit Readiness"],
  },
  {
    name: "Legal",
    description: "Legal compliance and contract management",
    color: "slate",
    icon: Building,
    budget: 180000,
    targets: ["Legal Compliance", "Risk Management", "Contract Review"],
  },
  {
    name: "Customer Support",
    description: "Customer service and support operations",
    color: "teal",
    icon: Building,
    budget: 220000,
    targets: ["Customer Satisfaction", "Response Time", "Issue Resolution"],
  },
  {
    name: "Admin & Facilities",
    description: "Administrative support and facility management",
    color: "amber",
    icon: Building,
    budget: 160000,
    targets: [
      "Facility Management",
      "Administrative Efficiency",
      "Resource Planning",
    ],
  },
  {
    name: "Compliance",
    description: "Regulatory compliance and governance",
    color: "red",
    icon: Shield,
    budget: 140000,
    targets: [
      "Regulatory Compliance",
      "Policy Implementation",
      "Audit Support",
    ],
  },
];

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create"); // 'create', 'edit', 'view'
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchEmployees(), initializeDepartments()]);
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
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

  const initializeDepartments = () => {
    // Process departments with real employee data
    const processedDepartments = DEPARTMENT_TEMPLATES.map((template) => {
      const deptEmployees = employees.filter(
        (emp) => emp.department === template.name
      );
      return {
        id: template.name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
        ...template,
        employeeCount: deptEmployees.length,
        employees: deptEmployees,
        isActive: true,
        createdAt: new Date().toISOString(),
        budget: template.budget,
        performance: Math.floor(Math.random() * 30) + 70, // Mock performance 70-100%
      };
    });

    setDepartments(processedDepartments);
  };

  useEffect(() => {
    if (employees.length > 0) {
      initializeDepartments();
    }
  }, [employees]);

  const handleCreateDepartment = () => {
    setModalType("create");
    setEditingDepartment({
      name: "",
      description: "",
      color: "blue",
      budget: 0,
      targets: [],
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditDepartment = (department) => {
    setModalType("edit");
    setEditingDepartment(department);
    setShowModal(true);
  };

  const handleViewDepartment = (department) => {
    setSelectedDepartment(department);
    setModalType("view");
    setShowModal(true);
  };

  const handleSaveDepartment = async () => {
    try {
      setLoading(true);
      // Since we're using mock data, just update local state
      if (modalType === "create") {
        const newDepartment = {
          ...editingDepartment,
          id: editingDepartment.name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
          employeeCount: 0,
          employees: [],
          createdAt: new Date().toISOString(),
          performance: 100,
        };
        setDepartments((prev) => [...prev, newDepartment]);
        setSuccess("Department created successfully");
      } else {
        setDepartments((prev) =>
          prev.map((dept) =>
            dept.id === editingDepartment.id ? editingDepartment : dept
          )
        );
        setSuccess("Department updated successfully");
      }
      setShowModal(false);
      setEditingDepartment(null);
    } catch (error) {
      setError("Failed to save department");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (!confirm("Are you sure you want to delete this department?")) return;

    try {
      setLoading(true);
      setDepartments((prev) => prev.filter((dept) => dept.id !== departmentId));
      setSuccess("Department deleted successfully");
    } catch (error) {
      setError("Failed to delete department");
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDepartmentStats = () => {
    const totalEmployees = employees.length;
    const totalBudget = departments.reduce(
      (sum, dept) => sum + (dept.budget || 0),
      0
    );
    const avgPerformance =
      departments.length > 0
        ? departments.reduce((sum, dept) => sum + (dept.performance || 0), 0) /
          departments.length
        : 0;

    return {
      totalDepartments: departments.length,
      totalEmployees,
      totalBudget,
      avgPerformance: Math.round(avgPerformance),
    };
  };

  const stats = getDepartmentStats();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Building className="h-7 w-7 text-green-500 mr-3" />
                Department Management
              </h1>
              <p className="text-gray-600">
                Organize and manage company departments and team structures
              </p>
            </div>
            <button
              onClick={handleCreateDepartment}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    Total Departments
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {stats.totalDepartments}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Total Employees
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {stats.totalEmployees}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">
                    Total Budget
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    ${(stats.totalBudget / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-orange-600 font-medium">
                    Avg Performance
                  </p>
                  <p className="text-2xl font-bold text-orange-900">
                    {stats.avgPerformance}%
                  </p>
                </div>
              </div>
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

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center space-x-4 ml-4">
              <span className="text-sm text-gray-600">
                Showing {filteredDepartments.length} of {departments.length}{" "}
                departments
              </span>
            </div>
          </div>
        </div>

        {/* Departments Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading departments...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDepartments.map((dept) => (
              <DepartmentCard
                key={dept.id}
                department={dept}
                onEdit={() => handleEditDepartment(dept)}
                onDelete={() => handleDeleteDepartment(dept.id)}
                onView={() => handleViewDepartment(dept)}
              />
            ))}
          </div>
        )}

        {filteredDepartments.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No departments found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by creating your first department"}
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreateDepartment}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Department
              </button>
            )}
          </div>
        )}

        {/* Department Modal */}
        {showModal && (
          <DepartmentModal
            type={modalType}
            department={
              modalType === "view" ? selectedDepartment : editingDepartment
            }
            onSave={handleSaveDepartment}
            onClose={() => {
              setShowModal(false);
              setEditingDepartment(null);
              setSelectedDepartment(null);
            }}
            onChange={setEditingDepartment}
            loading={loading}
            employees={employees}
          />
        )}
      </div>
    </div>
  );
};

// Department Card Component
const DepartmentCard = ({ department, onEdit, onDelete, onView }) => {
  const IconComponent = department.icon || Building;

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return "text-green-600 bg-green-100";
    if (performance >= 75) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow overflow-hidden">
      {/* Header */}
      <div className={`bg-${department.color}-100 p-4`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div
              className={`w-12 h-12 bg-${department.color}-500 rounded-lg flex items-center justify-center mr-3`}
            >
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className={`font-semibold text-${department.color}-900`}>
                {department.name}
              </h3>
              <p className={`text-sm text-${department.color}-700`}>
                {department.employeeCount} employees
              </p>
            </div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className={`p-1 text-${department.color}-600 hover:bg-${department.color}-200 rounded`}
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className={`p-1 text-${department.color}-600 hover:bg-${department.color}-200 rounded`}
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 text-red-600 hover:bg-red-200 rounded"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {department.description}
        </p>

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Budget</span>
            <span className="text-sm font-medium">
              ${(department.budget / 1000).toFixed(0)}K
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Performance</span>
            <span
              className={`text-sm font-medium px-2 py-1 rounded-full ${getPerformanceColor(
                department.performance
              )}`}
            >
              {department.performance}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Status</span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                department.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {department.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Targets */}
        {department.targets && department.targets.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-medium text-gray-700 mb-2">
              Key Targets:
            </h4>
            <div className="space-y-1">
              {department.targets.slice(0, 2).map((target, index) => (
                <div
                  key={index}
                  className="flex items-center text-xs text-gray-600"
                >
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  {target}
                </div>
              ))}
              {department.targets.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{department.targets.length - 2} more targets
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Department Modal Component
const DepartmentModal = ({
  type,
  department,
  onSave,
  onClose,
  onChange,
  loading,
  employees,
}) => {
  const [formData, setFormData] = useState(department || {});
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    setFormData(department || {});
  }, [department]);

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    if (onChange) onChange(updatedData);
  };

  const handleTargetChange = (index, value) => {
    const newTargets = [...(formData.targets || [])];
    newTargets[index] = value;
    handleInputChange("targets", newTargets);
  };

  const addTarget = () => {
    const newTargets = [...(formData.targets || []), ""];
    handleInputChange("targets", newTargets);
  };

  const removeTarget = (index) => {
    const newTargets = (formData.targets || []).filter((_, i) => i !== index);
    handleInputChange("targets", newTargets);
  };

  const departmentEmployees =
    employees?.filter((emp) => emp.department === department?.name) || [];

  const isViewMode = type === "view";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 p-4 flex justify-between items-center">
          <h3 className="text-white text-lg font-semibold">
            {type === "create"
              ? "Create Department"
              : type === "edit"
              ? "Edit Department"
              : "Department Details"}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs for view mode */}
        {isViewMode && (
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("info")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "info"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Department Info
              </button>
              <button
                onClick={() => setActiveTab("employees")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "employees"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Employees ({departmentEmployees.length})
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "analytics"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {(!isViewMode || activeTab === "info") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Basic Information</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department Name
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    disabled={isViewMode}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color Theme
                  </label>
                  <select
                    value={formData.color || "blue"}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  >
                    {[
                      "blue",
                      "green",
                      "purple",
                      "red",
                      "yellow",
                      "indigo",
                      "pink",
                      "gray",
                    ].map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Budget ($)
                  </label>
                  <input
                    type="number"
                    value={formData.budget || 0}
                    onChange={(e) =>
                      handleInputChange("budget", parseInt(e.target.value) || 0)
                    }
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  />
                </div>

                {!isViewMode && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive !== false}
                      onChange={(e) =>
                        handleInputChange("isActive", e.target.checked)
                      }
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">
                      Active Department
                    </label>
                  </div>
                )}
              </div>

              {/* Targets and Goals */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">
                  Key Targets & Goals
                </h4>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Department Targets
                    </label>
                    {!isViewMode && (
                      <button
                        type="button"
                        onClick={addTarget}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        <Plus className="h-4 w-4 inline mr-1" />
                        Add Target
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {(formData.targets || []).map((target, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={target}
                          onChange={(e) =>
                            handleTargetChange(index, e.target.value)
                          }
                          disabled={isViewMode}
                          placeholder="Enter target..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                        />
                        {!isViewMode && (
                          <button
                            type="button"
                            onClick={() => removeTarget(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {(!formData.targets || formData.targets.length === 0) && (
                    <p className="text-sm text-gray-500 italic">
                      No targets defined
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {isViewMode && activeTab === "employees" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">
                  Department Employees
                </h4>
                <span className="text-sm text-gray-600">
                  {departmentEmployees.length} total
                </span>
              </div>

              {departmentEmployees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {departmentEmployees.map((employee) => (
                    <div
                      key={employee.employeeId}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <Users className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">
                              {employee.name}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {employee.jobTitle}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {employee.isAdmin && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                          {employee.roleName && (
                            <Shield className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Role:</span>
                          <span className="ml-1 font-medium">
                            {employee.roleName || "No Role"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <span
                            className={`ml-1 px-2 py-1 rounded-full ${
                              employee.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {employee.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No employees assigned to this department
                  </p>
                </div>
              )}
            </div>
          )}

          {isViewMode && activeTab === "analytics" && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">
                Department Analytics
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm text-blue-600">Team Size</p>
                      <p className="text-xl font-bold text-blue-900">
                        {departmentEmployees.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <BarChart3 className="h-6 w-6 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-green-600">Performance</p>
                      <p className="text-xl font-bold text-green-900">
                        {department?.performance || 0}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <DollarSign className="h-6 w-6 text-purple-600 mr-2" />
                    <div>
                      <p className="text-sm text-purple-600">Budget</p>
                      <p className="text-xl font-bold text-purple-900">
                        ${((department?.budget || 0) / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">
                    Role Distribution
                  </h5>
                  <div className="space-y-2">
                    {Object.entries(
                      departmentEmployees.reduce((acc, emp) => {
                        const role = emp.roleName || "No Role";
                        acc[role] = (acc[role] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([role, count]) => (
                      <div
                        key={role}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm font-medium">{role}</span>
                        <span className="text-sm text-gray-600">
                          {count} employee{count !== 1 ? "s" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isViewMode && (
          <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {type === "create" ? "Create Department" : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentManagement;
