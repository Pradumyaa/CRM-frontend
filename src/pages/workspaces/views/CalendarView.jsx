import { useState, useEffect } from "react";
import useSpacesStore from "@/store/useSpacesStore";
import { Plus, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import AddTaskModal from "../tasks/AddTaskModal";

const CalendarView = ({ projectListId }) => {
  const { spaces } = useSpacesStore();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

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
    return <div className="p-4 text-center text-gray-600">Project list not found</div>;
  }

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();

    const days = [];
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, prevMonthDays - i), isCurrentMonth: false });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    const daysAfter = 42 - days.length;
    for (let i = 1; i <= daysAfter; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    setCalendarDays(days);
  };

  const getTasksForDate = (date) => {
    if (!projectList.tasks) return [];
    return projectList.tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return date.toDateString() === taskDate.toDateString();
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-600";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          {projectList.name} - Calendar View
        </h2>
        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center shadow-lg"
        >
          <Plus size={18} className="mr-2" /> Add Task
        </button>
      </div>

      {/* Calendar Controls */}
      <div className="flex justify-between items-center mb-4 bg-gray-100 p-3 rounded-lg shadow-sm">
        <div className="text-lg font-semibold text-gray-700">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 rounded-full hover:bg-gray-200 transition">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 rounded-lg font-medium">
            Today
          </button>
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 rounded-full hover:bg-gray-200 transition">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-gray-300 shadow-md overflow-hidden">
        {/* Days of the Week */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 text-center text-gray-700 font-medium py-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="bg-gray-50 py-2">{day}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {calendarDays.map((day, index) => {
            const tasksForDay = getTasksForDate(day.date);
            const isToday = new Date().toDateString() === day.date.toDateString();

            return (
              <div key={index} className={`p-3 min-h-24 bg-white flex flex-col rounded-md shadow-sm transition
                ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400 opacity-50"}
                ${isToday ? "border-2 border-purple-500 bg-purple-50" : "hover:bg-gray-100"}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-semibold ${isToday ? "text-purple-700" : ""}`}>
                    {day.date.getDate()}
                  </span>
                  <button onClick={() => setSelectedDay(day.date) || setIsAddTaskModalOpen(true)}
                    className="text-gray-400 hover:text-gray-600">
                    <Plus size={14} />
                  </button>
                </div>

                {/* Tasks */}
                <div className="mt-2 space-y-1 max-h-20 overflow-y-auto">
                  {tasksForDay.map(task => (
                    <div key={task.id} className={`text-xs px-2 py-1 rounded-full text-white truncate flex items-center
                      ${getPriorityColor(task.priority)}`} title={task.name}>
                      <Circle size={10} className="mr-2" />
                      {task.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal spaceId={spaceId} folderId={folderId} projectListId={projectListId}
        isOpen={isAddTaskModalOpen} onClose={() => setIsAddTaskModalOpen(false)}
        initialDueDate={selectedDay} />
    </div>
  );
};

export default CalendarView;
