import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const [username, setUsername] = useState("Jane Doe"); // Set default or get from auth
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
  ];

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/employees");

      // Add documents property to each employee if not exists
      const employeesWithDocs = response.data.employees.map((emp) => ({
        ...emp,
        documents: {
          contract: localStorage.getItem(
            `document_contract_${emp.employeeId || emp._id}`
          ),
          payroll: localStorage.getItem(
            `document_payroll_${emp.employeeId || emp._id}`
          ),
          performance: localStorage.getItem(
            `document_performance_${emp.employeeId || emp._id}`
          ),
          resume: localStorage.getItem(
            `document_resume_${emp.employeeId || emp._id}`
          ),
        },
      }));

      setEmployees(employeesWithDocs);
      setFilteredEmployees(employeesWithDocs);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchEmployees();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800); // Give a sense of refreshing
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

  const handleDeleteDocument = (employee, docType) => {
    if (
      window.confirm(
        `Are you sure you want to delete this ${
          documentTypes.find((dt) => dt.id === docType)?.label || docType
        }?`
      )
    ) {
      try {
        const storageKey = `document_${docType}_${
          employee.employeeId || employee._id
        }`;
        localStorage.removeItem(storageKey);

        const updatedEmployees = employees.map((emp) => {
          if (
            (emp.employeeId || emp._id) ===
            (employee.employeeId || employee._id)
          ) {
            return {
              ...emp,
              documents: {
                ...emp.documents,
                [docType]: null,
              },
            };
          }
          return emp;
        });

        setEmployees(updatedEmployees);
        
        // Dispatch storage event to notify the user's profile page
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: storageKey,
            oldValue: employee.documents[docType],
            newValue: null,
          })
        );
      } catch (error) {
        console.error("Error deleting document:", error);
        alert("Failed to delete document. Please try again.");
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
      link.href = fileData.dataUrl;
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

  const handleSaveDocument = (employeeId, docType, fileData) => {
    const storageKey = `document_${docType}_${employeeId}`;

    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(fileData));

    const updatedEmployees = employees.map((emp) => {
      if ((emp.employeeId || emp._id) === employeeId) {
        return {
          ...emp,
          documents: {
            ...emp.documents,
            [docType]: JSON.stringify(fileData),
          },
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);

    // Dispatch storage event to notify the user's profile page
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: storageKey,
        newValue: JSON.stringify(fileData),
      })
    );
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

  // Calculate document statistics
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

    return {
      totalDocs,
      uploadedDocs,
      completionPercentage:
        totalDocs > 0 ? Math.round((uploadedDocs / totalDocs) * 100) : 0,
    };
  };

  const docStats = calculateDocumentStats();

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
                onClick={() => {
                  // You could add functionality to add a document in bulk here
                }}
                className="bg-white text-indigo-700 px-4 py-2 rounded-lg flex items-center transition-all hover:bg-opacity-90 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                Bulk Upload
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
