import React from "react";
import {
  FileText,
  Users,
  Settings,
  Key,
  Building,
  BarChart3,
  Calendar,
  MessageSquare,
} from "lucide-react";

// Reports Center Component
const ReportsCenter = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <FileText className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Reports Center
          </h2>
          <p className="text-gray-600 mb-6">
            Generate and manage organizational reports and analytics
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="p-4 border border-gray-200 rounded-lg">
              <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">
                Performance Reports
              </h3>
              <p className="text-sm text-gray-600">
                Employee and team performance analytics
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">
                Attendance Reports
              </h3>
              <p className="text-sm text-gray-600">
                Attendance tracking and summaries
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Custom Reports</h3>
              <p className="text-sm text-gray-600">
                Create custom reports and dashboards
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default ReportsCenter;
