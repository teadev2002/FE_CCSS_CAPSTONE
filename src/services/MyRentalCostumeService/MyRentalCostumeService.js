import { apiClient, formDataClient } from "../../api/apiClient.js";

const MyRentalCostumeService = {
  GetAllRequestByAccountId: async (accountId) => {
    try {
      const response = await apiClient.get(
        `/api/Request/GetAllRequestByAccount?accountId=${accountId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching history:", error);
      throw error;
    }
  },
};
export default MyRentalCostumeService;
