// còn lỗi update
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
      const response = await apiClient.get(`/Character?id=${characterId}`);
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
      const formData = new FormData();
      formData.append("categoryId", characterData.categoryId || "");
      formData.append("characterName", characterData.characterName || "");
      formData.append("description", characterData.description || "");
      formData.append(
        "price",
        characterData.price ? characterData.price.toString() : "0"
      );
      formData.append(
        "quantity",
        characterData.quantity ? characterData.quantity.toString() : "0"
      );
      formData.append(
        "maxHeight",
        characterData.maxHeight ? characterData.maxHeight.toString() : "0"
      );
      formData.append(
        "maxWeight",
        characterData.maxWeight ? characterData.maxWeight.toString() : "0"
      );
      formData.append(
        "minHeight",
        characterData.minHeight ? characterData.minHeight.toString() : "0"
      );
      formData.append(
        "minWeight",
        characterData.minWeight ? characterData.minWeight.toString() : "0"
      );

      if (characterData.imageFiles && Array.isArray(characterData.imageFiles)) {
        characterData.imageFiles.forEach((file) => {
          formData.append("imageFiles", file);
        });
      }

      // Log dữ liệu gửi đi
      console.log("Dữ liệu gửi đi:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await formDataClient.post("/Character", formData);
      return response.data;
    } catch (error) {
      console.log("Chi tiết lỗi:", error.response?.data);
      throw new Error(error.response?.data?.message || "Lỗi khi tạo character");
    }
  },

  // Cập nhật character
  updateCharacter: async (characterId, characterData) => {
    try {
      const formData = new FormData();
      formData.append("categoryId", characterData.categoryId || "");
      formData.append("characterName", characterData.characterName || "");
      formData.append("description", characterData.description || "");
      formData.append(
        "price",
        characterData.price ? characterData.price.toString() : "0"
      );
      formData.append(
        "quantity",
        characterData.quantity ? characterData.quantity.toString() : "0"
      );
      formData.append(
        "maxHeight",
        characterData.maxHeight ? characterData.maxHeight.toString() : "0"
      );
      formData.append(
        "maxWeight",
        characterData.maxWeight ? characterData.maxWeight.toString() : "0"
      );
      formData.append(
        "minHeight",
        characterData.minHeight ? characterData.minHeight.toString() : "0"
      );
      formData.append(
        "minWeight",
        characterData.minWeight ? characterData.minWeight.toString() : "0"
      );

      if (characterData.imageFiles && Array.isArray(characterData.imageFiles)) {
        characterData.imageFiles.forEach((file) => {
          formData.append("imageFiles", file);
        });
      }

      // Log dữ liệu gửi đi
      console.log("Dữ liệu gửi đi:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await formDataClient.put(
        `/Character?id=${characterId}`,
        formData
      );
      return response.data;
    } catch (error) {
      console.log("Chi tiết lỗi:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Lỗi khi cập nhật character"
      );
    }
  },

  // Xóa character
  deleteCharacter: async (characterId) => {
    try {
      await apiClient.delete(`/Character/?id=${characterId}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lỗi khi xóa character");
    }
  },
};

export default CharacterService;
