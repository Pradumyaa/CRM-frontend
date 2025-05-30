// Fixed EmployeeListPage.jsx with proper authentication
import { useState, useEffect } from "react";
import { Plus, BriefcaseBusiness } from "lucide-react";
import axios from "axios";
import SearchBar from "@/pages/components/SearchBar.jsx";
import EmployeeTable from "./employee/EmployeeTable.jsx";
import AddEmployeeModal from "./employee/AddEmployeeModal.jsx";
import ViewEmployeeModal from "./employee/ViewEmployeeModal.jsx";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("Admin"); // Will be updated from stored data
  const [error, setError] = useState(null);

  // Setup axios with auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    // Get username from localStorage
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUsername(storedName);
    }

    const fetchEmployees = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Include authorization header
        const response = await axios.get(
          "https://getmax-backend.vercel.app/api/employees",
          getAuthHeaders()
        );

        console.log("Employees data:", response.data);
        setEmployees(response.data.employees || []);
        setFilteredEmployees(response.data.employees || []);
      } catch (error) {
        console.error("Error fetching employees:", error);

        // Set more helpful error message
        if (error.response) {
          if (error.response.status === 401) {
            setError("Authentication required. Please login again.");
          } else {
            setError(
              `Failed to load employees: ${error.response.status} ${error.response.statusText}`
            );
          }
        } else {
          setError("Network error when trying to fetch employees");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsEditing(true);
    setIsAddModalOpen(true);
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setIsViewModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setIsEditing(false);
    setSelectedEmployee(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      await axios.delete(
        `https://getmax-backend.vercel.app/api/employees/${employeeId}`,
        getAuthHeaders()
      );

      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
      setFilteredEmployees((prev) =>
        prev.filter((emp) => emp.id !== employeeId)
      );
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee. Try again.");
    }
  };

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Get today's date in a nice format
  const getTodayDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Display an error screen if authentication failed
  if (error && error.includes("Authentication required")) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {getGreeting()}, {username} 👋
              </h1>
              <p className="opacity-80 text-lg">{getTodayDate()}</p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedEmployee(null);
                  setIsAddModalOpen(true);
                }}
                className="bg-white text-indigo-700 px-4 py-2 rounded-lg flex items-center transition-all hover:bg-opacity-90 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Employee
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Employee List Section */}
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="py-6">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <BriefcaseBusiness className="mr-2 h-5 w-5 text-indigo-600" />
                  Employee Management
                </h2>
                <p className="text-gray-500 text-sm">
                  Manage all your employees in one place
                </p>
              </div>

              <div className="w-full lg:w-1/2 xl:w-2/5">
                <div className="relative">
                  <SearchBar
                    setFilteredEmployees={setFilteredEmployees}
                    setSearchQuery={setSearchQuery}
                    employees={employees}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-500">Loading employees...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="text-red-500 text-lg mb-4">Error</div>
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
          ) : (
            <EmployeeTable
              employees={filteredEmployees}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddEmployeeModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          employeeData={selectedEmployee || {}}
          setEmployeeData={setSelectedEmployee}
          onSave={() => window.location.reload()}
          isEditing={isEditing}
          getAuthHeaders={getAuthHeaders} // Pass the auth function
        />
      )}

      {isViewModalOpen && (
        <ViewEmployeeModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          employee={selectedEmployee}
          getAuthHeaders={getAuthHeaders} // Pass the auth function
        />
      )}
    </div>
  );
};

export default EmployeeListPage;
