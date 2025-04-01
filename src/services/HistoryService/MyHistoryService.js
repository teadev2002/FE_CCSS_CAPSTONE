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
        `/api/Contract/accountId/${accountId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching contract:", error);
      throw error;
    }
  },

  updateStatusContract: async (contractId, status) => {
    try {
      const response = await apiClient.put(
        `/api/Contract?contracId=${contractId}&status=${status}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error updating contract status:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },
};
export default MyHistoryService;
