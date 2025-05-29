import React from 'react';
import { 
  FileText, Users, Settings, Key, Building,
  BarChart3, Calendar, MessageSquare
} from 'lucide-react';
// Permissions Center Component
 const PermissionsCenter = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <Key className="h-16 w-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Permissions Center</h2>
          <p className="text-gray-600 mb-6">
            Configure system permissions and access control settings
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 border border-gray-200 rounded-lg">
              <Settings className="h-8 w-8 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">System Permissions</h3>
              <p className="text-sm text-gray-600">Manage core system access and administrative rights</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Role-Based Access</h3>
              <p className="text-sm text-gray-600">Configure permissions based on organizational roles</p>
            </div>
          </div>
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Super Admin Access Required:</strong> Only Super Admins can modify system permissions
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PermissionsCenter;