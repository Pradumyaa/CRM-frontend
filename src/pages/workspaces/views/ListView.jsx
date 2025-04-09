import { useState } from "react";
import useSpacesStore from "@/store/useSpacesStore";
import AddTaskModal from "../tasks/AddTaskModal";
import TaskItem from "../tasks/TaskItem";
import { 
  Plus, 
  Filter, 
  SortAsc,
  ChevronDown,
  Clock,
  Tag,
  User
} from "lucide-react";

const ListView = ({ projectListId }) => {
  const { spaces } = useSpacesStore();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  // Find the project list and its parent space and folder
  let projectList = null;
  let spaceId = null;
  let folderId = null;

  // This is more complex because we need to find the path to the project list
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

  // Filter tasks based on the selected filter option
  const getFilteredTasks = () => {
    if (!projectList.tasks) return [];
    
    switch (filterOption) {
      case "completed":
        return projectList.tasks.filter(task => task.completed);
      case "incomplete":
        return projectList.tasks.filter(task => !task.completed);
      case "high":
        return projectList.tasks.filter(task => task.priority === "high");
      case "medium":
        return projectList.tasks.filter(task => task.priority === "medium");
      case "low":
        return projectList.tasks.filter(task => task.priority === "low");
      default:
        return projectList.tasks;
    }
  };

  // Sort tasks based on the selected sort option
  const getSortedTasks = () => {
    const filteredTasks = getFilteredTasks();

    switch (sortOption) {
      case "name-asc":
        return [...filteredTasks].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return [...filteredTasks].sort((a, b) => b.name.localeCompare(a.name));
      case "priority-high":
        return [...filteredTasks].sort((a, b) => {
          const priorityMap = { high: 3, medium: 2, low: 1 };
          return priorityMap[b.priority] - priorityMap[a.priority];
        });
      case "priority-low":
        return [...filteredTasks].sort((a, b) => {
          const priorityMap = { high: 3, medium: 2, low: 1 };
          return priorityMap[a.priority] - priorityMap[b.priority];
        });
      case "due-date":
        return [...filteredTasks].sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
      case "newest":
      default:
        return filteredTasks;
    }
  };

  const tasks = getSortedTasks();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {projectList.name}
        </h2>
        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center shadow-sm"
        >
          <Plus size={18} className="mr-1" /> Add Task
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button className="flex items-center space-x-1 px-3 py-1.5 bg-white text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter size={16} />
              <span className="text-sm">Filter</span>
              <ChevronDown size={16} />
            </button>
            {/* Filter dropdown would go here */}
          </div>
          
          <div className="relative">
            <button className="flex items-center space-x-1 px-3 py-1.5 bg-white text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              <SortAsc size={16} />
              <span className="text-sm">Sort</span>
              <ChevronDown size={16} />
            </button>
            {/* Sort dropdown would go here */}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 bg-white text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 text-sm flex items-center">
            <Clock size={16} className="mr-1" />
            Due Date
          </button>
          <button className="px-3 py-1.5 bg-white text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 text-sm flex items-center">
            <Tag size={16} className="mr-1" />
            Priority
          </button>
          <button className="px-3 py-1.5 bg-white text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 text-sm flex items-center">
            <User size={16} className="mr-1" />
            Assignee
          </button>
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

      {/* Task List */}
      {tasks && tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              spaceId={spaceId}
              folderId={folderId}
              projectListId={projectListId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-1">No tasks yet</h3>
          <p className="text-sm text-gray-500 mb-4">Get started by adding your first task</p>
          <button 
            onClick={() => setIsAddTaskModalOpen(true)}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded"
          >
            Add Task
          </button>
        </div>
      )}
    </div>
  );
};

export default ListView;