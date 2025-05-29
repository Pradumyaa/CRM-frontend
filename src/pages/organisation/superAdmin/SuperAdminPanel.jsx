import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  UserCheck,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  TrendingUp,
  Clock,
  Award,
  Target,
  Calendar,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Building,
  UserCog,
  Database,
  FileText,
  Globe,
  Crown,
  Key,
  Briefcase,
  Monitor,
  Book,
  Calculator,
  Scale,
  Headphones,
  Clipboard,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
} from "lucide-react";

// Role hierarchy from top to bottom
const ROLES = [
  {
    id: "super_admin",
    name: "Super Admin",
    level: 1,
    color: "purple",
    icon: Crown,
  },
  {
    id: "product_owner",
    name: "Product Owner",
    level: 2,
    color: "indigo",
    icon: Key,
  },
  { id: "admin", name: "Admin", level: 3, color: "blue", icon: Shield },
  {
    id: "cxo_director",
    name: "Leadership (CXO/Director)",
    level: 4,
    color: "emerald",
    icon: Award,
  },
  {
    id: "senior_manager",
    name: "Senior Manager",
    level: 5,
    color: "teal",
    icon: Target,
  },
  { id: "manager", name: "Manager", level: 6, color: "green", icon: Users },
  {
    id: "assistant_manager",
    name: "Assistant Manager",
    level: 7,
    color: "lime",
    icon: UserCheck,
  },
  {
    id: "senior_team_lead",
    name: "Senior Team Lead",
    level: 8,
    color: "yellow",
    icon: Activity,
  },
  {
    id: "team_lead",
    name: "Team Lead",
    level: 9,
    color: "orange",
    icon: Monitor,
  },
  {
    id: "assistant_team_lead",
    name: "Assistant Team Lead",
    level: 10,
    color: "amber",
    icon: UserCog,
  },
  {
    id: "senior_associate",
    name: "Senior Associate",
    level: 11,
    color: "red",
    icon: Briefcase,
  },
  { id: "associate", name: "Associate", level: 12, color: "pink", icon: Users },
  { id: "intern", name: "Intern", level: 13, color: "gray", icon: Book },
  {
    id: "viewer",
    name: "Viewer/Auditor",
    level: 14,
    color: "slate",
    icon: Eye,
  },
];

// Departments
const DEPARTMENTS = [
  { id: "sales", name: "Sales", color: "green", icon: TrendingUp },
  { id: "marketing", name: "Marketing", color: "purple", icon: Globe },
  { id: "hr", name: "Human Resources", color: "blue", icon: Users },
  { id: "finance", name: "Finance", color: "emerald", icon: Calculator },
  { id: "operations", name: "Operations", color: "orange", icon: Settings },
  { id: "it", name: "Information Technology", color: "indigo", icon: Monitor },
  { id: "rnd", name: "Research & Development", color: "cyan", icon: Database },
  { id: "learning", name: "Learning & Development", color: "teal", icon: Book },
  { id: "accounts", name: "Accounts", color: "yellow", icon: FileText },
  { id: "legal", name: "Legal", color: "red", icon: Scale },
  { id: "support", name: "Customer Support", color: "pink", icon: Headphones },
  {
    id: "admin_facilities",
    name: "Admin & Facilities",
    color: "gray",
    icon: Building,
  },
  { id: "compliance", name: "Compliance", color: "slate", icon: ShieldAlert },
];

// Permission definitions based on roles
const PERMISSIONS = {
  super_admin: ["all"],
  product_owner: [
    "manage_users",
    "view_analytics",
    "manage_roles",
    "view_reports",
  ],
  admin: [
    "manage_users",
    "view_analytics",
    "manage_attendance",
    "view_reports",
  ],
  cxo_director: ["view_analytics", "view_reports", "view_users"],
  senior_manager: ["view_analytics", "manage_team", "view_reports"],
  manager: ["manage_team", "view_team_analytics"],
  assistant_manager: ["view_team", "basic_reports"],
  senior_team_lead: ["view_team", "basic_reports"],
  team_lead: ["view_team"],
  assistant_team_lead: ["view_team"],
  senior_associate: ["view_own"],
  associate: ["view_own"],
  intern: ["view_own"],
  viewer: ["read_only"],
};

