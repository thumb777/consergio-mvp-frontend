import axios from "axios";

const API_URL = `${import.meta.env.VITE_BASE_URL}/auth`;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Sync user with our database (create if new, update if existing)
 */
const syncUser = async (userData) => {
  try {
    const response = await api.post("/sync", userData);
    return response.data.user;
  } catch (error) {
    console.error("Error syncing user:", error);
    throw error;
  }
};

/**
 * Get current user profile from our database
 */
const getCurrentUser = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

/**
 * Update user profile in our database
 */
const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await api.put(`/users/${userId}`, profileData);
    return response.data.user;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Delete user account from our database
 */
const deleteUserAccount = async (userId) => {
  try {
    await api.delete(`/users/${userId}`);
    return true;
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
};

const authService = {
  syncUser,
  getCurrentUser,
  updateUserProfile,
  deleteUserAccount,
};

export default authService; 