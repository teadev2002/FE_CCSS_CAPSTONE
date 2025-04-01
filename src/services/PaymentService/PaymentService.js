import { apiClient } from "../../api/apiClient.js";

const PaymentService = {
  createMomoPayment: async (paymentData) => {
    try {
      console.log("Creating MoMo payment with data:", paymentData);
      const response = await apiClient.post("/api/Momo", paymentData);
      console.log("CreateMomoPayment response:", response.data);
      return response.data; // Trả về URL thanh toán từ MoMo
    } catch (error) {
      console.error("Error creating MoMo payment:", error.response?.data || error);
      throw new Error(
        error.response?.data?.message || "Error creating MoMo payment"
      );
    }
  },
};

export default PaymentService;