import { apiClient } from "../../../api/apiClient.js";

// Service xử lý các thao tác với đơn hàng và tài khoản
const ManageOrderProductService = {
    // Lấy tất cả đơn hàng
    getAllOrders: async () => {
        try {
            const response = await apiClient.get("/api/Order");
            return response.data;
        } catch (error) {
            console.error(
                "Error fetching all orders:",
                error.response?.data || error.message
            );
            throw error;
        }
    },

    // Lấy thông tin tài khoản theo accountId
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
            console.error(
                `Error fetching account with ID ${accountId}:`,
                error.response?.data || error.message
            );
            throw error;
        }
    },

    // Lấy thông tin sản phẩm theo productId
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
            console.error(
                `Error fetching product with ID ${productId}:`,
                error.response?.data || error.message
            );
            throw error;
        }
    },
};

export default ManageOrderProductService;