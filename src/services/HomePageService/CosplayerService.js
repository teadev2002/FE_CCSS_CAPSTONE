// CosplayerService.js
import { apiClient } from "../../api/apiClient.js";

const CosplayerService = {
  getAllCosplayers: async () => {
    try {
      console.log("Fetching cosplayers...");
      const response = await apiClient.get("/api/Account/roleId/R004");
      console.log("GetAllCosplayers response:", response.data);
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
};

export default CosplayerService;