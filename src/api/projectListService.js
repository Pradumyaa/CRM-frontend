// api/projectListService.js - Complete project list service
import apiClient from "./apiClient.js";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://getmax-backend.vercel.app";

export const projectListService = {
  // Get all project lists for a folder
  getProjectLists: async (spaceId, folderId, employeeId) => {
    try {
      const response = await apiClient.get(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/folders/${folderId}/projectLists`,
        { params: { employeeId } }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching project lists:", error);
      throw error;
    }
  },

  // Get a single project list with its tasks
  getProjectList: async (projectListId, employeeId) => {
    try {
      const response = await apiClient.get(
        `${BASE_URL}/api/workspace/projectLists/${projectListId}`,
        { params: { employeeId } }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching project list:", error);
      throw error;
    }
  },

  // Create a new project list
  createProjectList: async (spaceId, folderId, projectListData) => {
    const employeeId = localStorage.getItem("employeeId");
    try {
      const response = await apiClient.post(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/folders/${folderId}/projectLists`,
        {
          ...projectListData,
          employeeId,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating project list:", error);
      throw error;
    }
  },

  // Update a project list
  updateProjectList: async (
    spaceId,
    folderId,
    projectListId,
    updateData,
    employeeId
  ) => {
    try {
      const response = await apiClient.put(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/folders/${folderId}/projectLists/${projectListId}`,
        {
          ...updateData,
          employeeId,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error updating project list:", error);
      throw error;
    }
  },

  // Delete a project list
  deleteProjectList: async (spaceId, folderId, projectListId, employeeId) => {
    try {
      const response = await apiClient.delete(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/folders/${folderId}/projectLists/${projectListId}`,
        {
          params: { employeeId },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting project list:", error);
      throw error;
    }
  },

  // Reorder project lists in a folder
  reorderProjectLists: async (
    spaceId,
    folderId,
    projectListIds,
    employeeId
  ) => {
    try {
      const response = await apiClient.put(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/folders/${folderId}/projectLists/reorder`,
        {
          projectListIds,
          employeeId,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error reordering project lists:", error);
      throw error;
    }
  },
};

export default projectListService;
