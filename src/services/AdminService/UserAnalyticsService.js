// UserAnalyticsService.js
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
};

export default UserAnalyticsService;