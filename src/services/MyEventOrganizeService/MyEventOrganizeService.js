import { apiClient, formDataClient } from "../../api/apiClient.js";
import dayjs from "dayjs";

const MyEventOrganizeService = {
  getAllRequestByAccountId: async (accountId) => {
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
      console.error("Error fetching request details:", error);
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
  getCharacterById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Character/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching character details:", error);
      throw error;
    }
  },
  editRequest: async (requestId, requestData) => {
    try {
      if (!requestId || typeof requestId !== "string") {
        throw new Error("RequestId must be a non-empty string");
      }
      if (!requestData.name || typeof requestData.name !== "string") {
        throw new Error("Name must be a non-empty string");
      }
      if (
        !requestData.description ||
        typeof requestData.description !== "string"
      ) {
        throw new Error("Description must be a non-empty string");
      }
      if (!requestData.startDate) {
        throw new Error("StartDate is required");
      }
      if (!requestData.endDate) {
        throw new Error("EndDate is required");
      }
      if (!requestData.location || typeof requestData.location !== "string") {
        throw new Error("Location must be a non-empty string");
      }
      if (!requestData.serviceId || typeof requestData.serviceId !== "string") {
        throw new Error("ServiceId must be a non-empty string");
      }
      if (!Array.isArray(requestData.listUpdateRequestCharacters)) {
        throw new Error("listUpdateRequestCharacters must be an array");
      }

      const adjustedStartDate = dayjs(requestData.startDate, "HH:mm DD/MM/YYYY")
        .add(1, "minute")
        .format("HH:mm DD/MM/YYYY");

      const updatedRequestData = {
        ...requestData,
        startDate: adjustedStartDate,
      };

      const response = await apiClient.put(
        `/api/Request?RequestId=${requestId}`,
        updatedRequestData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating request:", error);
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

  updateEventOrganizationRequest: async (requestId, updateData) => {
    try {
      // Construct the payload to match the API's expected structure
      const payload = {
        name: updateData.name,
        description: updateData.description,
        price: updateData.price,
        startDate: updateData.startDate, // Expected format: DD/MM/YYYY (e.g., "15/5/2025")
        endDate: updateData.endDate, // Expected format: DD/MM/YYYY (e.g., "16/5/2025")
        location: updateData.location,
        serviceId: updateData.serviceId || "S003", // Default to S003 if not provided
        packageId: updateData.packageId,
        range: updateData.range,
        listUpdateRequestCharacters: updateData.listUpdateRequestCharacters.map(
          (item) => ({
            requestCharacterId: item.requestCharacterId,
            characterId: item.characterId,
            description: item.description || "shared",
            quantity: item.quantity || 1,
          })
        ),
      };

      const response = await apiClient.put(
        `/api/Request?RequestId=${requestId}`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error updating event organization request:", error);
      throw new Error(
        error.response?.data?.message || "Lỗi khi cập nhật request"
      );
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
  chooseDeposit: async (requestId, payload) => {
    try {
      const response = await apiClient.patch(
        `/api/Request/UpdateDepositRequest?requestId=${requestId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error choosing deposit amount:", error);
      throw error;
    }
  },
  DepositPayment: async ({
    fullName,
    orderInfo = "",
    amount,
    purpose = 1, // chọn cọc deposit
    accountId,
    contractId,
  }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found. Please log in again.");
      }

      // Tạo request body
      const requestBody = {
        fullName,
        orderInfo,
        amount,
        purpose,
        accountId,
        contractId,
        isWeb: true,
      };

      const response = await apiClient.post("/api/VNPay", requestBody);

      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error(
            "Unauthorized: Invalid or expired token. Please log in again."
          );
        }
        console.error(
          "API Error:",
          error.response.data || error.response.statusText
        );
        throw new Error(
          error.response.data?.message || "Failed to initiate payment."
        );
      } else if (error.request) {
        console.error("Network Error:", error.request);
        throw new Error(
          "Network error: Unable to connect to the payment server."
        );
      } else {
        console.error("Error in DepositPayment:", error.message);
        throw error;
      }
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
  getFeedbackByContractId: async (accountId, contractId) => {
    try {
      // Kiểm tra đầu vào
      if (!accountId) {
        throw new Error("Account ID is required");
      }
      if (!contractId) {
        throw new Error("Contract ID is required");
      }

      // Gọi API để lấy danh sách feedback của contractId
      const feedbackResponse = await apiClient.get(
        `/api/Feedback/contractId/${contractId}`
      );

      // Kiểm tra dữ liệu feedback
      const feedbacks = Array.isArray(feedbackResponse.data)
        ? feedbackResponse.data
        : [];
      if (feedbacks.length === 0) {
        return { contractId, feedbacks: [] };
      }

      // Lấy tên cosplayer cho từng feedback
      const namePromises = feedbacks.map(async (feedback) => {
        try {
          const cosplayerData = await apiClient.get(
            `/api/Account/${feedback.accountId}`
          );
          return [feedback.accountId, cosplayerData?.data?.name || "Unknown"];
        } catch (error) {
          console.warn(
            `Failed to fetch cosplayer data for ID ${feedback.accountId}:`,
            error
          );
          return [feedback.accountId, "Unknown"];
        }
      });

      const namesArray = await Promise.all(namePromises);
      const cosplayerNames = Object.fromEntries(namesArray);

      return {
        contractId,
        feedbacks,
        cosplayerNames,
      };
    } catch (error) {
      console.error(
        `Error fetching feedback for contract ${contractId}:`,
        error
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch feedback for contract"
      );
    }
  },
  AddCharacterInReq: async (data) => {
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
  DeleteCharacterInReq: async (requestCharacterId) => {
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
  getNameCosplayerInRequestByCosplayerId: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/Account/${accountId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cosplayer:", error);
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
};

export default MyEventOrganizeService;
