import { apiClient } from "../../api/apiClient.js";

const UserAnalyticsService = {
  // Lấy danh sách tài khoản theo vai trò
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

  // Lấy top 5 cosplayer theo điểm
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

  // Lấy tổng số hợp đồng theo dịch vụ
  getContractsByService: async (serviceId) => {
    try {
      console.log(`Fetching contracts for serviceId=${serviceId}...`);
      const response = await apiClient.get("/api/DashBoard/GetAllContractFilterByService", {
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

  // Lấy tổng số đơn hàng
  getAllOrders: async () => {
    try {
      console.log(`Fetching all orders...`);
      const response = await apiClient.get("/api/DashBoard/GetAllOrder");
      console.log(`GetAllOrders response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders:`, error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to fetch orders";
      throw new Error(errorMessage);
    }
  },

  // Lấy tổng số thanh toán vé
  getAllTicketPayments: async () => {
    try {
      console.log(`Fetching all ticket payments...`);
      const response = await apiClient.get("/api/DashBoard/GetAllPaymentForTicket");
      console.log(`GetAllTicketPayments response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticket payments:`, error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to fetch ticket payments";
      throw new Error(errorMessage);
    }
  },

  // Lấy hợp đồng theo dịch vụ và thời gian
  getContractsByServiceAndDate: async (serviceId, dateFilterType) => {
    try {
      console.log(`Fetching contracts for serviceId=${serviceId}, dateFilterType=${dateFilterType}...`);
      const response = await apiClient.get("/api/DashBoard/GetAllContractFilterServiceAndDateTime", {
        params: { serviceId, dateFilterType },
      });
      console.log(`GetContractsByServiceAndDate (${serviceId}, ${dateFilterType}) response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contracts for serviceId=${serviceId}, dateFilterType=${dateFilterType}:`, error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        `Failed to fetch contracts for service ${serviceId} and date filter ${dateFilterType}`;
      throw new Error(errorMessage);
    }
  },

  // Lấy đơn hàng theo thời gian
  getOrdersByDate: async (dateFilterType) => {
    try {
      console.log(`Fetching orders for dateFilterType=${dateFilterType}...`);
      const response = await apiClient.get("/api/DashBoard/GetAllOrderFilterDateTime", {
        params: { dateFilterType },
      });
      console.log(`GetOrdersByDate (${dateFilterType}) response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders for dateFilterType=${dateFilterType}:`, error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        `Failed to fetch orders for date filter ${dateFilterType}`;
      throw new Error(errorMessage);
    }
  },

  // Lấy thanh toán vé theo thời gian
  getTicketPaymentsByDate: async (dateFilterType) => {
    try {
      console.log(`Fetching ticket payments for dateFilterType=${dateFilterType}...`);
      const response = await apiClient.get("/api/DashBoard/GetAllTicketAccountFilterDateTime", {
        params: { dateFilterType },
      });
      console.log(`GetTicketPaymentsByDate (${dateFilterType}) response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticket payments for dateFilterType=${dateFilterType}:`, error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        `Failed to fetch ticket payments for date filter ${dateFilterType}`;
      throw new Error(errorMessage);
    }
  },

  // Lấy top 5 tài khoản
  getTopAccounts: async () => {
    try {
      console.log(`Fetching top 5 accounts...`);
      const response = await apiClient.get("/api/DashBoard/top-accounts");
      console.log(`GetTopAccounts response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching top 5 accounts:`, error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification ||
        error.response?.data?.message ||
        "Failed to fetch top 5 accounts";
      throw new Error(errorMessage);
    }
  },
};

export default UserAnalyticsService;