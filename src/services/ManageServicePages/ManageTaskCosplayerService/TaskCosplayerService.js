import { apiClient, formDataClient } from "../../../api/apiClient.js";

const TaskCosplayerService = {
  getAllTask: async () => {
    try {
      const response = await apiClient.get("/api/Task");
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching all tasks:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  getInfoCosplayerByAccountId: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/Account/${accountId}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching cosplayer info by account ID:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  getContractByContractId: async (contractId) => {
    try {
      const response = await apiClient.get(
        `/api/Contract/contractId/${contractId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching contract by contract ID:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
export default TaskCosplayerService;
