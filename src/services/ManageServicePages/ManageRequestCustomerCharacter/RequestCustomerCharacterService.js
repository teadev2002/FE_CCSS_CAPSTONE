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
  getCategoryById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Category/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAccountCustomerCharacter: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/Account/${accountId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateCustomerCharacterStatus: async ({
    customerCharacterId,
    status,
    reason,
    price,
  }) => {
    try {
      // Validation cơ bản
      if (!customerCharacterId || !status) {
        throw new Error("customerCharacterId and status are required");
      }

      // Tạo query params
      let queryParams = `customerCharacterId=${customerCharacterId}&status=${status}`;

      // Nếu status là "Accept", price là bắt buộc, reason không cần
      if (status === "Accept") {
        if (price === undefined || price === null) {
          throw new Error("Price is required when status is Accept");
        }
        queryParams += `&price=${price}`;
      }
      // Nếu status là "Reject", reason là bắt buộc
      else if (status === "Reject") {
        if (!reason) {
          throw new Error("Reason is required when status is Reject");
        }
        queryParams += `&reason=${encodeURIComponent(reason)}`;
        if (price !== undefined && price !== null) {
          queryParams += `&price=${price}`;
        }
      }
      // Các status khác (Pending, Completed, v.v.), reason và price tùy chọn
      else {
        if (reason) {
          queryParams += `&reason=${encodeURIComponent(reason)}`;
        }
        if (price !== undefined && price !== null) {
          queryParams += `&price=${price}`;
        }
      }

      // Gọi API PUT
      const response = await apiClient.put(
        `/api/CustomerCharacter/status?${queryParams}`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating customer character status:", error);
      throw error;
    }
  },
};

export default RequestCustomerCharacterService;
