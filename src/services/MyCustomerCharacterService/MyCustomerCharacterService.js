import { apiClient, formDataClient } from "../../../api/apiClient.js";

const RequestCustomerCharacterService = {
  getRequestCustomerCharacterByAccountId: async (id) => {
    try {
      const response = await apiClient.get(
        `/api/CustomerCharacter?accountId=${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
export default RequestCustomerCharacterService;
