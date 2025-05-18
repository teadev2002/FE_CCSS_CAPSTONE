import { apiClient, formDataClient } from "../../api/apiClient.js";

const RefundService = {
  sendRefund: async (contractId, price, description, images) => {
    try {
      const formData = new FormData();

      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append("images", image);
        });
      }

      const queryParams = new URLSearchParams({
        ContractId: contractId,
        Price: price,
        Description: description,
      }).toString();

      const url = `/api/ContractRefund?${queryParams}`;

      const response = await formDataClient.post(url, formData);
      return response.data;
    } catch (error) {
      console.error("Error sending refund:", error);
      throw error;
    }
  },
  getRefunds: async () => {
    try {
      const response = await apiClient.get("/api/ContractRefund");
      return response.data;
    } catch (error) {
      console.error("Error fetching refunds:", error);
      throw error;
    }
  },
  getContractRefundByContractId: async (contractId) => {
    try {
      const response = await apiClient.get(`/api/ContractRefund/${contractId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching refund by ID:", error);
      throw error;
    }
  },
  GetContractRefundByContractRefundId: async (refundId) => {
    try {
      const url = `/api/ContractRefund/GetContractRefundByContractRefundId?contractRefundId=${refundId}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching refund by ID:", error);
      throw error;
    }
  },
  // New method to update a refund (PUT)
  updateRefund: async (
    contractRefundId,
    contractId,
    numberBank,
    bankName,
    accountBankName,
    price,
    description,
    images
  ) => {
    try {
      // Create FormData object for multipart/form-data (for images)
      const formData = new FormData();

      // Append images (assuming images is an array of File objects)
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append("images", image);
        });
      }

      // Construct the URL with query parameters
      const queryParams = new URLSearchParams({
        contractRefundId,
        ContractId: contractId,
        NumberBank: numberBank,
        BankName: bankName,
        AccountBankName: accountBankName,
        Price: price,
        Description: description,
      }).toString();

      const url = `/api/ContractRefund?${queryParams}`;

      // Make the PUT request using formDataClient
      const response = await formDataClient.put(url, formData);
      return response.data;
    } catch (error) {
      console.error("Error updating refund:", error);
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
  getAllContractRefundByAccountId: async (accountId) => {
    try {
      const response = await apiClient.get(
        `/api/ContractRefund/GetAllContractRefundByAccountId?accountId=${accountId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching refunds by account ID:", error);
      throw error;
    }
  },
  getContractRefundImagebyContractId: async (contractId) => {
    try {
      const response = await apiClient.get(
        `/api/ContractImage?contractId=${contractId}&status=Refund`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching refund images by contract ID:", error);
      throw error;
    }
  },
  getImageRefundMoneybyContractId: async (contractId) => {
    try {
      const response = await apiClient.get(
        `/api/ContractImage?contractId=${contractId}&status=RefundMoney`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching refund images by contract ID:", error);
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
      console.error("Error fetching contract by ID:", error);
      throw error;
    }
  },
  sendContractImage: async (contractId, status, images) => {
    try {
      // Validate inputs
      if (!contractId || typeof contractId !== "string") {
        throw new Error("Invalid or missing contractId");
      }
      if (!status || typeof status !== "string") {
        throw new Error("Invalid or missing status");
      }
      if (!images || !Array.isArray(images) || images.length === 0) {
        throw new Error("Images array is required and must not be empty");
      }

      // Create FormData object for multipart/form-data
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append("UrlImages", image);
      });

      // Construct the URL with query parameters
      const queryParams = new URLSearchParams({
        contractId,
        status,
      }).toString();
      const url = `/api/ContractImage?${queryParams}`;

      // Make the POST request using formDataClient
      const response = await formDataClient.post(url, formData);
      return response.data;
    } catch (error) {
      console.error("Error sending contract images:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },
};

export default RefundService;
