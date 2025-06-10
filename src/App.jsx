// App.jsx - Main Application Entry Point
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

// Import Layout
import PublicLayout from "./pages/public/layouts/PublicLayout.jsx";

// Public Pages
import LandingPage from "./pages/public/LandingPage.jsx";
import FeaturesPage from "./pages/public/FeaturesPage.jsx";
import SupportPage from "./pages/public/SupportPage.jsx";
import ProductsPage from "./pages/public/ProductsPage.jsx";
import ContactPage from "./pages/public/ContactPage.jsx";
import AboutPage from "./pages/public/AboutPage.jsx";
import LoginPage from "./pages/login/LoginPage.jsx";
import SocketDebug from "./components/SocketDebug.jsx";

// Import CRM App
import CRMApp from "./apps/CMRApp.jsx";

// Protected route wrapper for CRM
function ProtectedCRMRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#5932EA] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading BET Tool...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Main App Routes
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes with Layout */}
      <Route
        path="/"
        element={
          <PublicLayout currentPage="/">
            <LandingPage />
          </PublicLayout>
        }
      />

      <Route
        path="/features"
        element={
          <PublicLayout currentPage="/features">
            <FeaturesPage />
          </PublicLayout>
        }
      />

      <Route
        path="/about"
        element={
          <PublicLayout currentPage="/about">
            <AboutPage />
          </PublicLayout>
        }
      />

      <Route
        path="/support"
        element={
          <PublicLayout currentPage="/support">
            <SupportPage />
          </PublicLayout>
        }
      />

      <Route
        path="/products"
        element={
          <PublicLayout currentPage="/products">
            <ProductsPage />
          </PublicLayout>
        }
      />

      <Route
        path="/contact"
        element={
          <PublicLayout currentPage="/contact">
            <ContactPage />
          </PublicLayout>
        }
      />

      {/* Debug Route - Socket Debugging */}
      <Route
        path="/debug/socket"
        element={
          <PublicLayout currentPage="/debug/socket">
            <SocketDebug />
          </PublicLayout>
        }
      />

      {/* Login Route */}
      <Route
        path="/login"
        element={
          user ? <Navigate to="/crm/dashboard" replace /> : <LoginPage />
        }
      />

      {/* CRM Application - Protected */}
      <Route
        path="/crm/*"
        element={
          <ProtectedCRMRoute>
            <CRMApp />
          </ProtectedCRMRoute>
        }
      />

      {/* Legacy Route Redirects */}
      <Route
        path="/dashboard"
        element={<Navigate to="/crm/dashboard" replace />}
      />
      <Route path="/profile" element={<Navigate to="/crm/profile" replace />} />
      <Route
        path="/attendance"
        element={<Navigate to="/crm/attendance" replace />}
      />
      <Route path="/chat" element={<Navigate to="/crm/chat" replace />} />
      <Route
        path="/organisation/*"
        element={<Navigate to="/crm/organisation/employees" replace />}
      />
      <Route path="/spaces" element={<Navigate to="/crm/spaces" replace />} />
      <Route
        path="/products/*"
        element={<Navigate to="/crm/products" replace />}
      />
      <Route path="/income" element={<Navigate to="/crm/income" replace />} />

      {/* Catch-all - Redirect to Landing Page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Main App Component
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
