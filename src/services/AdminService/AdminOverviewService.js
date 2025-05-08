// src/services/AdminOverviewService.js
import { apiClient } from "../../api/apiClient.js";

const AdminOverviewService = {
  // Lấy số hợp đồng theo trạng thái
  getContractsByStatus: async (contractStatus) => {
    try {
      console.log(`Fetching contracts for status=${contractStatus}...`);
      const response = await apiClient.get("/api/DashBoard/GetAllContractFilterContractStatus", {
        params: { contractStatus },
      });
      console.log(`GetContractsByStatus (${contractStatus}) response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contracts for status=${contractStatus}:`, error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        `Failed to fetch contracts for status ${contractStatus}`;
      throw new Error(errorMessage);
    }
  },

  // Lấy số liệu hợp đồng hoàn thành và đang chờ
  getContractCompletionStats: async () => {
    try {
      console.log("Fetching contract completion stats...");
      const response = await apiClient.get("/api/DashBoard/GetAllContractCompleted");
      console.log("GetContractCompletionStats response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching contract completion stats:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to fetch contract completion stats";
      throw new Error(errorMessage);
    }
  },

  // Lấy số hợp đồng theo dịch vụ
  getContractsByService: async (serviceId) => {
    try {
      console.log(`Fetching contracts for serviceId=${serviceId}...`);
      const response = await apiClient.get("/api/DashBoard/GetAllContractFilterService", {
        params: { serviceId },
      });
      console.log(`GetContractsByService (${serviceId}) response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contracts for serviceId=${serviceId}:`, error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        `Failed to fetch contracts for service ${serviceId}`;
      throw new Error(errorMessage);
    }
  },
};

export default AdminOverviewService;