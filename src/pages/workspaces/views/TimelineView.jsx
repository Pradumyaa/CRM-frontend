import { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  SortAsc,
  Clock,
  Calendar as CalendarIcon,
} from "lucide-react";
import useSpacesStore from "@/store/useSpacesStore";
import AddTaskModal from "../tasks/AddTaskModal";
import { colors } from "@/utils/theme";

const TimelineView = ({ projectListId }) => {
  const { spaces } = useSpacesStore();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeframeStart, setTimeframeStart] = useState(new Date());
  const [timeframeEnd, setTimeframeEnd] = useState(new Date());
  const [timeframe, setTimeframe] = useState("month"); // week, month, quarter
  const [taskGroups, setTaskGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Initialize the timeline data on component load
  useEffect(() => {
    if (projectList) {
      updateTimeframe(timeframe);
      setIsLoading(false);
    }
  }, [projectList, timeframe]);

  // Update timeframe based on selection
  const updateTimeframe = (newTimeframe) => {
    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);

    switch (newTimeframe) {
      case "week":
        // Set start to beginning of current week (Sunday)
        start.setDate(today.getDate() - today.getDay());
        // Set end to end of week (Saturday)
        end.setDate(start.getDate() + 6);
        break;
      case "month":
        // Set start to beginning of current month
        start.setDate(1);
        // Set end to end of current month
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "quarter":
        // Set start to beginning of current quarter
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        // Set end to end of quarter
        end = new Date(today.getFullYear(), (quarter + 1) * 3, 0);
        break;
      default:
        break;
    }

    setTimeframe(newTimeframe);
    setTimeframeStart(start);
    setTimeframeEnd(end);

    // Group and organize tasks
    if (projectList && projectList.tasks) {
      organizeTasksByTimeframe(projectList.tasks, start, end, newTimeframe);
    }
  };

  // Navigate to previous timeframe
  const goToPreviousTimeframe = () => {
    const start = new Date(timeframeStart);

    switch (timeframe) {
      case "week":
        start.setDate(start.getDate() - 7);
        break;
      case "month":
        start.setMonth(start.getMonth() - 1);
        break;
      case "quarter":
        start.setMonth(start.getMonth() - 3);
        break;
      default:
        break;
    }

    setCurrentDate(start);
    updateTimeframe(timeframe);
  };

  // Navigate to next timeframe
  const goToNextTimeframe = () => {
    const start = new Date(timeframeStart);

    switch (timeframe) {
      case "week":
        start.setDate(start.getDate() + 7);
        break;
      case "month":
        start.setMonth(start.getMonth() + 1);
        break;
      case "quarter":
        start.setMonth(start.getMonth() + 3);
        break;
      default:
        break;
    }

    setCurrentDate(start);
    updateTimeframe(timeframe);
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
    updateTimeframe(timeframe);
  };

  // Organize tasks for timeline display
  const organizeTasksByTimeframe = (tasks, start, end, timeframeType) => {
    if (!tasks || tasks.length === 0) {
      setTaskGroups([]);
      return;
    }

    // Filter tasks that have due dates and are within the timeframe
    const relevantTasks = tasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate) >= start &&
        new Date(task.dueDate) <= end
    );

    let groups = [];

    if (timeframeType === "week") {
      // Group by day of week
      const days = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        days.push({
          date: day,
          label: day.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          tasks: [],
        });
      }

      // Add tasks to appropriate days
      relevantTasks.forEach((task) => {
        const taskDate = new Date(task.dueDate);
        const dayIndex = Math.floor((taskDate - start) / (24 * 60 * 60 * 1000));
        if (dayIndex >= 0 && dayIndex < 7) {
          days[dayIndex].tasks.push(task);
        }
      });

      groups = days;
    } else if (timeframeType === "month") {
      // Group by week
      const weeks = [];
      const numDays = (end - start) / (24 * 60 * 60 * 1000) + 1;
      const numWeeks = Math.ceil(numDays / 7);

      for (let i = 0; i < numWeeks; i++) {
        const weekStart = new Date(start);
        weekStart.setDate(start.getDate() + i * 7);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        if (weekEnd > end) weekEnd.setTime(end.getTime());

        weeks.push({
          startDate: weekStart,
          endDate: weekEnd,
          label: `${weekStart.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })} - ${weekEnd.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}`,
          tasks: [],
        });
      }

      // Add tasks to appropriate weeks
      relevantTasks.forEach((task) => {
        const taskDate = new Date(task.dueDate);
        const daysSinceStart = Math.floor(
          (taskDate - start) / (24 * 60 * 60 * 1000)
        );
        const weekIndex = Math.floor(daysSinceStart / 7);

        if (weekIndex >= 0 && weekIndex < weeks.length) {
          weeks[weekIndex].tasks.push(task);
        }
      });

      groups = weeks;
    } else if (timeframeType === "quarter") {
      // Group by month
      const months = [];
      for (let i = 0; i < 3; i++) {
        const monthStart = new Date(
          start.getFullYear(),
          start.getMonth() + i,
          1
        );
        const monthEnd = new Date(
          start.getFullYear(),
          start.getMonth() + i + 1,
          0
        );

        months.push({
          startDate: monthStart,
          endDate: monthEnd,
          label: monthStart.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          tasks: [],
        });
      }

      // Add tasks to appropriate months
      relevantTasks.forEach((task) => {
        const taskDate = new Date(task.dueDate);
        const monthIndex = taskDate.getMonth() - start.getMonth();

        if (monthIndex >= 0 && monthIndex < months.length) {
          months[monthIndex].tasks.push(task);
        }
      });

      groups = months;
    }

    setTaskGroups(groups);
  };

  const getTimeframeTitle = () => {
    switch (timeframe) {
      case "week":
        return `${timeframeStart.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${timeframeEnd.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      case "month":
        return currentDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      case "quarter":
        const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
        return `Q${quarter} ${currentDate.getFullYear()}`;
      default:
        return "";
    }
  };

  // Get color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
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
          <h1 className="text-2xl font-bold text-gray-800">Timeline</h1>
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center shadow-sm"
          >
            <Plus size={18} className="mr-1" /> Add Task
          </button>
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateTimeframe("week")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                timeframe === "week"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => updateTimeframe("month")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                timeframe === "month"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => updateTimeframe("quarter")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                timeframe === "quarter"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Quarter
            </button>
          </div>

          <div className="text-gray-700 font-medium">{getTimeframeTitle()}</div>

          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousTimeframe}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700"
            >
              Today
            </button>
            <button
              onClick={goToNextTimeframe}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {taskGroups.length > 0 ? (
          <div>
            {taskGroups.map((group, index) => (
              <div
                key={index}
                className="border-b border-gray-200 last:border-b-0"
              >
                <div className="bg-gray-50 px-6 py-3 font-medium text-gray-700 flex items-center">
                  <CalendarIcon size={16} className="text-gray-400 mr-2" />
                  {group.label}
                </div>

                {group.tasks.length > 0 ? (
                  <div className="py-2 px-6 divide-y divide-gray-100">
                    {group.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="py-3 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${getPriorityColor(
                              task.priority
                            )} mr-3`}
                          ></div>
                          <div>
                            <h3
                              className={`text-sm font-medium ${
                                task.completed
                                  ? "line-through text-gray-500"
                                  : "text-gray-800"
                              }`}
                            >
                              {task.name}
                            </h3>
                            {task.assignee && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                Assigned to {task.assignee}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center">
                          {task.dueDate && (
                            <div className="flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              <Clock size={12} className="mr-1" />
                              {new Date(task.dueDate).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" }
                              )}
                            </div>
                          )}
                          <div
                            className={`ml-3 px-2 py-0.5 text-xs rounded ${
                              task.completed
                                ? "bg-green-100 text-green-800"
                                : task.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {task.completed
                              ? "Completed"
                              : task.status === "in_progress"
                              ? "In Progress"
                              : "To Do"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-gray-500">
                    <p>No tasks scheduled for this period</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Clock size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No scheduled tasks found
            </h3>
            <p className="text-gray-500 mb-6">
              Tasks with due dates will appear on this timeline
            </p>
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700"
            >
              <Plus size={16} className="inline mr-1" />
              Add a Task
            </button>
          </div>
        )}
      </div>

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

export default TimelineView;
