import { useState } from "react";
import useSpacesStore from "@/store/useSpacesStore";
import { Plus, MoreHorizontal } from "lucide-react";
import AddTaskModal from "../tasks/AddTaskModal";

const KanbanView = ({ projectListId }) => {
  const { spaces, updateTask } = useSpacesStore();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('todo');

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

  // Define columns for the kanban board
  const columns = [
    { id: 'todo', name: 'To Do', color: 'bg-gray-100', textColor: 'text-gray-700' },
    { id: 'inProgress', name: 'In Progress', color: 'bg-blue-100', textColor: 'text-blue-700' },
    { id: 'review', name: 'Review', color: 'bg-yellow-100', textColor: 'text-yellow-700' },
    { id: 'done', name: 'Done', color: 'bg-green-100', textColor: 'text-green-700' }
  ];

  // Group tasks by status
  const getTasksByStatus = () => {
    const tasksByStatus = {
      todo: [],
      inProgress: [],
      review: [],
      done: []
    };

    if (projectList.tasks) {
      projectList.tasks.forEach(task => {
        if (task.completed) {
          tasksByStatus.done.push(task);
        } else if (task.status === 'inProgress') {
          tasksByStatus.inProgress.push(task);
        } else if (task.status === 'review') {
          tasksByStatus.review.push(task);
        } else {
          tasksByStatus.todo.push(task);
        }
      });
    }

    return tasksByStatus;
  };

  const tasksByStatus = getTasksByStatus();

  // Handle drag start
  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('task', JSON.stringify(task));
  };

  // Handle drop
  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const task = JSON.parse(e.dataTransfer.getData('task'));
    
    // Update the task's status
    const updatedTask = { 
      ...task, 
      status: newStatus,
      completed: newStatus === 'done'
    };
    
    updateTask(spaceId, folderId, projectListId, task.id, updatedTask);
  };

  // Allow dropping
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Open add task modal with preselected status
  const handleAddTaskToColumn = (status) => {
    setSelectedStatus(status);
    setIsAddTaskModalOpen(true);
  };

  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {projectList.name} - Kanban Board
        </h2>
      </div>
      
      {/* Kanban board */}
      <div className="flex space-x-4 h-full overflow-x-auto pb-4">
        {columns.map(column => (
          <div 
            key={column.id}
            className="flex-shrink-0 w-72 flex flex-col bg-gray-50 rounded-md shadow"
            onDrop={(e) => handleDrop(e, column.id)}
            onDragOver={handleDragOver}
          >
            {/* Column header */}
            <div className={`p-3 ${column.color} ${column.textColor} rounded-t-md flex justify-between items-center`}>
              <div className="font-semibold flex items-center">
                <span>{column.name}</span>
                <span className="ml-2 bg-white bg-opacity-30 text-xs rounded-full px-2 py-1">
                  {tasksByStatus[column.id].length}
                </span>
              </div>
              <button 
                onClick={() => handleAddTaskToColumn(column.id)}
                className="p-1 rounded-full hover:bg-white hover:bg-opacity-20"
              >
                <Plus size={16} />
              </button>
            </div>
            
            {/* Column content */}
            <div className="p-2 flex-1 overflow-y-auto space-y-2 min-h-96">
              {tasksByStatus[column.id].length > 0 ? (
                tasksByStatus[column.id].map(task => (
                  <div 
                    key={task.id}
                    className="bg-white p-3 rounded shadow-sm border border-gray-200 cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{task.name}</h4>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      {task.dueDate && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                      
                      <span className={`text-xs px-2 py-1 rounded ml-auto ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-md">
                  <p className="text-gray-400 text-sm">No tasks</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Task Modal */}
      <AddTaskModal
        spaceId={spaceId}
        folderId={folderId}
        projectListId={projectListId}
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        initialStatus={selectedStatus}
      />
    </div>
  );
};

export default KanbanView;