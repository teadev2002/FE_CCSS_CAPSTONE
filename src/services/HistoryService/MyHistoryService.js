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
  cancelContract: async (contractId, reason) => {
    try {
      const response = await apiClient.put(
        `/api/Contract?contracId=${contractId}&status=Cancel&reason=${reason}`
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
  editRequest: async (requestId, data) => {
    try {
      const response = await apiClient.put(
        `/api/Request?RequestId=${requestId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating request:", error);
      throw error;
    }
  },

  ChangeCosplayer: async (data) => {
    try {
      const response = await apiClient.post(`/api/Account/characterId`, data);
      return response.data;
    } catch (error) {
      console.error("Error changing cosplayer:", error);
      throw error;
    }
  },

  // Hàm mới để lấy danh sách cosplayer dựa trên characterId và khoảng thời gian
  getAvailableCosplayersByCharacterId: async (
    characterId,
    startDate,
    endDate
  ) => {
    try {
      const response = await apiClient.get(
        `/api/Account/characterId?characterId=${characterId}&startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching available cosplayers:", error);
      throw error;
    }
  },

  // Hàm mới để lấy danh sách cosplayer dựa trên tên nhân vật và khoảng thời gian
  getCosplayersByCharacterNameAndDate: async (
    characterName,
    startDate,
    endDate
  ) => {
    try {
      const response = await apiClient.get(
        `/api/Account/characterName/${characterName}?start=${encodeURIComponent(
          startDate
        )}&end=${encodeURIComponent(endDate)}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching cosplayers by character name and date:",
        error
      );
      throw error;
    }
  },

  // Hàm mới để lấy tất cả cosplayer (dùng để lọc ban đầu nếu cần)
  getAllCosplayers: async () => {
    try {
      const response = await apiClient.get("/api/Account/roleId/R004");
      return response.data.map((cosplayer) => ({
        ...cosplayer,
        images: cosplayer.images || [],
      }));
    } catch (error) {
      console.error("Error fetching all cosplayers:", error);
      throw error;
    }
  },
  getContractCharacters: async (contractId) => {
    try {
      const response = await apiClient.get(
        `/api/ContractCharacter?contractId=${contractId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching contract characters:", error);
      throw error;
    }
  },
  createFeedback: async (accountId, contractId, data) => {
    try {
      const response = await apiClient.post(
        `/api/Feedback?accountId=${accountId}&contractId=${contractId}`,
        data.feedbacks
      );
      return response.data;
    } catch (error) {
      console.error("Error creating feedback:", error);
      throw error;
    }
  },
  getContractCharacterByContractId: async (contractId) => {
    try {
      const response = await apiClient.get(
        `/api/ContractCharacter?contractId=${contractId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching contract characters:", error);
      throw error;
    }
  },
  getFeedbackByContractId: async (contractId) => {
    try {
      if (!contractId) {
        throw new Error("Contract ID is required");
      }
      const feedbackResponse = await apiClient.get(
        `/api/Feedback/contractId/${contractId}`
      );
      return {
        contractId,
        feedbacks: Array.isArray(feedbackResponse.data)
          ? feedbackResponse.data
          : [],
      };
    } catch (error) {
      console.error("Error fetching feedback by contract ID:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch feedback for contract"
      );
    }
  },
  AddCosplayer: async (data) => {
    try {
      const response = await apiClient.post(`/api/RequestCharacter`, data);
      return response.data;
    } catch (error) {
      console.error("Error adding cosplayer to request:", error);
      throw new Error(
        error.response?.data?.message || "Failed to add cosplayer to request"
      );
    }
  },
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
  getAccountByCharacterNameNDate: async (characterName, startDate, endDate) => {
    try {
      // Xây dựng URL với characterName trong path và start/end trong query string
      const response = await apiClient.get(
        `/api/Account/characterName/${characterName}?start=${encodeURIComponent(
          startDate
        )}&end=${encodeURIComponent(endDate)}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching accounts by character name and date:",
        error
      );
      throw new Error(
        error.response?.data?.message ||
          "Lỗi khi lấy tài khoản theo tên nhân vật và ngày"
      );
    }
  },
  DeleteCosplayerInReq: async (requestCharacterId) => {
    try {
      const response = await apiClient.delete(
        `/api/RequestCharacter?requestCharacterId=${requestCharacterId}`
      );
      return response.data; // Assuming the API returns a success message or empty response
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to delete cosplayer from request."
      );
    }
  },
  getContractByContractId: async (contractId) => {
    try {
      const response = await apiClient.get(
        `/api/Contract/contractId/${contractId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching contract by contract ID:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  getTaskByCosplayerIdInContract: async (cosplayerId) => {
    try {
      const response = await apiClient.get(
        `/api/Task/accountId/${cosplayerId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching task by cosplayer ID in contract:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  getTaskByContractId: async (contractId) => {
    try {
      const response = await apiClient.get(
        `/api/Task/GetAllTaskByContractId?contractId=${contractId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching task",
        error.response?.data || error.message
      );
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
  getContractByContractId: async (contractId) => {
    try {
      const response = await apiClient.get(
        `/api/Contract/contractId/${contractId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching contract by contract ID:", error);
      throw error;
    }
  },
};
export default MyHistoryService;
