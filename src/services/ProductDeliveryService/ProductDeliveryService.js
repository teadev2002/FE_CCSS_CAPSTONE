// src/services/ProductDeliveryService/ProductDeliveryService.js
import { apiClient } from "../../api/apiClient.js";

const ProductDeliveryService = {
  // Lấy danh sách tỉnh/thành phố
  getProvinces: async () => {
    try {
      const response = await apiClient.get("/api/Delivery/provinces");
      return response.data.data; // Trả về mảng provinces
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching provinces"
      );
    }
  },

  // Lấy danh sách quận/huyện theo provinceId
  getDistricts: async (provinceId) => {
    try {
      const response = await apiClient.post(`/api/Delivery/districts/${provinceId}`);
      return response.data.data; // Trả về mảng districts
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching districts"
      );
    }
  },

  // Lấy danh sách phường/xã theo districtId
  getWards: async (districtId) => {
    try {
      const response = await apiClient.post(`/api/Delivery/wards/${districtId}`);
      return response.data.data; // Trả về mảng wards
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching wards"
      );
    }
  },
};

export default ProductDeliveryService;