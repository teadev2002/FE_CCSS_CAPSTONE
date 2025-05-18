// src/services/AdminService/AccountManagementService.js

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

  // Lấy chi tiết tài khoản theo accountId
  getAccountById: async (accountId) => {
    try {
      console.log(`Fetching account with accountId=${accountId}...`);
      const response = await apiClient.get(`/api/Account/${accountId}`);
      console.log(`GetAccountById (${accountId}) response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching account with accountId=${accountId}:`, error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        `Failed to fetch account ${accountId}`;
      throw new Error(errorMessage);
    }
  },

  // Cập nhật trạng thái tài khoản (block/unblock)
  updateAccountStatus: async (accountId, isActive) => {
    try {
      console.log(`Updating account status for accountId=${accountId}, isActive=${isActive}...`);
      const response = await apiClient.put("/api/Account/UpdateStatusAccount", null, {
        params: { accountId, IsActive: isActive },
      });
      console.log(`UpdateAccountStatus (${accountId}) response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating account status for accountId=${accountId}:`, error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        `Failed to update account status for ${accountId}`;
      throw new Error(errorMessage);
    }
  },
};

export default AccountManagementService;