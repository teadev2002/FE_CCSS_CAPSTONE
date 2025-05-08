import { apiClient } from "../../api/apiClient.js";

const UserAnalyticsService = {
  getAccountsByRole: async (roleId, searchTerm = "") => {
    try {
      console.log(`Fetching accounts for roleId=${roleId}, searchTerm=${searchTerm}...`);
      const response = await apiClient.get("/api/Account/GetAllAccount", {
        params: { roleId, searchterm: searchTerm },
      });
      console.log(`GetAccountsByRole (${roleId}) response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching accounts for roleId=${roleId}:`, error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        `Failed to fetch accounts for role ${roleId}`;
      throw new Error(errorMessage);
    }
  },

  // Thêm hàm gọi API Top 5 Cosplayers by Rating
  getTop5PopularCosplayers: async (filterType) => {
    try {
      console.log(`Fetching top 5 popular cosplayers with filterType=${filterType}...`);
      const response = await apiClient.get("/api/DashBoard/top5-Popular-cosplayer", {
        params: { filterType },
      });
      console.log(`Top 5 Popular Cosplayers response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching top 5 popular cosplayers:`, error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to fetch top 5 popular cosplayers";
      throw new Error(errorMessage);
    }
  },
};

export default UserAnalyticsService;