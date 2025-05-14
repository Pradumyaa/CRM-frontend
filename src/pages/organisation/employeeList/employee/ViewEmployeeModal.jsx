import React from "react";
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  Briefcase, 
  Clock,
  FileText,
  Hash,
  Download
} from "lucide-react";

const ViewEmployeeModal = ({ isOpen, onClose, employee }) => {
  if (!isOpen || !employee) return null;

  // Format salary with appropriate currency
  const formatSalary = (salary) => {
    if (!salary && salary !== 0) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  // Format joining date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Calculate tenure
  const calculateTenure = (joiningDate) => {
    if (!joiningDate) return "N/A";
    try {
      const joinDate = new Date(joiningDate);
      const now = new Date();
      
      let years = now.getFullYear() - joinDate.getFullYear();
      let months = now.getMonth() - joinDate.getMonth();
      
      if (months < 0) {
        years--;
        months += 12;
      }
      
      if (years === 0) {
        return months === 1 ? "1 month" : `${months} months`;
      } else if (months === 0) {
        return years === 1 ? "1 year" : `${years} years`;
      } else {
        return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
      }
    } catch (error) {
      return "N/A";
    }
  };

  // Get first letter for avatar
  const getInitial = (name) => {
    return name && name.length > 0 ? name.charAt(0).toUpperCase() : "?";
  };
  
  // Check if resume exists in localStorage
  const checkResumeInStorage = () => {
    if (employee.employeeId) {
      const storedResume = localStorage.getItem(`resume_${employee.employeeId}`);
      return !!storedResume;
    }
    return false;
  };
  
  // Handle resume download
  const handleResumeDownload = () => {
    if (employee.employeeId) {
      const storedResume = localStorage.getItem(`resume_${employee.employeeId}`);
      if (storedResume) {
        // Create a temporary download link
        const link = document.createElement('a');
        link.href = storedResume;
        link.download = `${employee.name || 'employee'}_resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const hasResume = employee.resume || checkResumeInStorage();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden" style={{ maxHeight: "90vh" }}>
        {/* Header */}
        <div className="bg-indigo-600 p-6 relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-indigo-600 text-2xl font-bold">
              {getInitial(employee.name)}
            </div>
            <div className="ml-4">
              <h2 className="text-white text-xl font-medium">{employee.name || "N/A"}</h2>
              <p className="text-white/80">{employee.jobTitle || "N/A"}</p>
            </div>
          </div>
          
          <div className="absolute bottom-0 right-6 transform translate-y-1/2">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
              {employee.status || "Active"}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: "calc(90vh - 96px)" }}>
          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl mb-6">
            <div>
              <p className="text-gray-500 text-xs mb-1">Email Address</p>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-indigo-500 mr-2" />
                <p className="text-gray-700 font-medium text-sm">{employee.email || "shuklag858@gmail.com"}</p>
              </div>
            </div>
            
            <div>
              <p className="text-gray-500 text-xs mb-1">Phone Number</p>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-indigo-500 mr-2" />
                <p className="text-gray-700 font-medium text-sm">{employee.phoneNumber || "08265118331"}</p>
              </div>
            </div>
            
            <div>
              <p className="text-gray-500 text-xs mb-1">Employee ID</p>
              <div className="flex items-center">
                <Hash className="h-4 w-4 text-indigo-500 mr-2" />
                <p className="text-gray-700 font-medium text-sm">{employee.employeeId || "INT4613"}</p>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-5 gap-6">
            {/* Left Column (3/5 width) */}
            <div className="col-span-3 space-y-6">
              {/* Employment Information */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center p-4 border-b border-gray-100">
                  <Briefcase className="h-5 w-5 text-indigo-500 mr-2" />
                  <h3 className="text-gray-700 font-medium">Employment Information</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Department</p>
                      <p className="text-gray-700">{employee.department || "N/A"}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Manager</p>
                      <p className="text-gray-700">{employee.manager || "N/A"}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Location</p>
                      <p className="text-gray-700">{employee.location || "N/A"}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Salary</p>
                      <p className="text-gray-700">{formatSalary(employee.salary || 3000)}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Joining Date</p>
                      <p className="text-gray-700">{formatDate(employee.joiningDate || "2025-02-20")}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Tenure</p>
                      <p className="text-gray-700">{calculateTenure(employee.joiningDate || "2025-02-20")}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Address Information */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center p-4 border-b border-gray-100">
                  <MapPin className="h-5 w-5 text-indigo-500 mr-2" />
                  <h3 className="text-gray-700 font-medium">Address Information</h3>
                </div>
                <div className="p-4">
                  {employee.address ? (
                    <>
                      <div className="mb-3">
                        <p className="text-gray-500 text-xs mb-1">Street</p>
                        <p className="text-gray-700">{employee.address.street || "Madhav Enterprise, Shop No F6, Plot No-252, Shreenath Complex, Near 17/22 Bus Stop, Sector 22"}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">City</p>
                          <p className="text-gray-700">{employee.address.city || "Gandhinagar"}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-500 text-xs mb-1">State/Province</p>
                          <p className="text-gray-700">{employee.address.state || "Gujarat"}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Zip/Postal Code</p>
                          <p className="text-gray-700">{employee.address.zipCode || "382355"}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Country</p>
                          <p className="text-gray-700">{employee.address.country || "India"}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 text-center">No address information available</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column (2/5 width) */}
            <div className="col-span-2 space-y-6">
              {/* Quick Actions */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-gray-700 font-medium">Quick Actions</h3>
                </div>
                <div className="p-3">
                  <button className="w-full mb-2 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 p-3 rounded-lg transition-colors">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </button>
                  
                  <button className="w-full mb-2 flex items-center justify-center bg-green-50 hover:bg-green-100 text-green-600 p-3 rounded-lg transition-colors">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Employee
                  </button>
                  
                  {hasResume ? (
                    <button 
                      onClick={handleResumeDownload}
                      className="w-full flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-3 rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </button>
                  ) : (
                    <button className="w-full flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-lg transition-colors">
                      <FileText className="h-4 w-4 mr-2" />
                      View Documents
                    </button>
                  )}
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-gray-700 font-medium">Additional Info</h3>
                </div>
                <div className="p-4">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Created At</p>
                    <p className="text-gray-700">
                      {employee.createdAt ? formatDate(employee.createdAt) : formatDate(new Date())}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
      
      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
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

export default ViewEmployeeModal;