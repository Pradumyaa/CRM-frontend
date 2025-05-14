// api/folderService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // Or your backend base URL

export const folderService = {
  // Get all folders for a space
  getFolders: async (spaceId) => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      const response = await axios.get(`${BASE_URL}/api/workspace/spaces/${spaceId}/folders`, {
        params: { employeeId }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching folders:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  },

  // Create a new folder
  createFolder: async (spaceId, folderData) => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      const dataToSend = { ...folderData, employeeId };
      
      const response = await axios.post(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/folders`, 
        dataToSend, 
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating folder:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  },

  // Update a folder
  updateFolder: async (spaceId, folderId, updateData) => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      const dataToSend = { ...updateData, employeeId };
      
      const response = await axios.put(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/folders/${folderId}`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating folder:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  },

  // Delete a folder
  deleteFolder: async (spaceId, folderId) => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      
      const response = await axios.delete(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/folders/${folderId}`,
        {
          params: { employeeId }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting folder:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
      }
      throw error;
    }
  },

  // Reorder folders in a space
  reorderFolders: async (spaceId, folderIds) => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      const dataToSend = { folderIds, employeeId };
      
      const response = await axios.put(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/folders/reorder`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error reordering folders:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
      }
      throw error;
    }
  }
};

export default folderService;