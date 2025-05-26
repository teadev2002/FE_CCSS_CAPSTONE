// import { apiClient } from "../../api/apiClient.js";

// const PurchaseHistoryService = {
//   getAllTicketsByAccountId: async (accountId) => {
//     try {
//       const response = await apiClient.get(`/api/TicketAccount/GetAllByAccountId/${accountId}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching ticket purchase history:", error);
//       throw new Error(
//         error.response?.data?.message || "Failed to fetch ticket purchase history"
//       );
//     }
//   },

//   getAllOrdersByAccountId: async (accountId) => {
//     try {
//       const response = await apiClient.get(`/api/Order/GetAllOrdersByAccountId/${accountId}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching order purchase history:", error);
//       throw new Error(
//         error.response?.data?.message || "Failed to fetch order purchase history"
//       );
//     }
//   },

//   getAllPaymentsByAccountIdAndPurpose: async (accountId, purpose) => {
//     try {
//       const response = await apiClient.get(
//         `/api/Payment/GetAllPaymentByAccountIdAndPurpose?accountId=${accountId}&purpose=${purpose}`
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching payment history:", error);
//       throw new Error(
//         error.response?.data?.message || "Failed to fetch payment history"
//       );
//     }
//   },

//   calculateDeliveryFee: async (orderId) => {
//     try {
//       const response = await apiClient.post(`/api/Delivery/caculate-fee-delivery/${orderId}`);
//       return response.data; // Returns delivery fee (e.g., 22000)
//     } catch (error) {
//       console.error(`Error fetching delivery fee for order ${orderId}:`, error);
//       throw new Error(
//         error.response?.data?.message || "Failed to fetch delivery fee"
//       );
//     }
//   },
// };

// export default PurchaseHistoryService;

//-----------------------------------------------------------------------------------------------------------//

//sửa vào 26/05/2025

import { apiClient } from "../../api/apiClient.js";

const PurchaseHistoryService = {
  // Lấy danh sách vé theo accountId
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

  // Lấy danh sách đơn hàng theo accountId
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

  // Lấy danh sách giao dịch theo accountId và purpose
  getAllPaymentsByAccountIdAndPurpose: async (accountId, purpose) => {
    try {
      const response = await apiClient.get(
        `/api/Payment/GetAllPaymentByAccountIdAndPurpose?accountId=${accountId}&purpose=${purpose}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching payment history:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch payment history"
      );
    }
  },

  // Tính phí giao hàng cho đơn hàng theo orderId
  calculateDeliveryFee: async (orderId) => {
    try {
      const response = await apiClient.post(`/api/Delivery/caculate-fee-delivery/${orderId}`);
      return response.data; // Trả về phí giao hàng (ví dụ: 22000)
    } catch (error) {
      console.error(`Error fetching delivery fee for order ${orderId}:`, error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch delivery fee"
      );
    }
  },
};

export default PurchaseHistoryService;