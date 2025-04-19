import { apiClient } from "../../api/apiClient.js";

// Tạo một class CustomError để dễ xử lý lỗi
class CustomError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = "CustomError";
    this.details = details; // Lưu thông tin chi tiết từ backend (nếu có)
  }
}

const TaskService = {
  getAllTaskByAccountId: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/Task/accountId/${accountId}`);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      // Log lỗi để debug
      console.error(
        "Error fetching tasks by account ID:",
        error.response ? error.response.data : error.message
      );

      // Trích xuất thông báo lỗi từ backend
      const errorMessage =
        error.response?.data?.message || "Failed to fetch tasks";
      const errorDetails = error.response?.data?.details || null;

      // Ném lỗi tùy chỉnh với thông báo từ backend
      throw new CustomError(errorMessage, errorDetails);
    }
  },

  getTaskById: async (taskId) => {
    try {
      const response = await apiClient.get(`/api/Task/taskId/${taskId}`);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      // Log lỗi để debug
      console.error(
        "Error fetching task by ID:",
        error.response ? error.response.data : error.message
      );

      // Trích xuất thông báo lỗi từ backend
      const errorMessage =
        error.response?.data?.message ||
        `Failed to fetch task with ID ${taskId}`;
      const errorDetails = error.response?.data?.details || null;

      // Ném lỗi tùy chỉnh với thông báo từ backend
      throw new CustomError(errorMessage, errorDetails);
    }
  },

  getProfileById: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/Account/${accountId}`);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      // Log lỗi để debug
      console.error(
        "Error fetching profile by ID:",
        error.response ? error.response.data : error.message
      );

      // Trích xuất thông báo lỗi từ backend
      const errorMessage =
        error.response?.data?.message ||
        `Failed to fetch profile with ID ${accountId}`;
      const errorDetails = error.response?.data?.details || null;

      // Ném lỗi tùy chỉnh với thông báo từ backend
      throw new CustomError(errorMessage, errorDetails);
    }
  },
  updateTaskStatus: async (taskId, status, accountId) => {
    try {
      const response = await apiClient.put(
        `/api/Task?taskId=${taskId}&taskStatus=${status}&accountId=${accountId}`,
        status
      );
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      // Log lỗi để debug
      console.error(
        "Error updating task status:",
        error.response ? error.response.data : error.message
      );

      // Trích xuất thông báo lỗi từ backend
      const errorMessage =
        error.response?.data?.message || "Failed to update task status";
      const errorDetails = error.response?.data?.details || null;

      // Ném lỗi tùy chỉnh với thông báo từ backend
      throw new CustomError(errorMessage, errorDetails);
    }
  },
};

export default TaskService;
