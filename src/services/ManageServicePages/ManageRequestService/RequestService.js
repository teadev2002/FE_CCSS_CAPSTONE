// import { apiClient } from "../../../api/apiClient.js";

// const RequestService = {
//   getAllRequests: async () => {
//     try {
//       const response = await apiClient.get("/api/Request");
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching requests:", error);
//       throw error;
//     }
//   },

//   getNameCharacterById: async (id) => {
//     try {
//       const response = await apiClient.get(`/api/Character/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching character:", error);
//       throw error;
//     }
//   },

//   getRequestByRequestId: async (id) => {
//     try {
//       const response = await apiClient.get(`/api/Request/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching request:", error);
//       throw error;
//     }
//   },

//   getNameCosplayerInRequestByCosplayerId: async (accountId) => {
//     try {
//       const response = await apiClient.get(`/api/Account/${accountId}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching cosplayer:", error);
//       throw error;
//     }
//   },

//   DeleteRequestByRequestId: async (id) => {
//     try {
//       const response = await apiClient.delete(`/api/Request?requestId=${id}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching request:", error);
//       throw error;
//     }
//   },
//   UpdateRequestStatusById: async (id, requestStatus) => {
//     try {
//       const response = await apiClient.put(
//         `/api/Request/Status?requestId=${id}&requestStatus=${requestStatus}`
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error updating request status:", error);
//       throw error;
//     }
//   },
// };
// export default RequestService;
import { apiClient } from "../../../api/apiClient.js";

const RequestService = {
  getAllRequests: async () => {
    try {
      const response = await apiClient.get("/api/Request");
      return response.data;
    } catch (error) {
      console.error("Error fetching requests:", error);
      throw error;
    }
  },

  getRequestByRequestId: async (id) => {
    try {
      const response = await apiClient.get(`/api/Request/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching request:", error);
      throw error;
    }
  },

  getNameCharacterById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Character/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching character:", error);
      throw error;
    }
  },

  getCharacterById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Character/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching character details:", error);
      throw error;
    }
  },

  getNameCosplayerInRequestByCosplayerId: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/Account/${accountId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cosplayer:", error);
      throw error;
    }
  },

  getPackageById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Package/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching package details:", error);
      throw error;
    }
  },

  DeleteRequestByRequestId: async (id) => {
    try {
      const response = await apiClient.delete(`/api/Request?requestId=${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting request:", error);
      throw error;
    }
  },

  UpdateRequestStatusById: async (id, requestStatus) => {
    try {
      const response = await apiClient.put(
        `/api/Request/Status?requestId=${id}&requestStatus=${requestStatus}`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating request status:", error);
      throw error;
    }
  },
};

export default RequestService;
