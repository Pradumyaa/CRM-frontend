import { Mail, Phone, MapPin, Calendar, DollarSign, User, Briefcase } from "lucide-react";

const Overview = ({ employeeData }) => {
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
              "I am a dedicated professional with expertise in web development and UI/UX design. I enjoy collaborating with cross-functional teams to deliver innovative solutions that meet business objectives."}
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2 font-medium">Address</p>
          <p className="text-gray-700 text-sm">
            {employeeData.address
              ? `${employeeData.address.street || ""}, ${
                  employeeData.address.city || ""
                }, ${employeeData.address.state || ""} ${
                  employeeData.address.zipCode || ""
                }, ${employeeData.address.country || ""}`
              : "123 Main Street, Bangalore, Karnataka 560001, India"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-start hover:shadow-md transition-shadow">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
            <Mail size={18} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Email Address</p>
            <p className="text-gray-700 font-medium">
              {employeeData.email || "employee@company.com"}
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
              {employeeData.phoneNumber || "+91 9876543210"}
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
              {employeeData.joiningDate ? new Date(employeeData.joiningDate).toLocaleDateString() : "01-Jan-2023"}
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
              {employeeData.department || "Engineering"}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-start hover:shadow-md transition-shadow">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
            <DollarSign size={18} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Salary</p>
            <p className="text-gray-700 font-medium">
              ₹{employeeData.salary?.toLocaleString() || "75,000"} per month
            </p>
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
                                : "bg-green-100 text-green-600"
                            }`}
              >
                {employeeData.status || "Active"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;