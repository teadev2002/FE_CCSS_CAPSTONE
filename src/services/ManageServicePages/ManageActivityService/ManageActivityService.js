import { apiClient } from "../../../api/apiClient.js"; // Import giống ManageAllFestivalsService

const ManageActivityService = {
  // Lấy danh sách tất cả activities
  getAllActivities: async (searchTerm = "") => {
    try {
      console.log(`Fetching all activities with searchTerm=${searchTerm}...`);
      const response = await apiClient.get("/api/Activity", {
        params: { searchTerm }, // Thêm searchTerm vào query nếu backend hỗ trợ
      });
      console.log("GetAllActivities response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching activities:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to fetch activities";
      throw new Error(errorMessage);
    }
  },

  // Hàm tạo activity (chưa có API)
  addActivity: async (activityJson, imageFiles) => {
    try {
      throw new Error("API for adding activity is not available yet");
    } catch (error) {
      console.error("Error adding activity:", error);
      throw new Error(error.message || "Failed to add activity");
    }
  },

  // Hàm cập nhật activity (chưa có API)
  updateActivity: async (activityId, activityJson, imageFiles) => {
    try {
      throw new Error("API for updating activity is not available yet");
    } catch (error) {
      console.error("Error updating activity:", error);
      throw new Error(error.message || "Failed to update activity");
    }
  },

  // Hàm xóa activity (chưa có API)
  deleteActivity: async (activityId) => {
    try {
      throw new Error("API for deleting activity is not available yet");
    } catch (error) {
      console.error("Error deleting activity:", error);
      throw new Error(error.message || "Failed to delete activity");
    }
  },
};

export default ManageActivityService;