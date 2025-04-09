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
};

export default MyEventOrganizeService;
