import { useState } from "react";
import useSpacesStore from "@/store/useSpacesStore";
import AddTaskModal from "./AddTaskModal";
import TaskItem from "./TaskItem";
import { Plus } from "lucide-react";

const Tasks = ({ projectListId }) => {
  const { spaces } = useSpacesStore();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Tasks in {projectList.name}
        </h2>
        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-1" /> Add Task
        </button>
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
      {projectList.tasks && projectList.tasks.length > 0 ? (
        <div className="space-y-3">
          {projectList.tasks.map((task) => (
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
        <div className="text-center py-8 text-gray-500">
          No tasks yet. Click the button above to add your first task.
        </div>
      )}
    </div>
  );
};

export default Tasks;
