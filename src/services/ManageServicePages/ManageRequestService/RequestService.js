// File này chứa các API liên quan đến quản lý yêu cầu (Request) trong ứng dụng
// Các API này bao gồm việc lấy danh sách yêu cầu, lấy thông tin chi tiết của yêu cầu,
// update thêm api update status request
import { apiClient } from "../../../api/apiClient.js";

const RequestService = {
  // Các API hiện có
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

  getNameCharacterById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Character/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching character:", error);
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

  getNameCosplayerInRequestByCosplayerId: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/Account/${accountId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cosplayer:", error);
      throw error;
    }
  },

  getPackageById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Package/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching package details:", error);
      throw error;
    }
  },

  // DeleteRequestByRequestId: async (id) => {
  //   try {
  //     const response = await apiClient.delete(`/api/Request?requestId=${id}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error deleting request:", error);
  //     throw error;
  //   }
  // },

  DeleteRequestByRequestId: async (id, reason = "") => {
    try {
      let url = `/api/Request?requestId=${id}`;
      if (reason) {
        url += `&reason=${encodeURIComponent(reason)}`;
      }
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      console.error("Error deleting request:", error);
      throw error;
    }
  },

  UpdateRequestStatusById: async (id, requestStatus, reason = "") => {
    try {
      let url = `/api/Request/Status?requestId=${id}&requestStatus=${requestStatus}`;
      if (requestStatus === 2 && reason) {
        url += `&reason=${encodeURIComponent(reason)}`;
      }
      const response = await apiClient.put(url);
      return response.data;
    } catch (error) {
      console.error("Error updating request status:", error);
      throw error;
    }
  },

  // Các API bổ sung (giữ nguyên)
  getContractByRequestId: async (requestId) => {
    try {
      const response = await apiClient.get(
        `/api/Contract/requestId/${requestId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching contract by request ID:", error);
      throw error;
    }
  },

  createContractFromRequest: async (requestId, deposit) => {
    try {
      const response = await apiClient.post(
        `/api/Contract?requestId=${requestId}&deposit=${deposit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error creating contract:", error);
      throw error;
    }
  },

  getRequestDatesByCharacterId: async (characterId) => {
    try {
      const response = await apiClient.get(
        `/api/Request/Character/${characterId}/Dates`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching request dates:", error);
      throw error;
    }
  },
};

export default RequestService;
