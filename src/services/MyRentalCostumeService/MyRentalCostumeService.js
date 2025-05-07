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
  GetRequestCostumeByRequestId: async (requestId) => {
    try {
      // Lấy thông tin request
      const requestResponse = await apiClient.get(`/api/Request/${requestId}`);
      const requestData = requestResponse.data;

      // Lấy thông tin character từ charactersListResponse
      const charactersList = requestData.charactersListResponse || [];
      const characterPromises = charactersList.map(async (char) => {
        const characterResponse = await apiClient.get(
          `/api/Character/${char.characterId}`
        );
        return {
          ...char,
          characterDetails: characterResponse.data, // Thêm thông tin chi tiết của character
        };
      });

      const enrichedCharacters = await Promise.all(characterPromises);

      // Trả về dữ liệu hợp nhất
      return {
        ...requestData,
        charactersListResponse: enrichedCharacters,
      };
    } catch (error) {
      console.error("Error fetching request costume details:", error);
      throw error;
    }
  },
  getRequestByRequestId: async (id) => {
    try {
      const response = await apiClient.get(`/api/Request/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching request details:", error);
      throw error;
    }
  },
  getAllContractByAccountId: async (accountId) => {
    try {
      const response = await apiClient.get(
        `/api/Contract/accountId/${accountId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching contract:", error);
      throw error;
    }
  },
  getCharacterById: async (characterId) => {
    try {
      const response = await apiClient.get(`/api/Character/${characterId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Lỗi khi lấy thông tin character"
      );
    }
  },
  addContractCostume: async (requestId, deposit) => {
    try {
      const response = await apiClient.post(
        `/api/Contract?requestId=${requestId}&deposit=${deposit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error adding contract costume:", error);
      throw new Error(
        error.response?.data?.message || "Lỗi khi thêm contract costume"
      );
    }
  },
  editRequest: async (requestId, data) => {
    try {
      const response = await apiClient.put(
        `/api/Request?RequestId=${requestId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating request:", error);
      throw error;
    }
  },
  getAllCharacters: async () => {
    try {
      const response = await apiClient.get("/api/Character");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Lỗi khi lấy danh sách characters"
      );
    }
  },
  chooseDeposit: async (requestId, payload) => {
    try {
      const response = await apiClient.patch(
        `/api/Request/UpdateDepositRequest?requestId=${requestId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error choosing deposit amount:", error);
      throw error;
    }
  },
};
export default MyRentalCostumeService;
