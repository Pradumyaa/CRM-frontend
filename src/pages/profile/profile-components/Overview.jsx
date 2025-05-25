import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Briefcase,
  Info,
} from "lucide-react";
import { useState } from "react";

const Overview = ({ employeeData }) => {
  const [showAdminInfo, setShowAdminInfo] = useState(false);

  // Format address from address object
  const formatAddress = (address) => {
    if (!address) return "No address information available";

    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country,
    ].filter(Boolean);

    return parts.length > 0
      ? parts.join(", ")
      : "No address information available";
  };

  // Check if the employee is admin
  const isAdmin = employeeData?.isAdmin === true;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Profile Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2 font-medium">About Me</p>
          <p className="text-gray-700 text-sm">
            {employeeData.aboutMe ||
              `I am a dedicated professional with expertise in ${
                employeeData.jobTitle || "my field"
              }. I enjoy collaborating with cross-functional teams to deliver innovative solutions that meet business objectives.`}
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2 font-medium">Address</p>
          <p className="text-gray-700 text-sm">
            {formatAddress(employeeData.address)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-start hover:shadow-md transition-shadow">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
            <Mail size={18} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Email Address</p>
            <p className="text-gray-700 font-medium break-all">
              {employeeData.email || "email@example.com"}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-start hover:shadow-md transition-shadow">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
            <Phone size={18} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Phone Number</p>
            <p className="text-gray-700 font-medium">
              {employeeData.phoneNumber || "Not provided"}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-start hover:shadow-md transition-shadow">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Date of Joining</p>
            <p className="text-gray-700 font-medium">
              {employeeData.joiningDate
                ? new Date(employeeData.joiningDate).toLocaleDateString()
                : "Not available"}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-start hover:shadow-md transition-shadow">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
            <Briefcase size={18} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Department</p>
            <p className="text-gray-700 font-medium">
              {employeeData.department || "Not assigned"}
            </p>
          </div>
        </div>

        {/* Salary - Only visible to admins or the employee themselves */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-start hover:shadow-md transition-shadow relative">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
            <DollarSign size={18} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Salary</p>
            <p className="text-gray-700 font-medium">
              {employeeData.salary
                ? `₹${employeeData.salary.toLocaleString()} per month`
                : "Not available"}
            </p>
          </div>

          {/* Info icon for salary information - Optional for demonstration */}
          <div
            className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600 cursor-pointer"
            onMouseEnter={() => setShowAdminInfo(true)}
            onMouseLeave={() => setShowAdminInfo(false)}
          >
            <Info size={16} />

            {showAdminInfo && (
              <div className="absolute right-0 top-full mt-1 p-2 bg-white rounded-md shadow-lg border text-xs text-gray-600 w-48 z-10">
                Salary information is only visible to the employee and
                administrators.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-start hover:shadow-md transition-shadow">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
            <User size={18} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <div className="mt-1">
              <span
                className={`px-3 py-1 rounded-md inline-block font-medium text-sm
                            ${
                              employeeData.status === "Inactive"
                                ? "bg-red-100 text-red-600"
                                : employeeData.status === "On Leave"
                                ? "bg-yellow-100 text-yellow-600"
                                : employeeData.status === "Resigned"
                                ? "bg-gray-100 text-gray-600"
                                : employeeData.status === "Absconded"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-600"
                            }`}
              >
                {employeeData.status || "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Admin Badge - Only visible if employee is admin */}
        {isAdmin && (
          <div className="md:col-span-2 bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200 shadow-sm">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center text-purple-600 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
                  <path d="M12 8v8"></path>
                  <path d="M12 16l-4-4"></path>
                  <path d="M12 16l4-4"></path>
                </svg>
              </div>
              <div>
                <p className="font-medium text-purple-800">
                  Administrator Access
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  This employee has system administrator privileges
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
