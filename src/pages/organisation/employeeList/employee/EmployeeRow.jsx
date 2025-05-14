import React from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Edit2,
  Trash2,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Award,
  RefreshCw,
  Clock,
  AlertTriangle,
} from "lucide-react";

const EmployeeRow = ({
  employee,
  index,
  showDropdown,
  setShowDropdown,
  onEdit,
  onDelete,
  onView, // Make sure this prop is passed correctly
}) => {
  const isEven = index % 2 === 0;

  // Get status icon and colors
  const getStatusDisplay = (status) => {
    switch (status) {
      case "Active":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          borderColor: "border-green-400",
          icon: <CheckCircle className="h-4 w-4 mr-1.5 text-green-600" />,
        };
      case "Inactive":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          borderColor: "border-red-400",
          icon: <XCircle className="h-4 w-4 mr-1.5 text-red-600" />,
        };
      case "On Leave":
        return {
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-400",
          icon: <Clock className="h-4 w-4 mr-1.5 text-yellow-600" />,
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          borderColor: "border-gray-400",
          icon: <AlertTriangle className="h-4 w-4 mr-1.5 text-gray-600" />,
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

  // Handle dropdown menu
  const handleDropdownToggle = (e) => {
    e.stopPropagation();
    setShowDropdown(
      showDropdown === employee.employeeId ? null : employee.employeeId
    );
  };

  // Add hover animation to the row
  const rowHoverClass =
    "transition-transform duration-150 ease-in-out hover:scale-[1.01] hover:shadow-md";

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
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div
              className={`h-10 w-10 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-semibold text-sm shadow-sm`}
            >
              {employee.name ? employee.name.charAt(0).toUpperCase() : "?"}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {employee.name || "N/A"}
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <Award className="h-3 w-3 mr-1 text-indigo-500" />
              {employee.jobTitle || "N/A"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="flex items-center text-sm text-gray-500">
            <Mail className="h-4 w-4 mr-1.5 text-indigo-500" />
            {employee.email || "N/A"}
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Phone className="h-4 w-4 mr-1.5 text-indigo-500" />
            {employee.phoneNumber || "N/A"}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1.5 text-indigo-500" />
            {employee.location || "N/A"}
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Briefcase className="h-4 w-4 mr-1.5 text-indigo-500" />
            {employee.department || "N/A"}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1.5 text-indigo-500" />
            {formatDate(employee.joiningDate)}
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <DollarSign className="h-4 w-4 mr-1.5 text-indigo-500" />
            {formatSalary(employee.salary)}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${statusDisplay.bgColor} ${statusDisplay.textColor} ${statusDisplay.borderColor} border`}
        >
          {statusDisplay.icon}
          {employee.status || "Unknown"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-1 relative">
          <button
            onClick={() => onView && onView(employee)} // Make sure this is correctly passing the employee
            className="text-indigo-600 hover:text-white p-1.5 rounded hover:bg-indigo-600 transition-colors duration-200 tooltip-trigger"
            title="View Profile"
          >
            <Eye className="h-4 w-4" />
            <span className="tooltip">View</span>
          </button>
          <button
            onClick={() => onEdit && onEdit(employee)}
            className="text-blue-600 hover:text-white p-1.5 rounded hover:bg-blue-600 transition-colors duration-200 tooltip-trigger"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
            <span className="tooltip">Edit</span>
          </button>
          <button
            onClick={() =>
              onDelete && onDelete(employee.employeeId || employee._id)
            }
            className="text-red-600 hover:text-white p-1.5 rounded hover:bg-red-600 transition-colors duration-200 tooltip-trigger"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
            <span className="tooltip">Delete</span>
          </button>
          <div className="relative">
            <button
              onClick={handleDropdownToggle}
              className="text-gray-600 hover:text-white p-1.5 rounded hover:bg-gray-700 transition-colors duration-200 tooltip-trigger"
              title="More Options"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="tooltip">More</span>
            </button>

            {showDropdown === employee.employeeId && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                <div className="py-1 rounded-md bg-white">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Send email to ${employee.name}`);
                    }}
                    className="flex w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <Mail className="h-4 w-4 mr-2 text-indigo-500" />
                    Send Email
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Reset password for ${employee.name}`);
                    }}
                    className="flex w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-2 text-indigo-500" />
                    Reset Password
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Manage permissions for ${employee.name}`);
                    }}
                    className="flex w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <Award className="h-4 w-4 mr-2 text-indigo-500" />
                    Manage Permissions
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tooltip styles */}
        <style jsx>{`
          .tooltip-trigger {
            position: relative;
          }
          .tooltip {
            visibility: hidden;
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #1e293b;
            color: white;
            text-align: center;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 10;
          }
          .tooltip::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #1e293b transparent transparent transparent;
          }
          .tooltip-trigger:hover .tooltip {
            visibility: visible;
            opacity: 1;
          }
        `}</style>
      </td>
    </tr>
  );
};

export default EmployeeRow;
