import { apiClient } from "../../api/apiClient.js";

const FestivalService = {
  getAllFestivals: async () => {
    try {
      console.log("Fetching all festivals");
      const response = await apiClient.get("/api/Event/GetAllEvents");
      console.log("GetAllFestivals response:", response.data);
      return response.data; // Giả sử API trả về mảng các sự kiện
    } catch (error) {
      console.error("Error fetching festivals:", error.response?.data || error);
      throw new Error(
        error.response?.data?.message || "Error fetching festivals"
      );
    }
  },

  getCosplayerByEventCharacterId: async (eventCharacterId) => {
    try {
      console.log(`Fetching cosplayer with eventCharacterId: ${eventCharacterId}`);
      const response = await apiClient.get(
        `/api/Account/GetAccountByEventCharacterId/${eventCharacterId}`
      );
      console.log("GetCosplayer response:", response.data);
      return response.data; // Trả về thông tin cosplayer
    } catch (error) {
      console.error("Error fetching cosplayer:", error.response?.data || error);
      throw new Error(
        error.response?.data?.message || "Error fetching cosplayer"
      );
    }
  },
};

export default FestivalService;