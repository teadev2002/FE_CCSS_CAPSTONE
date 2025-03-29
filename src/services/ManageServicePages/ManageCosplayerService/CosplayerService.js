import { apiClient } from "../../../api/apiClient.js";

const CosplayerService = {
  getAllCosplayersByRoleId: async () => {
    try {
      const response = await apiClient.get("/api/Account/roleId/R004");
      // Đảm bảo dữ liệu trả về là mảng và có thuộc tính images
      return response.data.map((cosplayer) => ({
        ...cosplayer,
        images: cosplayer.images || [], // Nếu không có images, trả về mảng rỗng
      }));
    } catch (error) {
      console.error("Error fetching cosplayers by roleId:", error);
      throw error;
    }
  },
};

export default CosplayerService;
