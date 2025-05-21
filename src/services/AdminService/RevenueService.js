import { apiClient } from "../../api/apiClient";

const RevenueService = {
  async getRevenue(filterType, revenueSource) {
    try {
      const response = await apiClient.get("/api/DashBoard/revenue", {
        params: {
          filterType,
          revenueSource,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || error.message || "Failed to fetch revenue data"
      );
    }
  },

  async getRevenueChart(filterType, revenueSource) {
    try {
      const response = await apiClient.get("/api/DashBoard/revenueChart", {
        params: {
          filterType,
          revenueSource,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || error.message || "Failed to fetch revenue chart data"
      );
    }
  },

  // Thêm hàm gọi API GET /api/Payment
  async getPayments() {
    try {
      const response = await apiClient.get("/api/Payment");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || error.message || "Failed to fetch payment data"
      );
    }
  },
};

export default RevenueService;