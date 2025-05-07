// Import apiClient để thực hiện các yêu cầu HTTP
import { apiClient } from "../../api/apiClient.js";

const CharacterService = {
  // Hàm lấy tất cả nhân vật từ API
  getAllCharacters: async () => {
    try {
      const response = await apiClient.get("/api/Character/all");
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      // Ném lỗi với thông báo cụ thể nếu API thất bại
      throw new Error(
        error.response?.data?.message || "Lỗi khi lấy danh sách nhân vật"
      );
    }
  },
  getCharacterById: async (characterId) => {
    try {
      const response = await apiClient.get(`/api/Character/${characterId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Lỗi khi lấy thông tin character"
      );
    }
  },
};

export default CharacterService;
