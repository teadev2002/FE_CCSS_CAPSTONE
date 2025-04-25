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
  // updateEventOrganizationRequest: async (requestId, updateData) => {
  //   try {
  //     // Construct the full payload to match the API's expected structure
  //     const payload = {
  //       name: updateData.name,
  //       description: updateData.description,
  //       price: updateData.price,
  //       startDate: updateData.startDate, // Expected format: DD/MM/YYYY (e.g., "26/04/2025")
  //       endDate: updateData.endDate, // Expected format: DD/MM/YYYY (e.g., "27/04/2025")
  //       location: updateData.location,
  //       serviceId: updateData.serviceId || "S003", // Default to S003 if not provided
  //       packageId: updateData.packageId,
  //       listUpdateRequestCharacters: updateData.listUpdateRequestCharacters.map(
  //         (item) => ({
  //           characterId: item.characterId,
  //           cosplayerId: item.cosplayerId || null,
  //           description: item.description || "shared",
  //           quantity: item.quantity || 1,
  //           listUpdateRequestDates: item.listUpdateRequestDates.map((date) => ({
  //             requestDateId: date.requestDateId || null,
  //             startDate: date.startDate, // Expected format: HH:mm DD/MM/YYYY (e.g., "09:11 26/04/2025")
  //             endDate: date.endDate, // Expected format: HH:mm DD/MM/YYYY (e.g., "18:11 26/04/2025")
  //           })),
  //         })
  //       ),
  //     };

  //     const response = await apiClient.put(
  //       `/api/Request?RequestId=${requestId}`,
  //       payload
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error updating event organization request:", error);
  //     throw new Error(
  //       error.response?.data?.message || "Lỗi khi cập nhật request"
  //     );
  //   }
  // },
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
};

export default MyEventOrganizeService;
