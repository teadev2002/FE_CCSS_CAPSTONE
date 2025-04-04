// src/services/FestivalService.js
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
};

export default FestivalService;