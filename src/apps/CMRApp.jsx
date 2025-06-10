// CRMApp.jsx - Dedicated CRM Application Component
import { useState, useEffect } from "react";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Import existing components
import Sidebar from "../pages/components/sidebar/Sidebar.jsx";
import AttendanceCalendarPage from "../pages/attendance/AttendanceCalendarPage.jsx";
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import EmployeeListPage from "../pages/organisation/employeeList/EmployeeListPage.jsx";
import DocumentsPage from "../pages/organisation/documents/DocumentsPage.jsx";
import IncomePage from "../pages/income/IncomePage.jsx";
import ProfilePage from "../pages/profile/ProfilePage.jsx";
import ChatPage from "../pages/chat/ChatPage.jsx";
import SpacesPage from "../pages/workspaces/WorkspacePage.jsx";

// Import new role-based components
import SuperAdminPanel from "../pages/organisation/superAdmin/SuperAdminPanel.jsx";
import LiveActivityTracker from "../pages/organisation/activityTracker/LiveActivityTracker.jsx";
import RoleManagement from "../pages/organisation/roles/RoleManagement.jsx";
import AnalyticsDashboard from "../pages/organisation/analytics/AnalyticsDashboard.jsx";
import ReportsCenter from "../pages/organisation/reports/ReportsCenter.jsx";
import RequestsManagement from "../pages/organisation/requests/RequestsManagement.jsx";
import DepartmentManagement from "../pages/organisation/departments/DepartmentManagement.jsx";
import PermissionsCenter from "../pages/organisation/permissions/PermissionsCenter.jsx";

