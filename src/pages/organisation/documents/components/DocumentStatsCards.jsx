import React from "react";
import { 
  User, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Users, 
  BarChart2 
} from "lucide-react";

const DocumentStatsCards = ({ employees, documentTypes, docStats }) => {
  // Calculate statistics
  const totalEmployees = employees.length;
  const completeDocumentation = employees.filter((emp) =>
    documentTypes.every((dt) => !dt.required || emp.documents[dt.id])
  ).length;
  const missingDocuments = employees.filter((emp) =>
    documentTypes.some((dt) => dt.required && !emp.documents[dt.id])
  ).length;

  // Document type statistics for each document type
  const documentTypeStats = documentTypes.map(docType => {
    const uploaded = employees.filter(emp => emp.documents[docType.id]).length;
    const percentage = Math.round((uploaded / totalEmployees) * 100) || 0;
    
    return {
      ...docType,
      uploaded,
      percentage
    };
  });

  // Card styles based on document type colors
  const getCardStyle = (docType) => {
    const styles = {
      blue: {
        bgGradient: "from-blue-50 to-blue-200",
        border: "border-blue-200",
        textColor: "text-blue-600",
        iconBg: "bg-blue-200",
        iconColor: "text-blue-600"
      },
      green: {
        bgGradient: "from-green-50 to-green-200",
        border: "border-green-200",
        textColor: "text-green-600",
        iconBg: "bg-green-200",
        iconColor: "text-green-600"
      },
      orange: {
        bgGradient: "from-orange-50 to-orange-200",
        border: "border-orange-200",
        textColor: "text-orange-600",
        iconBg: "bg-orange-200",
        iconColor: "text-orange-600"
      },
      purple: {
        bgGradient: "from-purple-50 to-purple-200",
        border: "border-purple-200",
        textColor: "text-purple-600",
        iconBg: "bg-purple-200",
        iconColor: "text-purple-600"
      },
      red: {
        bgGradient: "from-red-50 to-red-200",
        border: "border-red-200",
        textColor: "text-red-600",
        iconBg: "bg-red-200",
        iconColor: "text-red-600"
      }
    };
    
    return styles[docType] || styles.blue;
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid - Equal sized cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Employees Card */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-200 p-4 rounded-lg border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">
                Total Employees
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {totalEmployees}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-600 font-medium">
            Overall workforce count
          </div>
        </div>

        {/* Document Completion Card */}
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-200 p-4 rounded-lg border border-indigo-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-600 text-sm font-medium">
                Document Completion
              </p>
              <p className="text-2xl font-bold text-indigo-700">
                {docStats.completionPercentage}%
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center">
              <BarChart2 className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-indigo-600 font-medium">
            {docStats.uploadedDocs} of {docStats.totalDocs} documents uploaded
          </div>
        </div>

        {/* Complete Documentation Card */}
        <div className="bg-gradient-to-r from-green-50 to-green-200 p-4 rounded-lg border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">
                Complete Documentation
              </p>
              <p className="text-2xl font-bold text-green-700">
                {completeDocumentation}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-green-600 font-medium">
            {((completeDocumentation / totalEmployees) * 100).toFixed(0)}% of total employees
          </div>
        </div>

        {/* Missing Documents Card */}
        <div className="bg-gradient-to-r from-red-50 to-red-200 p-4 rounded-lg border border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">
                Missing Documents
              </p>
              <p className="text-2xl font-bold text-red-700">
                {missingDocuments}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-200 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-red-600 font-medium">
            {((missingDocuments / totalEmployees) * 100).toFixed(0)}% need attention
          </div>
        </div>
      </div>

      {/* Document Type Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {documentTypeStats.map((doc) => {
          const style = getCardStyle(doc.color);
          return (
            <div key={doc.id} className={`bg-gradient-to-r ${style.bgGradient} p-4 rounded-lg border ${style.border} shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${style.textColor} text-sm font-medium`}>
                    {doc.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-700">
                    {doc.uploaded}/{totalEmployees}
                  </p>
                </div>
                <div className={`h-10 w-10 rounded-full ${style.iconBg} flex items-center justify-center`}>
                  <FileText className={`h-5 w-5 ${style.iconColor}`} />
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-${doc.color}-500`}
                    style={{ width: `${doc.percentage}%` }}
                  ></div>
                </div>
                <p className={`mt-1 text-xs ${style.textColor} font-medium`}>
                  {doc.percentage}% uploaded
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentStatsCards;