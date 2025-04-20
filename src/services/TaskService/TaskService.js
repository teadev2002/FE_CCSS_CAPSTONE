// import { apiClient } from "../../api/apiClient.js";

// // Tạo một class CustomError để dễ xử lý lỗi
// class CustomError extends Error {
//   constructor(message, details = null) {
//     super(message);
//     this.name = "CustomError";
//     this.details = details; // Lưu thông tin chi tiết từ backend (nếu có)
//   }
// }

// const TaskService = {
//   getAllTaskByAccountId: async (accountId) => {
//     try {
//       const response = await apiClient.get(`/api/Task/accountId/${accountId}`);
//       return response.data; // Trả về dữ liệu từ API
//     } catch (error) {
//       // Log lỗi để debug
//       console.error(
//         "Error fetching tasks by account ID:",
//         error.response ? error.response.data : error.message
//       );

//       // Trích xuất thông báo lỗi từ backend
//       const errorMessage =
//         error.response?.data?.message || "Failed to fetch tasks";
//       const errorDetails = error.response?.data?.details || null;

//       // Ném lỗi tùy chỉnh với thông báo từ backend
//       throw new CustomError(errorMessage, errorDetails);
//     }
//   },

//   getTaskById: async (taskId) => {
//     try {
//       const response = await apiClient.get(`/api/Task/taskId/${taskId}`);
//       return response.data; // Trả về dữ liệu từ API
//     } catch (error) {
//       // Log lỗi để debug
//       console.error(
//         "Error fetching task by ID:",
//         error.response ? error.response.data : error.message
//       );

//       // Trích xuất thông báo lỗi từ backend
//       const errorMessage =
//         error.response?.data?.message ||
//         `Failed to fetch task with ID ${taskId}`;
//       const errorDetails = error.response?.data?.details || null;

//       // Ném lỗi tùy chỉnh với thông báo từ backend
//       throw new CustomError(errorMessage, errorDetails);
//     }
//   },

//   getProfileById: async (accountId) => {
//     try {
//       const response = await apiClient.get(`/api/Account/${accountId}`);
//       return response.data; // Trả về dữ liệu từ API
//     } catch (error) {
//       // Log lỗi để debug
//       console.error(
//         "Error fetching profile by ID:",
//         error.response ? error.response.data : error.message
//       );

//       // Trích xuất thông báo lỗi từ backend
//       const errorMessage =
//         error.response?.data?.message ||
//         `Failed to fetch profile with ID ${accountId}`;
//       const errorDetails = error.response?.data?.details || null;

//       // Ném lỗi tùy chỉnh với thông báo từ backend
//       throw new CustomError(errorMessage, errorDetails);
//     }
//   },
//   updateTaskStatus: async (taskId, status, accountId) => {
//     try {
//       const response = await apiClient.put(
//         `/api/Task?taskId=${taskId}&taskStatus=${status}&accountId=${accountId}`,
//         status
//       );
//       return response.data; // Trả về dữ liệu từ API
//     } catch (error) {
//       // Log lỗi để debug
//       console.error(
//         "Error updating task status:",
//         error.response ? error.response.data : error.message
//       );

//       // Trích xuất thông báo lỗi từ backend
//       const errorMessage =
//         error.response?.data?.message || "Failed to update task status";
//       const errorDetails = error.response?.data?.details || null;

//       // Ném lỗi tùy chỉnh với thông báo từ backend
//       throw new CustomError(errorMessage, errorDetails);
//     }
//   },
// };

// export default TaskService;

/////////////// them request characteristic ///////////////
import { apiClient } from "../../api/apiClient.js";

// Tạo một class CustomError để dễ xử lý lỗi
class CustomError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = "CustomError";
    this.details = details; // Lưu thông tin chi tiết từ backend (nếu có)
  }
}

