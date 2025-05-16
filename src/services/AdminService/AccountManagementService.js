// src/services/AdminService/AccountManagementService.js

// Nhập client API để gọi các yêu cầu HTTP
import { apiClient } from "../../api/apiClient.js";

// Service cho trang quản lý tài khoản
const AccountManagementService = {
  // Lấy danh sách tài khoản theo vai trò (roleId) và từ khóa tìm kiếm
  getAccountsByRole: async (roleId, searchTerm = "") => {
    try {
      console.log(`Getting account with roleId=${roleId}, searchTerm=${searchTerm}...`);
      const response = await apiClient.get("/api/Account/GetAllAccount", {
        params: { roleId, searchterm: searchTerm },
      });
      console.log(`Result getAccountsByRole (${roleId}):`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Failed to get account with roleId=${roleId}:`, error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        `Failed to fetch accounts for role ${roleId}`;
      throw new Error(errorMessage);
    }
  },
};

// Xuất service
export default AccountManagementService;