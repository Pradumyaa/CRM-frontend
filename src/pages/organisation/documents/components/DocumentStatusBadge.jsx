import React from "react";
import {
  FileText,
  Download,
  Upload,
  Trash2,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react";

const DocumentStatusBadge = ({
  docType,
  employee,
  fileInfo,
  onOpenUploadModal,
  onDownloadDocument,
  onDeleteDocument,
}) => {
  const getDocumentStatus = (employee, docType) => {
    const hasDocument = employee.documents && employee.documents[docType.id];

    if (hasDocument) {
      return {
        status: "complete",
        icon: <CheckCircle size={16} className="text-green-500" />,
        text: "Uploaded",
        styleClass: "text-green-600 bg-green-50",
      };
    } else if (docType.required) {
      return {
        status: "missing",
        icon: <AlertCircle size={16} className="text-red-500" />,
        text: "Missing",
        styleClass: "text-red-600 bg-red-50",
      };
    } else {
      return {
        status: "optional",
        icon: <Info size={16} className="text-gray-500" />,
        text: "Optional",
        styleClass: "text-gray-600 bg-gray-50",
      };
    }
  };

  const getDocumentColorClass = (docTypeId) => {
    const colors = {
      contract: "border-blue-200 bg-blue-50 text-blue-700",
      payroll: "border-orange-200 bg-orange-50 text-orange-700",
      performance: "border-purple-200 bg-purple-50 text-purple-700",
      resume: "border-green-200 bg-green-50 text-green-700",
    };

    return colors[docTypeId] || "border-gray-200 bg-gray-50 text-gray-700";
  };

  const docStatus = getDocumentStatus(employee, docType);

  if (fileInfo) {
    return (
      <div
        className={`p-2 rounded-lg border ${getDocumentColorClass(docType.id)}`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FileText className={`h-5 w-5 text-${docType.color}-500`} />
            <div className="ml-2">
              <div className="text-xs font-medium truncate max-w-[120px]">
                {fileInfo.name}
              </div>
              <div className="text-xs text-gray-500">
                {fileInfo.type} • {fileInfo.size}
              </div>
            </div>
          </div>
          <div className="flex">
            <button
              onClick={() => onDownloadDocument(employee, docType.id)}
              className="p-1 text-gray-500 hover:text-indigo-600 rounded-md hover:bg-gray-100"
              title="Download"
            >
              <Download size={16} />
            </button>
            <button
              onClick={() => onDeleteDocument(employee, docType.id)}
              className="p-1 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <div
        className={`flex items-center px-2 py-1 rounded-md ${docStatus.styleClass}`}
      >
        {docStatus.icon}
        <span className="ml-1 text-xs">{docStatus.text}</span>
      </div>
      <button
        onClick={() => onOpenUploadModal(employee, docType.id)}
        className="ml-2 p-1 text-gray-500 hover:text-indigo-600 rounded-md hover:bg-gray-100"
        title="Upload"
      >
        <Upload size={16} />
      </button>
    </div>
  );
};

export default DocumentStatusBadge;
