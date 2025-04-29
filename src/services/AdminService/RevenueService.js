// src/services/AdminService/RevenueService.js
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
};

export default RevenueService;