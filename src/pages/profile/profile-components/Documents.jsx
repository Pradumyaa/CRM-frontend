import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Upload,
  X,
  AlertCircle,
  Info,
  CheckCircle,
  Eye,
  MoreHorizontal,
  Trash,
  Lock,
  RefreshCw,
} from "lucide-react";
import documentService from "../../../services/DocumentService";
import resumeParserService from "../../../services/DocumentService";

const Documents = ({ employeeId, isAdmin, isOwnProfile, onDocumentUpload }) => {
  // Initialize state
  const [documents, setDocuments] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [showTooltip, setShowTooltip] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentDocType, setCurrentDocType] = useState("resume");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Document types definition - some document types are admin only
  const documentTypes = [
    {
      id: "contract",
      label: "Employment Contract",
      required: true,
      color: "blue",
      description: "Official employment agreement between company and employee",
      adminOnly: true,
    },
    {
      id: "payroll",
      label: "Payroll Details",
      required: true,
      color: "orange",
      description: "Salary structure, tax information and payment details",
      adminOnly: true,
    },
    {
      id: "performance",
      label: "Performance Review",
      required: true,
      color: "purple",
      description: "Regular employee performance evaluation reports",
      adminOnly: true,
    },
    {
      id: "resume",
      label: "Resume",
      required: false,
      color: "green",
      description: "Employee's curriculum vitae and professional background",
      adminOnly: false,
    },
    {
      id: "identification",
      label: "Identification Documents",
      required: true,
      color: "red",
      description: "Government issued identification documents",
      adminOnly: false,
    },
    {
      id: "certifications",
      label: "Certifications",
      required: false,
      color: "indigo",
      description: "Professional certifications and qualifications",
      adminOnly: false,
    },
  ];

  // Function to check if user can upload this document type
  const canUploadDocType = (docType) => {
    const docTypeInfo = documentTypes.find((d) => d.id === docType);
    if (!docTypeInfo) return false;

    // Admin can upload all document types
    if (isAdmin) return true;

    // Employee can only upload their own non-admin documents
    return isOwnProfile && !docTypeInfo.adminOnly;
  };

  // Load documents from the API
  const loadDocuments = async () => {
    setLoading(true);

    try {
      // Get documents from the database
      const docs = await documentService.getEmployeeDocuments(employeeId);

      // Transform API response to our UI format
      const transformedDocs = documentTypes
        .filter((docType) => isAdmin || !docType.adminOnly || isOwnProfile)
        .map((docType) => {
          // Find this document type in the API response
          const apiDoc = docs.find((d) => d.documentType === docType.id);

          let docInfo = {
            id: docType.id,
            type: docType.id,
            name: docType.label,
            size: "",
            date: "",
            file: null,
            isAttached: false,
            userUploadable: isAdmin || (isOwnProfile && !docType.adminOnly),
            fileType: "",
            color: docType.color,
            description: docType.description,
            adminOnly: docType.adminOnly,
            docId: null, // Database document ID
          };

          if (apiDoc) {
            // Document exists in database
            docInfo = {
              ...docInfo,
              name: apiDoc.name || docType.label,
              size: apiDoc.size
                ? `${(apiDoc.size / (1024 * 1024)).toFixed(2)} MB`
                : "",
              date: apiDoc.createdAt,
              file: apiDoc.url,
              isAttached: true,
              fileType:
                apiDoc.type && apiDoc.type.includes("pdf") ? "PDF" : "DOCX",
              docId: apiDoc.id, // Store the database document ID
            };
          } else {
            // Check localStorage as a fallback during migration period
            const storageKey = `document_${docType.id}_${employeeId}`;
            const storedDoc = localStorage.getItem(storageKey);

            if (storedDoc) {
              try {
                const parsedDoc = JSON.parse(storedDoc);
                docInfo = {
                  ...docInfo,
                  name: parsedDoc.name || docType.label,
                  size: `${(parsedDoc.size / (1024 * 1024)).toFixed(2)} MB`,
                  date: parsedDoc.date,
                  file: parsedDoc.dataUrl,
                  isAttached: true,
                  fileType: parsedDoc.type.includes("pdf") ? "PDF" : "DOCX",
                  legacy: true, // Mark as legacy document for migration
                };
              } catch (error) {
                console.error(
                  `Error parsing document data for ${docType.id}:`,
                  error
                );
              }
            }
          }

          return docInfo;
        });

      setDocuments(transformedDocs);
    } catch (error) {
      console.error("Error loading documents:", error);
      // If API call fails, fallback to localStorage
      loadLegacyDocuments();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fallback loader for legacy localStorage documents
  const loadLegacyDocuments = () => {
    try {
      // Transform documents from localStorage to our format
      const userDocs = documentTypes
        .filter((docType) => isAdmin || !docType.adminOnly || isOwnProfile)
        .map((docType) => {
          const storageKey = `document_${docType.id}_${employeeId}`;
          const storedDoc = localStorage.getItem(storageKey);

          let docInfo = {
            id: docType.id,
            type: docType.id,
            name: docType.label,
            size: "",
            date: "",
            file: null,
            isAttached: false,
            userUploadable: isAdmin || (isOwnProfile && !docType.adminOnly),
            fileType: "",
            color: docType.color,
            description: docType.description,
            adminOnly: docType.adminOnly,
            legacy: true,
          };

          if (storedDoc) {
            try {
              const parsedDoc = JSON.parse(storedDoc);
              docInfo = {
                ...docInfo,
                name: parsedDoc.name || docType.label,
                size: `${(parsedDoc.size / (1024 * 1024)).toFixed(2)} MB`,
                date: parsedDoc.date,
                file: parsedDoc.dataUrl,
                isAttached: true,
                fileType: parsedDoc.type.includes("pdf") ? "PDF" : "DOCX",
              };
            } catch (error) {
              console.error(
                `Error parsing document data for ${docType.id}:`,
                error
              );
            }
          }

          return docInfo;
        });

      setDocuments(userDocs);
    } catch (error) {
      console.error("Error loading legacy documents:", error);
    }
  };

  // Migrate legacy documents to database (handles the transition)
  const migrateLegacyDocuments = async () => {
    try {
      setRefreshing(true);
      const migrationResult =
        await documentService.migrateLocalDocumentsToBackend(employeeId);
      console.log("Migration result:", migrationResult);

      // Reload documents after migration
      await loadDocuments();

      // Show success notification if there were migrations
      if (migrationResult.migratedCount > 0) {
        alert(
          `Successfully migrated ${migrationResult.migratedCount} documents to the cloud storage.`
        );
      }
    } catch (error) {
      console.error("Error migrating documents:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Load documents on component mount
  useEffect(() => {
    loadDocuments();

    // Check for localStorage documents to migrate
    const documentTypesToCheck = documentTypes.map((dt) => dt.id);
    const hasLegacyDocs = documentTypesToCheck.some((docType) =>
      localStorage.getItem(`document_${docType}_${employeeId}`)
    );

    // If legacy docs exist, migrate them
    if (hasLegacyDocs) {
      migrateLegacyDocuments();
    }
  }, [employeeId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File size exceeds 10MB limit");
        setSelectedFile(null);
        return;
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        setUploadError("Invalid file type. Please upload a PDF or DOCX file");
        setSelectedFile(null);
        return;
      }

      // Create preview for PDF files
      if (file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl("");
      }

      setSelectedFile(file);
      setUploadError("");
    }
  };

  const openUploadModal = (docType) => {
    if (!canUploadDocType(docType)) {
      return; // Don't open modal if user can't upload this document type
    }

    setSelectedFile(null);
    setUploadError("");
    setUploadSuccess(false);
    setShowUpload(true);
    setActiveDropdown(null);
    setCurrentDocType(docType);
  };

  const closeUploadModal = () => {
    setShowUpload(false);
    setSelectedFile(null);
    setUploadError("");
    setUploadSuccess(false);
  };

  const handlePreview = (url) => {
    if (url) {
      window.open(url);
    }
  };

  const deleteDocument = async (docType) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        const docToDelete = documents.find((doc) => doc.type === docType);

        if (docToDelete) {
          setRefreshing(true);

          if (docToDelete.docId) {
            // Delete from database using API
            await documentService.deleteDocument(docToDelete.docId);
          } else if (docToDelete.legacy) {
            // Remove legacy document from localStorage
            localStorage.removeItem(`document_${docType}_${employeeId}`);
          }

          // Reload documents to reflect changes
          await loadDocuments();
        }
      } catch (error) {
        console.error("Error deleting document:", error);
        alert("Failed to delete document. Please try again.");
      } finally {
        setRefreshing(false);
      }
    }
  };

  const updateDocument = async (docType = currentDocType) => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      return;
    }

    setIsUploading(true);

    try {
      // Upload document using the service
      await documentService.uploadDocument(selectedFile, employeeId, docType);

      // Reload documents to reflect changes
      await loadDocuments();

      setUploadSuccess(true);

      // If a resume was uploaded, trigger AI skill extraction
      if (docType === "resume") {
        console.log("Resume uploaded - triggering AI skill extraction...");

        // Clear any cached skills to force fresh extraction
        const cacheKey = `skills_${employeeId}`;
        localStorage.removeItem(cacheKey);

        // Notify parent component to refresh skills
        if (onDocumentUpload) {
          onDocumentUpload();
        }

        // Also trigger backend skill extraction
        try {
          const token = localStorage.getItem("token");
          if (token) {
            // Call the skills endpoint to trigger fresh extraction
            await fetch(
              `https://getmax-backend.vercel.app/api/resume/skills/${employeeId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          }
        } catch (skillError) {
          console.warn("Error triggering skill extraction:", skillError);
        }
      }

      // Close modal after showing success
      setTimeout(() => {
        closeUploadModal();
      }, 1500);
    } catch (error) {
      console.error("Error uploading document:", error);
      setUploadError("Error uploading document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getDocColor = (type) => {
    const colors = {
      resume: "bg-green-100 text-green-600",
      contract: "bg-blue-100 text-blue-600",
      performance: "bg-purple-100 text-purple-600",
      payroll: "bg-orange-100 text-orange-600",
      identification: "bg-red-100 text-red-600",
      certifications: "bg-indigo-100 text-indigo-600",
    };
    return colors[type] || "bg-gray-100 text-gray-600";
  };

  const getDocBgColor = (type) => {
    const colors = {
      resume: "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
      contract: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
      performance:
        "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
      payroll:
        "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200",
      identification: "bg-gradient-to-br from-red-50 to-red-100 border-red-200",
      certifications:
        "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200",
    };
    return (
      colors[type] ||
      "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
    );
  };

  // Calculate time elapsed since upload
  const getTimeElapsed = (uploadDate) => {
    if (!uploadDate) return "Not uploaded";

    const now = new Date();
    const uploadTime = new Date(uploadDate);
    const diffMs = now - uploadTime;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
    }
  };

  const toggleDropdown = (id) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  // Refresh documents
  const refreshDocuments = async () => {
    setRefreshing(true);
    await loadDocuments();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-7 bg-gray-200 rounded w-48"></div>
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border rounded-xl shadow-sm h-40 bg-gray-50"
            >
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-14 w-14 rounded-full bg-gray-200"></div>
                  <div className="ml-4">
                    <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-40"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Documents</h3>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshDocuments}
            className={`text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100 ${
              refreshing ? "animate-spin" : ""
            }`}
            disabled={refreshing}
            title="Refresh documents"
          >
            <RefreshCw size={18} />
          </button>

          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setShowTooltip("info")}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <Info size={18} className="text-gray-500" />
            {showTooltip === "info" && (
              <div className="absolute right-0 z-10 w-64 p-3 text-xs bg-white rounded-lg shadow-lg border text-gray-600">
                {isAdmin
                  ? "As an admin, you can upload and manage all document types for this employee."
                  : "You can only upload and update your resume and personal documents. Other documents are managed by the HR department."}
              </div>
            )}
          </div>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-8">
          <FileText size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No Documents Available
          </h3>
          <p className="text-gray-500 text-center mb-4">
            {isAdmin
              ? "You can upload documents for this employee using the options below."
              : "Your documents will appear here once they're uploaded by you or the HR department."}
          </p>
          {isAdmin && (
            <button
              onClick={() => openUploadModal("contract")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Upload size={16} className="mr-2" />
              Upload First Document
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`border rounded-xl shadow-sm hover:shadow transition-shadow ${getDocBgColor(
                doc.type
              )}`}
            >
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`h-14 w-14 rounded-full ${getDocColor(
                      doc.type
                    )} flex items-center justify-center shadow-sm`}
                  >
                    <FileText size={24} />
                  </div>

                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="font-semibold text-gray-800">{doc.name}</p>
                      {doc.adminOnly && !isAdmin && (
                        <span className="ml-2 p-1 bg-gray-100 rounded text-gray-500 text-xs flex items-center">
                          <Lock size={10} className="mr-1" />
                          HR Only
                        </span>
                      )}
                      {doc.legacy && (
                        <span className="ml-2 p-1 bg-yellow-100 rounded text-yellow-600 text-xs">
                          Legacy
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {doc.isAttached
                        ? `${doc.fileType} • ${doc.size} • ${getTimeElapsed(
                            doc.date
                          )}`
                        : "Not attached - Contact HR to request this document"}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(doc.id)}
                    className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {activeDropdown === doc.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 w-40">
                      {doc.isAttached && (
                        <button
                          onClick={() => handlePreview(doc.file)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center"
                        >
                          <Eye size={14} className="mr-2" />
                          View Document
                        </button>
                      )}

                      {doc.isAttached && (
                        <button
                          onClick={() => window.open(doc.file)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center"
                        >
                          <Download size={14} className="mr-2" />
                          Download
                        </button>
                      )}

                      {canUploadDocType(doc.type) && (
                        <button
                          onClick={() => openUploadModal(doc.type)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center"
                        >
                          <Upload size={14} className="mr-2" />
                          {doc.isAttached ? "Replace" : "Upload"}
                        </button>
                      )}

                      {(isAdmin || (isOwnProfile && !doc.adminOnly)) &&
                        doc.isAttached && (
                          <button
                            onClick={() => deleteDocument(doc.type)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                          >
                            <Trash size={14} className="mr-2" />
                            Delete
                          </button>
                        )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex border-t border-gray-200 bg-white/50 rounded-b-xl overflow-hidden">
                {doc.isAttached ? (
                  <>
                    <button
                      onClick={() => handlePreview(doc.file)}
                      className="py-2 flex-1 text-indigo-600 hover:bg-indigo-50 text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </button>
                    <div className="w-px bg-gray-200"></div>
                    <button
                      onClick={() => window.open(doc.file)}
                      className="py-2 flex-1 text-indigo-600 hover:bg-indigo-50 text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <Download size={14} className="mr-1" />
                      Download
                    </button>
                  </>
                ) : (
                  <div className="py-2 flex-1 text-gray-400 text-sm font-medium text-center">
                    Document not available
                  </div>
                )}

                {canUploadDocType(doc.type) && (
                  <>
                    <div className="w-px bg-gray-200"></div>
                    <button
                      onClick={() => openUploadModal(doc.type)}
                      className="py-2 flex-1 text-indigo-600 hover:bg-indigo-50 text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <Upload size={14} className="mr-1" />
                      {doc.isAttached ? "Replace" : "Upload"}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl overflow-hidden w-full max-w-md shadow-2xl">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center">
                <FileText size={20} className="mr-2" />
                Upload{" "}
                {documentTypes.find((d) => d.id === currentDocType)?.label ||
                  "Document"}
              </h3>
              <button
                onClick={closeUploadModal}
                className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {uploadSuccess ? (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center mb-6 border border-green-200">
                  <CheckCircle size={24} className="mr-3 text-green-600" />
                  <div>
                    <p className="font-medium">
                      Document uploaded successfully!
                    </p>
                    <p className="text-sm">
                      Your document has been updated and is now available.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Document Type Info */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1 font-medium">
                      Document Type
                    </p>
                    <div className="flex items-center p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-indigo-700">
                          {documentTypes.find((d) => d.id === currentDocType)
                            ?.label || "Document"}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {documentTypes.find((d) => d.id === currentDocType)
                            ?.description || ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* File upload area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors mb-5 ${
                      selectedFile
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                  >
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.docx,.doc"
                    />

                    {selectedFile ? (
                      <>
                        <CheckCircle
                          size={36}
                          className="text-green-500 mb-2"
                        />
                        <p className="font-medium text-green-700">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB •{" "}
                          {selectedFile.type.includes("pdf") ? "PDF" : "DOCX"}
                        </p>
                        <div className="flex mt-3">
                          <button
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 bg-indigo-50 rounded-md mr-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (previewUrl) {
                                window.open(previewUrl, "_blank");
                              }
                            }}
                            disabled={!previewUrl}
                          >
                            <Eye size={14} className="inline mr-1" />
                            Preview
                          </button>
                          <button
                            className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 bg-red-50 rounded-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                              setPreviewUrl("");
                            }}
                          >
                            <X size={14} className="inline mr-1" />
                            Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload size={36} className="text-gray-400 mb-2" />
                        <p className="font-medium text-gray-700">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF or DOCX (max 10MB)
                        </p>
                      </>
                    )}
                  </div>

                  {/* Error message */}
                  {uploadError && (
                    <div className="mb-4 p-3 bg-red-50 rounded-lg flex items-center text-red-600 border border-red-200">
                      <AlertCircle size={18} className="mr-2" />
                      <p className="text-sm">{uploadError}</p>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={closeUploadModal}
                      className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => updateDocument()}
                      disabled={!selectedFile || isUploading}
                      className={`px-4 py-2 rounded-lg text-sm text-white font-medium ${
                        selectedFile && !isUploading
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : "bg-gray-400 cursor-not-allowed"
                      } transition-colors flex items-center`}
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={16} className="mr-2" />
                          Upload Document
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
