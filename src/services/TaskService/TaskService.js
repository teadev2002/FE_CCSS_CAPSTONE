import { apiClient } from "../../api/apiClient.js"; // Giả sử file cấu hình axios nằm cùng thư mục hoặc điều chỉnh đường dẫn phù hợp

const TaskService = {
  getAllTaskByAccountId: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/Task/accountId/${accountId}`);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error(
        "Error fetching tasks:",
        error.response ? error.response.data : error.message
      );
      throw error; // Ném lỗi để component gọi hàm này xử lý
    }
  },
};

export default TaskService;
