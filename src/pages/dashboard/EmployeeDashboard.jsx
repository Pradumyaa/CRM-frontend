// pages/dashboard/EmployeeDashboard.jsx
import React from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/Button";
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertTriangle,
  Coffee,
  Award,
  Timer,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";
import RecentActivity from "./RecentActivity";
import UpcomingEvents from "./UpcomingEvents";
import TaskSummary from "./TaskSummary";

const EmployeeDashboard = ({
  loading,
  error,
  employeeMetrics,
  workspaceMetrics,
  recentActivities,
  upcomingEvents,
  taskData,
  tasks,
  employee,
}) => {
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

  const totalTasks = taskData.completed + taskData.pending + taskData.overdue;
  const completedPercentage =
    totalTasks > 0 ? Math.round((taskData.completed / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column - Main Content */}
      <div className="md:col-span-2 space-y-6">
        {/* Attendance Summary */}
        <Card className="p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Attendance Summary
            </h2>
            <Link
              to="/attendance"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View Calendar
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 border rounded-xl bg-blue-50 border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-600">
                  Days Worked
                </h3>
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {employeeMetrics.totalDaysWorked || 0}
              </p>
            </div>

            <div className="p-4 border rounded-xl bg-green-50 border-green-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-600">Days Off</h3>
                <Coffee className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {employeeMetrics.dayOff || 0}
              </p>
            </div>

            <div className="p-4 border rounded-xl bg-amber-50 border-amber-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-600">Late In</h3>
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {employeeMetrics.lateClockIn || 0}
              </p>
            </div>

            <div className="p-4 border rounded-xl bg-purple-50 border-purple-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-600">Overtime</h3>
                <Award className="h-6 w-6 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {employeeMetrics.overTime || 0}
              </p>
            </div>
          </div>

          {/* Today's Status */}
          <div className="mt-6 p-4 border rounded-xl bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700">
                    Today's Status
                  </h3>
                  <p className="text-xs text-gray-500">
                    You're clocked in for today
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-sm font-semibold text-gray-700">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <p className="text-xs text-gray-500">Current Time</p>
              </div>
            </div>

            <div className="mt-4 flex justify-between gap-4">
              <button className="flex-1 py-2 px-3 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center justify-center gap-1">
                <Timer className="h-4 w-4" />
                <span>Clock Out</span>
              </button>
              <button className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 flex items-center justify-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Request Day Off</span>
              </button>
            </div>
          </div>
        </Card>

        {/* My Workspaces */}
        <Card className="p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              My Workspaces
            </h2>
            <Link
              to="/workspaces"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {workspaceMetrics.totalSpaces > 0 ? (
              // If there are spaces, show the first 2
              Array.from({
                length: Math.min(2, workspaceMetrics.totalSpaces),
              }).map((_, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-xl hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="p-2 bg-indigo-100 rounded-md">
                        <Briefcase className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">
                          {index === 0 ? "Main Workspace" : "Project Alpha"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {index === 0 ? "5 projects" : "3 projects"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs py-1 px-2 bg-green-100 text-green-700 rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Completion</span>
                      <span>{index === 0 ? "65%" : "42%"}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: index === 0 ? "65%" : "42%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // If no spaces, show a message
              <div className="col-span-2 p-6 border rounded-xl text-center text-gray-500">
                No workspaces yet. Create your first workspace to get started.
              </div>
            )}
          </div>

          <Link to="/workspaces">
            <Button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
              Manage My Workspaces
            </Button>
          </Link>
        </Card>

        {/* Task Summary */}
        <TaskSummary taskData={taskData} tasks={tasks} />
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        {/* Employee Profile Card */}
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
                {employee?.name || "Employee"}
              </h2>
              <p className="text-sm text-gray-500">
                {employee?.jobTitle || "Team Member"}
              </p>

              <div className="mt-5 w-full border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {workspaceMetrics.totalProjects || 0}
                    </p>
                    <p className="text-xs text-gray-500">Active Projects</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {workspaceMetrics.taskCompletionRate || 0}%
                    </p>
                    <p className="text-xs text-gray-500">Completion Rate</p>
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

        {/* Quick Actions */}
        <Card className="p-5 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <Link to="/attendance">
              <Button className="w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-100 flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>View Attendance</span>
              </Button>
            </Link>

            <Link to="/chat">
              <Button className="w-full py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg border border-green-100 flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Open Chat</span>
              </Button>
            </Link>

            <Link to="/workspaces">
              <Button className="w-full py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg border border-purple-100 flex items-center justify-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>View Workspaces</span>
              </Button>
            </Link>
          </div>
        </Card>

        {/* Task Progress */}
        <Card className="p-5 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              My Task Progress
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Tasks Completed</span>
                <span className="font-medium">
                  {taskData.completed}/{totalTasks}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${completedPercentage}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Pending Tasks</span>
                <span className="font-medium">
                  {taskData.pending}/{totalTasks}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{
                    width: `${
                      totalTasks > 0
                        ? Math.round((taskData.pending / totalTasks) * 100)
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Overdue Tasks</span>
                <span className="font-medium">
                  {taskData.overdue}/{totalTasks}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${
                      totalTasks > 0
                        ? Math.round((taskData.overdue / totalTasks) * 100)
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Upcoming Events */}
        <UpcomingEvents events={upcomingEvents} />

        {/* Recent Activity */}
        <RecentActivity activities={recentActivities} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
