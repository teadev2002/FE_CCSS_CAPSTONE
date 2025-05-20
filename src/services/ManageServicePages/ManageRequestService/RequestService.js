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
  checkAndUpdateRequestStatus: async (
    requestId,
    requestStatus,
    reason = ""
  ) => {
    try {
      // Kiểm tra đầu vào
      if (!requestId) {
        throw new Error("Request ID is required");
      }
      if (requestStatus === 2 && !reason.trim()) {
        throw new Error("Reason is required when canceling a request");
      }

      // Gọi API UpdateRequestStatusById trực tiếp, bỏ kiểm tra RequestCharacter
      const updateResponse = await RequestService.UpdateRequestStatusById(
        requestId,
        requestStatus,
        reason
      );

      return {
        success: true,
        message:
          requestStatus === 2
            ? "Request canceled successfully"
            : "Request status updated successfully",
        data: updateResponse,
      };
    } catch (error) {
      console.error("Error updating request status:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update request status"
      );
    }
  },
  getNotification: async (accountId) => {
    try {
      const response = await apiClient.get(
        `/api/Notification/accountId?accountId=${accountId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },
  seenNotification: async (Id) => {
    try {
      const response = await apiClient.put(
        `/api/Notification?notificationId=${Id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error marking notification as seen:", error);
      throw error;
    }
  },
};

export default RequestService;