// Protected route wrapper with role-based access control
function ProtectedRoute({
  children,
  requiredLevel = 14,
  requiredPermissions = [],
}) {
  const { user, loading, hasRoleLevel, hasAnyPermission } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check role level access
  if (!hasRoleLevel(requiredLevel)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have sufficient permissions to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required access level: L{requiredLevel} or higher
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check specific permissions if required
  if (
    requiredPermissions.length > 0 &&
    !hasAnyPermission(requiredPermissions)
  ) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Permission Required
          </h2>
          <p className="text-gray-600 mb-4">
            You need specific permissions to access this feature.
          </p>
          <p className="text-sm text-gray-500">
            Required permissions: {requiredPermissions.join(", ")}
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
}

// Main CRM Layout with sidebar and role-based content
function CRMLayout() {
  const [selectedItem, setSelectedItem] = useState("dashboard");
  const { userRole, hasRoleLevel } = useAuth();

  // Content mapping with role-based access control
  const contentMap = {
    // Basic pages available to all authenticated users
    dashboard: <DashboardPage />,
    profile: <ProfilePage />,
    help: <AttendanceCalendarPage />,

    // Organization section with role-based components
    employeeList: (
      <ProtectedRoute requiredLevel={3}>
        <EmployeeListPage />
      </ProtectedRoute>
    ),

    superAdminPanel: (
      <ProtectedRoute requiredLevel={1} requiredPermissions={["all_access"]}>
        <SuperAdminPanel />
      </ProtectedRoute>
    ),

    roleManagement: (
      <ProtectedRoute requiredLevel={2} requiredPermissions={["manage_roles"]}>
        <RoleManagement />
      </ProtectedRoute>
    ),

    documents: (
      <ProtectedRoute
        requiredLevel={6}
        requiredPermissions={["view_documents"]}
      >
        <DocumentsPage />
      </ProtectedRoute>
    ),

    activityTracker: (
      <ProtectedRoute
        requiredLevel={9}
        requiredPermissions={["track_activities"]}
      >
        <LiveActivityTracker />
      </ProtectedRoute>
    ),

    analytics: (
      <ProtectedRoute
        requiredLevel={5}
        requiredPermissions={["view_analytics"]}
      >
        <AnalyticsDashboard />
      </ProtectedRoute>
    ),

    reports: (
      <ProtectedRoute requiredLevel={6} requiredPermissions={["view_reports"]}>
        <ReportsCenter />
      </ProtectedRoute>
    ),

    requests: (
      <ProtectedRoute
        requiredLevel={7}
        requiredPermissions={["manage_requests"]}
      >
        <RequestsManagement />
      </ProtectedRoute>
    ),

    departments: (
      <ProtectedRoute
        requiredLevel={4}
        requiredPermissions={["manage_departments"]}
      >
        <DepartmentManagement />
      </ProtectedRoute>
    ),

    permissions: (
      <ProtectedRoute
        requiredLevel={1}
        requiredPermissions={["manage_permissions"]}
      >
        <PermissionsCenter />
      </ProtectedRoute>
    ),

    // Additional features based on role
    chat: (
      <ProtectedRoute requiredLevel={8}>
        <ChatPage />
      </ProtectedRoute>
    ),

    spaces: (
      <ProtectedRoute requiredLevel={8}>
        <SpacesPage />
      </ProtectedRoute>
    ),

    income: (
      <ProtectedRoute
        requiredLevel={6}
        requiredPermissions={["view_financial_data"]}
      >
        <IncomePage />
      </ProtectedRoute>
    ),
  };

  // Get role-appropriate default content
  const getDefaultContent = () => {
    const item = selectedItem || "dashboard";
    return (
      contentMap[item] || (
        <div className="p-8 bg-white rounded-lg shadow-sm">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Feature Coming Soon
            </h2>
            <p className="text-gray-600 mb-4">
              This feature is currently under development for your role level.
            </p>
            <div className="text-sm text-gray-500">
              <p>
                Current selection:{" "}
                <span className="font-medium">{selectedItem}</span>
              </p>
              <p>
                Your role: <span className="font-medium">{userRole}</span>
              </p>
            </div>
          </div>
        </div>
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar selectedItem={selectedItem} onItemSelect={setSelectedItem} />
      <div className="flex-1 min-h-screen overflow-auto">
        {getDefaultContent()}
      </div>
    </div>
  );
}

// Loading component
const CRMLoadingScreen = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      <h2 className="mt-6 text-xl font-semibold text-gray-900">
        Loading CRM Dashboard
      </h2>
      <p className="mt-2 text-gray-600">
        Setting up your personalized experience...
      </p>
      <div className="mt-4 flex justify-center space-x-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  </div>
);

// Error Boundary Component for CRM
class CRMErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CRM Application Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
            <div className="text-red-500 text-6xl mb-4">💥</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              CRM System Error
            </h2>
            <p className="text-gray-600 mb-4">
              We encountered an unexpected error in the CRM system. Please try
              refreshing the page.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Refresh CRM
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Try Again
              </button>
            </div>
            {process.env.NODE_ENV === "development" && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// CRM App Routes
function CRMRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <CRMLoadingScreen />;
  }

  return (
    <Routes>
      {/* CRM Dashboard Routes */}
      <Route path="/dashboard" element={<CRMLayout />} />
      <Route path="/profile" element={<CRMLayout />} />
      <Route path="/attendance" element={<CRMLayout />} />
      <Route path="/chat" element={<CRMLayout />} />
      <Route path="/spaces" element={<CRMLayout />} />
      <Route path="/income" element={<CRMLayout />} />

      {/* Organization Routes */}
      <Route path="/organisation/employees" element={<CRMLayout />} />
      <Route path="/organisation/super-admin" element={<CRMLayout />} />
      <Route path="/organisation/roles" element={<CRMLayout />} />
      <Route path="/organisation/documents" element={<CRMLayout />} />
      <Route path="/organisation/activity-tracker" element={<CRMLayout />} />
      <Route path="/organisation/analytics" element={<CRMLayout />} />
      <Route path="/organisation/reports" element={<CRMLayout />} />
      <Route path="/organisation/requests" element={<CRMLayout />} />
      <Route path="/organisation/departments" element={<CRMLayout />} />
      <Route path="/organisation/permissions" element={<CRMLayout />} />

      {/* Default CRM route */}
      <Route path="/" element={<Navigate to="/crm/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/crm/dashboard" replace />} />
    </Routes>
  );
}

// Role-based feature announcements
const FeatureAnnouncement = () => {
  const { userRole, hasRoleLevel } = useAuth();
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  if (!showAnnouncement) return null;

  const getAnnouncementForRole = () => {
    if (hasRoleLevel(1)) {
      return {
        title: "🎉 Super Admin Features Unlocked!",
        message:
          "You now have access to the complete Super Admin Panel with role management, system analytics, and full organizational control.",
        color: "purple",
      };
    } else if (hasRoleLevel(3)) {
      return {
        title: "🛠️ Admin Dashboard Enhanced!",
        message:
          "New employee management tools and enhanced analytics are now available in your admin panel.",
        color: "blue",
      };
    } else if (hasRoleLevel(6)) {
      return {
        title: "📊 Manager Tools Updated!",
        message:
          "Access new team management features, reports center, and department analytics.",
        color: "green",
      };
    } else if (hasRoleLevel(9)) {
      return {
        title: "🎯 Team Lead Features!",
        message:
          "Live activity tracking and team collaboration tools are now available.",
        color: "orange",
      };
    }
    return null;
  };

  const announcement = getAnnouncementForRole();

  if (!announcement) return null;

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm bg-${announcement.color}-50 border-l-4 border-${announcement.color}-400 p-4 rounded-lg shadow-lg z-50`}
    >
      <div className="flex">
        <div className="flex-1">
          <h4 className={`text-sm font-medium text-${announcement.color}-800`}>
            {announcement.title}
          </h4>
          <p className={`mt-1 text-sm text-${announcement.color}-700`}>
            {announcement.message}
          </p>
        </div>
        <button
          onClick={() => setShowAnnouncement(false)}
          className={`ml-3 text-${announcement.color}-400 hover:text-${announcement.color}-600`}
        >
          <span className="sr-only">Dismiss</span>×
        </button>
      </div>
    </div>
  );
};

// Main CRM App component
function CRMApp() {
  return (
    <CRMErrorBoundary>
      <div className="CRMApp">
        <CRMRoutes />
        <FeatureAnnouncement />
      </div>
    </CRMErrorBoundary>
  );
}

export default CRMApp;
