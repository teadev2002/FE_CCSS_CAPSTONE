import { apiClient, formDataClient } from "../../../api/apiClient.js";

const SourvenirService = {
  getAllProducts: async () => {
    try {
      const response = await apiClient.get("/Product");
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching all products:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getProductById: async (productId) => {
    if (!productId) {
      const error = new Error("Product ID is required");
      console.error("Error fetching product by ID:", error.message);
      throw error;
    }
    try {
      const response = await apiClient.get(`/Product/${productId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching product with ID ${productId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  createProduct: async (productData, files) => {
    try {
      // Create a FormData object to handle multipart/form-data
      const formData = new FormData();

      // Append the product data fields to the FormData
      formData.append("ProductName", productData.ProductName || "");
      formData.append("Description", productData.Description || "");
      formData.append("Quantity", productData.Quantity || 0);
      formData.append("Price", productData.Price || 0);

      // Append the files to the FormData under the "formFiles" key
      if (files && files.length > 0) {
        files.forEach((file, index) => {
          formData.append(`formFiles`, file); // Use the same key "formFiles" for each file
        });
      }

      // Make the POST request using formDataClient
      const response = await formDataClient.post("/Product", formData);
      return response.data;
    } catch (error) {
      console.error(
        "Error creating product:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  updateProduct: async (productId, productData) => {
    if (!productId) {
      const error = new Error("Product ID is required for update");
      console.error("Error updating product:", error.message);
      throw error;
    }
    try {
      const response = await apiClient.put("/Product", productData, {
        params: {
          productId: productId,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error updating product with ID ${productId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    if (!productId) {
      const error = new Error("Product ID is required for deletion");
      console.error("Error deleting product:", error.message);
      throw error;
    }
    try {
      await apiClient.delete("/Product", {
        params: {
          productId: productId,
        },
      });
      console.log(`Product with ID ${productId} deleted successfully.`);
    } catch (error) {
      console.error(
        `Error deleting product with ID ${productId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default SourvenirService;
