// Nhập apiClient để thực hiện các yêu cầu HTTP
import { apiClient } from "../../api/apiClient.js";

const ProductDeliveryService = {
  // Lấy danh sách tỉnh/thành phố
  getProvinces: async () => {
    try {
      const response = await apiClient.get("/api/Delivery/provinces");
      return response.data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching provinces"
      );
    }
  },

  // Lấy danh sách quận/huyện dựa trên provinceId
  getDistricts: async (provinceId) => {
    try {
      const response = await apiClient.post(`/api/Delivery/districts/${provinceId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching districts"
      );
    }
  },

  // Lấy danh sách phường/xã dựa trên districtId
  getWards: async (districtId) => {
    try {
      const response = await apiClient.post(`/api/Delivery/wards/${districtId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching wards"
      );
    }
  },

  // Tính phí giao hàng dựa trên orderId
  calculateDeliveryFee: async (orderId) => {
    try {
      // Log URL để debug
      const url = `/api/Delivery/caculate-fee-delivery/${orderId}`;
      console.log("Calling calculate delivery fee API:", url);
      const response = await apiClient.post(url);
      console.log("Delivery fee response:", response.data);
      return response.data; // Giả sử trả về số, ví dụ: 22000
    } catch (error) {
      // Log chi tiết lỗi để debug
      console.error("Calculate delivery fee error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(
        error.response?.data?.message || "Error calculating delivery fee"
      );
    }
  },
};

export default ProductDeliveryService;