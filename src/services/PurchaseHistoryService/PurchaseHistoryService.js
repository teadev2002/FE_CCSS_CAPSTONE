import { apiClient } from "../../api/apiClient.js";

const PurchaseHistoryService = {
  getAllTicketsByAccountId: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/TicketAccount/GetAllByAccountId/${accountId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching ticket purchase history:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch ticket purchase history"
      );
    }
  },

  getAllOrdersByAccountId: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/Order/GetAllOrdersByAccountId/${accountId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order purchase history:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch order purchase history"
      );
    }
  },
};

export default PurchaseHistoryService;