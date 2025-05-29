// WorkspacePage.jsx - Complete workspace implementation
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SpacesSidebar from "./sidebar/SpacesSidebar";
import Navbar from "./navbar/Navbar";
import ListView from "./views/ListView";
import GanttView from "./views/GanttView";
import CalendarView from "./views/CalendarView";
import KanbanView from "./views/KanbanView";
import TableView from "./views/TableView";
import TimelineView from "./views/TimelineView";
import WorkloadView from "./views/WorkloadView";
import ActivityView from "./views/ActivityView";
import OverviewView from "./views/OverviewView";
import useSpacesStore from "../../store/useSpacesStore";
import { isAuthenticated } from "../../utils/auth";
import {
  initializeWorkspace,
  getWorkspaceStats,
} from "../../utils/workspaceInit";

const WorkspacePage = () => {
  const navigate = useNavigate();
  const { fetchSpaces, spaces, loading, error } = useSpacesStore();
  const [selectedProjectList, setSelectedProjectList] = useState(null);
  const [activeView, setActiveView] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [initializationError, setInitializationError] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Initialize workspace on component mount
  useEffect(() => {
    const loadWorkspace = async () => {
      try {
        setPageLoading(true);
        setInitializationError(null);

        // First, try to fetch existing spaces
        await fetchSpaces();

        // If no spaces exist, initialize with sample data (for demo purposes)
        const currentSpaces = useSpacesStore.getState().spaces;
        if (!currentSpaces || currentSpaces.length === 0) {
          console.log(
            "No existing spaces found, initializing with sample data..."
          );
          await initializeWorkspace();
        }

        // Log workspace statistics
        const stats = getWorkspaceStats();
        console.log("Workspace loaded successfully:", stats);
      } catch (err) {
        console.error("Error loading workspace:", err);
        setInitializationError(err.message || "Failed to load workspace");
      } finally {
        setPageLoading(false);
      }
    };

    loadWorkspace();
  }, [fetchSpaces]);

  const handleSelectProjectList = (projectListId) => {
    setSelectedProjectList(projectListId);
    if (!activeView || activeView === "overview") {
      setActiveView("list"); // Default to list view when selecting a project
    }
  };

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const renderView = () => {
    // Show loading state
    if (pageLoading || loading) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {pageLoading ? "Initializing workspace..." : "Loading..."}
            </p>
          </div>
        </div>
      );
    }

    // Show initialization error
    if (initializationError) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50">
          <div className="text-center max-w-md">
            <div className="text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Workspace Initialization Error
            </h2>
            <p className="text-gray-600 mb-4">{initializationError}</p>
            <div className="space-x-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => {
                  useSpacesStore.setState({
                    spaces: [],
                    loading: false,
                    error: null,
                  });
                  setInitializationError(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Show general error
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50">
          <div className="text-center max-w-md">
            <div className="text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Error Loading Workspace
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchSpaces()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    // Show project selection prompt
    if (!selectedProjectList) {
      const stats = getWorkspaceStats();

      return (
        <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center p-6 bg-gray-50">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to Your Workspace
          </h2>

          <p className="text-gray-600 mb-6 max-w-md">
            Select a project list from the sidebar to view and manage tasks, or
            create a new one to get started.
          </p>

          {/* Workspace Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full max-w-lg">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">
                {stats.totalSpaces}
              </div>
              <div className="text-sm text-gray-500">Spaces</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalProjectLists}
              </div>
              <div className="text-sm text-gray-500">Projects</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {stats.totalTasks}
              </div>
              <div className="text-sm text-gray-500">Tasks</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {stats.completionRate}%
              </div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>

          <button
            onClick={() =>
              document.getElementById("add-project-button")?.click()
            }
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Create New Project
          </button>
        </div>
      );
    }

    // Render the selected view
    const viewProps = { projectListId: selectedProjectList };

    switch (activeView) {
      case "overview":
        return <OverviewView {...viewProps} />;
      case "list":
        return <ListView {...viewProps} />;
      case "gantt":
        return <GanttView {...viewProps} />;
      case "calendar":
        return <CalendarView {...viewProps} />;
      case "kanban":
        return <KanbanView {...viewProps} />;
      case "table":
        return <TableView {...viewProps} />;
      case "timeline":
        return <TimelineView {...viewProps} />;
      case "workload":
        return <WorkloadView {...viewProps} />;
      case "activity":
        return <ActivityView {...viewProps} />;
      default:
        return <OverviewView {...viewProps} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out flex-shrink-0 ${
          sidebarCollapsed ? "w-16" : "w-72"
        }`}
      >
        <SpacesSidebar
          onSelectProjectList={handleSelectProjectList}
          isCollapsed={sidebarCollapsed}
          toggleCollapse={toggleSidebar}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar
          activeView={activeView}
          setActiveView={setActiveView}
          projectListId={selectedProjectList}
        />
        <div className="flex-1 overflow-auto">{renderView()}</div>
      </div>
    </div>
  );
};

export default WorkspacePage;
