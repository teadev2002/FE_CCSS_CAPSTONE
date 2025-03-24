// import apiClient from "../../../api/apiClient.js";
import { apiClient, formDataClient } from "../../../api/apiClient.js";

const CharacterService = {
  // Lấy tất cả characters
  getAllCharacters: async () => {
    try {
      const response = await apiClient.get("/Character");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Lỗi khi lấy danh sách characters"
      );
    }
  },

  // Lấy character theo ID
  getCharacterById: async (characterId) => {
    try {
      const response = await apiClient.get(
        `/Character?characterId=${characterId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Lỗi khi lấy thông tin character"
      );
    }
  },

  // Tạo mới character
  createCharacter: async (characterData) => {
    try {
      const response = await apiClient.post("/Character", characterData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lỗi khi tạo character");
    }
  },

  // Cập nhật character
  updateCharacter: async (characterId, characterData) => {
    try {
      const response = await apiClient.put(
        `/Character/${characterId}`,
        characterData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Lỗi khi cập nhật character"
      );
    }
  },

  // Xóa character
  deleteCharacter: async (characterId) => {
    try {
      await apiClient.delete(`/Character/${characterId}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lỗi khi xóa character");
    }
  },
};

export default CharacterService;

// import { apiClient, formDataClient } from "../../../api/apiClient.js";

// const CharacterService = {
//   // Lấy tất cả characters
//   getAllCharacters: async () => {
//     try {
//       const response = await apiClient.get("/api/Character");
//       return response.data;
//     } catch (error) {
//       throw new Error(
//         error.response?.data?.message || "Lỗi khi lấy danh sách characters"
//       );
//     }
//   },

//   // Lấy character theo ID
//   getCharacterById: async (characterId) => {
//     try {
//       const response = await apiClient.get(`/api/Character?id=${characterId}`);
//       return response.data;
//     } catch (error) {
//       throw new Error(
//         error.response?.data?.message || "Lỗi khi lấy thông tin character"
//       );
//     }
//   },

//   // Tạo mới character
//   createCharacter: async (characterData) => {
//     try {
//       const formData = new FormData();
//       formData.append("categoryId", characterData.categoryId || "");
//       formData.append("characterName", characterData.characterName || "");
//       formData.append("description", characterData.description || "");
//       formData.append("price", characterData.price || 0);
//       formData.append("isActive", characterData.isActive ? "true" : "false");
//       formData.append("maxHeight", characterData.maxHeight || 0);
//       formData.append("maxWeight", characterData.maxWeight || 0);
//       formData.append("minHeight", characterData.minHeight || 0);
//       formData.append("minWeight", characterData.minWeight || 0);
//       formData.append("quantity", characterData.quantity || 0);
//       formData.append("createDate", characterData.createDate || "");
//       formData.append("updateDate", characterData.updateDate || "");

//       // Xử lý images (nếu backend hỗ trợ upload file, bạn có thể gửi file thay vì URL)
//       if (characterData.images && Array.isArray(characterData.images)) {
//         characterData.images.forEach((image, index) => {
//           formData.append(`images[${index}].imageId`, image.imageId || "");
//           formData.append(`images[${index}].urlImage`, image.urlImage || "");
//         });
//       }

//       const response = await formDataClient.post("/api/Character", formData);
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || "Lỗi khi tạo character");
//     }
//   },

//   // Cập nhật character
//   updateCharacter: async (characterId, characterData) => {
//     try {
//       const formData = new FormData();
//       formData.append("categoryId", characterData.categoryId || "");
//       formData.append("characterName", characterData.characterName || "");
//       formData.append("description", characterData.description || "");
//       formData.append("price", characterData.price || 0);
//       formData.append("isActive", characterData.isActive ? "true" : "false");
//       formData.append("maxHeight", characterData.maxHeight || 0);
//       formData.append("maxWeight", characterData.maxWeight || 0);
//       formData.append("minHeight", characterData.minHeight || 0);
//       formData.append("minWeight", characterData.minWeight || 0);
//       formData.append("quantity", characterData.quantity || 0);
//       formData.append("createDate", characterData.createDate || "");
//       formData.append("updateDate", characterData.updateDate || "");

//       // Xử lý images
//       if (characterData.images && Array.isArray(characterData.images)) {
//         characterData.images.forEach((image, index) => {
//           formData.append(`images[${index}].imageId`, image.imageId || "");
//           formData.append(`images[${index}].urlImage`, image.urlImage || "");
//         });
//       }

//       const response = await formDataClient.put(
//         `/api/Character?id=${characterId}`,
//         formData
//       );
//       return response.data;
//     } catch (error) {
//       throw new Error(
//         error.response?.data?.message || "Lỗi khi cập nhật character"
//       );
//     }
//   },

//   // Xóa character
//   deleteCharacter: async (characterId) => {
//     try {
//       await apiClient.delete(`/api/Character/${characterId}`);
//     } catch (error) {
//       throw new Error(error.response?.data?.message || "Lỗi khi xóa character");
//     }
//   },
// };

// export default CharacterService;
