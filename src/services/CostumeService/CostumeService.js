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
      // Tạo FormData để gửi dữ liệu multipart/form-data
      const data = new FormData();

      // Thêm các trường thông tin vào FormData
      data.append("CategoryId", formData.categoryId);
      data.append("Name", formData.name);
      data.append("Description", formData.description);
      data.append("MaxHeight", formData.maxHeight);
      data.append("MaxWeight", formData.maxWeight);
      data.append("MinHeight", formData.minHeight);
      data.append("MinWeight", formData.minWeight);
      data.append("CreateBy", formData.createBy);

      // Thêm danh sách hình ảnh (CustomerCharacterImages)
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image, index) => {
          data.append(`CustomerCharacterImages`, image);
        });
      }

      // Gửi yêu cầu POST với FormData
      const response = await apiClient.post("/api/CustomerCharacter", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating customer character:", error);
      throw new Error(
        error.response?.data?.message || "Error creating customer character"
      );
    }
  },
};
export default CostumeService;
