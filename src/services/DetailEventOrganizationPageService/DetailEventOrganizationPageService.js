import { apiClient, formDataClient } from "../../api/apiClient.js";

const DetailEventOrganizationPageService = {
  getAllPackages: async () => {
    try {
      const response = await apiClient.get("/api/Package");
      return response.data;
    } catch (error) {
      console.error("Error fetching all packages:", error);
      throw error;
    }
  },

  getPackageById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Package/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching package by ID:", error);
      throw error;
    }
  },
};

export default DetailEventOrganizationPageService;
