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
  getProfileById: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/Account/${accountId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get profile");
    }
  },
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
};

export default ProfileService;
