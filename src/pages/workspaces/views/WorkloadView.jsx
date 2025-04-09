import { useState, useEffect } from "react";
import {
  Users,
  Filter,
  Plus,
  AlertTriangle,
  BarChart2,
  Calendar,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Circle,
  SortAsc,
} from "lucide-react";
import useSpacesStore from "@/store/useSpacesStore";
import AddTaskModal from "../tasks/AddTaskModal";

const WorkloadView = ({ projectListId }) => {
  const { spaces, team } = useSpacesStore();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [timeframeFilter, setTimeframeFilter] = useState("all"); // all, thisWeek, nextWeek, thisMonth
  const [statusFilter, setStatusFilter] = useState("all"); // all, todo, inProgress, completed
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberWorkloads, setMemberWorkloads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name"); // name, tasksCount, completion
  const [sortDirection, setSortDirection] = useState("asc"); // asc, desc
  const [expandedMembers, setExpandedMembers] = useState({});

  // Find project list and related data
  let projectList = null;
  let spaceId = null;
  let folderId = null;
  let spaceName = "";
  let folderName = "";

  for (const space of spaces) {
    for (const folder of space.folders) {
      const foundList = folder.projectLists.find(
        (list) => list.id === projectListId
      );
      if (foundList) {
        projectList = foundList;
        spaceId = space.id;
        folderId = folder.id;
        spaceName = space.name;
        folderName = folder.name;
        break;
      }
    }
    if (projectList) break;
  }

  useEffect(() => {
    if (projectList) {
      calculateMemberWorkloads();
      setIsLoading(false);
    }
  }, [
    projectList,
    timeframeFilter,
    statusFilter,
    spaces,
    team,
    sortBy,
    sortDirection,
  ]);

  // Calculate workloads for team members
  const calculateMemberWorkloads = () => {
    if (!projectList || !projectList.tasks) {
      setMemberWorkloads([]);
      return;
    }

    // Filter tasks based on timeframe
    let filteredTasks = [...projectList.tasks];

    if (timeframeFilter !== "all") {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // End of current week (Saturday)

      const startOfNextWeek = new Date(endOfWeek);
      startOfNextWeek.setDate(endOfWeek.getDate() + 1); // Start of next week

      const endOfNextWeek = new Date(startOfNextWeek);
      endOfNextWeek.setDate(startOfNextWeek.getDate() + 6); // End of next week

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      switch (timeframeFilter) {
        case "thisWeek":
          filteredTasks = filteredTasks.filter(
            (task) =>
              task.dueDate &&
              new Date(task.dueDate) >= startOfWeek &&
              new Date(task.dueDate) <= endOfWeek
          );
          break;
        case "nextWeek":
          filteredTasks = filteredTasks.filter(
            (task) =>
              task.dueDate &&
              new Date(task.dueDate) >= startOfNextWeek &&
              new Date(task.dueDate) <= endOfNextWeek
          );
          break;
        case "thisMonth":
          filteredTasks = filteredTasks.filter(
            (task) =>
              task.dueDate &&
              new Date(task.dueDate) >= startOfMonth &&
              new Date(task.dueDate) <= endOfMonth
          );
          break;
        default:
          break;
      }
    }

    // Filter tasks based on status
    if (statusFilter !== "all") {
      filteredTasks = filteredTasks.filter((task) => {
        switch (statusFilter) {
          case "todo":
            return !task.completed && task.status !== "in_progress";
          case "inProgress":
            return !task.completed && task.status === "in_progress";
          case "completed":
            return task.completed;
          default:
            return true;
        }
      });
    }

    // Group tasks by assignee
    const tasksByAssignee = {};

    filteredTasks.forEach((task) => {
      const assignee = task.assignee || "Unassigned";
      if (!tasksByAssignee[assignee]) {
        tasksByAssignee[assignee] = [];
      }
      tasksByAssignee[assignee].push(task);
    });

    // Calculate workload for each team member
    const workloads = team.map((member) => {
      const memberTasks = tasksByAssignee[member.name] || [];
      const totalTasks = memberTasks.length;
      const completedTasks = memberTasks.filter(
        (task) => task.completed
      ).length;
      const completionRate = totalTasks
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

      // Count tasks by priority
      const highPriorityTasks = memberTasks.filter(
        (task) => task.priority === "high"
      ).length;
      const mediumPriorityTasks = memberTasks.filter(
        (task) => task.priority === "medium"
      ).length;
      const lowPriorityTasks = memberTasks.filter(
        (task) => task.priority === "low"
      ).length;

      // Count tasks by status
      const todoTasks = memberTasks.filter(
        (task) => !task.completed && task.status !== "in_progress"
      ).length;
      const inProgressTasks = memberTasks.filter(
        (task) => !task.completed && task.status === "in_progress"
      ).length;
      const completedTasksCount = memberTasks.filter(
        (task) => task.completed
      ).length;

      return {
        ...member,
        tasks: memberTasks,
        totalTasks,
        completedTasks,
        completionRate,
        highPriorityTasks,
        mediumPriorityTasks,
        lowPriorityTasks,
        todoTasks,
        inProgressTasks,
        completedTasksCount,
      };
    });

    // Add an entry for unassigned tasks
    const unassignedTasks = tasksByAssignee["Unassigned"] || [];
    if (unassignedTasks.length > 0) {
      const totalTasks = unassignedTasks.length;
      const completedTasks = unassignedTasks.filter(
        (task) => task.completed
      ).length;
      const completionRate = totalTasks
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

      workloads.push({
        id: "unassigned",
        name: "Unassigned",
        avatar: null,
        tasks: unassignedTasks,
        totalTasks,
        completedTasks,
        completionRate,
        highPriorityTasks: unassignedTasks.filter(
          (task) => task.priority === "high"
        ).length,
        mediumPriorityTasks: unassignedTasks.filter(
          (task) => task.priority === "medium"
        ).length,
        lowPriorityTasks: unassignedTasks.filter(
          (task) => task.priority === "low"
        ).length,
        todoTasks: unassignedTasks.filter(
          (task) => !task.completed && task.status !== "in_progress"
        ).length,
        inProgressTasks: unassignedTasks.filter(
          (task) => !task.completed && task.status === "in_progress"
        ).length,
        completedTasksCount: unassignedTasks.filter((task) => task.completed)
          .length,
      });
    }

    // Sort workloads based on selected criteria
    workloads.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "tasksCount":
          comparison = a.totalTasks - b.totalTasks;
          break;
        case "completion":
          comparison = a.completionRate - b.completionRate;
          break;
        default:
          comparison = 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    setMemberWorkloads(workloads);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const toggleMemberExpand = (memberId) => {
    setExpandedMembers((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  const getStatusBadge = (task) => {
    if (task.completed) {
      return (
        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
          <CheckCircle size={10} className="mr-1" />
          Completed
        </span>
      );
    } else if (task.status === "in_progress") {
      return (
        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center">
          <Clock size={10} className="mr-1" />
          In Progress
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full flex items-center">
          <Circle size={10} className="mr-1" />
          To Do
        </span>
      );
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return (
          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
            High
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            Medium
          </span>
        );
      case "low":
        return (
          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!projectList) {
    return (
      <div className="p-6 text-center text-gray-500">
        Project list not found
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full mx-auto">
      {/* Header with project info */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{spaceName}</span>
          <span className="mx-2">›</span>
          <span>{folderName}</span>
          <span className="mx-2">›</span>
          <span className="font-medium">{projectList.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Team Workload</h1>
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center shadow-sm"
          >
            <Plus size={18} className="mr-1" /> Add Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Time Frame
              </label>
              <select
                value={timeframeFilter}
                onChange={(e) => setTimeframeFilter(e.target.value)}
                className="border border-gray-300 rounded-md text-sm p-1.5"
              >
                <option value="all">All Time</option>
                <option value="thisWeek">This Week</option>
                <option value="nextWeek">Next Week</option>
                <option value="thisMonth">This Month</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md text-sm p-1.5"
              >
                <option value="all">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Sort By
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleSort("name")}
                  className={`px-2 py-1 text-xs rounded-md flex items-center ${
                    sortBy === "name"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Name
                  {sortBy === "name" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp size={14} className="ml-1" />
                    ) : (
                      <ChevronDown size={14} className="ml-1" />
                    ))}
                </button>

                <button
                  onClick={() => toggleSort("tasksCount")}
                  className={`px-2 py-1 text-xs rounded-md flex items-center ${
                    sortBy === "tasksCount"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Tasks
                  {sortBy === "tasksCount" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp size={14} className="ml-1" />
                    ) : (
                      <ChevronDown size={14} className="ml-1" />
                    ))}
                </button>

                <button
                  onClick={() => toggleSort("completion")}
                  className={`px-2 py-1 text-xs rounded-md flex items-center ${
                    sortBy === "completion"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Completion
                  {sortBy === "completion" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp size={14} className="ml-1" />
                    ) : (
                      <ChevronDown size={14} className="ml-1" />
                    ))}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workload Content */}
      {memberWorkloads.length > 0 ? (
        <div className="space-y-6">
          {memberWorkloads.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleMemberExpand(member.id)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{member.name}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span className="flex items-center bg-gray-100 px-2 py-0.5 rounded-full mr-2">
                        <CheckCircle
                          size={10}
                          className="mr-1 text-green-500"
                        />
                        {member.completedTasksCount} completed
                      </span>
                      <span className="flex items-center bg-gray-100 px-2 py-0.5 rounded-full mr-2">
                        <Clock size={10} className="mr-1 text-blue-500" />
                        {member.inProgressTasks} in progress
                      </span>
                      <span className="flex items-center bg-gray-100 px-2 py-0.5 rounded-full">
                        <Circle size={10} className="mr-1 text-gray-500" />
                        {member.todoTasks} to do
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  {/* Progress Bar */}
                  <div className="hidden sm:block w-36 bg-gray-200 rounded-full h-2.5 mr-4">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${member.completionRate}%` }}
                    ></div>
                  </div>

                  <div className="text-gray-700 mr-4">
                    <span className="font-medium">
                      {member.completionRate}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({member.completedTasks}/{member.totalTasks})
                    </span>
                  </div>

                  {expandedMembers[member.id] ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Task List */}
              {expandedMembers[member.id] && (
                <div className="border-t border-gray-200">
                  {member.tasks.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {member.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-4 flex flex-wrap md:flex-nowrap justify-between items-start hover:bg-gray-50"
                        >
                          <div className="w-full md:w-auto md:flex-1">
                            <h4
                              className={`font-medium ${
                                task.completed
                                  ? "text-gray-500 line-through"
                                  : "text-gray-800"
                              }`}
                            >
                              {task.name}
                            </h4>
                            {task.description && (
                              <p className="text-sm text-gray-500 mt-1 mb-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {getPriorityBadge(task.priority)}
                              {getStatusBadge(task)}
                              {task.dueDate && (
                                <span className="flex items-center text-xs text-gray-500">
                                  <Calendar size={10} className="mr-1" />
                                  {formatDate(task.dueDate)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      No tasks assigned
                      {member.id === "unassigned" ? "" : " to this team member"}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 text-center">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No workload data available
          </h3>
          <p className="text-gray-500 mb-6">
            There are no tasks matching your current filters
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setTimeframeFilter("all");
                setStatusFilter("all");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700"
            >
              Add a Task
            </button>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        spaceId={spaceId}
        folderId={folderId}
        projectListId={projectListId}
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
      />
    </div>
  );
};

export default WorkloadView;
