import apiClient from "../../api/apiClient.js";

const ProfileService = {
  getProfileById: async (accountId) => {
    try {
      const response = await apiClient.get(`/Account?accountId=${accountId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lỗi khi lấy profile");
    }
  },
};
export default ProfileService;
