import { useState, useRef, useEffect } from "react";
import useSpacesStore from "@/store/useSpacesStore";
import {
  CheckCircle,
  Circle,
  MoreHorizontal,
  Pencil,
  Trash,
  Clock,
  Calendar,
  User,
  MessageSquare,
  Flag,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Tag,
  Copy,
  Clipboard,
} from "lucide-react";

const TaskItem = ({ task, spaceId, folderId, projectListId }) => {
  const { updateTask, deleteTask, team } = useSpacesStore();
  const [showActions, setShowActions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [showDetails, setShowDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    // Handle click outside to close dropdown menu
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const toggleComplete = () => {
    updateTask(spaceId, folderId, projectListId, task.id, {
      ...task,
      completed: !task.completed,
      status: !task.completed ? "completed" : "to_do",
    });
  };

  const handleDelete = () => {
    setIsDeleting(true);

    // Simulate async operation
    setTimeout(() => {
      deleteTask(spaceId, folderId, projectListId, task.id);
      setIsDeleting(false);
    }, 300);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedName(task.name);
    setShowMenu(false);
  };

  const saveEdit = () => {
    if (editedName.trim() !== "") {
      updateTask(spaceId, folderId, projectListId, task.id, {
        ...task,
        name: editedName,
      });
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedName(task.name);
    }
  };

  const updateStatus = (newStatus) => {
    updateTask(spaceId, folderId, projectListId, task.id, {
      ...task,
      status: newStatus,
      completed: newStatus === "completed",
    });
    setShowMenu(false);
  };

  const updatePriority = (newPriority) => {
    updateTask(spaceId, folderId, projectListId, task.id, {
      ...task,
      priority: newPriority,
    });
    setShowMenu(false);
  };

  const duplicateTask = () => {
    const newTask = {
      ...task,
      name: `${task.name} (Copy)`,
      id: undefined, // Let the store generate a new ID
      createdAt: new Date().toISOString(),
    };

    useSpacesStore
      .getState()
      .addTask(spaceId, folderId, projectListId, newTask);
    setShowMenu(false);
  };

  const getPriorityIcon = () => {
    switch (task.priority) {
      case "high":
        return <Flag className="text-red-500" size={14} />;
      case "medium":
        return <Flag className="text-yellow-500" size={14} />;
      case "low":
        return <Flag className="text-green-500" size={14} />;
      default:
        return <Flag className="text-gray-400" size={14} />;
    }
  };

  const getStatusIcon = () => {
    if (task.completed) {
      return <CheckCircle className="text-emerald-500" size={16} />;
    }

    switch (task.status) {
      case "in_progress":
        return <Clock className="text-blue-500" size={16} />;
      case "review":
        return <Clipboard className="text-purple-500" size={16} />;
      default:
        return <Circle className="text-gray-400" size={16} />;
    }
  };

  const getStatusLabel = () => {
    if (task.completed) {
      return "Completed";
    }

    switch (task.status) {
      case "in_progress":
        return "In Progress";
      case "review":
        return "In Review";
      default:
        return "To Do";
    }
  };

  const getStatusColor = () => {
    if (task.completed) {
      return "bg-emerald-100 text-emerald-800";
    }

    switch (task.status) {
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if date is today, yesterday, or tomorrow
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }

    // Otherwise return formatted date
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: today.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
    });
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(23, 59, 59, 999); // End of the day

    return dueDate < new Date();
  };

  return (
    <div
      className={`p-4 border border-gray-200 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow mb-3 ${
        isDeleting ? "opacity-50" : ""
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        if (!showMenu) setShowMenu(false);
      }}
    >
      <div className="flex items-start">
        {/* Task checkbox */}
        <button
          onClick={toggleComplete}
          className="mt-0.5 flex-shrink-0 text-gray-500 hover:text-indigo-600 transition-colors focus:outline-none"
          disabled={isDeleting}
        >
          {task.completed ? (
            <CheckCircle className="text-emerald-500" size={18} />
          ) : (
            <Circle size={18} />
          )}
        </button>

        {/* Task content */}
        <div className="ml-3 flex-grow">
          {/* Task Name */}
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={handleKeyPress}
              className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isDeleting}
            />
          ) : (
            <div
              className="flex items-center group cursor-pointer"
              onClick={() => setShowDetails(!showDetails)}
            >
              <h3
                className={`font-medium ${
                  task.completed
                    ? "line-through text-gray-500"
                    : "text-gray-800"
                }`}
              >
                {task.name}
              </h3>
              <button
                className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(!showDetails);
                }}
              >
                {showDetails ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
            </div>
          )}

          {/* Task metadata row */}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            {/* Due date */}
            {task.dueDate && (
              <span
                className={`flex items-center ${
                  isOverdue() ? "text-red-600" : ""
                }`}
              >
                <Calendar size={12} className="mr-1" />
                {formatDate(task.dueDate)}
                {isOverdue() && (
                  <AlertCircle size={12} className="ml-1 text-red-600" />
                )}
              </span>
            )}

            {/* Assignee */}
            {task.assignee && (
              <span className="flex items-center">
                <User size={12} className="mr-1" />
                {task.assignee}
              </span>
            )}

            {/* Priority */}
            <span className="flex items-center">
              {getPriorityIcon()}
              <span className="ml-1 capitalize">{task.priority}</span>
            </span>

            {/* Status badge */}
            <span
              className={`px-1.5 py-0.5 rounded-full flex items-center ${getStatusColor()}`}
            >
              {getStatusIcon()}
              <span className="ml-1">{getStatusLabel()}</span>
            </span>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full flex items-center"
                  >
                    <Tag size={10} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Expanded details section */}
          {showDetails && (
            <div className="mt-3 border-t border-gray-100 pt-3 text-sm">
              {task.description ? (
                <p className="text-gray-700 mb-2">{task.description}</p>
              ) : (
                <p className="text-gray-500 italic mb-2">No description</p>
              )}

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-1">
                    DATES
                  </h4>
                  <div className="space-y-1">
                    {task.startDate && (
                      <div className="flex items-center text-gray-700">
                        <span className="text-gray-500 w-20">Start:</span>
                        {formatDate(task.startDate)}
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center text-gray-700">
                        <span className="text-gray-500 w-20">Due:</span>
                        <span className={isOverdue() ? "text-red-600" : ""}>
                          {formatDate(task.dueDate)}
                          {isOverdue() && (
                            <AlertCircle
                              size={12}
                              className="ml-1 text-red-600"
                            />
                          )}
                        </span>
                      </div>
                    )}
                    {task.estimatedHours && (
                      <div className="flex items-center text-gray-700">
                        <span className="text-gray-500 w-20">Estimate:</span>
                        {task.estimatedHours}{" "}
                        {task.estimatedHours === 1 ? "hour" : "hours"}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-1">
                    DETAILS
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-700">
                      <span className="text-gray-500 w-20">Status:</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full flex items-center ${getStatusColor()}`}
                      >
                        {getStatusLabel()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="text-gray-500 w-20">Priority:</span>
                      <span className="flex items-center">
                        {getPriorityIcon()}
                        <span className="ml-1 capitalize">{task.priority}</span>
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="text-gray-500 w-20">Assignee:</span>
                      <span>{task.assignee || "Unassigned"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Task Actions */}
        <div className="ml-2 flex-shrink-0">
          {showActions && !isEditing && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none"
                disabled={isDeleting}
              >
                <MoreHorizontal size={16} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1">
                  <button
                    onClick={handleEdit}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    <Pencil size={14} className="mr-2 text-gray-500" />
                    Edit Task
                  </button>

                  <div className="border-b border-gray-100 my-1"></div>

                  <div className="px-4 py-1 text-xs font-medium text-gray-500">
                    STATUS
                  </div>
                  <button
                    onClick={() => updateStatus("to_do")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    <Circle size={14} className="mr-2 text-gray-500" />
                    To Do
                  </button>
                  <button
                    onClick={() => updateStatus("in_progress")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    <Clock size={14} className="mr-2 text-blue-500" />
                    In Progress
                  </button>
                  <button
                    onClick={() => updateStatus("review")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    <Clipboard size={14} className="mr-2 text-purple-500" />
                    In Review
                  </button>
                  <button
                    onClick={() => updateStatus("completed")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    <CheckCircle size={14} className="mr-2 text-emerald-500" />
                    Completed
                  </button>

                  <div className="border-b border-gray-100 my-1"></div>

                  <div className="px-4 py-1 text-xs font-medium text-gray-500">
                    PRIORITY
                  </div>
                  <button
                    onClick={() => updatePriority("high")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    <Flag size={14} className="mr-2 text-red-500" />
                    High
                  </button>
                  <button
                    onClick={() => updatePriority("medium")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    <Flag size={14} className="mr-2 text-yellow-500" />
                    Medium
                  </button>
                  <button
                    onClick={() => updatePriority("low")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    <Flag size={14} className="mr-2 text-green-500" />
                    Low
                  </button>

                  <div className="border-b border-gray-100 my-1"></div>

                  <button
                    onClick={duplicateTask}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    <Copy size={14} className="mr-2 text-gray-500" />
                    Duplicate Task
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                  >
                    <Trash size={14} className="mr-2" />
                    Delete Task
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
