import { apiClient, formDataClient } from "../../api/apiClient.js";

const CategoryService = {
  getAllCategories: async () => {
    try {
      const response = await apiClient.get("/Category");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Lỗi khi lấy danh sách Category"
      );
    }
  },
};
export default CategoryService;
