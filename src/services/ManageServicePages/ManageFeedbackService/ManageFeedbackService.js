import { apiClient } from "../../../api/apiClient.js";

// Service quản lý feedback
const ManageFeedbackService = {
  // Lấy danh sách tất cả feedback
  getAllFeedbacks: async () => {
    try {
      const response = await apiClient.get("/api/Feedback");
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching all feedbacks:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Lấy chi tiết tài khoản theo accountId
  getAccountById: async (accountId) => {
    if (!accountId) {
      const error = new Error("Account ID is required");
      console.error("Error fetching account by ID:", error.message);
      throw error;
    }
    try {
      const response = await apiClient.get(`/api/Account/${accountId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching account with ID ${accountId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default ManageFeedbackService;