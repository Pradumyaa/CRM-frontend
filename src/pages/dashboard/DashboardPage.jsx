// pages/dashboard/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/Button";
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
  UserCheck,
  UserX,
  AlertTriangle,
  Coffee,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { employeeService } from "../../api/apiClient";
import useDashboardStore from "../../store/useDashboardStore";
import useSpacesStore from "../../store/useSpacesStore";

// Components
import DashboardGreeting from "./DashboardGreeting";
import RecentActivity from "./RecentActivity";
import MetricsOverview from "./MetricsOverview";
import UpcomingEvents from "./UpcomingEvents";
import TaskSummary from "./TaskSummary";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employee, setEmployee] = useState(null);

  // Dashboard store
  const {
    adminMetrics,
    employeeMetrics,
    fetchAdminDashboard,
    fetchEmployeeDashboard,
    updateRecentActivities,
    updateUpcomingEvents,
  } = useDashboardStore();

  // Workspace store for task data
  const { spaces } = useSpacesStore();

  // Calculate workspace metrics
  const workspaceMetrics = React.useMemo(() => {
    const totalSpaces = spaces.length;
    let totalFolders = 0;
    let totalProjects = 0;
    let totalTasks = 0;
    let completedTasks = 0;

    spaces.forEach((space) => {
      totalFolders += space.folders?.length || 0;

      space.folders?.forEach((folder) => {
        totalProjects += folder.projectLists?.length || 0;

        folder.projectLists?.forEach((list) => {
          totalTasks += list.tasks?.length || 0;

          list.tasks?.forEach((task) => {
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
      space.folders?.forEach((folder) => {
        folder.projectLists?.forEach((list) => {
          list.tasks?.forEach((task) => {
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

    // Sort by most recent (we don't have actual timestamps yet, so this is simplified)
    // and limit to 4
    return activities.slice(0, 4);
  }, [spaces]);

  // Create upcoming events from tasks with due dates
  const upcomingEvents = React.useMemo(() => {
    const events = [];
    let id = 1;

    // Find tasks with due dates
    spaces.forEach((space) => {
      space.folders?.forEach((folder) => {
        folder.projectLists?.forEach((list) => {
          list.tasks?.forEach((task) => {
            if (task.dueDate) {
              events.push({
                id: id++,
                title: task.name,
                contact: `${list.name} (${space.name})`,
                date: new Date(task.dueDate).toLocaleDateString(),
                type: task.priority === "high" ? "deadline" : "meeting",
              });
            }
          });
        });
      });
    });

    // Sort by due date and limit to 3
    return events
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  }, [spaces]);

  // Calculate task data for TaskSummary
  const taskData = React.useMemo(() => {
    let completed = 0;
    let pending = 0;
    let overdue = 0;

    const today = new Date();

    spaces.forEach((space) => {
      space.folders?.forEach((folder) => {
        folder.projectLists?.forEach((list) => {
          list.tasks?.forEach((task) => {
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

  // Get tasks for TaskSummary
  const tasks = React.useMemo(() => {
    const allTasks = [];

    spaces.forEach((space) => {
      space.folders?.forEach((folder) => {
        folder.projectLists?.forEach((list) => {
          list.tasks?.forEach((task) => {
            if (!task.completed) {
              allTasks.push({
                id: task.id,
                title: task.name,
                priority: task.priority || "medium",
                dueDate: task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No date",
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!user?.employeeId) {
          setError("User information not available");
          setLoading(false);
          return;
        }

        // Fetch employee data
        try {
          const response = await employeeService.getEmployee(user.employeeId);
          setEmployee(response.employee);
        } catch (err) {
          console.error("Error fetching employee data:", err);
          // Fall back to user data from auth context
          setEmployee(user);
        }

        // Fetch dashboard metrics based on role
        if (isAdmin) {
          await fetchAdminDashboard();
        } else {
          await fetchEmployeeDashboard(user.employeeId);
        }

        // Update store with activities and events
        updateRecentActivities(recentActivities);
        updateUpcomingEvents(upcomingEvents);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [
    user,
    isAdmin,
    fetchAdminDashboard,
    fetchEmployeeDashboard,
    recentActivities,
    upcomingEvents,
    updateRecentActivities,
    updateUpcomingEvents,
  ]);

  // Admin-specific metrics
  const adminDashboardMetrics = [
    {
      title: "Total Employees",
      value: adminMetrics.totalEmployees,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      change: "+5.2%",
      trend: "up",
      background: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      title: "Active Employees",
      value: adminMetrics.activeEmployees,
      icon: <UserCheck className="h-6 w-6 text-green-500" />,
      change: "+3.1%",
      trend: "up",
      background: "bg-green-50",
      border: "border-green-100",
    },
    {
      title: "Inactive Employees",
      value: adminMetrics.totalEmployees - adminMetrics.activeEmployees,
      icon: <UserX className="h-6 w-6 text-red-500" />,
      change: "-2.4%",
      trend: "down",
      background: "bg-red-50",
      border: "border-red-100",
    },
    {
      title: "Active Rate",
      value: `${adminMetrics.activeRate}%`,
      icon: <TrendingUp className="h-6 w-6 text-purple-500" />,
      change: "+1.8%",
      trend: "up",
      background: "bg-purple-50",
      border: "border-purple-100",
    },
  ];

  // Employee-specific metrics
  const employeeDashboardMetrics = [
    {
      title: "Days Worked",
      value: employeeMetrics.totalDaysWorked,
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      change: "-",
      trend: "neutral",
      background: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      title: "Days Off",
      value: employeeMetrics.dayOff,
      icon: <Coffee className="h-6 w-6 text-green-500" />,
      change: "-",
      trend: "neutral",
      background: "bg-green-50",
      border: "border-green-100",
    },
    {
      title: "Late Clock-ins",
      value: employeeMetrics.lateClockIn,
      icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
      change: "-",
      trend: "neutral",
      background: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      title: "Overtime Hours",
      value: employeeMetrics.overTime,
      icon: <Award className="h-6 w-6 text-purple-500" />,
      change: "-",
      trend: "neutral",
      background: "bg-purple-50",
      border: "border-purple-100",
    },
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

      {/* Metrics Overview */}
      <div className="mb-6">
        <MetricsOverview
          metrics={isAdmin ? adminDashboardMetrics : employeeDashboardMetrics}
          loading={loading}
        />
      </div>

      {/* Role-based dashboard content */}
      {isAdmin ? (
        <AdminDashboard
          loading={loading}
          error={error}
          adminMetrics={adminMetrics}
          workspaceMetrics={workspaceMetrics}
          recentActivities={recentActivities}
          upcomingEvents={upcomingEvents}
          taskData={taskData}
          tasks={tasks}
          employee={employee}
        />
      ) : (
        <EmployeeDashboard
          loading={loading}
          error={error}
          employeeMetrics={employeeMetrics}
          workspaceMetrics={workspaceMetrics}
          recentActivities={recentActivities}
          upcomingEvents={upcomingEvents}
          taskData={taskData}
          tasks={tasks}
          employee={employee}
        />
      )}
    </div>
  );
};

export default DashboardPage;
