import apiClient from './apiClient';

export const taskService = {
  // Get all tasks for a project list
  getTasks: async (spaceId, folderId, projectListId, employeeId) => {
    try {
      const response = await apiClient.get(
        `http://localhost:3000/api/workspace/spaces/${spaceId}/folders/${folderId}/projectLists/${projectListId}/tasks`,
        { params: { employeeId } }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get a single task
  getTask: async (taskId, employeeId) => {
    try {
      const response = await apiClient.get(
        `http://localhost:3000/api/workspace/tasks/${taskId}`,
        { params: { employeeId } }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  // Create a new task in a project list
  createTask: async (spaceId, folderId, projectListId, taskData) => {
    const employeeId = localStorage.getItem("employeeId");
    try {
      const response = await apiClient.post(
        `http://localhost:3000/api/workspace/spaces/${spaceId}/folders/${folderId}/projectLists/${projectListId}/tasks`,
        {
          ...taskData,
          employeeId
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (spaceId, folderId, projectListId, taskId, updateData) => {
    const employeeId = localStorage.getItem("employeeId");
    try {
      const response = await apiClient.put(
        `http://localhost:3000/api/workspace/spaces/${spaceId}/folders/${folderId}/projectLists/${projectListId}/tasks/${taskId}`,
        {
          ...updateData,
          employeeId
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (spaceId, folderId, projectListId, taskId, employeeId) => {
    try {
      const response = await apiClient.delete(
        `http://localhost:3000/api/workspace/spaces/${spaceId}/folders/${folderId}/projectLists/${projectListId}/tasks/${taskId}`,
        {
          params: { employeeId }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Get upcoming tasks (global scope)
  getUpcomingTasks: async (employeeId) => {
    try {
      const response = await apiClient.get(
        'http://localhost:3000/api/workspace/tasks/upcoming',
        { params: { employeeId } }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching upcoming tasks:', error);
      throw error;
    }
  },

  // Get tasks assigned to the current user
  getAssignedTasks: async (employeeId) => {
    try {
      const response = await apiClient.get(
        'http://localhost:3000/api/workspace/tasks/assigned',
        { params: { employeeId } }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching assigned tasks:', error);
      throw error;
    }
  },

  // Get high priority tasks
  getHighPriorityTasks: async (employeeId) => {
    try {
      const response = await apiClient.get(
        'http://localhost:3000/api/workspace/tasks/high-priority',
        { params: { employeeId } }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching high priority tasks:', error);
      throw error;
    }
  },

  // Reorder tasks in a project list
  reorderTasks: async (spaceId, folderId, projectListId, taskIds, employeeId) => {
    try {
      const response = await apiClient.put(
        `http://localhost:3000/api/workspace/spaces/${spaceId}/folders/${folderId}/projectLists/${projectListId}/tasks/reorder`,
        {
          taskIds,
          employeeId
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error reordering tasks:', error);
      throw error;
    }
  }
};

export default taskService;