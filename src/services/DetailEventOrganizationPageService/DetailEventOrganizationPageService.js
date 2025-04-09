import { apiClient, formDataClient } from "../../api/apiClient.js";

const DetailEventOrganizationPageService = {
  getAllPackages: async () => {
    try {
      const response = await apiClient.get("/api/Package");
      return response.data;
    } catch (error) {
      console.error("Error fetching all packages:", error);
      throw error;
    }
  },

  getPackageById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Package/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching package by ID:", error);
      throw error;
    }
  },
  getAllCharacters: async () => {
    try {
      const response = await apiClient.get("/api/Character");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Fail to get list characters"
      );
    }
  },
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
  sendRequestEventOrganization: async (requestData) => {
    try {
      const response = await apiClient.post("/api/Request", requestData);
      return response.data;
    } catch (error) {
      console.error("Error sending hire cosplayer request:", error);
      throw new Error(
        error.response?.data?.message || "Error sending Post request"
      );
    }
  },
};

export default DetailEventOrganizationPageService;
