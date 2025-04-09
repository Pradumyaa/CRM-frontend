import { useState } from "react";
import useSpacesStore from "@/store/useSpacesStore";
import { Plus, ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import AddTaskModal from "../tasks/AddTaskModal";

const TableView = ({ projectListId }) => {
  const { spaces, updateTask } = useSpacesStore();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

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

  // Handle sort toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort tasks based on field and direction
  const getSortedTasks = () => {
    if (!projectList.tasks) return [];

    const tasks = [...projectList.tasks];

    if (!sortField) return tasks;

    return tasks.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "status":
          // Sort by completion and then by status
          if (a.completed !== b.completed) {
            comparison = a.completed ? 1 : -1;
          } else {
            comparison = (a.status || "").localeCompare(b.status || "");
          }
          break;
        case "priority":
          const priorityMap = { high: 3, medium: 2, low: 1 };
          comparison =
            (priorityMap[a.priority] || 0) - (priorityMap[b.priority] || 0);
          break;
        case "dueDate":
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        default:
          return 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  const tasks = getSortedTasks();

  // Get status badge color
  const getStatusBadge = (task) => {
    if (task.completed) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          Completed
        </span>
      );
    }

    switch (task.status) {
      case "inProgress":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            In Progress
          </span>
        );
      case "review":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            Review
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            To Do
          </span>
        );
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            High
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            Medium
          </span>
        );
      case "low":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Low
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            None
          </span>
        );
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "--";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {projectList.name} - Table View
        </h2>
        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-1" /> Add Task
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Task
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("priority")}
                  >
                    Priority
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("dueDate")}
                  >
                    Due Date
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Assignee
                </th>
                <th scope="col" className="relative px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {
                            updateTask(
                              spaceId,
                              folderId,
                              projectListId,
                              task.id,
                              {
                                ...task,
                                completed: !task.completed,
                              }
                            );
                          }}
                          className="mr-2 h-4 w-4 text-purple-600 rounded"
                        />
                        <span
                          className={
                            task.completed
                              ? "line-through text-gray-500"
                              : "text-gray-900 font-medium"
                          }
                        >
                          {task.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(task)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getPriorityBadge(task.priority)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(task.dueDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {task.assignee || "--"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No tasks available. Add some tasks to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

export default TableView;
