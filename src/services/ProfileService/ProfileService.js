// // import apiClient from "../../api/apiClient.js";
// import { apiClient, formDataClient } from "../../api/apiClient.js";

// const ProfileService = {
//   getProfileById: async (accountId) => {
//     try {
//       const response = await apiClient.get(`/api/Account/${accountId}`);
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || "Lỗi khi lấy profile");
//     }
//   },
// };
// export default ProfileService;

//----------------------------------------------------------------------------------------//

import { apiClient, formDataClient } from "../../api/apiClient.js";

const ProfileService = {
  // Lấy thông tin hồ sơ theo accountId
  getProfileById: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/Account/${accountId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get profile");
    }
  },

  // Lấy danh sách tài khoản theo roleId
  getAccountsByRoleId: async (roleId) => {
    try {
      const response = await apiClient.get(`/api/Account/roleId/${roleId}`);
      return Array.isArray(response.data) ? response.data : [response.data]; // Đảm bảo trả về mảng
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get accounts by role"
      );
    }
  },

  // Cập nhật thông tin hồ sơ
  updateProfile: async (accountId, data) => {
    try {
      const formData = new FormData();
      formData.append("accountId", data.accountId || "");
      formData.append("name", data.name || "");
      formData.append("email", data.email || "");
      formData.append("password", data.password || "");
      formData.append("description", data.description || "");

      // Convert birthday to yyyy-MM-dd format if it exists
      if (data.birthday) {
        const date = new Date(data.birthday);
        const formattedDate = date.toISOString().split("T")[0]; // Converts to yyyy-MM-dd
        formData.append("birthday", formattedDate);
      } else {
        formData.append("birthday", "");
      }

      formData.append("phone", data.phone || "");
      formData.append("height", data.height || "");
      formData.append("weight", data.weight || "");

      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }

      if (data.images && Array.isArray(data.images)) {
        data.images.forEach((image, index) => {
          formData.append(`images`, image);
        });
      }

      const response = await formDataClient.put(`/api/Account`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  },

  // Lấy danh sách feedback theo cosplayerId
  getFeedbackByCosplayerId: async (cosplayerId) => {
    try {
      const response = await apiClient.get(`/api/Feedback/cosplayerId/${cosplayerId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get feedbacks"
      );
    }
  },
};

export default ProfileService;