const SuperAdminPanel = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState(ROLES);
  const [departments, setDepartments] = useState(DEPARTMENTS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 142,
    activeUsers: 128,
    roleDistribution: {},
    departmentDistribution: {},
    recentActivity: [],
  });

  // Mock data generation
  useEffect(() => {
    generateMockData();
  }, []);

  const generateMockData = () => {
    const mockEmployees = Array.from({ length: 142 }, (_, i) => ({
      id: `emp_${i + 1}`,
      name: `Employee ${i + 1}`,
      email: `employee${i + 1}@company.com`,
      role: ROLES[Math.floor(Math.random() * ROLES.length)].id,
      department:
        DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)].id,
      status: Math.random() > 0.1 ? "active" : "inactive",
      lastActive: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ),
      joinDate: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ),
      permissions: [],
    }));

    setEmployees(mockEmployees);

    // Calculate distributions
    const roleDistribution = {};
    const departmentDistribution = {};

    mockEmployees.forEach((emp) => {
      roleDistribution[emp.role] = (roleDistribution[emp.role] || 0) + 1;
      departmentDistribution[emp.department] =
        (departmentDistribution[emp.department] || 0) + 1;
    });

    setDashboardData((prev) => ({
      ...prev,
      roleDistribution,
      departmentDistribution,
      recentActivity: generateRecentActivity(),
    }));
  };

  const generateRecentActivity = () => {
    const activities = [
      "User role updated",
      "New employee added",
      "Department transfer",
      "Permission granted",
      "Account activated",
      "Role assignment changed",
    ];

    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      action: activities[Math.floor(Math.random() * activities.length)],
      user: `Employee ${Math.floor(Math.random() * 50) + 1}`,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      type: ["info", "success", "warning"][Math.floor(Math.random() * 3)],
    }));
  };

  const getRoleInfo = (roleId) => ROLES.find((r) => r.id === roleId);
  const getDepartmentInfo = (deptId) =>
    DEPARTMENTS.find((d) => d.id === deptId);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || emp.role === selectedRole;
    const matchesDepartment =
      selectedDepartment === "all" || emp.department === selectedDepartment;

    return matchesSearch && matchesRole && matchesDepartment;
  });

  const handleRoleChange = (employeeId, newRole) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId ? { ...emp, role: newRole } : emp
      )
    );
  };

  const handleStatusToggle = (employeeId) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? { ...emp, status: emp.status === "active" ? "inactive" : "active" }
          : emp
      )
    );
  };

  const StatCard = ({ title, value, change, icon: Icon, color = "blue" }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div
              className={`flex items-center mt-2 text-sm ${
                change > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change > 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(change)}% from last month
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const RoleCard = ({ role, count, onClick }) => {
    const IconComponent = role.icon;
    return (
      <div
        onClick={onClick}
        className={`p-4 rounded-lg border-2 border-${role.color}-200 bg-${role.color}-50 hover:bg-${role.color}-100 cursor-pointer transition-all`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full bg-${role.color}-100`}>
              <IconComponent className={`h-5 w-5 text-${role.color}-600`} />
            </div>
            <div>
              <h3 className={`font-medium text-${role.color}-900`}>
                {role.name}
              </h3>
              <p className={`text-sm text-${role.color}-700`}>
                Level {role.level}
              </p>
            </div>
          </div>
          <div className={`text-2xl font-bold text-${role.color}-700`}>
            {count || 0}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Crown className="h-8 w-8 text-purple-600 mr-3" />
                Super Admin Panel
              </h1>
              <p className="text-gray-600 mt-1">
                Manage roles, permissions, and organization structure
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 mt-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "roles", label: "Role Management", icon: Shield },
              { id: "employees", label: "Employee Management", icon: Users },
              { id: "departments", label: "Departments", icon: Building },
              { id: "permissions", label: "Permissions", icon: Key },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Employees"
                value={dashboardData.totalEmployees}
                change={8.2}
                icon={Users}
                color="blue"
              />
              <StatCard
                title="Active Users"
                value={dashboardData.activeUsers}
                change={-2.4}
                icon={UserCheck}
                color="green"
              />
              <StatCard
                title="Departments"
                value={DEPARTMENTS.length}
                icon={Building}
                color="purple"
              />
              <StatCard
                title="Role Types"
                value={ROLES.length}
                icon={Shield}
                color="orange"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Role Distribution */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Role Distribution
                </h3>
                <div className="space-y-3">
                  {ROLES.slice(0, 8).map((role) => {
                    const count = dashboardData.roleDistribution[role.id] || 0;
                    const percentage =
                      (count / dashboardData.totalEmployees) * 100;
                    return (
                      <div
                        key={role.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full bg-${role.color}-500`}
                          ></div>
                          <span className="text-sm text-gray-700">
                            {role.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 bg-${role.color}-500 rounded-full`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Department Distribution */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Department Distribution
                </h3>
                <div className="space-y-3">
                  {DEPARTMENTS.slice(0, 8).map((dept) => {
                    const count =
                      dashboardData.departmentDistribution[dept.id] || 0;
                    const percentage =
                      (count / dashboardData.totalEmployees) * 100;
                    return (
                      <div
                        key={dept.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full bg-${dept.color}-500`}
                          ></div>
                          <span className="text-sm text-gray-700">
                            {dept.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 bg-${dept.color}-500 rounded-full`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "success"
                          ? "bg-green-500"
                          : activity.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span> -{" "}
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Role Management Tab */}
        {activeTab === "roles" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Role Management
              </h2>
              <button
                onClick={() => setShowRoleModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ROLES.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  count={dashboardData.roleDistribution[role.id]}
                  onClick={() => console.log("Role clicked:", role.name)}
                />
              ))}
            </div>

            {/* Role Hierarchy Visualization */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Role Hierarchy
              </h3>
              <div className="space-y-2">
                {ROLES.map((role, index) => {
                  const IconComponent = role.icon;
                  return (
                    <div
                      key={role.id}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50"
                      style={{ marginLeft: `${role.level * 20}px` }}
                    >
                      <div className={`p-2 rounded-full bg-${role.color}-100`}>
                        <IconComponent
                          className={`h-4 w-4 text-${role.color}-600`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {role.name}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs bg-${role.color}-100 text-${role.color}-800`}
                          >
                            Level {role.level}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {dashboardData.roleDistribution[role.id] || 0}{" "}
                          employees
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Employee Management Tab */}
        {activeTab === "employees" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">All Roles</option>
                    {ROLES.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">All Departments</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-sm text-gray-600">
                  Showing {filteredEmployees.length} of {employees.length}{" "}
                  employees
                </div>
              </div>
            </div>

            {/* Employee Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmployees.slice(0, 20).map((employee) => {
                      const role = getRoleInfo(employee.role);
                      const department = getDepartmentInfo(employee.department);
                      const RoleIcon = role?.icon || Users;
                      const DeptIcon = department?.icon || Building;

                      return (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-purple-600 font-medium">
                                  {employee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {employee.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {employee.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <RoleIcon
                                className={`h-4 w-4 text-${role?.color}-600 mr-2`}
                              />
                              <span
                                className={`px-2 py-1 text-xs rounded-full bg-${role?.color}-100 text-${role?.color}-800`}
                              >
                                {role?.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <DeptIcon
                                className={`h-4 w-4 text-${department?.color}-600 mr-2`}
                              />
                              <span className="text-sm text-gray-900">
                                {department?.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleStatusToggle(employee.id)}
                              className={`px-2 py-1 text-xs rounded-full ${
                                employee.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {employee.status}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {employee.lastActive.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Departments Tab */}
        {activeTab === "departments" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Department Management
              </h2>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEPARTMENTS.map((dept) => {
                const IconComponent = dept.icon;
                const count =
                  dashboardData.departmentDistribution[dept.id] || 0;
                return (
                  <div
                    key={dept.id}
                    className={`bg-white p-6 rounded-xl shadow-sm border-2 border-${dept.color}-200 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full bg-${dept.color}-100`}>
                        <IconComponent
                          className={`h-6 w-6 text-${dept.color}-600`}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <h3
                      className={`text-lg font-semibold text-${dept.color}-900 mb-2`}
                    >
                      {dept.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-3xl font-bold text-${dept.color}-700`}
                      >
                        {count}
                      </span>
                      <span className="text-sm text-gray-500">employees</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Active</span>
                        <span className="font-medium text-green-600">
                          {Math.floor(count * 0.9)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Department Analytics */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Department Performance
              </h3>
              <div className="space-y-4">
                {DEPARTMENTS.slice(0, 6).map((dept) => {
                  const count =
                    dashboardData.departmentDistribution[dept.id] || 0;
                  const performance = Math.floor(Math.random() * 40) + 60; // Mock performance
                  return (
                    <div
                      key={dept.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <dept.icon
                          className={`h-5 w-5 text-${dept.color}-600`}
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {dept.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {count} employees
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {performance}%
                          </div>
                          <div className="text-xs text-gray-500">
                            Performance
                          </div>
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 bg-${dept.color}-500 rounded-full`}
                            style={{ width: `${performance}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Permissions Tab */}
        {activeTab === "permissions" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Permission Management
              </h2>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Create Permission
              </button>
            </div>

            {/* Permission Matrix */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Role-Permission Matrix
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage what each role can access and perform
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        View Users
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Manage Users
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        View Analytics
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Manage Roles
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        System Admin
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ROLES.slice(0, 8).map((role) => {
                      const permissions = PERMISSIONS[role.id] || [];
                      const hasAll = permissions.includes("all");

                      return (
                        <tr key={role.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <role.icon
                                className={`h-4 w-4 text-${role.color}-600 mr-3`}
                              />
                              <span className="font-medium text-gray-900">
                                {role.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={
                                hasAll || permissions.includes("view_users")
                              }
                              className="h-4 w-4 text-purple-600 rounded"
                              readOnly
                            />
                          </td>
                          <td className="px-3 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={
                                hasAll || permissions.includes("manage_users")
                              }
                              className="h-4 w-4 text-purple-600 rounded"
                              readOnly
                            />
                          </td>
                          <td className="px-3 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={
                                hasAll || permissions.includes("view_analytics")
                              }
                              className="h-4 w-4 text-purple-600 rounded"
                              readOnly
                            />
                          </td>
                          <td className="px-3 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={
                                hasAll || permissions.includes("manage_roles")
                              }
                              className="h-4 w-4 text-purple-600 rounded"
                              readOnly
                            />
                          </td>
                          <td className="px-3 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={hasAll}
                              className="h-4 w-4 text-purple-600 rounded"
                              readOnly
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Permission Groups */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  System Permissions
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      name: "Super Admin Access",
                      desc: "Full system control",
                      level: "critical",
                    },
                    {
                      name: "User Management",
                      desc: "Create, edit, delete users",
                      level: "high",
                    },
                    {
                      name: "Role Management",
                      desc: "Manage roles and permissions",
                      level: "high",
                    },
                    {
                      name: "System Settings",
                      desc: "Configure system settings",
                      level: "medium",
                    },
                  ].map((perm, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {perm.name}
                        </div>
                        <div className="text-sm text-gray-600">{perm.desc}</div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          perm.level === "critical"
                            ? "bg-red-100 text-red-800"
                            : perm.level === "high"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {perm.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Department Permissions
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      name: "View Department Data",
                      desc: "Access department information",
                      level: "low",
                    },
                    {
                      name: "Manage Team",
                      desc: "Manage team members",
                      level: "medium",
                    },
                    {
                      name: "Department Reports",
                      desc: "Generate department reports",
                      level: "medium",
                    },
                    {
                      name: "Budget Access",
                      desc: "View and manage budgets",
                      level: "high",
                    },
                  ].map((perm, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {perm.name}
                        </div>
                        <div className="text-sm text-gray-600">{perm.desc}</div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          perm.level === "high"
                            ? "bg-orange-100 text-orange-800"
                            : perm.level === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {perm.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Organization Analytics
            </h2>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Employee Growth"
                value="+12%"
                change={12}
                icon={TrendingUp}
                color="green"
              />
              <StatCard
                title="Role Assignments"
                value="98%"
                change={2.1}
                icon={UserCheck}
                color="blue"
              />
              <StatCard
                title="Active Sessions"
                value="89"
                change={-5.2}
                icon={Activity}
                color="purple"
              />
              <StatCard
                title="Dept Efficiency"
                value="92%"
                change={8.7}
                icon={Target}
                color="orange"
              />
            </div>

            {/* Advanced Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Role Effectiveness */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Role Effectiveness
                </h3>
                <div className="space-y-4">
                  {ROLES.slice(0, 6).map((role) => {
                    const effectiveness = Math.floor(Math.random() * 30) + 70;
                    return (
                      <div
                        key={role.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <role.icon
                            className={`h-4 w-4 text-${role.color}-600`}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {role.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 bg-${role.color}-500 rounded-full`}
                              style={{ width: `${effectiveness}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-10">
                            {effectiveness}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Department Performance Trends */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Department Trends
                </h3>
                <div className="space-y-4">
                  {DEPARTMENTS.slice(0, 6).map((dept) => {
                    const trend = Math.random() > 0.5 ? "up" : "down";
                    const value = Math.floor(Math.random() * 20) + 5;
                    return (
                      <div
                        key={dept.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <dept.icon
                            className={`h-4 w-4 text-${dept.color}-600`}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {dept.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {trend === "up" ? (
                            <ArrowUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-red-600" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              trend === "up" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {value}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Activity Heatmap */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Activity Heatmap
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const intensity = Math.floor(Math.random() * 4);
                  return (
                    <div
                      key={i}
                      className={`h-8 rounded ${
                        intensity === 0
                          ? "bg-gray-100"
                          : intensity === 1
                          ? "bg-purple-200"
                          : intensity === 2
                          ? "bg-purple-400"
                          : "bg-purple-600"
                      }`}
                      title={`Day ${i + 1}: ${intensity * 25}% activity`}
                    ></div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                <span>5 weeks ago</span>
                <div className="flex items-center space-x-2">
                  <span>Less</span>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-gray-100 rounded"></div>
                    <div className="w-3 h-3 bg-purple-200 rounded"></div>
                    <div className="w-3 h-3 bg-purple-400 rounded"></div>
                    <div className="w-3 h-3 bg-purple-600 rounded"></div>
                  </div>
                  <span>More</span>
                </div>
                <span>Today</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Role Creation Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New Role
              </h3>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter role name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Level
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  {Array.from({ length: 14 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Level {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Color
                </label>
                <div className="flex space-x-2">
                  {["purple", "blue", "green", "yellow", "red", "indigo"].map(
                    (color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full bg-${color}-500 hover:ring-2 hover:ring-${color}-300`}
                      />
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPanel;
