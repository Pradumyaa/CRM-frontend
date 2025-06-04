import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Award,
  Clock,
  AlertTriangle,
  Crown,
  Shield,
  Star,
  MoreVertical,
  FileText,
  Building,
  TrendingUp,
  Activity,
  ExternalLink,
  Copy,
  MessageSquare,
  Bell,
  Download,
} from "lucide-react";

const EmployeeRow = ({
  employee,
  index,
  onEdit,
  onDelete,
  onView,
  onQuickAction,
  userPermissions = {},
  selectedEmployees = [],
  setSelectedEmployees = () => {},
  showDropdown,
  setShowDropdown,
}) => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);

  const isEven = index % 2 === 0;
  const isSelected = selectedEmployees.includes(
    employee.employeeId || employee._id
  );

  // Get status icon and colors
  const getStatusDisplay = (status) => {
    switch (status) {
      case "Active":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          borderColor: "border-green-400",
          icon: <CheckCircle className="h-4 w-4 mr-1.5 text-green-600" />,
          pulse: "animate-pulse",
        };
      case "Inactive":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          borderColor: "border-red-400",
          icon: <XCircle className="h-4 w-4 mr-1.5 text-red-600" />,
          pulse: "",
        };
      case "On Leave":
        return {
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-400",
          icon: <Clock className="h-4 w-4 mr-1.5 text-yellow-600" />,
          pulse: "",
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          borderColor: "border-gray-400",
          icon: <AlertTriangle className="h-4 w-4 mr-1.5 text-gray-600" />,
          pulse: "",
        };
    }
  };

  // Get avatar background color based on name
  const getAvatarColor = (name) => {
    if (!name) return "from-gray-500 to-gray-600";

    const firstChar = name.charAt(0).toLowerCase();
    const charCode = firstChar.charCodeAt(0);

    // Create a gradient based on the character code
    if (charCode < 100) return "from-red-500 to-pink-500";
    if (charCode < 105) return "from-orange-500 to-amber-500";
    if (charCode < 110) return "from-yellow-500 to-green-500";
    if (charCode < 115) return "from-green-500 to-teal-500";
    if (charCode < 120) return "from-teal-500 to-blue-500";
    return "from-blue-500 to-indigo-500";
  };

  const statusDisplay = getStatusDisplay(employee.status);
  const avatarColor = getAvatarColor(employee.name);

  // Format salary with currency
  const formatSalary = (salary) => {
    if (!salary && salary !== 0) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Calculate tenure
  const calculateTenure = (joiningDate) => {
    if (!joiningDate) return "New";
    try {
      const joinDate = new Date(joiningDate);
      const now = new Date();
      const diffTime = Math.abs(now - joinDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 30) return `${diffDays}d`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo`;
      return `${Math.floor(diffDays / 365)}yr`;
    } catch (error) {
      return "N/A";
    }
  };

  // Handle selection
  const handleSelection = (checked) => {
    const employeeId = employee.employeeId || employee._id;
    if (checked) {
      setSelectedEmployees((prev) => [...prev, employeeId]);
    } else {
      setSelectedEmployees((prev) => prev.filter((id) => id !== employeeId));
    }
  };

  // Handle quick actions with loading state
  const handleQuickActionWithLoading = async (action) => {
    setIsActionLoading(true);
    try {
      if (onQuickAction) {
        await onQuickAction(employee, action);
      }
    } finally {
      setIsActionLoading(false);
      setShowDropdown(null);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setShowTooltip(`${type} copied!`);
      setTimeout(() => setShowTooltip(null), 2000);
    });
  };

  // Performance indicator based on various metrics
  const getPerformanceIndicator = () => {
    const score = Math.random() * 100; // This would come from actual performance data
    if (score >= 90)
      return {
        color: "text-green-600",
        icon: <TrendingUp className="w-4 h-4" />,
        label: "High",
      };
    if (score >= 70)
      return {
        color: "text-blue-600",
        icon: <Activity className="w-4 h-4" />,
        label: "Good",
      };
    if (score >= 50)
      return {
        color: "text-yellow-600",
        icon: <Clock className="w-4 h-4" />,
        label: "Fair",
      };
    return {
      color: "text-red-600",
      icon: <AlertTriangle className="w-4 h-4" />,
      label: "Needs Attention",
    };
  };

  const performance = getPerformanceIndicator();

  // Add hover animation to the row
  const rowHoverClass =
    "transition-all duration-200 ease-in-out hover:scale-[1.005] hover:shadow-lg";

  return (
    <tr
      className={`${
        isEven ? "bg-white" : "bg-gray-50"
      } ${rowHoverClass} border-l-4 ${
        employee.status === "Active"
          ? "border-l-green-400"
          : employee.status === "Inactive"
          ? "border-l-red-400"
          : employee.status === "On Leave"
          ? "border-l-yellow-400"
          : "border-l-gray-400"
      } ${isSelected ? "bg-indigo-50 border-l-indigo-500" : ""} group`}
    >
      {/* Selection Checkbox */}
      {userPermissions.canBulkActions && (
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => handleSelection(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        </td>
      )}

      {/* Employee Info */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-12 w-12 flex-shrink-0 relative">
            <div
              className={`h-12 w-12 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-semibold text-sm shadow-sm ring-2 ring-white`}
            >
              {employee.name ? employee.name.charAt(0).toUpperCase() : "?"}
            </div>
            {employee.status === "Active" && (
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 flex items-center">
              {employee.name || "N/A"}
              {employee.isAdmin && (
                <Crown
                  className="h-4 w-4 text-yellow-500 ml-2"
                  title="Administrator"
                />
              )}
              {employee.roleLevel <= 3 && (
                <Shield
                  className="h-4 w-4 text-purple-500 ml-1"
                  title="Management"
                />
              )}
            </div>
            <div className="text-xs text-gray-500 flex items-center mt-1">
              <Award className="h-3 w-3 mr-1 text-indigo-500" />
              {employee.jobTitle || "N/A"}
            </div>
            <div className="text-xs text-gray-400 flex items-center mt-1">
              <span className="font-mono">
                ID: {employee.employeeId || "N/A"}
              </span>
              <span className="mx-2">•</span>
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                {calculateTenure(employee.joiningDate)}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Contact Info */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-sm text-gray-500 group/email">
            <Mail className="h-4 w-4 mr-1.5 text-indigo-500" />
            <span className="truncate max-w-[180px]">
              {employee.email || "N/A"}
            </span>
            {employee.email && (
              <button
                onClick={() => copyToClipboard(employee.email, "Email")}
                className="ml-2 opacity-0 group-hover/email:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
                title="Copy email"
              >
                <Copy className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500 group/phone">
            <Phone className="h-4 w-4 mr-1.5 text-indigo-500" />
            <span>{employee.phoneNumber || "N/A"}</span>
            {employee.phoneNumber && (
              <button
                onClick={() => copyToClipboard(employee.phoneNumber, "Phone")}
                className="ml-2 opacity-0 group-hover/phone:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
                title="Copy phone"
              >
                <Copy className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </td>

      {/* Location/Department */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1.5 text-indigo-500" />
            <span>{employee.location || "N/A"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Building className="h-4 w-4 mr-1.5 text-indigo-500" />
            <span>{employee.department || "N/A"}</span>
          </div>
          <div className="flex items-center text-xs">
            <span className={`flex items-center ${performance.color}`}>
              {performance.icon}
              <span className="ml-1">{performance.label}</span>
            </span>
          </div>
        </div>
      </td>

      {/* Joining Date/Salary */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1.5 text-indigo-500" />
            <span>{formatDate(employee.joiningDate)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <DollarSign className="h-4 w-4 mr-1.5 text-indigo-500" />
            <span className="font-medium">{formatSalary(employee.salary)}</span>
          </div>
          <div className="text-xs text-gray-400">
            {employee.manager && <span>Manager: {employee.manager}</span>}
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col items-start space-y-2">
          <span
            className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${statusDisplay.bgColor} ${statusDisplay.textColor} ${statusDisplay.borderColor} border ${statusDisplay.pulse}`}
          >
            {statusDisplay.icon}
            {employee.status || "Active"}
          </span>

          {/* Quick Status Indicators */}
          <div className="flex items-center space-x-1">
            {employee.isAdmin && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                Admin
              </span>
            )}
            {employee.roleLevel <= 6 && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                Manager
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-1">
          {/* Quick Action Buttons */}
          <button
            onClick={() => onView && onView(employee)}
            className="text-indigo-600 hover:text-white p-2 rounded-lg hover:bg-indigo-600 transition-all duration-200 group/btn"
            title="View Profile"
            onMouseEnter={() => setShowTooltip("View Profile")}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <Eye className="h-4 w-4" />
          </button>

          {userPermissions.canEdit && (
            <button
              onClick={() => onEdit && onEdit(employee)}
              className="text-blue-600 hover:text-white p-2 rounded-lg hover:bg-blue-600 transition-all duration-200"
              title="Edit Employee"
              onMouseEnter={() => setShowTooltip("Edit Employee")}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}

          {/* Quick Email */}
          <button
            onClick={() => handleQuickActionWithLoading("email")}
            className="text-green-600 hover:text-white p-2 rounded-lg hover:bg-green-600 transition-all duration-200"
            title="Send Email"
            disabled={isActionLoading}
            onMouseEnter={() => setShowTooltip("Send Email")}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <Mail className="h-4 w-4" />
          </button>

          {/* More Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() =>
                setShowDropdown(
                  showDropdown === employee.employeeId
                    ? null
                    : employee.employeeId
                )
              }
              className="text-gray-600 hover:text-white p-2 rounded-lg hover:bg-gray-600 transition-all duration-200"
              title="More Actions"
              onMouseEnter={() => setShowTooltip("More Actions")}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {showDropdown === employee.employeeId && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-md shadow-xl border border-gray-200 z-30 py-1">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {employee.name}
                  </p>
                  <p className="text-xs text-gray-500">{employee.employeeId}</p>
                </div>

                {/* Communication Actions */}
                <div className="py-1">
                  <button
                    onClick={() => handleQuickActionWithLoading("call")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    disabled={isActionLoading}
                  >
                    <Phone className="w-4 h-4 mr-3" />
                    Call Employee
                  </button>

                  <button
                    onClick={() => handleQuickActionWithLoading("email")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    disabled={isActionLoading}
                  >
                    <Mail className="w-4 h-4 mr-3" />
                    Send Email
                  </button>

                  <button
                    onClick={() => handleQuickActionWithLoading("message")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    disabled={isActionLoading}
                  >
                    <MessageSquare className="w-4 h-4 mr-3" />
                    Send Message
                  </button>
                </div>

                <div className="border-t border-gray-100"></div>

                {/* View Actions */}
                <div className="py-1">
                  {userPermissions.canViewDocuments && (
                    <button
                      onClick={() => handleQuickActionWithLoading("documents")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      disabled={isActionLoading}
                    >
                      <FileText className="w-4 h-4 mr-3" />
                      View Documents
                    </button>
                  )}

                  {userPermissions.canViewAttendance && (
                    <button
                      onClick={() => handleQuickActionWithLoading("attendance")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      disabled={isActionLoading}
                    >
                      <Calendar className="w-4 h-4 mr-3" />
                      View Attendance
                    </button>
                  )}

                  <button
                    onClick={() => handleQuickActionWithLoading("performance")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    disabled={isActionLoading}
                  >
                    <TrendingUp className="w-4 h-4 mr-3" />
                    Performance
                  </button>
                </div>

                <div className="border-t border-gray-100"></div>

                {/* Management Actions */}
                <div className="py-1">
                  <button
                    onClick={() =>
                      window.open(
                        `/employee/${employee.employeeId}/profile`,
                        "_blank"
                      )
                    }
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <ExternalLink className="w-4 h-4 mr-3" />
                    Open Profile
                  </button>

                  <button
                    onClick={() => handleQuickActionWithLoading("export")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    disabled={isActionLoading}
                  >
                    <Download className="w-4 h-4 mr-3" />
                    Export Data
                  </button>
                </div>

                {userPermissions.canDelete && (
                  <>
                    <div className="border-t border-gray-100"></div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowDropdown(null);
                          onDelete && onDelete(employee.employeeId);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-3" />
                        Delete Employee
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-40 -mt-8 transform -translate-x-1/2">
            {showTooltip}
          </div>
        )}
      </td>
    </tr>
  );
};

export default EmployeeRow;
