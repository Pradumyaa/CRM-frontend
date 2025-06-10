// api/spaceService.js - Complete space service
import apiClient from "./apiClient.js";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://getmax-backend.vercel.app";

export const spaceService = {
  // Get all spaces for the current user
  getSpaces: async () => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      const response = await apiClient.get(`${BASE_URL}/api/workspace/spaces`, {
        params: { employeeId },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching spaces:", error);
      throw error;
    }
  },

  // Create a new space
  createSpace: async (spaceData) => {
    try {
      const response = await apiClient.post(
        `${BASE_URL}/api/workspace/spaces`,
        spaceData
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating space:", error);
      throw error;
    }
  },

  // Update a space
  updateSpace: async (spaceId, updateData) => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      const dataToSend = { ...updateData, employeeId };

      const response = await apiClient.put(
        `${BASE_URL}/api/workspace/spaces/${spaceId}`,
        dataToSend
      );
      return response.data.data;
    } catch (error) {
      console.error("Error updating space:", error);
      throw error;
    }
  },

  // Delete a space
  deleteSpace: async (spaceId) => {
    try {
      const employeeId = localStorage.getItem("employeeId");

      const response = await apiClient.delete(
        `${BASE_URL}/api/workspace/spaces/${spaceId}`,
        {
          params: { employeeId },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting space:", error);
      throw error;
    }
  },

  // Add a member to a space
  addMember: async (spaceId, email) => {
    try {
      const employeeId = localStorage.getItem("employeeId");

      const response = await apiClient.post(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/members`,
        { email, employeeId }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error adding member:", error);
      throw error;
    }
  },

  // Remove a member from a space
  removeMember: async (spaceId, userId) => {
    try {
      const employeeId = localStorage.getItem("employeeId");

      const response = await apiClient.delete(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/members/${userId}`,
        {
          params: { employeeId },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error removing member:", error);
      throw error;
    }
  },
};

export default spaceService;
