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

  addEvent: async (eventData, imageFiles) => {
    try {
      console.log("Adding new event with data:", eventData);
      console.log("Image files:", imageFiles);

      // Tạo FormData để gửi dữ liệu dạng multipart/form-data
      const formData = new FormData();

      // Thêm các trường JSON vào FormData (trừ ImageUrl)
      formData.append("EventName", eventData.EventName);
      formData.append("Description", eventData.Description);
      formData.append("Location", eventData.Location);
      formData.append("StartDate", eventData.StartDate);
      formData.append("EndDate", eventData.EndDate);
      if (eventData.CreateBy) {
        formData.append("CreateBy", eventData.CreateBy);
      }
      formData.append("Ticket", JSON.stringify(eventData.Ticket));
      formData.append("EventCharacterRequest", JSON.stringify(eventData.EventCharacterRequest));
      formData.append("EventActivityRequests", JSON.stringify(eventData.EventActivityRequests));

      // Thêm các file hình ảnh vào FormData với key là "ImageUrl"
      imageFiles.forEach((file, index) => {
        if (file) {
          formData.append("ImageUrl", file); // API sẽ nhận file trực tiếp
        }
      });

      const response = await apiClient.post("/api/Event/AddEvent", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
};

export default ManageAllFestivalsService;