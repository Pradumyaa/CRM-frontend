import { useState, useEffect, useRef } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Tag,
  AlignLeft,
  ChevronDown,
  AlertCircle,
  Check,
  MoreVertical,
  PlayCircle,
  Flag,
} from "lucide-react";
import useSpacesStore from "@/store/useSpacesStore";

const AddTaskModal = ({
  spaceId,
  folderId,
  projectListId,
  isOpen,
  onClose,
  initialDueDate = null,
  initialStartDate = null,
}) => {
  const { addTask, team } = useSpacesStore();
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskStartDate, setTaskStartDate] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskTags, setTaskTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [taskStatus, setTaskStatus] = useState("to_do");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [activeTab, setActiveTab] = useState("details"); // details, notes

  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const priorityRef = useRef(null);
  const assigneeRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Reset all form fields
      setTaskName("");
      setTaskDescription("");
      setTaskPriority("medium");
      setTaskStartDate(
        initialStartDate
          ? new Date(initialStartDate).toISOString().split("T")[0]
          : ""
      );
      setTaskDueDate(
        initialDueDate
          ? new Date(initialDueDate).toISOString().split("T")[0]
          : ""
      );
      setTaskAssignee("");
      setTaskTags([]);
      setNewTag("");
      setTaskStatus("to_do");
      setEstimatedHours("");
      setValidationError("");
      setIsSubmitting(false);
      setActiveTab("details");

      // Focus the input after modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialDueDate, initialStartDate]);

  useEffect(() => {
    // Handle click outside to close dropdowns
    const handleClickOutside = (event) => {
      if (priorityRef.current && !priorityRef.current.contains(event.target)) {
        setShowPriorityDropdown(false);
      }
      if (assigneeRef.current && !assigneeRef.current.contains(event.target)) {
        setShowAssigneeDropdown(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };

    // Handle escape key to close
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        if (showPriorityDropdown) {
          setShowPriorityDropdown(false);
        } else if (showAssigneeDropdown) {
          setShowAssigneeDropdown(false);
        } else if (showStatusDropdown) {
          setShowStatusDropdown(false);
        } else {
          onClose();
        }
      }
    };

    // Handle click outside to close modal
    const handleModalClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
      document.addEventListener("mousedown", handleModalClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
      document.removeEventListener("mousedown", handleModalClickOutside);
    };
  }, [
    isOpen,
    onClose,
    showPriorityDropdown,
    showAssigneeDropdown,
    showStatusDropdown,
  ]);

  // Validate the task dates
  useEffect(() => {
    // Clear validation errors when dates change
    if (validationError.includes("date")) {
      setValidationError("");
    }

    // If both dates are set, validate that start date is before or equal to due date
    if (taskStartDate && taskDueDate) {
      const start = new Date(taskStartDate);
      const due = new Date(taskDueDate);

      if (start > due) {
        setValidationError("Start date cannot be after due date");
      }
    }
  }, [taskStartDate, taskDueDate, validationError]);

  const handleAddTask = () => {
    // Validate task name
    if (!taskName.trim()) {
      setValidationError("Task name is required");
      return;
    }

    // Validate dates if both are provided
    if (taskStartDate && taskDueDate) {
      const start = new Date(taskStartDate);
      const due = new Date(taskDueDate);

      if (start > due) {
        setValidationError("Start date cannot be after due date");
        return;
      }
    }

    // Validate estimated hours
    if (
      estimatedHours &&
      (isNaN(estimatedHours) || Number(estimatedHours) <= 0)
    ) {
      setValidationError("Estimated hours must be a positive number");
      return;
    }

    setIsSubmitting(true);

    // Create task object
    const task = {
      name: taskName.trim(),
      description: taskDescription.trim(),
      completed: false,
      priority: taskPriority,
      startDate: taskStartDate || null,
      dueDate: taskDueDate || null,
      assignee: taskAssignee || null,
      tags: taskTags,
      status: taskStatus,
      estimatedHours: estimatedHours ? Number(estimatedHours) : null,
      createdAt: new Date().toISOString(),
    };

    // Simulate async operation
    setTimeout(() => {
      addTask(spaceId, folderId, projectListId, task);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && newTag.trim()) {
      if (!taskTags.includes(newTag.trim())) {
        setTaskTags([...taskTags, newTag.trim()]);
      }
      setNewTag("");
      e.preventDefault(); // Prevent form submission
    }
  };

  const removeTag = (tagToRemove) => {
    setTaskTags(taskTags.filter((tag) => tag !== tagToRemove));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "to_do":
        return "text-gray-500";
      case "in_progress":
        return "text-blue-500";
      case "review":
        return "text-purple-500";
      case "completed":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "to_do":
        return "To Do";
      case "in_progress":
        return "In Progress";
      case "review":
        return "In Review";
      case "completed":
        return "Completed";
      default:
        return "To Do";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-fade-in-up"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Add New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-2 px-1 text-sm font-medium ${
                activeTab === "details"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Task Details
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`pb-2 px-1 text-sm font-medium ${
                activeTab === "notes"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Notes & Attachments
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          {validationError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-sm text-red-700 flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {validationError}
            </div>
          )}

          {activeTab === "details" && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Name*
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={taskName}
                  onChange={(e) => {
                    setTaskName(e.target.value);
                    if (e.target.value.trim()) {
                      if (validationError === "Task name is required") {
                        setValidationError("");
                      }
                    }
                  }}
                  placeholder="What needs to be done?"
                  className={`border ${
                    validationError === "Task name is required"
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  } p-2 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow`}
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="relative">
                  <AlignLeft
                    size={16}
                    className="absolute top-3 left-3 text-gray-400"
                  />
                  <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Add more details about this task..."
                    className="border border-gray-300 p-2 pl-10 rounded-md w-full h-24 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <div ref={statusRef} className="relative">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between border border-gray-300 rounded-md p-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center">
                        <span className={`mr-2 ${getStatusColor(taskStatus)}`}>
                          ●
                        </span>
                        <span>{getStatusLabel(taskStatus)}</span>
                      </div>
                      <ChevronDown size={16} className="text-gray-400" />
                    </button>

                    {showStatusDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
                        <div className="py-1">
                          <button
                            type="button"
                            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                            onClick={() => {
                              setTaskStatus("to_do");
                              setShowStatusDropdown(false);
                            }}
                          >
                            <span className="text-gray-500 mr-2">●</span>
                            To Do
                            {taskStatus === "to_do" && (
                              <Check
                                size={16}
                                className="ml-auto text-indigo-500"
                              />
                            )}
                          </button>
                          <button
                            type="button"
                            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                            onClick={() => {
                              setTaskStatus("in_progress");
                              setShowStatusDropdown(false);
                            }}
                          >
                            <span className="text-blue-500 mr-2">●</span>
                            In Progress
                            {taskStatus === "in_progress" && (
                              <Check
                                size={16}
                                className="ml-auto text-indigo-500"
                              />
                            )}
                          </button>
                          <button
                            type="button"
                            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                            onClick={() => {
                              setTaskStatus("review");
                              setShowStatusDropdown(false);
                            }}
                          >
                            <span className="text-purple-500 mr-2">●</span>
                            In Review
                            {taskStatus === "review" && (
                              <Check
                                size={16}
                                className="ml-auto text-indigo-500"
                              />
                            )}
                          </button>
                          <button
                            type="button"
                            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                            onClick={() => {
                              setTaskStatus("completed");
                              setShowStatusDropdown(false);
                            }}
                          >
                            <span className="text-green-500 mr-2">●</span>
                            Completed
                            {taskStatus === "completed" && (
                              <Check
                                size={16}
                                className="ml-auto text-indigo-500"
                              />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <div ref={priorityRef} className="relative">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between border border-gray-300 rounded-md p-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={() =>
                        setShowPriorityDropdown(!showPriorityDropdown)
                      }
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center">
                        <Flag
                          size={16}
                          className={`mr-2 ${getPriorityColor(taskPriority)}`}
                        />
                        <span className="capitalize">{taskPriority}</span>
                      </div>
                      <ChevronDown size={16} className="text-gray-400" />
                    </button>

                    {showPriorityDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
                        <div className="py-1">
                          <button
                            type="button"
                            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                            onClick={() => {
                              setTaskPriority("high");
                              setShowPriorityDropdown(false);
                            }}
                          >
                            <Flag size={16} className="text-red-500 mr-2" />
                            High
                            {taskPriority === "high" && (
                              <Check
                                size={16}
                                className="ml-auto text-indigo-500"
                              />
                            )}
                          </button>
                          <button
                            type="button"
                            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                            onClick={() => {
                              setTaskPriority("medium");
                              setShowPriorityDropdown(false);
                            }}
                          >
                            <Flag size={16} className="text-yellow-500 mr-2" />
                            Medium
                            {taskPriority === "medium" && (
                              <Check
                                size={16}
                                className="ml-auto text-indigo-500"
                              />
                            )}
                          </button>
                          <button
                            type="button"
                            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                            onClick={() => {
                              setTaskPriority("low");
                              setShowPriorityDropdown(false);
                            }}
                          >
                            <Flag size={16} className="text-green-500 mr-2" />
                            Low
                            {taskPriority === "low" && (
                              <Check
                                size={16}
                                className="ml-auto text-indigo-500"
                              />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <PlayCircle
                      size={16}
                      className="absolute top-3 left-3 text-gray-400"
                    />
                    <input
                      type="date"
                      value={taskStartDate}
                      onChange={(e) => setTaskStartDate(e.target.value)}
                      className={`border ${
                        validationError.includes("date")
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      } p-2 pl-10 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <div className="relative">
                    <Calendar
                      size={16}
                      className="absolute top-3 left-3 text-gray-400"
                    />
                    <input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className={`border ${
                        validationError.includes("date")
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      } p-2 pl-10 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignee
                  </label>
                  <div ref={assigneeRef} className="relative">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between border border-gray-300 rounded-md p-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={() =>
                        setShowAssigneeDropdown(!showAssigneeDropdown)
                      }
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center">
                        <User size={16} className="mr-2 text-gray-400" />
                        <span>{taskAssignee || "Unassigned"}</span>
                      </div>
                      <ChevronDown size={16} className="text-gray-400" />
                    </button>

                    {showAssigneeDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-48 overflow-y-auto">
                        <div className="py-1">
                          <button
                            type="button"
                            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                            onClick={() => {
                              setTaskAssignee("");
                              setShowAssigneeDropdown(false);
                            }}
                          >
                            <span className="text-gray-400">Unassigned</span>
                            {taskAssignee === "" && (
                              <Check
                                size={16}
                                className="ml-auto text-indigo-500"
                              />
                            )}
                          </button>
                          {team.map((member) => (
                            <button
                              key={member.id}
                              type="button"
                              className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                              onClick={() => {
                                setTaskAssignee(member.name);
                                setShowAssigneeDropdown(false);
                              }}
                            >
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                                  {member.avatar ? (
                                    <img
                                      src={member.avatar}
                                      alt={member.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <User
                                      size={20}
                                      className="w-full h-full p-1 text-gray-500 bg-gray-200"
                                    />
                                  )}
                                </div>
                                <span>{member.name}</span>
                              </div>
                              {taskAssignee === member.name && (
                                <Check
                                  size={16}
                                  className="ml-auto text-indigo-500"
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Hours
                  </label>
                  <div className="relative">
                    <Clock
                      size={16}
                      className="absolute top-3 left-3 text-gray-400"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={estimatedHours}
                      onChange={(e) => {
                        setEstimatedHours(e.target.value);
                        if (validationError.includes("hours")) {
                          setValidationError("");
                        }
                      }}
                      placeholder="Hours"
                      className={`border ${
                        validationError.includes("hours")
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      } p-2 pl-10 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="mb-2 flex flex-wrap gap-2">
                  {taskTags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <Tag
                    size={16}
                    className="absolute top-3 left-3 text-gray-400"
                  />
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Add a tag and press Enter"
                    className="border border-gray-300 p-2 pl-10 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "notes" && (
            <div className="py-2">
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center text-gray-500">
                <p>
                  Notes and attachments can be added after creating the task.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors relative"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="opacity-0">Add Task</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              </>
            ) : (
              "Add Task"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
