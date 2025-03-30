import { apiClient, formDataClient } from "../../api/apiClient.js";

const MyHistoryService = {
  gotoHistoryByAccountId: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/Account/${accountId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lỗi khi vào history");
    }
  },

  GetAllRequestByAccountId: async (accountId) => {
    try {
      const response = await apiClient.get(
        `/api/Request/GetAllRequestByAccount?accountId=${accountId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching history:", error);
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

  depositRequest: async (id, num) => {
    try {
      const response = await apiClient.post(
        `/api/Contract?requestId=${id}&deposit=${num}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching request:", error);
      throw error;
    }
  },

  getAllContractByAccountId: async (accountId) => {
    try {
      const response = await apiClient.get(
        `/api/Contract/acountId/${accountId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching contract:", error);
      throw error;
    }
  },
};
export default MyHistoryService;
