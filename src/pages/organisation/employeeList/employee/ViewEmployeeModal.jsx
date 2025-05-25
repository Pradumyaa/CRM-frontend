import React, { useState } from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Briefcase,
  Hash,
  FileText,
  Download,
  Eye,
  ExternalLink,
} from "lucide-react";
import documentService from "../../../../services/DocumentService"

const ViewEmployeeModal = ({ isOpen, onClose, employee }) => {
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [documents, setDocuments] = useState([]);

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
        return `${years} year${years > 1 ? "s" : ""}, ${months} month${
          months > 1 ? "s" : ""
        }`;
      }
    } catch (error) {
      return "N/A";
    }
  };

  // Get first letter for avatar
  const getInitial = (name) => {
    return name && name.length > 0 ? name.charAt(0).toUpperCase() : "?";
  };

  // Handle sending email
  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Regarding: ${employee.name}`);
    const body = encodeURIComponent(`Dear ${employee.name},\n\n`);
    const mailtoLink = `mailto:${employee.email}?subject=${subject}&body=${body}`;
    window.open(mailtoLink, "_blank");
  };

  // Handle calling employee
  const handleCallEmployee = () => {
    const telLink = `tel:${employee.phoneNumber}`;
    window.open(telLink, "_self");
  };

  // Handle view documents - fetch from backend using DocumentService
  const handleViewDocuments = async () => {
    if (showDocuments) {
      setShowDocuments(false);
      return;
    }

    setDocumentsLoading(true);
    try {
      // Ensure token is set in DocumentService
      const token = localStorage.getItem("token");
      if (token) {
        documentService.setToken(token);
      }

      // Use DocumentService to fetch documents
      const fetchedDocuments = await documentService.getEmployeeDocuments(
        employee.employeeId
      );

      console.log("Fetched documents:", fetchedDocuments);
      setDocuments(fetchedDocuments || []);
      setShowDocuments(true);
    } catch (error) {
      console.error("Error fetching documents:", error);

      // Provide more specific error messaging
      let errorMessage = "Error fetching documents. Please try again.";
      if (error.message && error.message.includes("401")) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error.message && error.message.includes("403")) {
        errorMessage = "You don't have permission to view these documents.";
      } else if (error.message && error.message.includes("404")) {
        errorMessage = "No documents found for this employee.";
        // Still show the documents section but with empty state
        setDocuments([]);
        setShowDocuments(true);
        setDocumentsLoading(false);
        return;
      }

      alert(errorMessage);
    } finally {
      setDocumentsLoading(false);
    }
  };

  // Handle document download
  const handleDownloadDocument = (doc) => {
    window.open(doc.url, "_blank");
  };

  // Handle document view
  const handleViewDocument = (doc) => {
    window.open(doc.url, "_blank");
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  // Get document type display name
  const getDocumentTypeDisplay = (type) => {
    const types = {
      contract: "Employment Contract",
      payroll: "Payroll Information",
      performance: "Performance Review",
      resume: "Resume/CV",
      identification: "ID Documents",
      certifications: "Certifications",
      other: "Other Documents",
    };
    return types[type] || type;
  };

  // Get document type icon
  const getDocumentTypeIcon = (type) => {
    switch (type) {
      case "contract":
        return "📋";
      case "payroll":
        return "💰";
      case "performance":
        return "📊";
      case "resume":
        return "📄";
      case "identification":
        return "🆔";
      case "certifications":
        return "🏆";
      default:
        return "📁";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
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
              <h2 className="text-white text-xl font-medium">
                {employee.name || "N/A"}
              </h2>
              <p className="text-white/80">{employee.jobTitle || "N/A"}</p>
            </div>
          </div>

          <div className="absolute bottom-0 right-6 transform translate-y-1/2">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${
                employee.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : employee.status === "Inactive"
                  ? "bg-red-100 text-red-800"
                  : employee.status === "On Leave"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full mr-1.5 ${
                  employee.status === "Active"
                    ? "bg-green-500"
                    : employee.status === "Inactive"
                    ? "bg-red-500"
                    : employee.status === "On Leave"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
                }`}
              ></span>
              {employee.status || "Active"}
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="p-6 overflow-y-auto custom-scrollbar"
          style={{ maxHeight: "calc(90vh - 96px)" }}
        >
          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl mb-6">
            <div>
              <p className="text-gray-500 text-xs mb-1">Email Address</p>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-indigo-500 mr-2" />
                <p className="text-gray-700 font-medium text-sm truncate">
                  {employee.email || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-xs mb-1">Phone Number</p>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-indigo-500 mr-2" />
                <p className="text-gray-700 font-medium text-sm">
                  {employee.phoneNumber || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-xs mb-1">Employee ID</p>
              <div className="flex items-center">
                <Hash className="h-4 w-4 text-indigo-500 mr-2" />
                <p className="text-gray-700 font-medium text-sm">
                  {employee.employeeId || "N/A"}
                </p>
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
                  <h3 className="text-gray-700 font-medium">
                    Employment Information
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Department</p>
                      <p className="text-gray-700">
                        {employee.department || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-xs mb-1">Manager</p>
                      <p className="text-gray-700">
                        {employee.manager || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-xs mb-1">Location</p>
                      <p className="text-gray-700">
                        {employee.location || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-xs mb-1">Salary</p>
                      <p className="text-gray-700">
                        {formatSalary(employee.salary)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-xs mb-1">Joining Date</p>
                      <p className="text-gray-700">
                        {formatDate(employee.joiningDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-xs mb-1">Tenure</p>
                      <p className="text-gray-700">
                        {calculateTenure(employee.joiningDate)}
                      </p>
                    </div>
                  </div>

                  {employee.description && (
                    <div className="mt-4">
                      <p className="text-gray-500 text-xs mb-1">Description</p>
                      <p className="text-gray-700">{employee.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center p-4 border-b border-gray-100">
                  <MapPin className="h-5 w-5 text-indigo-500 mr-2" />
                  <h3 className="text-gray-700 font-medium">
                    Address Information
                  </h3>
                </div>
                <div className="p-4">
                  {employee.address ? (
                    <>
                      <div className="mb-3">
                        <p className="text-gray-500 text-xs mb-1">Street</p>
                        <p className="text-gray-700">
                          {employee.address.street || "N/A"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">City</p>
                          <p className="text-gray-700">
                            {employee.address.city || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500 text-xs mb-1">
                            State/Province
                          </p>
                          <p className="text-gray-700">
                            {employee.address.state || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500 text-xs mb-1">
                            Zip/Postal Code
                          </p>
                          <p className="text-gray-700">
                            {employee.address.zipCode || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500 text-xs mb-1">Country</p>
                          <p className="text-gray-700">
                            {employee.address.country || "N/A"}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 text-center">
                      No address information available
                    </p>
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
                  <button
                    onClick={handleSendEmail}
                    className="w-full mb-2 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 p-3 rounded-lg transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </button>

                  <button
                    onClick={handleCallEmployee}
                    className="w-full mb-2 flex items-center justify-center bg-green-50 hover:bg-green-100 text-green-600 p-3 rounded-lg transition-colors"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Employee
                  </button>

                  <button
                    onClick={handleViewDocuments}
                    disabled={documentsLoading}
                    className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      showDocuments
                        ? "bg-purple-100 text-purple-700 border border-purple-300"
                        : "bg-purple-50 hover:bg-purple-100 text-purple-600"
                    }`}
                  >
                    {documentsLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        {showDocuments ? "Hide Documents" : "View Documents"}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-gray-700 font-medium">Additional Info</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Created At</p>
                    <p className="text-gray-700">
                      {employee.createdAt
                        ? formatDate(employee.createdAt)
                        : formatDate(new Date())}
                    </p>
                  </div>

                  {employee.updatedAt && (
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Last Updated</p>
                      <p className="text-gray-700">
                        {formatDate(employee.updatedAt)}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-gray-500 text-xs mb-1">Admin Status</p>
                    <p className="text-gray-700">
                      {employee.isAdmin ? (
                        <span className="text-indigo-600 font-medium">
                          Administrator
                        </span>
                      ) : (
                        <span className="text-gray-600">Regular Employee</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section - Expandable */}
          {showDocuments && (
            <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-purple-50">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 text-purple-500 mr-2" />
                  Documents ({documents.length})
                </h3>
                <button
                  onClick={() => setShowDocuments(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-white/50 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4">
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-500 mb-2">
                      No documents found
                    </h4>
                    <p className="text-gray-400">
                      No documents have been uploaded for this employee yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center flex-1">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-200">
                            <span className="text-lg">
                              {getDocumentTypeIcon(doc.documentType)}
                            </span>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {doc.name}
                              </h4>
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {getDocumentTypeDisplay(doc.documentType)}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center text-xs text-gray-500">
                              <span>{formatFileSize(doc.size)}</span>
                              <span className="mx-2">•</span>
                              <span>
                                {doc.createdAt
                                  ? formatDate(doc.createdAt)
                                  : "Unknown date"}
                              </span>
                              {doc.type && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span className="uppercase">
                                    {doc.type.split("/")[1] || doc.type}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleViewDocument(doc)}
                            className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="View Document"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadDocument(doc)}
                            className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            title="Download Document"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => window.open(doc.url, "_blank")}
                            className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                            title="Open in New Tab"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
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
