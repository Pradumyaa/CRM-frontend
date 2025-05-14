// api/teamService.js
import apiClient from './apiClient';

export const teamService = {
  // Get all team members
  getAllTeamMembers: async () => {
    try {
      const response = await apiClient.get('/workspace/team');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },

  // Get a specific team member
  getTeamMember: async (userId) => {
    try {
      const response = await apiClient.get(`/workspace/team/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching team member:', error);
      throw error;
    }
  },

  // Add a new team member (admin only)
  addTeamMember: async (memberData) => {
    try {
      const response = await apiClient.post('/workspace/team', memberData);
      return response.data.data;
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  },

  // Update a team member
  updateTeamMember: async (userId, updateData) => {
    try {
      const response = await apiClient.put(`/workspace/team/${userId}`, updateData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  },

  // Remove a team member (admin only)
  removeTeamMember: async (userId) => {
    try {
      const response = await apiClient.delete(`/workspace/team/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing team member:', error);
      throw error;
    }
  }
};

export default teamService;