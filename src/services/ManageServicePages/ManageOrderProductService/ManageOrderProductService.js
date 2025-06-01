// import { apiClient } from "../../../api/apiClient.js";

// const ManageOrderProductService = {
//   getAllOrders: async () => {
//     try {
//       const response = await apiClient.get("/api/Order");
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching all orders:", error.response?.data || error.message);
//       throw error;
//     }
//   },

//   getAccountById: async (accountId) => {
//     if (!accountId) {
//       const error = new Error("Account ID is required");
//       console.error("Error fetching account by ID:", error.message);
//       throw error;
//     }
//     try {
//       const response = await apiClient.get(`/api/Account/${accountId}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error fetching account with ID ${accountId}:`, error.response?.data || error.message);
//       throw error;
//     }
//   },

//   getProductById: async (productId) => {
//     if (!productId) {
//       const error = new Error("Product ID is required");
//       console.error("Error fetching product by ID:", error.message);
//       throw error;
//     }
//     try {
//       const response = await apiClient.get(`/api/Product/${productId}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error fetching product with ID ${productId}:`, error.response?.data || error.message);
//       throw error;
//     }
//   },

//   updateShipStatus: async (orderId, shipStatus) => {
//     if (!orderId || shipStatus == null) {
//       const error = new Error("Order ID and ShipStatus are required");
//       console.error("Error updating ship status:", error.message);
//       throw error;
//     }
//     try {
//       const response = await apiClient.patch(`/api/Order/${orderId}/shipstatus?ShipStatus=${shipStatus}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error updating ship status for order ${orderId}:`, error.response?.data || error.message);
//       throw error;
//     }
//   },

//   // Thêm hàm gọi API tính phí giao hàng
//   calculateDeliveryFee: async (orderId) => {
//     if (!orderId) {
//       const error = new Error("Order ID is required");
//       console.error("Error fetching delivery fee:", error.message);
//       throw error;
//     }
//     try {
//       const response = await apiClient.post(`/api/Delivery/caculate-fee-delivery/${orderId}`);
//       return response.data; // Returns delivery fee (e.g., 22000)
//     } catch (error) {
//       console.error(`Error fetching delivery fee for order ${orderId}:`, error.response?.data || error.message);
//       throw error;
//     }
//   },
// };

// export default ManageOrderProductService;

//-------------------------------------------------------------------------------------------//

//sửa ngày 02/06/2025

import { apiClient } from "../../../api/apiClient.js";

const ManageOrderProductService = {
  getAllOrders: async () => {
    try {
      const response = await apiClient.get("/api/Order");
      return response.data;
    } catch (error) {
      console.error("Error fetching all orders:", error.response?.data || error.message);
      throw error;
    }
  },

  getAccountById: async (accountId) => {
    if (!accountId) {
      const error = new Error("Account ID is required");
      console.error("Error fetching account by ID:", error.message);
      throw error;
    }
    try {
      const response = await apiClient.get(`/api/Account/${accountId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching account with ID ${accountId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  getProductById: async (productId) => {
    if (!productId) {
      const error = new Error("Product ID is required");
      console.error("Error fetching product by ID:", error.message);
      throw error;
    }
    try {
      const response = await apiClient.get(`/api/Product/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  updateShipStatus: async (orderId, shipStatus, cancelReason = null) => {
    if (!orderId || shipStatus == null) {
      const error = new Error("Order ID and ShipStatus are required");
      console.error("Error updating ship status:", error.message);
      throw error;
    }
    try {
      let url = `/api/Order/${orderId}/shipstatus?ShipStatus=${shipStatus}`;
      if (shipStatus === 4 && cancelReason) {
        url += `&CancelReason=${encodeURIComponent(cancelReason)}`;
      }
      const response = await apiClient.patch(url);
      return response.data;
    } catch (error) {
      console.error(`Error updating ship status for order ${orderId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  calculateDeliveryFee: async (orderId) => {
    if (!orderId) {
      const error = new Error("Order ID is required");
      console.error("Error fetching delivery fee:", error.message);
      throw error;
    }
    try {
      const response = await apiClient.post(`/api/Delivery/caculate-fee-delivery/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching delivery fee for order ${orderId}:`, error.response?.data || error.message);
      throw error;
    }
  },
};

export default ManageOrderProductService;