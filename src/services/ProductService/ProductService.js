import { apiClient, formDataClient } from "../../api/apiClient.js";

const ProductService = {
  // Get all products
  getProducts: async () => {
    try {
      const response = await apiClient.get("/api/Product");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching products"
      );
    }
  },

  // Get all product images
  getProductImages: async () => {
    try {
      const response = await apiClient.get("/api/ProductImage");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching product images"
      );
    }
  },

  // Get combined product and image data
  getCombinedProductData: async () => {
    try {
      const [products, images] = await Promise.all([
        ProductService.getProducts(),
        ProductService.getProductImages(),
      ]);

      // Combine data
      const combinedData = products
        .filter((product) => product.isActive) // Only active products
        .map((product) => {
          const productImage = images.find(
            (img) => img.productId === product.productId
          );
          return {
            id: product.productId,
            name: product.productName,
            description: product.description,
            quantity: product.quantity,
            price: product.price,
            image: productImage
              ? productImage.urlImage
              : "https://via.placeholder.com/300", // Default image
          };
        });

      return combinedData;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching combined product data"
      );
    }
  },
};

export default ProductService;
