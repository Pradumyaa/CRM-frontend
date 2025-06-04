import React, { useState, useEffect } from "react";
import {
  FolderOpen,
  Upload,
  Download,
  Trash2,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  File,
  Image,
  Folder,
  Users,
  Building,
  Calendar,
  MoreHorizontal,
  Edit,
  Share,
  Star,
  Archive,
} from "lucide-react";

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedDocType, setSelectedDocType] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    employeeId: "",
    documentType: "",
    file: null,
  });
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalEmployees: 0,
    documentTypes: 0,
    recentUploads: 0,
  });

  // Document types
  const documentTypes = [
    { id: "contract", name: "Contract", icon: FileText },
    { id: "identification", name: "ID Documents", icon: File },
    { id: "payroll", name: "Payroll", icon: FileText },
    { id: "certificate", name: "Certificates", icon: Star },
    { id: "resume", name: "Resume/CV", icon: FileText },
    { id: "photo", name: "Photos", icon: Image },
    { id: "other", name: "Other", icon: File },
  ];

  // Get auth token
  const getAuthToken = () => localStorage.getItem("token");

  // API call wrapper
  const apiCall = async (url, options = {}) => {
    const token = getAuthToken();
    const response = await fetch(`http://localhost:3000/api${url}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API call failed");
    }

    return response.json();
  };

  // Fetch all documents
  const fetchDocuments = async () => {
    try {
      const response = await apiCall("/documents/all");
      return response.documents || [];
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      return [];
    }
  };

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const response = await apiCall("/employees");
      return response.employees || [];
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      return [];
    }
  };

  // Fetch document stats
  const fetchDocumentStats = async () => {
    try {
      const response = await apiCall("/documents/stats");
      return response.stats || {};
    } catch (error) {
      console.error("Failed to fetch document stats:", error);
      return {};
    }
  };

  // Upload document
  const uploadDocument = async (file, employeeId, documentType) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("employeeId", employeeId);
      formData.append("documentType", documentType);

      const token = getAuthToken();
      const response = await fetch(
        "http://localhost:3000/api/documents/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  };

  // Delete document
  const deleteDocument = async (documentId) => {
    try {
      await apiCall(`/documents/${documentId}`, {
        method: "DELETE",
      });
    } catch (error) {
      throw error;
    }
  };

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [documentsData, employeesData, statsData] = await Promise.all([
        fetchDocuments(),
        fetchEmployees(),
        fetchDocumentStats(),
      ]);

      setDocuments(documentsData);
      setEmployees(employeesData);
      setStats({
        totalDocuments: statsData.totalDocuments || documentsData.length,
        totalEmployees: statsData.totalEmployees || employeesData.length,
        documentTypes: statsData.documentsByType
          ? Object.keys(statsData.documentsByType).length
          : documentTypes.length,
        recentUploads: documentsData.filter((doc) => {
          const uploadDate = new Date(doc.createdAt || doc.uploadDate);
          const today = new Date();
          const timeDiff = today - uploadDate;
          return timeDiff < 24 * 60 * 60 * 1000; // Last 24 hours
        }).length,
      });
    } catch (error) {
      setError(`Failed to load data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (
      !uploadData.file ||
      !uploadData.employeeId ||
      !uploadData.documentType
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await uploadDocument(
        uploadData.file,
        uploadData.employeeId,
        uploadData.documentType
      );

      setSuccess("Document uploaded successfully!");
      setShowUploadModal(false);
      setUploadData({ employeeId: "", documentType: "", file: null });
      await loadData();
    } catch (error) {
      setError(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (documentId, documentName) => {
    if (!window.confirm(`Are you sure you want to delete "${documentName}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteDocument(documentId);
      setSuccess("Document deleted successfully!");
      await loadData();
    } catch (error) {
      setError(`Failed to delete document: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    loadData();
  }, []);

  // Clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmployee =
      selectedEmployee === "all" || doc.employeeId === selectedEmployee;
    const matchesType =
      selectedDocType === "all" || doc.documentType === selectedDocType;

    return matchesSearch && matchesEmployee && matchesType;
  });

  // Get employee name
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(
      (emp) => emp.employeeId === employeeId || emp.id === employeeId
    );
    return employee?.name || employeeId || "Unknown";
  };

  // Get file size in readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (fileName, documentType) => {
    const extension = fileName?.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "bmp"].includes(extension)) {
      return Image;
    }

    const docType = documentTypes.find((type) => type.id === documentType);
    return docType?.icon || File;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Upload Modal Component
  const UploadModal = () => {
    if (!showUploadModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Upload Document</h3>
            <button
              onClick={() => {
                setShowUploadModal(false);
                setUploadData({ employeeId: "", documentType: "", file: null });
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee *
              </label>
              <select
                value={uploadData.employeeId}
                onChange={(e) =>
                  setUploadData({ ...uploadData, employeeId: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option
                    key={emp.employeeId || emp.id}
                    value={emp.employeeId || emp.id}
                  >
                    {emp.name} ({emp.employeeId || emp.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type *
              </label>
              <select
                value={uploadData.documentType}
                onChange={(e) =>
                  setUploadData({ ...uploadData, documentType: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Document Type</option>
                {documentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File *
              </label>
              <input
                type="file"
                onChange={(e) =>
                  setUploadData({ ...uploadData, file: e.target.files[0] })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
                required
              />
              {uploadData.file && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {uploadData.file.name} (
                  {formatFileSize(uploadData.file.size)})
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setShowUploadModal(false);
                setUploadData({ employeeId: "", documentType: "", file: null });
              }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleFileUpload}
              disabled={
                loading ||
                !uploadData.file ||
                !uploadData.employeeId ||
                !uploadData.documentType
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FolderOpen className="h-8 w-8 text-blue-600 mr-3" />
              Documents Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage employee documents and files
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </button>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
            <button onClick={() => setSuccess(null)} className="ml-auto">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalDocuments}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Employees with Docs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalEmployees}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Document Types</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.documentTypes}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Folder className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recent Uploads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.recentUploads}
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Upload className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Employees</option>
              {employees.map((emp) => (
                <option
                  key={emp.employeeId || emp.id}
                  value={emp.employeeId || emp.id}
                >
                  {emp.name}
                </option>
              ))}
            </select>

            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Document Types</option>
              {documentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>

            <div className="text-sm text-gray-600">
              Showing {filteredDocuments.length} of {documents.length}
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="bg-white rounded-lg border overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Loading documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="p-12 text-center">
              <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No documents found</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upload First Document
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Document
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((document) => {
                    const FileIcon = getFileIcon(
                      document.name,
                      document.documentType
                    );
                    const docType = documentTypes.find(
                      (type) => type.id === document.documentType
                    );

                    return (
                      <tr key={document.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-blue-100 mr-4">
                              <FileIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {document.name || "Untitled Document"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {document.type || "Unknown type"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getEmployeeName(document.employeeId)}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {document.employeeId || "N/A"}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {docType?.name || document.documentType || "Other"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatFileSize(document.size || 0)}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(
                            document.createdAt || document.uploadDate
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {document.url && (
                              <a
                                href={document.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="View Document"
                              >
                                <Eye className="h-4 w-4" />
                              </a>
                            )}
                            {document.url && (
                              <a
                                href={document.url}
                                download
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Download Document"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            )}
                            <button
                              onClick={() =>
                                handleDeleteDocument(document.id, document.name)
                              }
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete Document"
                              disabled={loading}
                            >
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
          )}
        </div>

        {/* Document Types Overview */}
        <div className="mt-8 bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">
            Document Types Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {documentTypes.map((type) => {
              const count = documents.filter(
                (doc) => doc.documentType === type.id
              ).length;
              const IconComponent = type.icon;

              return (
                <div
                  key={type.id}
                  className="p-4 border rounded-lg text-center"
                >
                  <div className="flex justify-center mb-2">
                    <div className="p-3 rounded-full bg-gray-100">
                      <IconComponent className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {type.name}
                  </div>
                  <div className="text-lg font-bold text-blue-600">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal />
    </div>
  );
};

export default DocumentsPage;
