// api/folderService.js - Complete folder service
import apiClient from "./apiClient.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const folderService = {
  // Get all folders for a space
  getFolders: async (spaceId) => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      const response = await apiClient.get(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/folders`,
        {
          params: { employeeId },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching folders:", error);
      throw error;
    }
  },

  // Create a new folder
  createFolder: async (spaceId, folderData) => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      const dataToSend = { ...folderData, employeeId };

      const response = await apiClient.post(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/folders`,
        dataToSend
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating folder:", error);
      throw error;
    }
  },

  // Update a folder
  updateFolder: async (spaceId, folderId, updateData) => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      const dataToSend = { ...updateData, employeeId };

      const response = await apiClient.put(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/folders/${folderId}`,
        dataToSend
      );
      return response.data.data;
    } catch (error) {
      console.error("Error updating folder:", error);
      throw error;
    }
  },

  // Delete a folder
  deleteFolder: async (spaceId, folderId) => {
    try {
      const employeeId = localStorage.getItem("employeeId");

      const response = await apiClient.delete(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/folders/${folderId}`,
        {
          params: { employeeId },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting folder:", error);
      throw error;
    }
  },

  // Reorder folders in a space
  reorderFolders: async (spaceId, folderIds) => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      const dataToSend = { folderIds, employeeId };

      const response = await apiClient.put(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/folders/reorder`,
        dataToSend
      );
      return response.data;
    } catch (error) {
      console.error("Error reordering folders:", error);
      throw error;
    }
  },
};

export default folderService;
