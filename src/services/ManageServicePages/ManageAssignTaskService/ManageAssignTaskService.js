import { apiClient } from "../../../api/apiClient.js";

const ManageAssignTaskService = {
  getAllRequests: async () => {
    try {
      const response = await apiClient.get("/api/Request");
      return response.data;
    } catch (error) {
      console.error("Error fetching requests:", error);
      throw error;
    }
  },
  getRequestByRequestId: async (id) => {
    try {
      const response = await apiClient.get(`/api/Request/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching request:", error);
      throw error;
    }
  },

  getCharacterById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Character/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching character details:", error);
      throw error;
    }
  },
  // Lấy tất cả characters
  getAllCharacters: async () => {
    try {
      const response = await apiClient.get("/api/Character");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Lỗi khi lấy danh sách characters"
      );
    }
  },

  // Lấy character theo ID
  getCharacterById: async (characterId) => {
    try {
      const response = await apiClient.get(`/api/Character/${characterId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Lỗi khi lấy thông tin character"
      );
    }
  },
  getAccountNoTaskByCharacterName: async (characterId, startDate, endDate) => {
    try {
      const response = await apiClient.get(
        `/api/Account/characterId?characterId=${characterId}&startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw error;
    }
  },
  getAllPackages: async () => {
    try {
      const response = await apiClient.get("/api/Package");
      return response.data;
    } catch (error) {
      console.error("Error fetching packages:", error);
      throw error;
    }
  },
  getPackageById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Package/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching package:", error);
      throw error;
    }
  },
  assignTask: async (requestId, assignments) => {
    try {
      const response = await apiClient.post(
        `/api/Task?requestId=${requestId}`,
        assignments
      );
      return response.data;
    } catch (error) {
      console.error("Error assigning task:", error);
      throw new Error(error.response?.data?.message || "Lỗi khi gán task");
    }
  },
  getAllCosplayers: async () => {
    try {
      const response = await apiClient.get("/api/Account/roleId/R004");
      // Đảm bảo dữ liệu trả về là mảng và có thuộc tính images
      return response.data.map((cosplayer) => ({
        ...cosplayer,
        images: cosplayer.images || [], // Nếu không có images, trả về mảng rỗng
      }));
    } catch (error) {
      console.error("Error fetching all cosplayers:", error);
      throw error;
    }
  },
};
export default ManageAssignTaskService;
