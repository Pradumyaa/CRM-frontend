import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/Button";
import {
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  Bell,
  FileText,
  FolderOpen,
  ListChecks,
  Clock,
  Briefcase,
} from "lucide-react";
import DashboardGreeting from "./DashboardGreeting";
import RecentActivity from "./RecentActivity";
import MetricsOverview from "./MetricsOverview";
import UpcomingEvents from "./UpcomingEvents";
import TaskSummary from "./TaskSummary";
import useSpacesStore from "@/store/useSpacesStore";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState({
    totalClients: 0,
    activeDeals: 0,
    completedTasks: 0,
    conversionRate: 0,
  });

  // Get workspace data from zustand store
  const { spaces } = useSpacesStore();

  // Calculate workspace metrics
  const workspaceMetrics = React.useMemo(() => {
    const totalSpaces = spaces.length;
    let totalFolders = 0;
    let totalProjects = 0;
    let totalTasks = 0;
    let completedTasks = 0;

    spaces.forEach((space) => {
      totalFolders += space.folders.length;

      space.folders.forEach((folder) => {
        totalProjects += folder.projectLists.length;

        folder.projectLists.forEach((list) => {
          totalTasks += list.tasks.length;

          list.tasks.forEach((task) => {
            if (task.completed) {
              completedTasks++;
            }
          });
        });
      });
    });

    const taskCompletionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalSpaces,
      totalFolders,
      totalProjects,
      totalTasks,
      completedTasks,
      taskCompletionRate,
    };
  }, [spaces]);

  // Get recent activities from workspace data
  const recentActivities = React.useMemo(() => {
    const activities = [];
    let id = 1;

    // Get most recent tasks (limited to 4)
    spaces.forEach((space) => {
      space.folders.forEach((folder) => {
        folder.projectLists.forEach((list) => {
          list.tasks.forEach((task) => {
            activities.push({
              id: id++,
              type: "Task",
              name: task.name,
              action: task.completed ? "Task completed" : "Task created",
              time: "Recently",
              space: space.name,
              folder: folder.name,
              list: list.name,
            });
          });
        });
      });
    });

    // Sort by most recent and limit to 4
    return activities.slice(0, 4);
  }, [spaces]);

  // Create upcoming events from tasks with due dates
  const upcomingEvents = React.useMemo(() => {
    const events = [];
    let id = 1;

    // Find tasks with due dates
    spaces.forEach((space) => {
      space.folders.forEach((folder) => {
        folder.projectLists.forEach((list) => {
          list.tasks.forEach((task) => {
            if (task.dueDate) {
              events.push({
                id: id++,
                title: task.name,
                contact: `${list.name} (${space.name})`,
                date: task.dueDate,
                type: task.priority === "high" ? "deadline" : "meeting",
              });
            }
          });
        });
      });
    });

    // Sort by due date and limit to 3
    return events.slice(0, 3);
  }, [spaces]);

  // Calculate task data for TaskSummary
  const taskData = React.useMemo(() => {
    let completed = 0;
    let pending = 0;
    let overdue = 0;

    const today = new Date();

    spaces.forEach((space) => {
      space.folders.forEach((folder) => {
        folder.projectLists.forEach((list) => {
          list.tasks.forEach((task) => {
            if (task.completed) {
              completed++;
            } else if (task.dueDate) {
              const dueDate = new Date(task.dueDate);
              if (dueDate < today) {
                overdue++;
              } else {
                pending++;
              }
            } else {
              pending++;
            }
          });
        });
      });
    });

    return { completed, pending, overdue };
  }, [spaces]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employeeId = localStorage.getItem("employeeId");
        if (!employeeId) {
          // If no employee ID, just use demo data
          setEmployee({
            name: "Demo User",
            position: "Project Manager",
            images: [],
          });
          setLoading(false);
          return;
        }

        try {
          const response = await fetch(
            `https://crm-backend-6gcl.onrender.com/api/employees/${employeeId}`
          );
          if (!response.ok) throw new Error("Failed to fetch employee data");

          const data = await response.json();
          setEmployee({
            ...data.employee,
            images: data.employee.images || [],
          });
        } catch (fetchError) {
          console.log("Using demo data instead:", fetchError);
          setEmployee({
            name: "Demo User",
            position: "Project Manager",
            images: [],
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();

    // Set metrics based on workspace data
    setMetrics({
      totalClients: workspaceMetrics.totalProjects,
      activeDeals:
        workspaceMetrics.totalTasks - workspaceMetrics.completedTasks,
      completedTasks: workspaceMetrics.completedTasks,
      conversionRate: workspaceMetrics.taskCompletionRate,
    });
  }, [workspaceMetrics]);

  // Get tasks for TaskSummary
  const tasks = React.useMemo(() => {
    const allTasks = [];

    spaces.forEach((space) => {
      space.folders.forEach((folder) => {
        folder.projectLists.forEach((list) => {
          list.tasks.forEach((task) => {
            if (!task.completed) {
              allTasks.push({
                id: task.id,
                title: task.name,
                priority: task.priority || "medium",
                dueDate: task.dueDate || "No date",
                spaceId: space.id,
                folderId: folder.id,
                listId: list.id,
              });
            }
          });
        });
      });
    });

    // Sort by priority and limit to 4
    return allTasks
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .slice(0, 4);
  }, [spaces]);

  // Performance data for the chart
  const performanceData = [
    { name: "Jan", deals: 4, leads: 12 },
    { name: "Feb", deals: 6, leads: 18 },
    { name: "Mar", deals: 8, leads: 22 },
    { name: "Apr", deals: 12, leads: 28 },
    { name: "May", deals: 9, leads: 25 },
    { name: "Jun", deals: 15, leads: 32 },
  ];

  return (
    <div className="p-6 bg-gray-50">
      {/* Top Section: Greeting and Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-3">
          <DashboardGreeting
            loading={loading}
            employee={employee}
            error={error}
          />
        </div>

        <div className="md:col-span-1">
          <Card className="h-full flex flex-col justify-center items-center p-6 shadow-md rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border-0">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700">
                Today's Goal
              </h3>
              <div className="mt-2 text-3xl font-bold text-indigo-600">
                {taskData.pending > 0 ? taskData.pending : 0}
              </div>
              <p className="text-sm text-gray-500">Pending tasks</p>
              <Link to="/workspaces">
                <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md">
                  View Workspaces
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Metrics Overview */}
          <MetricsOverview metrics={metrics} loading={loading} />

          {/* Workspace Summary */}
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
                  <h3 className="text-sm font-medium text-gray-600">
                    Projects
                  </h3>
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

          {/* Task Summary */}
          <TaskSummary taskData={taskData} tasks={tasks} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Employee Profile Card */}
          {!loading && !error && employee && (
            <Card className="p-6 rounded-xl shadow-md bg-white">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={employee?.images[0] || "/default-profile.jpg"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-800">
                  {employee?.name || "Unknown"}
                </h2>
                <p className="text-sm text-gray-500">
                  {employee?.position || "Sales Representative"}
                </p>

                <div className="mt-5 w-full border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {workspaceMetrics.totalProjects}
                      </p>
                      <p className="text-xs text-gray-500">Active Projects</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {workspaceMetrics.taskCompletionRate}%
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

          {/* Upcoming Events */}
          <UpcomingEvents events={upcomingEvents} />

          {/* Recent Activity */}
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
