// App.jsx
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

// Import your existing components
import Sidebar from "./pages/components/sidebar/Sidebar.jsx";
import LoginPage from "./pages/login/LoginPage.jsx";
import AttendanceCalendarPage from "./pages/attendance/AttendanceCalendarPage.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import EmployeeListPage from "./pages/organisation/employeeList/EmployeeListPage.jsx";
import DocumentsPage from "./pages/organisation/documents/DocumentsPage.jsx";
import ActivityPage from "./pages/organisation/activityTracker/ActivityPage.jsx";
import IncomePage from "./pages/income/IncomePage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import AllProductsContent from "./pages/product/AllProductsContent.jsx";
import CategoriesContent from "./pages/product/CategoriesContent.jsx";
import OrdersContent from "./pages/product/OrdersContent.jsx";
import ChatPage from "./pages/chat/ChatPage.jsx";
import SpacesPage from "./pages/workspaces/WorkspacePage.jsx";

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

// Main App Layout with sidebar
function HomeLayout() {
  const [selectedItem, setSelectedItem] = useState("dashboard");

  const contentMap = {
    dashboard: <DashboardPage />,
    employeeList: <EmployeeListPage />,
    activityTracker: <ActivityPage />,
    documents: <DocumentsPage />,
    help: <AttendanceCalendarPage />,
    income: <IncomePage />,
    profile: <ProfilePage />,
    allProducts: <AllProductsContent />,
    categories: <CategoriesContent />,
    orders: <OrdersContent />,
    chat: <ChatPage />,
    spaces: <SpacesPage />,
  };

  return (
    <div className="flex h-screen">
      <Sidebar selectedItem={selectedItem} onItemSelect={setSelectedItem} />
      <div className="flex-1 min-h-screen overflow-auto p-6">
        {contentMap[selectedItem] || (
          <div className="p-8">Content for {selectedItem}</div>
        )}
      </div>
    </div>
  );
}

// Main App component with routes
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <HomeLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// Main App component with AuthProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
