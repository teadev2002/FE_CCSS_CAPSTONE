import { apiClient } from "../../api/apiClient.js";

const navbarService = {
  getNotification: async (accountId) => {
    try {
      const response = await apiClient.get(
        `/api/Notification/accountId?accountId=${accountId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },
  seenNotification: async (Id) => {
    try {
      const response = await apiClient.put(
        `/api/Notification?notificationId=${Id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error marking notification as seen:", error);
      throw error;
    }
  },
};
export default navbarService;
