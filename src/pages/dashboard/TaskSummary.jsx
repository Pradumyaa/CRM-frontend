import React from "react";
import { Card } from "../components/ui/card";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import useSpacesStore from "@/store/useSpacesStore";

const TaskSummary = ({ taskData, tasks = [] }) => {
  const { updateTask } = useSpacesStore();
  const totalTasks = taskData.completed + taskData.pending + taskData.overdue;
  const completedPercentage =
    totalTasks > 0 ? Math.round((taskData.completed / totalTasks) * 100) : 0;

  // Function to handle task completion
  const handleTaskComplete = (task) => {
    updateTask(task.spaceId, task.folderId, task.listId, task.id, {
      ...task,
      completed: true,
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Task Management</h2>
        <button className="text-sm text-indigo-600 hover:text-indigo-800">
          View All Tasks
        </button>
      </div>

      {/* Task Summary Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="col-span-2 flex items-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-indigo-100 mr-4">
            <span className="text-xl font-bold text-indigo-600">
              {completedPercentage}%
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Task Completion</p>
            <p className="text-xs text-gray-500">
              {taskData.completed} of {totalTasks} tasks completed
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-green-50 p-3 rounded-lg">
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-lg font-semibold text-gray-800">
              {taskData.completed}
            </span>
          </div>
          <p className="text-xs text-gray-500">Completed</p>
        </div>

        <div className="grid grid-rows-2 gap-2">
          <div className="flex items-center justify-between bg-amber-50 p-2 rounded-lg">
            <span className="text-xs text-gray-500">Pending</span>
            <div className="flex items-center">
              <Clock className="h-3 w-3 text-amber-500 mr-1" />
              <span className="font-semibold text-gray-800">
                {taskData.pending}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-red-50 p-2 rounded-lg">
            <span className="text-xs text-gray-500">Overdue</span>
            <div className="flex items-center">
              <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
              <span className="font-semibold text-gray-800">
                {taskData.overdue}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
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
                        className="h-4 w-4 text-indigo-600 rounded border-gray-300 mr-3"
                        onChange={() => handleTaskComplete(task)}
                      />
                      <span className="text-sm text-gray-800">
                        {task.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`text-xs font-medium ${getPriorityColor(
                        task.priority
                      )} capitalize`}
                    >
                      {task.priority || "medium"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {task.dueDate || "No date"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Edit
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-4 text-center text-sm text-gray-500"
                >
                  No tasks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button className="w-full mt-4 py-2 text-sm text-center text-indigo-600 hover:text-indigo-800 border border-dashed border-indigo-300 hover:border-indigo-500 rounded-lg">
        + Add New Task
      </button>
    </Card>
  );
};

export default TaskSummary;
