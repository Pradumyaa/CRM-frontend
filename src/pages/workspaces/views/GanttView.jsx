import { useState, useEffect } from "react";
import useSpacesStore from "@/store/useSpacesStore";
import { Plus } from "lucide-react";
import AddTaskModal from "../tasks/AddTaskModal";

const GanttView = ({ projectListId }) => {
  const { spaces, updateTask } = useSpacesStore();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [timeframe, setTimeframe] = useState("week"); // "day", "week", "month"
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateHeaders, setDateHeaders] = useState([]);

  // Find the project list and its parent space and folder
  let projectList = null;
  let spaceId = null;
  let folderId = null;

  for (const space of spaces) {
    for (const folder of space.folders) {
      const foundList = folder.projectLists.find(
        (list) => list.id === projectListId
      );
      if (foundList) {
        projectList = foundList;
        spaceId = space.id;
        folderId = folder.id;
        break;
      }
    }
    if (projectList) break;
  }

  if (!projectList) {
    return <div className="p-4">Project list not found</div>;
  }

  useEffect(() => {
    // Generate date headers based on the selected timeframe
    const headers = [];
    const today = new Date(currentDate);

    if (timeframe === "day") {
      // Show 24 hours of the current day
      const day = today.getDate();
      const month = today.getMonth();
      const year = today.getFullYear();

      for (let hour = 0; hour < 24; hour++) {
        headers.push({
          label: `${hour}:00`,
          date: new Date(year, month, day, hour),
          key: `hour-${hour}`,
        });
      }
    } else if (timeframe === "week") {
      // Show the current week (starting from Sunday or Monday)
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - dayOfWeek); // Start from Sunday

      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        headers.push({
          label: date.toLocaleDateString(undefined, {
            weekday: "short",
            day: "numeric",
          }),
          date: date,
          key: `day-${i}`,
        });
      }
    } else if (timeframe === "month") {
      // Show the current month
      const year = today.getFullYear();
      const month = today.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        headers.push({
          label: `${day}`,
          date: date,
          key: `month-day-${day}`,
        });
      }
    }

    setDateHeaders(headers);
  }, [timeframe, currentDate]);

  const getTaskPosition = (task) => {
    if (!task.dueDate) return null;

    const taskDate = new Date(task.dueDate);
    let positionPercentage = 0;

    if (timeframe === "day") {
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);

      // If task is on this day
      if (taskDate >= startOfDay && taskDate <= endOfDay) {
        const totalDayMs = 24 * 60 * 60 * 1000;
        const taskHourMs =
          taskDate.getHours() * 60 * 60 * 1000 +
          taskDate.getMinutes() * 60 * 1000;
        positionPercentage = (taskHourMs / totalDayMs) * 100;
      }
    } else if (timeframe === "week") {
      const dayOfWeek = currentDate.getDay();
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      // If task is in this week
      if (taskDate >= startOfWeek && taskDate <= endOfWeek) {
        const totalWeekMs = 7 * 24 * 60 * 60 * 1000;
        const msSinceStartOfWeek = taskDate - startOfWeek;
        positionPercentage = (msSinceStartOfWeek / totalWeekMs) * 100;
      }
    } else if (timeframe === "month") {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      // If task is in this month
      if (taskDate >= startOfMonth && taskDate <= endOfMonth) {
        const totalDaysInMonth = endOfMonth.getDate();
        const dayOfMonth = taskDate.getDate();
        positionPercentage = ((dayOfMonth - 1) / totalDaysInMonth) * 100;
      }
    }

    return positionPercentage;
  };

  const changeTimeframe = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (timeframe === "day") {
      newDate.setDate(newDate.getDate() - 1);
    } else if (timeframe === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else if (timeframe === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (timeframe === "day") {
      newDate.setDate(newDate.getDate() + 1);
    } else if (timeframe === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else if (timeframe === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getTimeframeTitle = () => {
    if (timeframe === "day") {
      return currentDate.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else if (timeframe === "week") {
      const dayOfWeek = currentDate.getDay();
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
    } else if (timeframe === "month") {
      return currentDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      });
    }
  };

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

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {projectList.name} - Gantt View
        </h2>
        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-1" /> Add Task
        </button>
      </div>

      {/* Gantt Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => changeTimeframe("day")}
            className={`px-3 py-1 rounded ${
              timeframe === "day" ? "bg-purple-500 text-white" : "bg-gray-200"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => changeTimeframe("week")}
            className={`px-3 py-1 rounded ${
              timeframe === "week" ? "bg-purple-500 text-white" : "bg-gray-200"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => changeTimeframe("month")}
            className={`px-3 py-1 rounded ${
              timeframe === "month" ? "bg-purple-500 text-white" : "bg-gray-200"
            }`}
          >
            Month
          </button>
        </div>

        <div className="text-gray-700 font-medium">{getTimeframeTitle()}</div>

        <div className="flex space-x-2">
          <button
            onClick={goToPrevious}
            className="px-3 py-1 rounded bg-gray-200"
          >
            Previous
          </button>
          <button onClick={goToToday} className="px-3 py-1 rounded bg-gray-200">
            Today
          </button>
          <button onClick={goToNext} className="px-3 py-1 rounded bg-gray-200">
            Next
          </button>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="border rounded-lg overflow-hidden">
        {/* Timeline Header */}
        <div className="flex bg-gray-100 border-b">
          <div className="w-1/4 p-2 font-medium border-r">Task</div>
          <div className="w-3/4 flex">
            {dateHeaders.map((header) => (
              <div
                key={header.key}
                className="flex-1 p-2 text-center text-sm border-r last:border-r-0"
              >
                {header.label}
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        {projectList.tasks && projectList.tasks.length > 0 ? (
          projectList.tasks.map((task) => {
            const taskPosition = getTaskPosition(task);

            return (
              <div key={task.id} className="flex border-b last:border-b-0">
                <div className="w-1/4 p-3 border-r flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {
                      updateTask(spaceId, folderId, projectListId, task.id, {
                        ...task,
                        completed: !task.completed,
                      });
                    }}
                    className="mr-2"
                  />
                  <span
                    className={
                      task.completed ? "line-through text-gray-500" : ""
                    }
                  >
                    {task.name}
                  </span>
                </div>
                <div className="w-3/4 relative" style={{ height: "48px" }}>
                  {task.dueDate && taskPosition !== null && (
                    <div
                      className={`absolute h-6 ${getPriorityColor(
                        task.priority
                      )} ${
                        task.completed ? "opacity-50" : ""
                      } rounded px-2 text-white text-xs flex items-center justify-center`}
                      style={{
                        left: `${taskPosition}%`,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "5%",
                        minWidth: "60px",
                      }}
                      title={`${task.name} - Due: ${new Date(
                        task.dueDate
                      ).toLocaleDateString()}`}
                    >
                      {task.name}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-gray-500">
            No tasks with due dates found. Add tasks with due dates to see them
            on the Gantt chart.
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

export default GanttView;
