import { apiClient, formDataClient } from "../../api/apiClient.js";

const RequestCustomerCharacterService = {
  getRequestCustomerCharacterByAccountId: async (id) => {
    try {
      const response = await apiClient.get(
        `/api/CustomerCharacter?accountId=${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  UpdateCustomerCharacter: async (data) => {
    try {
      const formData = new FormData();

      // Thêm các trường đơn giản vào FormData
      formData.append("accountId", data.accountId || "");
      formData.append(
        "customerCharacterRequestId",
        data.customerCharacterRequestId || ""
      );
      formData.append("name", data.name || "");
      formData.append("description", data.description || "");
      formData.append("categoryId", data.categoryId || "");
      formData.append("minHeight", data.minHeight || 0);
      formData.append("maxHeight", data.maxHeight || 0);
      formData.append("minWeight", data.minWeight || 0);
      formData.append("maxWeight", data.maxWeight || 0);

      // Thêm mảng images (các file ảnh mới)
      if (data.images && Array.isArray(data.images)) {
        data.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append(`images[${index}]`, image);
          }
        });
      }

      const response = await formDataClient.put(
        `/api/CustomerCharacter/update-customer-character`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAllCategory: async () => {
    try {
      const response = await apiClient.get(`/api/Category`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAccountCustomerCharacter: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/Account/${accountId}`); // Đường dẫn API giả định
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default RequestCustomerCharacterService;
