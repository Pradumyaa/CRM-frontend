import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Replaced next/router
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
import useSpacesStore from "@/store/useSpacesStore";
import { isAuthenticated } from "@/utils/auth";

const WorkspacePage = () => {
  const navigate = useNavigate(); // ✅ react-router hook
  const { fetchSpaces, spaces, loading, error } = useSpacesStore();
  const [selectedProjectList, setSelectedProjectList] = useState(null);
  const [activeView, setActiveView] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // ✅ Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);
        await fetchSpaces();
      } catch (err) {
        console.error("Error loading workspace data:", err);
      } finally {
        setPageLoading(false);
      }
    };
    loadData();
  }, [fetchSpaces]);

  const handleSelectProjectList = (projectListId) => {
    setSelectedProjectList(projectListId);
    if (!activeView) setActiveView("overview");
  };

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const renderView = () => {
    if (pageLoading || loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchSpaces()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!selectedProjectList) {
      return (
        <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center p-6">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Select a project list
          </h2>
          <p className="text-gray-500 mb-6">
            Choose a project list from the sidebar to view and manage tasks
          </p>
          <button
            onClick={() =>
              document.getElementById("add-project-button")?.click()
            }
            className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
          >
            Create New Project
          </button>
        </div>
      );
    }

    switch (activeView) {
      case "overview":
        return <OverviewView projectListId={selectedProjectList} />;
      case "list":
        return <ListView projectListId={selectedProjectList} />;
      case "gantt":
        return <GanttView projectListId={selectedProjectList} />;
      case "calendar":
        return <CalendarView projectListId={selectedProjectList} />;
      case "kanban":
        return <KanbanView projectListId={selectedProjectList} />;
      case "table":
        return <TableView projectListId={selectedProjectList} />;
      case "timeline":
        return <TimelineView projectListId={selectedProjectList} />;
      case "workload":
        return <WorkloadView projectListId={selectedProjectList} />;
      case "activity":
        return <ActivityView projectListId={selectedProjectList} />;
      default:
        return <OverviewView projectListId={selectedProjectList} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? "w-16" : "w-72"}`}>
        <SpacesSidebar
          onSelectProjectList={handleSelectProjectList}
          isCollapsed={sidebarCollapsed}
          toggleCollapse={toggleSidebar}
          className="h-screen flex-shrink-0 bg-white border-r border-gray-200 shadow-sm"
        />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar
          activeView={activeView}
          setActiveView={setActiveView}
          projectListId={selectedProjectList}
        />
        <div className="flex-1 overflow-auto bg-gray-50">{renderView()}</div>
      </div>
    </div>
  );
};

export default WorkspacePage;
