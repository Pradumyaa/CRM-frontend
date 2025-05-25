import React, { useState, useEffect } from "react";
import {
  Filter,
  ChevronDown,
  FileText,
  Calendar,
  BarChart2,
  Users,
  RefreshCw,
  Plus,
  X,
} from "lucide-react";
import SearchBar from "@/pages/components/SearchBar";
import Pagination from "@/pages/components/Pagination";
import DocumentsTable from "./components/DocumentsTable";
import DocumentStatsCards from "./components/DocumentStatsCards";
import DocumentUploadModal from "./components/DocumentUploadModal";
import documentService from "../../../services/DocumentService";

const DocumentsPage = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [username, setUsername] = useState("");
  const [docStats, setDocStats] = useState({
    totalDocs: 0,
    uploadedDocs: 0,
    completionPercentage: 0,
  });
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  // Document types definition - Moved here for global access
  const documentTypes = [
    {
      id: "contract",
      label: "Employment Contract",
      required: true,
      color: "blue",
      description: "Official employment agreement between company and employee",
    },
    {
      id: "payroll",
      label: "Payroll Details",
      required: true,
      color: "orange",
      description: "Salary structure, tax information and payment details",
    },
    {
      id: "performance",
      label: "Performance Review",
      required: true,
      color: "purple",
      description: "Regular employee performance evaluation reports",
    },
    {
      id: "resume",
      label: "Resume",
      required: false,
      color: "green",
      description: "Employee's curriculum vitae and professional background",
    },
    {
      id: "identification",
      label: "Identification Documents",
      required: true,
      color: "red",
      description: "Government issued identification documents",
    },
    {
      id: "certifications",
      label: "Certifications",
      required: false,
      color: "indigo",
      description: "Professional certifications and qualifications",
    },
  ];

  // Get current user from localStorage
  useEffect(() => {
    const employeeId = localStorage.getItem("employeeId");
    if (employeeId) {
      fetchCurrentUser(employeeId);
    }
  }, []);

  // Fetch current user details
  const fetchCurrentUser = async (employeeId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await fetch(
        `http://localhost:3000/api/employees/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch current user");
      }

      const data = await response.json();
      setUsername(data.employee.name || "Admin User");
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  // Fetch employees and their documents
  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      // First get all employees
      const response = await fetch("http://localhost:3000/api/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const employeesData = await response.json();

      // For each employee, get their documents
      const employeesWithDocs = await Promise.all(
        employeesData.employees.map(async (emp) => {
          try {
            // Get documents from API
            const empDocs = await documentService.getEmployeeDocuments(
              emp.employeeId || emp._id
            );

            // Build a documents object to match the expected format
            const docsObject = {};
            documentTypes.forEach((docType) => {
              const foundDoc = empDocs.find(
                (d) => d.documentType === docType.id
              );
              if (foundDoc) {
                // Format as expected by the UI
                docsObject[docType.id] = JSON.stringify({
                  name: foundDoc.name,
                  type: foundDoc.type,
                  size: foundDoc.size,
                  date: foundDoc.createdAt || foundDoc.uploadDate,
                  dataUrl: foundDoc.url,
                  id: foundDoc.id,
                });
              } else {
                // Check localStorage as fallback during migration period
                const legacyDoc = localStorage.getItem(
                  `document_${docType.id}_${emp.employeeId || emp._id}`
                );
                if (legacyDoc) {
                  docsObject[docType.id] = legacyDoc;
                }
              }
            });

            return {
              ...emp,
              documents: docsObject,
            };
          } catch (err) {
            console.error(
              `Error fetching documents for employee ${
                emp.employeeId || emp._id
              }:`,
              err
            );
            return {
              ...emp,
              documents: {},
            };
          }
        })
      );

      setEmployees(employeesWithDocs);
      setFilteredEmployees(employeesWithDocs);

      // Fetch document stats
      await fetchDocumentStats();
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to fetch employees. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch document statistics
  const fetchDocumentStats = async () => {
    try {
      const stats = await fetch("http://localhost:3000/api/documents/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (stats.ok) {
        const statsData = await stats.json();
        if (statsData.success) {
          setDocStats({
            totalDocs: statsData.stats.totalDocuments,
            uploadedDocs: statsData.stats.totalDocuments,
            completionPercentage: statsData.stats.completionRate,
          });
          return;
        }
      }

      // If API fails, calculate stats client-side
      calculateDocumentStats();
    } catch (error) {
      console.error("Error fetching document stats:", error);
      calculateDocumentStats();
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchEmployees();
  };

  // Apply status filters
  const applyFilters = () => {
    let filtered = [...employees];

    if (statusFilter === "missing") {
      filtered = filtered.filter((emp) =>
        documentTypes.some(
          (docType) => docType.required && !emp.documents[docType.id]
        )
      );
    } else if (statusFilter === "complete") {
      filtered = filtered.filter((emp) =>
        documentTypes.every(
          (docType) => !docType.required || emp.documents[docType.id]
        )
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
    setCurrentPage(1);
  };

  // Apply filters when status filter or employees change
  useEffect(() => {
    applyFilters();
  }, [statusFilter, employees, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleDeleteDocument = async (employee, docType) => {
    if (
      window.confirm(
        `Are you sure you want to delete this ${
          documentTypes.find((dt) => dt.id === docType)?.label || docType
        }?`
      )
    ) {
      try {
        setIsRefreshing(true);

        // Check if this is a database document or localStorage document
        const documentString = employee.documents[docType];
        if (documentString) {
          const documentData = JSON.parse(documentString);

          if (documentData.id) {
            // Delete from database using the API
            await documentService.deleteDocument(documentData.id);
          } else {
            // Legacy document - remove from localStorage
            const storageKey = `document_${docType}_${
              employee.employeeId || employee._id
            }`;
            localStorage.removeItem(storageKey);
          }
        }

        // Refresh data to reflect changes
        await fetchEmployees();
      } catch (error) {
        console.error("Error deleting document:", error);
        alert("Failed to delete document. Please try again.");
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleDownload = (employee, docType) => {
    const docData = employee.documents[docType];

    if (!docData) {
      return;
    }

    try {
      const fileData = JSON.parse(docData);

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = fileData.dataUrl || fileData.url;
      link.download = fileData.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Error downloading document. Please try again.");
    }
  };

  const openUploadModal = (employee, docType) => {
    setSelectedEmployee(employee);
    setSelectedDocType(docType);
    setIsUploadModalOpen(true);
  };

  const handleSaveDocument = async (employeeId, docType, fileData) => {
    try {
      setIsRefreshing(true);

      // First upload to Cloudinary using our service
      const file = fileData.file; // Assuming modal passes the file object
      if (!file) {
        throw new Error("No file provided");
      }

      await documentService.uploadDocument(file, employeeId, docType);

      // Refresh data to show updated documents
      await fetchEmployees();

      // Success notification handled by the modal
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Error uploading document. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  // Get today's date in a nice format
  const getTodayDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Calculate document statistics - used if API call fails
  const calculateDocumentStats = () => {
    let totalDocs = 0;
    let uploadedDocs = 0;

    employees.forEach((emp) => {
      documentTypes.forEach((docType) => {
        totalDocs++;
        if (emp.documents[docType.id]) {
          uploadedDocs++;
        }
      });
    });

    setDocStats({
      totalDocs,
      uploadedDocs,
      completionPercentage:
        totalDocs > 0 ? Math.round((uploadedDocs / totalDocs) * 100) : 0,
    });
  };

  // Migrate legacy documents for all employees
  const migrateLegacyDocuments = async () => {
    if (
      !window.confirm(
        "This will migrate all legacy documents stored in localStorage to the cloud storage. Continue?"
      )
    ) {
      return;
    }

    setIsRefreshing(true);
    let migratedCount = 0;
    let failedCount = 0;

    try {
      for (const employee of employees) {
        const employeeId = employee.employeeId || employee._id;
        if (!employeeId) continue;

        try {
          const result = await documentService.migrateLocalDocumentsToBackend(
            employeeId
          );
          migratedCount += result.migratedCount;
          failedCount += result.failedCount;
        } catch (empError) {
          console.error(
            `Failed to migrate documents for employee ${employeeId}:`,
            empError
          );
          failedCount++;
        }
      }

      alert(
        `Migration complete: ${migratedCount} documents migrated successfully, ${failedCount} failed.`
      );

      // Refresh to show updated data
      await fetchEmployees();
    } catch (error) {
      console.error("Error during bulk migration:", error);
      alert("There was an error during document migration. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {getGreeting()}, {username} 👋
              </h1>
              <p className="opacity-80 text-lg">{getTodayDate()}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <button
                onClick={refreshData}
                className={`bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center transition-all ${
                  isRefreshing ? "opacity-50 cursor-wait" : ""
                }`}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                Refresh Data
              </button>
              <button
                onClick={migrateLegacyDocuments}
                className="bg-white text-indigo-700 px-4 py-2 rounded-lg flex items-center transition-all hover:bg-opacity-90 shadow-lg hover:shadow-xl"
                disabled={isRefreshing}
              >
                <Plus className="h-5 w-5 mr-2" />
                Migrate Legacy Docs
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-indigo-600" />
                Document Management
              </h2>
              <p className="text-gray-500 text-sm">
                Manage all your employee documents in one place
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="mb-8">
          <DocumentStatsCards
            employees={employees}
            documentTypes={documentTypes}
            docStats={docStats}
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative flex-grow max-w-md">
                <SearchBar
                  setFilteredEmployees={setFilteredEmployees}
                  setSearchQuery={setSearchQuery}
                  employees={employees}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <Filter className="h-4 w-4 mr-2 text-indigo-600" />
                    Filter
                    <ChevronDown
                      className={`ml-2 h-4 w-4 transform transition-transform ${
                        filterOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {filterOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-10 border border-gray-200 overflow-hidden">
                      <div className="py-1">
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-700">
                            Filter by Status
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setStatusFilter("all");
                            setFilterOpen(false);
                          }}
                          className={`flex items-center px-4 py-3 text-sm w-full text-left hover:bg-gray-50 border-l-4 ${
                            statusFilter === "all"
                              ? "border-indigo-600 bg-indigo-50/50 text-indigo-700"
                              : "border-transparent"
                          }`}
                        >
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          All Employees
                        </button>
                        <button
                          onClick={() => {
                            setStatusFilter("complete");
                            setFilterOpen(false);
                          }}
                          className={`flex items-center px-4 py-3 text-sm w-full text-left hover:bg-gray-50 border-l-4 ${
                            statusFilter === "complete"
                              ? "border-green-600 bg-green-50/50 text-green-700"
                              : "border-transparent"
                          }`}
                        >
                          <FileText className="h-4 w-4 mr-2 text-gray-500" />
                          Complete Documentation
                        </button>
                        <button
                          onClick={() => {
                            setStatusFilter("missing");
                            setFilterOpen(false);
                          }}
                          className={`flex items-center px-4 py-3 text-sm w-full text-left hover:bg-gray-50 border-l-4 ${
                            statusFilter === "missing"
                              ? "border-red-600 bg-red-50/50 text-red-700"
                              : "border-transparent"
                          }`}
                        >
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          Missing Documents
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Active filters display */}
          {statusFilter !== "all" && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">
                  Active filters:
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full flex items-center ${
                    statusFilter === "complete"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {statusFilter === "complete"
                    ? "Complete Documentation"
                    : "Missing Documents"}
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="ml-1 hover:text-gray-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Employee Documents Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <DocumentsTable
            employees={currentEmployees}
            documentTypes={documentTypes}
            isLoading={isLoading}
            onOpenUploadModal={openUploadModal}
            onDownloadDocument={handleDownload}
            onDeleteDocument={handleDeleteDocument}
          />

          {/* Pagination */}
          {filteredEmployees.length > itemsPerPage && (
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-gray-200 flex justify-between items-center">
              <div className="text-gray-700 text-sm">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredEmployees.length)} of{" "}
                {filteredEmployees.length} entries
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Upload Document Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        employee={selectedEmployee}
        documentType={selectedDocType}
        documentTypes={documentTypes}
        onSave={handleSaveDocument}
      />
    </div>
  );
};

export default DocumentsPage;
