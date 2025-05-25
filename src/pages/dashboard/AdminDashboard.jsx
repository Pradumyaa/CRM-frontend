// pages/dashboard/AdminDashboard.jsx
import React from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/Button";
import {
  Users,
  FileText,
  FolderOpen,
  ListChecks,
  Clock,
  Briefcase,
  BarChart3,
  Calendar,
  Check,
  AlertCircle,
  UserPlus,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";
import RecentActivity from "./RecentActivity";
import UpcomingEvents from "./UpcomingEvents";
import TaskSummary from "./TaskSummary";

const AdminDashboard = ({
  loading,
  error,
  adminMetrics,
  workspaceMetrics,
  recentActivities,
  upcomingEvents,
  taskData,
  tasks,
  employee,
}) => {
  // Performance data for the chart in admin dashboard
  const performanceData = [
    { name: "Jan", attendance: 92, hiring: 3 },
    { name: "Feb", attendance: 89, hiring: 5 },
    { name: "Mar", attendance: 95, hiring: 2 },
    { name: "Apr", attendance: 91, hiring: 4 },
    { name: "May", attendance: 88, hiring: 6 },
    { name: "Jun", attendance: 94, hiring: 3 },
  ];

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading dashboard: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column - Main Content */}
      <div className="md:col-span-2 space-y-6">
        {/* Organization Overview */}
        <Card className="p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Organization Overview
            </h2>
            <Link
              to="/organisation/employeeList"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Manage Employees
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 border rounded-xl bg-blue-50 border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-600">
                  Total Employees
                </h3>
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {adminMetrics.totalEmployees}
              </p>
            </div>

            <div className="p-4 border rounded-xl bg-green-50 border-green-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-600">Active</h3>
                <Check className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {adminMetrics.activeEmployees}
              </p>
            </div>

            <div className="p-4 border rounded-xl bg-red-50 border-red-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-600">Inactive</h3>
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {adminMetrics.totalEmployees - adminMetrics.activeEmployees}
              </p>
            </div>

            <div className="p-4 border rounded-xl bg-amber-50 border-amber-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-600">
                  Average Attendance
                </h3>
                <Calendar className="h-6 w-6 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">92%</p>
            </div>
          </div>

          {/* Organizational Health Indicator */}
          <div className="mt-6 p-4 border rounded-xl bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Employee Retention
              </h3>
              <p className="text-sm text-gray-500">
                {adminMetrics.activeEmployees} of {adminMetrics.totalEmployees}{" "}
                employees active
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${adminMetrics.activeRate}%` }}
              ></div>
            </div>
            <p className="mt-1 text-xs text-right text-gray-500">
              {adminMetrics.activeRate}% retention rate
            </p>
          </div>
        </Card>

        {/* Workspace Overview */}
        <Card className="p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Workspace Overview
            </h2>
            <Link
              to="/workspaces"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Manage Workspaces
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 border rounded-xl bg-blue-50 border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-600">Spaces</h3>
                <Briefcase className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {workspaceMetrics.totalSpaces}
              </p>
            </div>

            <div className="p-4 border rounded-xl bg-green-50 border-green-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-600">Folders</h3>
                <FolderOpen className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {workspaceMetrics.totalFolders}
              </p>
            </div>

            <div className="p-4 border rounded-xl bg-purple-50 border-purple-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-600">Projects</h3>
                <ListChecks className="h-6 w-6 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {workspaceMetrics.totalProjects}
              </p>
            </div>

            <div className="p-4 border rounded-xl bg-amber-50 border-amber-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-600">Tasks</h3>
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {workspaceMetrics.totalTasks}
              </p>
            </div>
          </div>

          {/* Workspace Stats */}
          <div className="mt-6 p-4 border rounded-xl bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Task Completion
              </h3>
              <p className="text-sm text-gray-500">
                {workspaceMetrics.completedTasks} of{" "}
                {workspaceMetrics.totalTasks} tasks completed
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${workspaceMetrics.taskCompletionRate}%` }}
              ></div>
            </div>
            <p className="mt-1 text-xs text-right text-gray-500">
              {workspaceMetrics.taskCompletionRate}% complete
            </p>
          </div>
        </Card>

        {/* Admin Actions */}
        <Card className="p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Administrative Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/organisation/employeeList">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow-md flex justify-center items-center gap-2">
                <UserPlus className="h-5 w-5" />
                <span>Manage Employees</span>
              </Button>
            </Link>

            <Link to="/organisation/activityTracker">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg shadow-md flex justify-center items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <span>Activity Tracker</span>
              </Button>
            </Link>

            <Link to="/organisation/documents">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg shadow-md flex justify-center items-center gap-2">
                <FileText className="h-5 w-5" />
                <span>Manage Documents</span>
              </Button>
            </Link>
          </div>
        </Card>

        {/* Task Summary */}
        <TaskSummary taskData={taskData} tasks={tasks} />
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        {/* Admin Profile Card */}
        {employee && (
          <Card className="p-6 rounded-xl shadow-md bg-white">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={employee?.images?.[0] || "/default-profile.jpg"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">
                {employee?.name || "Admin User"}
              </h2>
              <p className="text-sm text-gray-500">Administrator</p>

              <div className="mt-5 w-full border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {adminMetrics.totalEmployees}
                    </p>
                    <p className="text-xs text-gray-500">Total Employees</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {adminMetrics.activeRate}%
                    </p>
                    <p className="text-xs text-gray-500">Retention Rate</p>
                  </div>
                </div>
              </div>

              <Link to="/profile">
                <Button className="mt-5 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg border border-gray-200">
                  View Profile
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Day Off Requests */}
        <Card className="p-5 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Day Off Requests
            </h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {/* Example day off requests - in a real app, this would come from API */}
            <div className="p-3 bg-white border-l-4 border-l-amber-500 rounded-r-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">
                    John Smith
                  </h3>
                  <p className="text-xs text-gray-500">Medical Leave</p>
                </div>
                <div className="text-xs text-gray-500">May 22-24</div>
              </div>
              <div className="mt-2 flex justify-end gap-2">
                <button className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                  Approve
                </button>
                <button className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                  Reject
                </button>
              </div>
            </div>

            <div className="p-3 bg-white border-l-4 border-l-blue-500 rounded-r-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">
                    Jane Doe
                  </h3>
                  <p className="text-xs text-gray-500">Vacation</p>
                </div>
                <div className="text-xs text-gray-500">May 30-31</div>
              </div>
              <div className="mt-2 flex justify-end gap-2">
                <button className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                  Approve
                </button>
                <button className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                  Reject
                </button>
              </div>
            </div>
          </div>

          <Link to="/attendance">
            <Button className="w-full mt-4 py-2 text-sm text-center text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-300 rounded-lg">
              Manage Leave Requests
            </Button>
          </Link>
        </Card>

        {/* Recent Activity */}
        <RecentActivity activities={recentActivities} />

        {/* Upcoming Events */}
        <UpcomingEvents events={upcomingEvents} />
      </div>
    </div>
  );
};

export default AdminDashboard;