const TaskService = {
  getAllTaskByAccountId: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/Task/accountId/${accountId}`);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      // Log lỗi để debug
      console.error(
        "Error fetching tasks by account ID:",
        error.response ? error.response.data : error.message
      );

      // Trích xuất thông báo lỗi từ backend
      const errorMessage =
        error.response?.data?.message || "Failed to fetch tasks";
      const errorDetails = error.response?.data?.details || null;

      // Ném lỗi tùy chỉnh với thông báo từ backend
      throw new CustomError(errorMessage, errorDetails);
    }
  },

  getTaskById: async (taskId) => {
    try {
      const response = await apiClient.get(`/api/Task/taskId/${taskId}`);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      // Log lỗi để debug
      console.error(
        "Error fetching task by ID:",
        error.response ? error.response.data : error.message
      );

      // Trích xuất thông báo lỗi từ backend
      const errorMessage =
        error.response?.data?.message ||
        `Failed to fetch task with ID ${taskId}`;
      const errorDetails = error.response?.data?.details || null;

      // Ném lỗi tùy chỉnh với thông báo từ backend
      throw new CustomError(errorMessage, errorDetails);
    }
  },

  getProfileById: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/Account/${accountId}`);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      // Log lỗi để debug
      console.error(
        "Error fetching profile by ID:",
        error.response ? error.response.data : error.message
      );

      // Trích xuất thông báo lỗi từ backend
      const errorMessage =
        error.response?.data?.message ||
        `Failed to fetch profile with ID ${accountId}`;
      const errorDetails = error.response?.data?.details || null;

      // Ném lỗi tùy chỉnh với thông báo từ backend
      throw new CustomError(errorMessage, errorDetails);
    }
  },

  updateTaskStatus: async (taskId, status, accountId) => {
    try {
      const response = await apiClient.put(
        `/api/Task?taskId=${taskId}&taskStatus=${status}&accountId=${accountId}`,
        status
      );
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      // Log lỗi để debug
      console.error(
        "Error updating task status:",
        error.response ? error.response.data : error.message
      );

      // Trích xuất thông báo lỗi từ backend
      const errorMessage =
        error.response?.data?.message || "Failed to update task status";
      const errorDetails = error.response?.data?.details || null;

      // Ném lỗi tùy chỉnh với thông báo từ backend
      throw new CustomError(errorMessage, errorDetails);
    }
  },

  // Hàm mới 1: Lấy chi tiết Request Character theo requestCharacterId
  getRequestCharacterById: async (requestCharacterId) => {
    try {
      const response = await apiClient.get(
        `/api/RequestCharacter/id?requestCharacterId=${requestCharacterId}`
      );
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      // Log lỗi để debug
      console.error(
        "Error fetching request character by ID:",
        error.response ? error.response.data : error.message
      );

      // Trích xuất thông báo lỗi từ backend
      const errorMessage =
        error.response?.data?.message ||
        `Failed to fetch request character with ID ${requestCharacterId}`;
      const errorDetails = error.response?.data?.details || null;

      // Ném lỗi tùy chỉnh với thông báo từ backend
      throw new CustomError(errorMessage, errorDetails);
    }
  },

  // Hàm mới 2: Lấy danh sách Request Characters theo cosplayerId
  getRequestCharactersByCosplayer: async (cosplayerId) => {
    try {
      const response = await apiClient.get(
        `/api/RequestCharacter/GetRequestCharacterByCosplayer?cosplayerId=${cosplayerId}`
      );
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      // Log lỗi để debug
      console.error(
        "Error fetching request characters by cosplayer ID:",
        error.response ? error.response.data : error.message
      );

      // Trích xuất thông báo lỗi từ backend
      const errorMessage =
        error.response?.data?.message ||
        `Failed to fetch request characters for cosplayer ID ${cosplayerId}`;
      const errorDetails = error.response?.data?.details || null;

      // Ném lỗi tùy chỉnh với thông báo từ backend
      throw new CustomError(errorMessage, errorDetails);
    }
  },

  updateRequestCharacterStatus: async (requestCharacterId, status) => {
    try {
      // Kiểm tra status có hợp lệ với enum RequestCharacterStatus
      const validStatuses = [0, 1, 2, 3, 4]; // None, Pending, Accept, Busy, Cancel
      if (!validStatuses.includes(status)) {
        throw new CustomError(
          `Invalid status value: ${status}. Must be 0 (None), 1 (Pending), 2 (Accept), 3 (Busy), or 4 (Cancel).`
        );
      }

      const response = await apiClient.put(
        `/api/RequestCharacter?requestCharacterId=${requestCharacterId}&status=${status}`
      );
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      // Log lỗi để debug
      console.error(
        "Error updating request character status:",
        error.response ? error.response.data : error.message
      );

      // Trích xuất thông báo lỗi từ backend
      const errorMessage =
        error.response?.data?.message ||
        `Failed to update request character status for ID ${requestCharacterId}`;
      const errorDetails = error.response?.data?.details || null;

      // Ném lỗi tùy chỉnh với thông báo từ backend
      throw new CustomError(errorMessage, errorDetails);
    }
  },
};

export default TaskService;
