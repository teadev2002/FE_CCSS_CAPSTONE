import { apiClient } from "../../../api/apiClient.js";

const ManageContractService = {
  // Lấy danh sách tất cả hợp đồng
  getAllContracts: async () => {
    try {
      const response = await apiClient.get("/api/Contract");
      return response.data;
    } catch (error) {
      console.error("Error fetching contracts:", error);
      throw error;
    }
  },

  // Lấy danh sách tất cả request
  getAllRequests: async () => {
    try {
      const response = await apiClient.get("/api/Request");
      return response.data;
    } catch (error) {
      console.error("Error fetching requests:", error);
      throw error;
    }
  },

  // Lấy chi tiết request theo ID
  getRequestByRequestId: async (id) => {
    try {
      const response = await apiClient.get(`/api/Request/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching request:", error);
      throw error;
    }
  },

  // Lấy thông tin nhân vật theo ID
  getNameCharacterById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Character/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching character:", error);
      throw error;
    }
  },

  // Lấy chi tiết nhân vật theo ID
  getCharacterById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Character/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching character details:", error);
      throw error;
    }
  },

  // Lấy thông tin cosplayer theo account ID
  getNameCosplayerInRequestByCosplayerId: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/Account/${accountId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cosplayer:", error);
      throw error;
    }
  },

  // Lấy thông tin gói dịch vụ theo ID
  getPackageById: async (id) => {
    try {
      const response = await apiClient.get(`/api/Package/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching package details:", error);
      throw error;
    }
  },
  createContract: async (requestId, deposit) => {
    try {
      // Tạo URL với query parameters
      const response = await apiClient.post(
        `/api/Contract?requestId=${requestId}&deposit=${deposit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error creating contract:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },
  // Cập nhật trạng thái hợp đồng
  updateContractStatus: async (contractId, status) => {
    try {
      const response = await apiClient.put(
        `/api/Contract?contracId=${contractId}&status=Completed`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating contract status:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },
  // Lấy danh sách hình ảnh hợp đồng theo contractId và status
  getContractImageAndStatus: async (contractId, status) => {
    try {
      const response = await apiClient.get(
        `/api/ContractImage?contractId=${contractId}&status=${status}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching contract images:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },
  // Cập nhật hợp đồng giao hàng với trạng thái và hình ảnh
  updateDeliveryContract: async (contractId, status, images, reason = "") => {
    try {
      // Tạo FormData để gửi dữ liệu multipart/form-data
      const formData = new FormData();

      // Thêm lý do (nếu có) vào FormData
      if (reason) {
        formData.append("Reason", reason);
      }

      // Thêm danh sách hình ảnh vào FormData
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append(`Images`, image, image.name);
        });
      }

      // Gửi yêu cầu PUT với query parameters và FormData
      const response = await apiClient.put(
        `/api/Contract/UpdateDeliveryContract?ContractId=${contractId}&Status=${status}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating delivery contract:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },
  getAllContractImageByContractId: async (contractId) => {
    try {
      const response = await apiClient.get(
        `/api/ContractImage/GetContractImageByContractId?contractId=${contractId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default ManageContractService;
