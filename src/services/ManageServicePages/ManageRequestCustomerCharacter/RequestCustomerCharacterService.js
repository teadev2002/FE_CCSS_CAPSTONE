import { apiClient, formDataClient } from "../../../api/apiClient.js";

const RequestCustomerCharacterService = {
  getRequestCustomerCharacter: async () => {
    try {
      const response = await apiClient.get(`/api/CustomerCharacter`);
      return response.data;
    } catch (error) {
      console.error("Error fetching requests:", error);
      throw error;
    }
  },
  getRequestCustomerCharacterById: async (id) => {
    try {
      const response = await apiClient.get(
        `/api/CustomerCharacter?customerCharacterId=${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching requests:", error);
      throw error;
    }
  },
};

export default RequestCustomerCharacterService;
