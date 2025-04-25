import { apiClient } from "../../../api/apiClient.js";

const ManageAllFestivalsService = {
  getAllEvents: async (searchTerm = "") => {
    try {
      console.log(`Fetching all events with searchTerm=${searchTerm}...`);
      const response = await apiClient.get("/api/Event/GetAllEvents", {
        params: { searchTerm },
      });
      console.log("GetAllEvents response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching all events:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to fetch events";
      throw new Error(errorMessage);
    }
  },

  getEventById: async (eventId) => {
    try {
      console.log(`Fetching event: eventId=${eventId}`);
      const response = await apiClient.get(`/api/Event/GetEvent/${eventId}`);
      console.log("GetEventById response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${eventId}:`, error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to fetch event details";
      throw new Error(errorMessage);
    }
  },

  getCosplayerByEventCharacterId: async (eventCharacterId) => {
    try {
      console.log(`Fetching cosplayer: eventCharacterId=${eventCharacterId}`);
      const response = await apiClient.get(
        `/api/Account/GetAccountByEventCharacterId/${eventCharacterId}`
      );
      console.log("GetCosplayerByEventCharacterId response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching cosplayer ${eventCharacterId}:`,
        error.response?.data || error
      );
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to fetch cosplayer details";
      throw new Error(errorMessage);
    }
  },

  addEvent: async (eventJson, imageFiles) => {
    try {
      console.log("Adding new event with eventJson:", eventJson);
      console.log("Image files:", imageFiles);

      // Tạo FormData chỉ để gửi ImageUrl
      const formData = new FormData();
      imageFiles.forEach((file, index) => {
        if (file) {
          formData.append("ImageUrl", file);
        }
      });

      // Log nội dung FormData để debug
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      // Gửi eventJson qua query string
      const response = await apiClient.post(
        `/api/Event/AddEvent?eventJson=${encodeURIComponent(eventJson)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("AddEvent response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding event:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to add event";
      throw new Error(errorMessage);
    }
  },

  getAllCharacters: async () => {
    try {
      console.log("Fetching all characters...");
      const response = await apiClient.get("/api/Character/all");
      console.log("GetAllCharacters response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching characters:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to fetch characters";
      throw new Error(errorMessage);
    }
  },

  getAvailableCosplayers: async (characterId, startDate, endDate) => {
    try {
      console.log(`Fetching available cosplayers for characterId=${characterId}`);
      const payload = {
        characterId,
        dates: [{ startDate, endDate }],
        accountId: null,
      };
      console.log("GetAvailableCosplayers payload:", JSON.stringify(payload, null, 2));
      const response = await apiClient.post("/api/Account/characterId", payload);
      console.log("GetAvailableCosplayers response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching cosplayers:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to fetch cosplayers";
      throw new Error(errorMessage);
    }
  },

  getAllActivities: async () => {
    try {
      console.log("Fetching all activities...");
      const response = await apiClient.get("/api/Activity");
      console.log("GetAllActivities response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching activities:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to fetch activities";
      throw new Error(errorMessage);
    }
  },
};

export default ManageAllFestivalsService;