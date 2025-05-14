// api/spaceService.js 
import axios from 'axios'; 
 
const BASE_URL = 'http://localhost:3000'; // Or your backend base URL 
 
export const spaceService = { 
  // Get all spaces for the current user 
  getSpaces: async () => { 
    try { 
      const employeeId = localStorage.getItem("employeeId"); 
      const response = await axios.get(`${BASE_URL}/api/workspace/spaces`, { 
        params: { employeeId } // Send as query parameter 
      }); 
      return response.data.data; 
    } catch (error) { 
      console.error('Error fetching spaces:', error); 
      throw error; 
    } 
  }, 
 
  // Create a new space
  createSpace: async (spaceData) => { 
    console.log("Sending spaceData:", spaceData); 
    try { 
      const response = await axios.post(`${BASE_URL}/api/workspace/spaces`, spaceData, { 
        headers: { 
          'Content-Type': 'application/json' 
        }, 
      }); 
      console.log("Response received:", response.data); 
      return response.data.data; 
    } catch (error) { 
      console.error('Error creating space:', error); 
      if (error.response) { 
        console.error('Error data:', error.response.data); 
        console.error('Error status:', error.response.status); 
      } else if (error.request) { 
        console.error('No response received:', error.request); 
      } else { 
        console.error('Error message:', error.message); 
      } 
      throw error; 
    } 
  }, 
 
  // Update a space 
  updateSpace: async (spaceId, updateData) => { 
    try {
      // Make sure to include employeeId in update data
      const employeeId = localStorage.getItem("employeeId");
      const dataToSend = { ...updateData, employeeId };
      
      const response = await axios.put(`${BASE_URL}/api/workspace/spaces/${spaceId}`, dataToSend, { 
        headers: { 
          'Content-Type': 'application/json' 
        }
      }); 
      return response.data.data; 
    } catch (error) { 
      console.error('Error updating space:', error); 
      if (error.response) { 
        console.error('Error data:', error.response.data); 
        console.error('Error status:', error.response.status); 
      }
      throw error; 
    } 
  }, 
 
  // Delete a space 
  deleteSpace: async (spaceId) => { 
    try {
      // Include employeeId as query parameter
      const employeeId = localStorage.getItem("employeeId");
      
      const response = await axios.delete(`${BASE_URL}/api/workspace/spaces/${spaceId}`, { 
        params: { employeeId }
      }); 
      return response.data; 
    } catch (error) { 
      console.error('Error deleting space:', error); 
      if (error.response) {
        console.error('Error data:', error.response.data);
      }
      throw error; 
    } 
  }, 
 
  // Add a member to a space 
  addMember: async (spaceId, email) => { 
    try {
      // Include employeeId in the request body
      const employeeId = localStorage.getItem("employeeId");
      
      const response = await axios.post(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/members`, 
        { email, employeeId }, 
        { 
          headers: { 
            'Content-Type': 'application/json' 
          }
        }
      ); 
      return response.data.data; 
    } catch (error) { 
      console.error('Error adding member:', error); 
      if (error.response) {
        console.error('Error data:', error.response.data);
      }
      throw error; 
    } 
  }, 
 
  // Remove a member from a space 
  removeMember: async (spaceId, userId) => { 
    try {
      // Include employeeId as query parameter
      const employeeId = localStorage.getItem("employeeId");
      
      const response = await axios.delete(
        `${BASE_URL}/api/workspace/spaces/${spaceId}/members/${userId}`, 
        { 
          params: { employeeId }
        }
      ); 
      return response.data.data; 
    } catch (error) { 
      console.error('Error removing member:', error); 
      if (error.response) {
        console.error('Error data:', error.response.data);
      }
      throw error; 
    } 
  } 
}; 
 
export default spaceService;