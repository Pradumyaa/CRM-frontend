import React, { useState, useEffect } from "react";
import {
  FileText,
  Users,
  Settings,
  Key,
  Building,
  BarChart3,
  Calendar,
  MessageSquare,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  PieChart,
  Activity,
  DollarSign,
  Target,
  Mail,
  FileX,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

// Mock data - replace with actual API calls
const mockReports = [
  {
    id: 1,
    title: "Monthly Attendance Report",
    type: "attendance",
    category: "HR",
    status: "ready",
    lastGenerated: "2024-11-20T10:30:00Z",
    size: "2.4 MB",
    format: "PDF",
    parameters: { month: "November", year: "2024" },
    description: "Comprehensive attendance analysis for November 2024",
    requiredLevel: 6,
  },
  {
    id: 2,
    title: "Employee Performance Analytics",
    type: "performance",
    category: "Management",
    status: "generating",
    lastGenerated: "2024-11-19T15:45:00Z",
    size: "5.2 MB",
    format: "Excel",
    parameters: { quarter: "Q4", year: "2024" },
    description: "Q4 2024 employee performance metrics and KPIs",
    requiredLevel: 5,
  },
  {
    id: 3,
    title: "Department Productivity Report",
    type: "productivity",
    category: "Operations",
    status: "ready",
    lastGenerated: "2024-11-18T09:15:00Z",
    size: "3.8 MB",
    format: "PDF",
    parameters: { departments: ["Engineering", "Sales"], period: "Monthly" },
    description: "Cross-department productivity comparison and insights",
    requiredLevel: 4,
  },
  {
    id: 4,
    title: "Financial Overview",
    type: "financial",
    category: "Finance",
    status: "error",
    lastGenerated: "2024-11-17T14:20:00Z",
    size: "1.2 MB",
    format: "Excel",
    parameters: { type: "Summary", period: "YTD" },
    description: "Year-to-date financial summary and projections",
    requiredLevel: 3,
  },
  {
    id: 5,
    title: "Custom Analytics Dashboard",
    type: "custom",
    category: "Analytics",
    status: "scheduled",
    lastGenerated: null,
    size: null,
    format: "Interactive",
    parameters: { widgets: ["attendance", "performance", "revenue"] },
    description: "Customizable analytics dashboard with real-time data",
    requiredLevel: 5,
  },
];

const mockReportTemplates = [
  {
    id: "attendance_monthly",
    name: "Monthly Attendance Report",
    category: "HR",
    description: "Detailed monthly attendance analysis",
    requiredLevel: 6,
    parameters: ["month", "year", "departments"],
  },
  {
    id: "performance_quarterly",
    name: "Quarterly Performance Review",
    category: "Management",
    description: "Employee performance metrics and KPIs",
    requiredLevel: 5,
    parameters: ["quarter", "year", "employees", "metrics"],
  },
  {
    id: "financial_summary",
    name: "Financial Summary Report",
    category: "Finance",
    description: "Financial overview and budget analysis",
    requiredLevel: 3,
    parameters: ["period", "departments", "categories"],
  },
  {
    id: "custom_dashboard",
    name: "Custom Analytics Dashboard",
    category: "Analytics",
    description: "Build your own analytics dashboard",
    requiredLevel: 5,
    parameters: ["widgets", "timeframe", "filters"],
  },
];

// Role-based access control hook
const useRoleAccess = () => {
  // This would typically come from your auth context
  const [userRole] = useState("manager"); // Simulate current user role
  const [userLevel] = useState(6); // Simulate user access level

  const hasAccess = (requiredLevel) => {
    return userLevel <= requiredLevel;
  };

  const canEdit = (requiredLevel) => {
    return userLevel <= requiredLevel;
  };

  const canDelete = (requiredLevel) => {
    return userLevel <= requiredLevel - 1; // Only higher roles can delete
  };

  return { userRole, userLevel, hasAccess, canEdit, canDelete };
};

const ReportsCenter = () => {
  const [activeTab, setActiveTab] = useState("reports");
  const [reports, setReports] = useState(mockReports);
  const [filteredReports, setFilteredReports] = useState(mockReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { userRole, userLevel, hasAccess, canEdit, canDelete } =
    useRoleAccess();

  // Filter reports based on search and filters
  useEffect(() => {
    let filtered = reports.filter((report) => hasAccess(report.requiredLevel));

    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (report) =>
          report.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((report) => report.status === filterStatus);
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, filterCategory, filterStatus, userLevel]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "generating":
        return <Activity className="h-4 w-4 text-blue-500 animate-spin" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800";
      case "generating":
        return "bg-blue-100 text-blue-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "hr":
        return <Users className="h-4 w-4" />;
      case "finance":
        return <DollarSign className="h-4 w-4" />;
      case "management":
        return <Target className="h-4 w-4" />;
      case "operations":
        return <Activity className="h-4 w-4" />;
      case "analytics":
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleGenerateReport = (reportId) => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId
            ? {
                ...report,
                status: "ready",
                lastGenerated: new Date().toISOString(),
              }
            : report
        )
      );
      setIsGenerating(false);
    }, 3000);
  };

  const handleDownloadReport = (report) => {
    // Simulate download
    console.log(`Downloading ${report.title}...`);
    // In real implementation, this would trigger actual download
  };

  const handleDeleteReport = (reportId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      setReports((prev) => prev.filter((report) => report.id !== reportId));
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p
              className={`text-sm flex items-center mt-1 ${
                change > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              {Math.abs(change)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ReportCard = ({ report }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          {getCategoryIcon(report.category)}
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {report.title}
            </h3>
            <p className="text-sm text-gray-600">{report.category}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            report.status
          )}`}
        >
          {getStatusIcon(report.status)}
          <span className="ml-1 capitalize">{report.status}</span>
        </span>
      </div>

      <p className="text-gray-600 mb-4">{report.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-500">Format:</span>
          <span className="ml-2 font-medium">{report.format}</span>
        </div>
        <div>
          <span className="text-gray-500">Size:</span>
          <span className="ml-2 font-medium">{report.size || "N/A"}</span>
        </div>
        <div className="col-span-2">
          <span className="text-gray-500">Last Generated:</span>
          <span className="ml-2 font-medium">
            {report.lastGenerated
              ? new Date(report.lastGenerated).toLocaleDateString()
              : "Never"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          {report.status === "ready" && (
            <button
              onClick={() => handleDownloadReport(report)}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </button>
          )}

          {report.status !== "generating" && (
            <button
              onClick={() => handleGenerateReport(report.id)}
              disabled={isGenerating}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${isGenerating ? "animate-spin" : ""}`}
              />
              Generate
            </button>
          )}
        </div>

        <div className="flex space-x-1">
          {canEdit(report.requiredLevel) && (
            <button
              onClick={() => setSelectedReport(report)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}

          {canDelete(report.requiredLevel) && (
            <button
              onClick={() => handleDeleteReport(report.id)}
              className="p-2 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const CreateReportModal = () =>
    showCreateModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl m-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Create New Report</h2>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockReportTemplates
              .filter((template) => hasAccess(template.requiredLevel))
              .map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer"
                  onClick={() => {
                    console.log(
                      "Creating report from template:",
                      template.name
                    );
                    setShowCreateModal(false);
                  }}
                >
                  <div className="flex items-center mb-2">
                    {getCategoryIcon(template.category)}
                    <h3 className="ml-2 font-medium">{template.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {template.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    Required Level: L{template.requiredLevel}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                Reports Center
              </h1>
              <p className="text-gray-600 mt-1">
                Generate, manage and analyze organizational reports
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">
                Access Level:{" "}
                <span className="font-medium text-blue-600">L{userLevel}</span>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Reports"
            value={filteredReports.length}
            change={12}
            icon={FileText}
            color="bg-blue-500"
          />
          <StatCard
            title="Ready Reports"
            value={filteredReports.filter((r) => r.status === "ready").length}
            change={8}
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Generating"
            value={
              filteredReports.filter((r) => r.status === "generating").length
            }
            icon={Activity}
            color="bg-yellow-500"
          />
          <StatCard
            title="Scheduled"
            value={
              filteredReports.filter((r) => r.status === "scheduled").length
            }
            icon={Clock}
            color="bg-purple-500"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="hr">HR</option>
                <option value="finance">Finance</option>
                <option value="management">Management</option>
                <option value="operations">Operations</option>
                <option value="analytics">Analytics</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="ready">Ready</option>
                <option value="generating">Generating</option>
                <option value="scheduled">Scheduled</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredReports.length} of{" "}
              {reports.filter((r) => hasAccess(r.requiredLevel)).length} reports
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <FileX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reports found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first report"}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </button>
          </div>
        )}

        {/* Create Report Modal */}
        <CreateReportModal />
      </div>
    </div>
  );
};

export default ReportsCenter;
