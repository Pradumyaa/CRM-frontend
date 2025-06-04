// api/teamService.js - Complete team service
import apiClient from "./apiClient.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const teamService = {
  // Get all team members
  getAllTeamMembers: async () => {
    try {
      const response = await apiClient.get(`${BASE_URL}/api/workspace/team`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching team members:", error);
      throw error;
    }
  },

  // Get a specific team member
  getTeamMember: async (userId) => {
    try {
      const response = await apiClient.get(
        `${BASE_URL}/api/workspace/team/${userId}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching team member:", error);
      throw error;
    }
  },

  // Add a new team member (admin only)
  addTeamMember: async (memberData) => {
    try {
      const response = await apiClient.post(
        `${BASE_URL}/api/workspace/team`,
        memberData
      );
      return response.data.data;
    } catch (error) {
      console.error("Error adding team member:", error);
      throw error;
    }
  },

  // Update a team member
  updateTeamMember: async (userId, updateData) => {
    try {
      const response = await apiClient.put(
        `${BASE_URL}/api/workspace/team/${userId}`,
        updateData
      );
      return response.data.data;
    } catch (error) {
      console.error("Error updating team member:", error);
      throw error;
    }
  },

  // Remove a team member (admin only)
  removeTeamMember: async (userId) => {
    try {
      const response = await apiClient.delete(
        `${BASE_URL}/api/workspace/team/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error removing team member:", error);
      throw error;
    }
  },

  // Get team members for a specific space
  getSpaceMembers: async (spaceId) => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      const response = await apiClient.get(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/members`,
        { params: { employeeId } }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching space members:", error);
      throw error;
    }
  },
};

export default teamService;
