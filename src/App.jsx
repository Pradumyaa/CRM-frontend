import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./pages/components/sidebar/Sidebar.jsx";
import LoginPage from "./pages/login/LoginPage.jsx";
import AttendanceCalendarPage from "./pages/attendance/AttendanceCalendarPage.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import EmployeeListPage from "./pages/organisation/employeeList/EmployeeListPage.jsx";
import DocumentsPage from "./pages/organisation/documents/DocumentsPage.jsx";
import ActivityPage from "./pages/organisation/activityTracker/ActivityPage.jsx";
// import IncomePage from "./pages/income/IncomePage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
// import AllProductsContent from "./pages/product/AllProductsContent.jsx";
// import CategoriesContent from "./pages/product/CategoriesContent.jsx";
// import OrdersContent from "./pages/product/OrdersContent.jsx";
// import ChatPage from "./pages/chat/ChatPage.jsx";
// import SpacesPage from "./pages/workspaces/WorkspacePage.jsx"; // ✅ Import SpacesPage
// import HomePage from './pages/HomePage';

const HomeLayout = ({ selectedItem, onItemSelect }) => {
  const contentMap = {
    dashboard: <DashboardPage />,
    employeeList: <EmployeeListPage />,
    activityTracker: <ActivityPage />,
    documents: <DocumentsPage />,
    help: <AttendanceCalendarPage />,
    // income: <IncomePage />,
    profile: <ProfilePage />,
    // allProducts: <AllProductsContent />,
    // categories: <CategoriesContent />,
    // orders: <OrdersContent />,
    // chat: <ChatPage />,
    // spaces: <SpacesPage />,
  };

  return (
    <div className="flex h-screen">
      <Sidebar selectedItem={selectedItem} onItemSelect={onItemSelect} />
      <div className="flex-1 min-h-screen overflow-auto p-6">
        {contentMap[selectedItem] || (
          <div className="p-8">Content for {selectedItem}</div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state to show a loader during fetch
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [selectedItem, setSelectedItem] = useState("dashboard");

  // Fetch all employees on component mount
  useEffect(() => {
    const savedEmployeeId = localStorage.getItem("employeeId");

    if (savedEmployeeId) {
      setIsAuthenticated(true); // User is logged in
    }

    const fetchEmployees = async () => {
      try {
        console.log("Fetching employees...");
        const response = await axios.get("http://localhost:3000/api/employees");

        console.log("Employees fetched:", response.data);
        setEmployees(response.data); // Set all employees in state
        setFilteredEmployees(response.data); // Initially set filteredEmployees to all employees
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching employees:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchEmployees();
  }, []);

  // Conditional rendering for loading state
  if (loading) {
    return <div>Loading...</div>; // Show loading until employees are fetched
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/attendance" element={<AttendanceCalendarPage />} />

        {isAuthenticated ? (
          <Route
            path="/*"
            element={
              <HomeLayout
                selectedItem={selectedItem}
                onItemSelect={setSelectedItem}
              />
            }
          />
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
