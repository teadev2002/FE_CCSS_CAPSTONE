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

      const combinedData = products
        .filter((product) => product.isActive)
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
              : "https://via.placeholder.com/300",
          };
        });

      return combinedData;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching combined product data"
      );
    }
  },

  // Get product by ID (thêm hàm mới để lấy thông tin sản phẩm hiện tại)
  getProductById: async (productId) => {
    try {
      const response = await apiClient.get(`/api/Product/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching product by ID"
      );
    }
  },

  // Update product quantity
  updateProductQuantity: async (productId, newQuantity) => {
    try {
      // Lấy thông tin sản phẩm hiện tại
      const currentProduct = await ProductService.getProductById(productId);

      // Tạo payload với thông tin hiện tại, chỉ cập nhật quantity
      const payload = {
        productName: currentProduct.productName,
        description: currentProduct.description,
        quantity: newQuantity,
        price: currentProduct.price,
        isActive: currentProduct.isActive,
      };

      const response = await apiClient.put(`/api/Product?productId=${productId}`, payload);
      console.log("UpdateProductQuantity response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating product quantity:", error.response?.data || error);
      throw new Error(
        error.response?.data?.message || "Error updating product quantity"
      );
    }
  },
};

export default ProductService;