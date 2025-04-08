import { apiClient } from "../../api/apiClient.js";

const CostumeService = {
  getAllCostumes: async () => {
    try {
      const response = await apiClient.get("/api/Character");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching costumes"
      );
    }
  },
  getCategories: async () => {
    try {
      const response = await apiClient.get("/api/Category");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error(
        error.response?.data?.message || "Error fetching categories"
      );
    }
  },
  sendRequestHireCostume: async (requestData) => {
    try {
      const response = await apiClient.post("/api/Request", requestData);
      return response.data;
    } catch (error) {
      console.error("Error sending hire cosplayer request:", error);
      throw new Error(
        error.response?.data?.message || "Lỗi khi gửi yêu cầu thuê đồ"
      );
    }
  },
  createCustomerCharacter: async (formData) => {
    try {
      // 1. Tạo query parameters từ formData
      const queryParams = new URLSearchParams({
        CategoryId: formData.categoryId,
        Name: formData.name,
        Description: formData.description,
        MaxHeight: formData.maxHeight,
        MaxWeight: formData.maxWeight,
        MinHeight: formData.minHeight,
        MinWeight: formData.minWeight,
        CreateBy: formData.createBy,
      }).toString();

      // 2. Tạo FormData để gửi hình ảnh (nếu có)
      const data = new FormData();
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          data.append("CustomerCharacterImages", image);
        });
      }

      // 3. Gửi yêu cầu POST với query parameters và body (FormData)
      const response = await apiClient.post(
        `/api/CustomerCharacter?${queryParams}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 4. Kiểm tra kết quả trả về
      if (response.data === true) {
        return true; // API trả về TRUE, nghĩa là thành công
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error creating customer character:", error);
      throw new Error(
        error.response?.data?.message || "Error creating customer character"
      );
    }
  },
};
export default CostumeService;
