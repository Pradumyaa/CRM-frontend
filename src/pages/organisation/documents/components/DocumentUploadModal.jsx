import React, { useState, useEffect } from "react";
import { X, Upload, CheckCircle, AlertCircle, FileText, Clock, Calendar, User, Eye } from "lucide-react";

const DocumentUploadModal = ({
  isOpen,
  onClose,
  employee,
  documentType,
  documentTypes,
  onSave,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [preview, setPreview] = useState(null);

  const docTypeObj = documentTypes.find((dt) => dt.id === documentType) || {};

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setSelectedFile(null);
      setUploadError("");
      setIsUploading(false);
      setUploadSuccess(false);
      setPreview(null);
    }
  }, [isOpen]);

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

      setSelectedFile(file);
      setUploadError("");

      // Create a preview if it's a PDF
      if (file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      return;
    }

    setIsUploading(true);

    // Create a file reader to read the file and store in localStorage
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        // Store file metadata in localStorage
        const fileData = {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          date: new Date().toISOString(),
          dataUrl: event.target.result,
        };

        // Save to localStorage
        localStorage.setItem(
          `document_${documentType}_${employee.employeeId || employee._id}`,
          JSON.stringify(fileData)
        );

        // Call the onSave callback to update the state in parent component
        onSave(employee.employeeId || employee._id, documentType, fileData);

        // Show success message
        setUploadSuccess(true);
        setIsUploading(false);

        // Close modal after delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) {
        console.error("Error saving document:", error);
        setUploadError("Error saving document. Please try again.");
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  // Get document color based on document type
  const getDocumentColor = (docTypeId) => {
    const colors = {
      contract: "blue",
      payroll: "orange",
      performance: "purple",
      resume: "green",
    };
    return colors[docTypeId] || "gray";
  };

  const docColor = getDocumentColor(documentType);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-md m-4 overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center`}>
          <h3 className="text-xl font-semibold text-white flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Upload {docTypeObj.label || "Document"}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {uploadSuccess ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center mb-6 border border-green-200">
              <CheckCircle size={24} className="mr-3 text-green-600" />
              <div>
                <p className="font-medium">Document uploaded successfully!</p>
                <p className="text-sm">
                  The document has been attached to the employee profile.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Employee Info */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1 font-medium">Employee Details</p>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium mr-3">
                    {employee?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{employee?.name}</p>
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                        ID: {employee?.employeeId || employee?._id}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <User className="h-3 w-3 mr-1" />
                      {employee?.jobTitle || "Employee"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Type Info */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1 font-medium">Document Type</p>
                <div className="flex items-center p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-indigo-700">{docTypeObj.label || "Document"}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{docTypeObj.description || "Upload file"}</p>
                  </div>
                  {docTypeObj.required && (
                    <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  )}
                </div>
              </div>

              {/* Upload Area */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1 font-medium">Upload Document</p>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    selectedFile
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => document.getElementById("file-upload").click()}
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />

                  {selectedFile ? (
                    <>
                      <CheckCircle size={36} className="text-green-500 mb-2" />
                      <p className="font-medium text-green-700">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {
                          selectedFile.type.includes('pdf') ? 'PDF' : 'DOCX'
                        }
                      </p>
                      <div className="flex mt-3">
                        <button
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 bg-indigo-50 rounded-md mr-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (preview) {
                              window.open(preview, '_blank');
                            }
                          }}
                          disabled={!preview}
                        >
                          <Eye size={14} className="inline mr-1" />
                          Preview
                        </button>
                        <button
                          className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 bg-red-50 rounded-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            setPreview(null);
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

                {uploadError && (
                  <div className="mt-2 text-sm text-red-600 flex items-center bg-red-50 p-2 rounded-md border border-red-200">
                    <AlertCircle size={14} className="mr-1" />
                    {uploadError}
                  </div>
                )}
              </div>

              {/* Upload Info */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-6">
                <div className="flex items-center text-xs text-gray-600">
                  <Clock size={14} className="text-gray-500 mr-1" />
                  <span>Date: {new Date().toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <Calendar size={14} className="text-gray-500 mr-1" />
                  <span>Time: {new Date().toLocaleTimeString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This document will be attached to {employee?.name}'s profile and will be available for view and download.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className={`px-4 py-2 rounded-lg text-white font-medium flex items-center ${
                    selectedFile && !isUploading
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-indigo-400 cursor-not-allowed"
                  }`}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
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
  );
};

export default DocumentUploadModal;