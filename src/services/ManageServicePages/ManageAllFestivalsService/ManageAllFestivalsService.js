import { apiClient } from "../../../api/apiClient.js";
import dayjs from "dayjs";

const ManageAllFestivalsService = {

  // Lấy tất cả sự kiện với từ khóa tìm kiếm
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

  // Lấy thông tin sự kiện theo ID
  getEventById: async (eventId) => {
    try {
      console.log(`Fetching event with eventId=${eventId}`);
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

  // Lấy thông tin cosplayer theo ID nhân vật sự kiện
  getCosplayerByEventCharacterId: async (eventCharacterId) => {
    try {
      console.log(`Fetching cosplayer with eventCharacterId=${eventCharacterId}`);
      const response = await apiClient.get(
        `/api/Account/GetAccountByEventCharacterId/${eventCharacterId}`
      );
      console.log("GetCosplayerByEventCharacterId response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching cosplayer with eventCharacterId=${eventCharacterId}:`,
        error.response?.data || error
      );
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to fetch cosplayer details";
      throw new Error(errorMessage);
    }
  },

  // Thêm sự kiện mới
  addEvent: async (eventJson, imageFiles) => {
    try {
      console.log("Adding new event with eventJson:", eventJson);
      console.log("Image files:", imageFiles);

      const formData = new FormData();
      imageFiles.forEach((file, index) => {
        if (file) {
          formData.append("ImageUrl", file);
        }
      });

      for (let pair of formData.entries()) {
        console.log(`FormData entry - ${pair[0]}:`, pair[1]);
      }

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

  // Cập nhật sự kiện
  updateEvent: async (eventId, eventJson, imageFiles) => {
    try {
      console.log(`Updating event with eventId=${eventId}, eventJson:`, eventJson);
      const parsedJson = JSON.parse(eventJson);
      console.log("Images to delete:", parsedJson.imagesDeleted);
      console.log("EventCharacterRequest:", parsedJson.eventCharacterRequest);
      console.log("New image files:", imageFiles);

      const formData = new FormData();
      imageFiles.forEach((file, index) => {
        if (file) {
          formData.append("ImageUrl", file);
        }
      });

      const response = await apiClient.put(
        `/api/Event/UpdateEvent/${eventId}?eventJson=${encodeURIComponent(eventJson)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("UpdateEvent response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating event ${eventId}:`, error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to update event";
      throw new Error(errorMessage);
    }
  },

  // Lấy tất cả nhân vật theo khoảng thời gian
  getAllCharacters: async (startDate, endDate) => {
    try {
      console.log(`Fetching characters with startDate=${startDate}, endDate=${endDate}...`);
      const response = await apiClient.get("/api/Character/GetCharactersByDate", {
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      });
      console.log("GetCharactersByDate response:", response.data);
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

  // Lấy danh sách cosplayer rảnh theo nhân vật và khoảng thời gian
  getAvailableCosplayers: async (characterId, startDate, endDate) => {
    try {
      console.log(`Fetching available cosplayers for characterId=${characterId}`);
      const payload = {
        characterId,
        dates: [{
          startDate: dayjs(startDate).format('HH:mm DD/MM/YYYY'),
          endDate: dayjs(endDate).format('HH:mm DD/MM/YYYY'),
        }],
        accountId: null,
      };
      console.log("GetAvailableCosplayers payload:", JSON.stringify(payload, null, 2));
      const response = await apiClient.post("/api/Account/GetAccountByCharacterAndDateForCreateEvent", payload);
      console.log("GetAvailableCosplayers response:", response.data);
      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
      console.error("Error fetching cosplayers:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to fetch cosplayers";
      throw new Error(errorMessage);
    }
  },

  // Kiểm tra trạng thái booking của cosplayer trong khoảng thời gian
  checkCosplayerBooking: async (dates) => {
    try {
      console.log("Checking cosplayer bookings with dates:", JSON.stringify(dates, null, 2));
      const formattedDates = dates.map((date) => ({
        startDate: dayjs(date.startDate).format('HH:mm DD/MM/YYYY'),
        endDate: dayjs(date.endDate).format('HH:mm DD/MM/YYYY'),
      }));
      const response = await apiClient.post(
        "/api/RequestCharacter/GetAllRequestCharacterByListDate",
        formattedDates,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("CheckCosplayerBooking response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error checking cosplayer bookings:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to check cosplayer bookings";
      throw new Error(errorMessage);
    }
  },

  // Lấy tất cả hoạt động
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

  getLocations: async () => {
    try {
      console.log("Fetching locations...");
      const response = await apiClient.get("/api/Location");
      console.log("GetLocations response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching locations:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to fetch locations";
      throw new Error(errorMessage);
    }
  },
};

export default ManageAllFestivalsService;