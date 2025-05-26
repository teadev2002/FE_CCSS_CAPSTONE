// import { apiClient, formDataClient } from "../../api/apiClient.js";

// const ProductService = {
//   // Get all products
//   getProducts: async () => {
//     try {
//       const response = await apiClient.get("/api/Product");
//       return response.data;
//     } catch (error) {
//       throw new Error(
//         error.response?.data?.message || "Error fetching products"
//       );
//     }
//   },

//   // Get all product images
//   getProductImages: async () => {
//     try {
//       const response = await apiClient.get("/api/ProductImage");
//       return response.data;
//     } catch (error) {
//       throw new Error(
//         error.response?.data?.message || "Error fetching product images"
//       );
//     }
//   },

//   // Get combined product and image data
//   getCombinedProductData: async () => {
//     try {
//       const [products, images] = await Promise.all([
//         ProductService.getProducts(),
//         ProductService.getProductImages(),
//       ]);

//       const combinedData = products
//         .filter((product) => product.isActive)
//         .map((product) => {
//           const productImage = images.find(
//             (img) => img.productId === product.productId
//           );
//           return {
//             id: product.productId,
//             name: product.productName,
//             description: product.description,
//             quantity: product.quantity,
//             price: product.price,
//             image: productImage
//               ? productImage.urlImage
//               : "https://via.placeholder.com/300",
//           };
//         });

//       return combinedData;
//     } catch (error) {
//       throw new Error(
//         error.response?.data?.message || "Error fetching combined product data"
//       );
//     }
//   },

//   // Get product by ID (thêm hàm mới để lấy thông tin sản phẩm hiện tại)
//   getProductById: async (productId) => {
//     try {
//       const response = await apiClient.get(`/api/Product/${productId}`);
//       return response.data;
//     } catch (error) {
//       throw new Error(
//         error.response?.data?.message || "Error fetching product by ID"
//       );
//     }
//   },

//   // Update product quantity
//   updateProductQuantity: async (productId, newQuantity) => {
//     try {
//       // Lấy thông tin sản phẩm hiện tại
//       const currentProduct = await ProductService.getProductById(productId);

//       // Tạo payload với thông tin hiện tại, chỉ cập nhật quantity
//       const payload = {
//         productName: currentProduct.productName,
//         description: currentProduct.description,
//         quantity: newQuantity,
//         price: currentProduct.price,
//         isActive: currentProduct.isActive,
//       };

//       const response = await apiClient.put(`/api/Product?productId=${productId}`, payload);
//       console.log("UpdateProductQuantity response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Error updating product quantity:", error.response?.data || error);
//       throw new Error(
//         error.response?.data?.message || "Error updating product quantity"
//       );
//     }
//   },
// };

// export default ProductService;

//-----------------------------------------------------------------------//

//sửa ngày 26/05/2025


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
          // Lấy tất cả hình ảnh của sản phẩm
          const productImages = images
            .filter((img) => img.productId === product.productId)
            .sort((a, b) => {
              // Sắp xếp để ảnh isAvatar: true lên đầu
              if (a.isAvatar && !b.isAvatar) return -1;
              if (!a.isAvatar && b.isAvatar) return 1;
              return 0;
            });

          // Lấy ảnh đại diện (isAvatar: true) hoặc ảnh đầu tiên nếu không có
          const avatarImage = productImages.find((img) => img.isAvatar) || productImages[0];

          return {
            id: product.productId,
            name: product.productName,
            description: product.description,
            quantity: product.quantity,
            price: product.price,
            // Trả về ảnh đại diện cho giao diện ngoài
            image: avatarImage
              ? avatarImage.urlImage
              : "https://via.placeholder.com/300",
            // Trả về toàn bộ mảng productImages cho modal
            productImages: productImages.map((img) => ({
              urlImage: img.urlImage,
              isAvatar: img.isAvatar,
            })),
          };
        });

      return combinedData;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching combined product data"
      );
    }
  },

  // Get product by ID
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