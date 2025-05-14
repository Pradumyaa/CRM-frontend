import React from "react";
import { AlertCircle, Search } from "lucide-react";
import DocumentStatusBadge from "./DocumentStatusBadge";

const DocumentsTable = ({
  employees,
  documentTypes,
  isLoading,
  onOpenUploadModal,
  onDownloadDocument,
  onDeleteDocument,
}) => {
  const getCompletionStatus = (employee) => {
    const requiredDocs = documentTypes.filter((dt) => dt.required);
    const completedDocs = requiredDocs.filter(
      (dt) => employee.documents[dt.id]
    );

    const percentage = Math.round(
      (completedDocs.length / requiredDocs.length) * 100
    );

    return {
      percentage,
      completed: completedDocs.length,
      total: requiredDocs.length,
      color: percentage === 100 
        ? "bg-green-500" 
        : percentage > 50 
        ? "bg-yellow-500" 
        : "bg-red-500"
    };
  };

  const formatFileInfo = (docString) => {
    if (!docString) return null;

    try {
      const docData = JSON.parse(docString);
      const fileSize = (docData.size / (1024 * 1024)).toFixed(2);
      const uploadDate = new Date(docData.date).toLocaleDateString("en-IN");

      return {
        name: docData.name,
        size: `${fileSize} MB`,
        date: uploadDate,
        type: docData.type.includes("pdf") ? "PDF" : "DOCX",
      };
    } catch (error) {
      console.error("Error parsing document data:", error);
      return null;
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-500">Loading employees...</p>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full bg-gray-100 mb-3">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">
            No employees found matching your filters
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Try adjusting your search criteria or clearing filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Employee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Employee ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Completion
            </th>
            {documentTypes.map((docType) => (
              <th
                key={docType.id}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                {docType.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {employees.map((employee, index) => {
            const completionStatus = getCompletionStatus(employee);
            const isEven = index % 2 === 0;
            const avatarColor = getAvatarColor(employee.name);

            return (
              <tr
                key={employee.employeeId || employee._id}
                className={`${isEven ? "bg-white" : "bg-gray-50"} hover:bg-gray-50 transition-colors border-l-4 ${
                  completionStatus.percentage === 100
                    ? "border-l-green-400"
                    : completionStatus.percentage > 50
                    ? "border-l-yellow-400"
                    : "border-l-red-400"
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
                      <div className="text-sm text-gray-500">
                        {employee.email || "N/A"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {employee.employeeId || employee._id || "N/A"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {employee.jobTitle || "No Job Title"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-1">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2 max-w-[100px]">
                        <div
                          className={`h-2 rounded-full ${completionStatus.color}`}
                          style={{ width: `${completionStatus.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        {completionStatus.percentage}%
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {completionStatus.completed}/{completionStatus.total} required docs
                    </span>
                  </div>
                </td>
                {documentTypes.map((docType) => {
                  const fileInfo = formatFileInfo(
                    employee.documents[docType.id]
                  );

                  return (
                    <td
                      key={docType.id}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      <DocumentStatusBadge
                        docType={docType}
                        employee={employee}
                        fileInfo={fileInfo}
                        onOpenUploadModal={onOpenUploadModal}
                        onDownloadDocument={onDownloadDocument}
                        onDeleteDocument={onDeleteDocument}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Custom scrollbar styling */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(99, 102, 241, 0.5) rgba(243, 244, 246, 0.3);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(243, 244, 246, 0.3);
          border-radius: 8px;
          margin: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.6);
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 70, 229, 0.8);
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default DocumentsTable;