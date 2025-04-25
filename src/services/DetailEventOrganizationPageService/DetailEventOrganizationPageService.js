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
      const response = await apiClient.post(
        "/api/Request/CreateCreateEvent",
        requestData
      );
      return response.data;
    } catch (error) {
      console.error("Error sending hire cosplayer request:", error);
      throw new Error(
        error.response?.data?.message || "Error sending Post request"
      );
    }
  },
  updateEventOrganizationRequest: async (requestId, updateData) => {
    try {
      // Construct the full payload to match the API's expected structure
      const payload = {
        name: updateData.name,
        description: updateData.description,
        price: updateData.price,
        startDate: updateData.startDate, // Expected format: DD/MM/YYYY (e.g., "26/04/2025")
        endDate: updateData.endDate, // Expected format: DD/MM/YYYY (e.g., "27/04/2025")
        location: updateData.location,
        serviceId: updateData.serviceId || "S003", // Default to S003 if not provided
        packageId: updateData.packageId,
        listUpdateRequestCharacters: updateData.listUpdateRequestCharacters.map(
          (item) => ({
            characterId: item.characterId,
            cosplayerId: item.cosplayerId || null,
            description: item.description || "shared",
            quantity: item.quantity || 1,
            listUpdateRequestDates: item.listUpdateRequestDates.map((date) => ({
              requestDateId: date.requestDateId || null,
              startDate: date.startDate, // Expected format: HH:mm DD/MM/YYYY (e.g., "09:11 26/04/2025")
              endDate: date.endDate, // Expected format: HH:mm DD/MM/YYYY (e.g., "18:11 26/04/2025")
            })),
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

export default DetailEventOrganizationPageService;
