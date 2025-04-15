import { apiClient } from "../../../api/apiClient.js";

const ManageContractService = {
  // Lấy danh sách tất cả hợp đồng
  getAllContracts: async () => {
    try {
      const response = await apiClient.get("/api/Contract");
      return response.data;
    } catch (error) {
      console.error("Error fetching contracts:", error);
      throw error;
    }
  },

  // Lấy danh sách tất cả request
  getAllRequests: async () => {
    try {
      const response = await apiClient.get("/api/Request");
      return response.data;
    } catch (error) {
      console.error("Error fetching requests:", error);
      throw error;
    }
  },

  // Lấy chi tiết request theo ID
  getRequestByRequestId: async (id) => {
    try {
      const response = await apiClient.get(`/api/Request/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching request:", error);
      throw error;
    }
  },

  // Lấy thông tin nhân vật theo ID
  getNameCharacterById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Character/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching character:", error);
      throw error;
    }
  },

  // Lấy chi tiết nhân vật theo ID
  getCharacterById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Character/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching character details:", error);
      throw error;
    }
  },

  // Lấy thông tin cosplayer theo account ID
  getNameCosplayerInRequestByCosplayerId: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/Account/${accountId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cosplayer:", error);
      throw error;
    }
  },

  // Lấy thông tin gói dịch vụ theo ID
  getPackageById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Package/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching package details:", error);
      throw error;
    }
  },
  createContract: async (requestId, deposit) => {
    try {
      // Tạo URL với query parameters
      const response = await apiClient.post(
        `/api/Contract?requestId=${requestId}&deposit=${deposit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error creating contract:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },
};

export default ManageContractService;
