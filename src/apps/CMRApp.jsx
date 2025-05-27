// apps/CRMApp.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Import CRM Components
import Sidebar from "../pages/components/sidebar/Sidebar.jsx";
import Header from "../pages/components/sidebar/Header.jsx";
import AttendanceCalendarPage from "../pages/attendance/AttendanceCalendarPage.jsx";
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import EmployeeListPage from "../pages/organisation/employeeList/EmployeeListPage.jsx";
import DocumentsPage from "../pages/organisation/documents/DocumentsPage.jsx";
import ActivityPage from "../pages/organisation/activityTracker/ActivityPage.jsx";
import IncomePage from "../pages/income/IncomePage.jsx";
import ProfilePage from "../pages/profile/ProfilePage.jsx";
import AllProductsContent from "../pages/product/AllProductsContent.jsx";
import CategoriesContent from "../pages/product/CategoriesContent.jsx";
import OrdersContent from "../pages/product/OrdersContent.jsx";
import ChatPage from "../pages/chat/ChatPage.jsx";
import SpacesPage from "../pages/workspaces/WorkspacePage.jsx";

// Admin-only route wrapper for CRM
function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#5932EA] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/crm/dashboard" replace />;
  }

  return children;
}

// CRM Layout wrapper that includes sidebar and header
function CRMLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

// CRM Application Routes
function CRMApp() {
  const { user } = useAuth();

  // If no user, this shouldn't happen as App.jsx protects this route
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      {/* CRM Home - Redirect to Dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />

      {/* Dashboard */}
      <Route
        path="dashboard"
        element={
          <CRMLayout>
            <DashboardPage />
          </CRMLayout>
        }
      />

      {/* Profile */}
      <Route
        path="profile"
        element={
          <CRMLayout>
            <ProfilePage />
          </CRMLayout>
        }
      />

      {/* Attendance */}
      <Route
        path="attendance"
        element={
          <CRMLayout>
            <AttendanceCalendarPage />
          </CRMLayout>
        }
      />

      {/* Chat */}
      <Route
        path="chat"
        element={
          <CRMLayout>
            <ChatPage />
          </CRMLayout>
        }
      />

      {/* Organisation Routes - Admin Only */}
      <Route
        path="organisation/employees"
        element={
          <AdminRoute>
            <CRMLayout>
              <EmployeeListPage />
            </CRMLayout>
          </AdminRoute>
        }
      />

      <Route
        path="organisation/activity"
        element={
          <AdminRoute>
            <CRMLayout>
              <ActivityPage />
            </CRMLayout>
          </AdminRoute>
        }
      />

      <Route
        path="organisation/documents"
        element={
          <AdminRoute>
            <CRMLayout>
              <DocumentsPage />
            </CRMLayout>
          </AdminRoute>
        }
      />

      {/* Workspaces */}
      <Route
        path="spaces"
        element={
          <AdminRoute>
            <CRMLayout>
              <SpacesPage />
            </CRMLayout>
          </AdminRoute>
        }
      />

      {/* Product Management */}
      <Route
        path="products"
        element={
          <CRMLayout>
            <AllProductsContent />
          </CRMLayout>
        }
      />

      <Route
        path="products/categories"
        element={
          <CRMLayout>
            <CategoriesContent />
          </CRMLayout>
        }
      />

      <Route
        path="products/orders"
        element={
          <CRMLayout>
            <OrdersContent />
          </CRMLayout>
        }
      />

      {/* Income */}
      <Route
        path="income"
        element={
          <CRMLayout>
            <IncomePage />
          </CRMLayout>
        }
      />

      {/* CRM 404 - Redirect to Dashboard */}
      <Route
        path="*"
        element={
          <CRMLayout>
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  CRM Page Not Found
                </h1>
                <p className="text-gray-600 mb-6">
                  The CRM page you're looking for doesn't exist.
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => (window.location.href = "/crm/dashboard")}
                    className="bg-[#5932EA] text-white px-6 py-3 rounded-lg hover:bg-[#4526B5]"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </CRMLayout>
        }
      />
    </Routes>
  );
}

export default CRMApp;
