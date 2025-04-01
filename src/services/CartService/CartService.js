import { apiClient } from "../../api/apiClient.js";

const CartService = {
  getCartByAccountId: async (accountId) => {
    try {
      console.log("Fetching cart for accountId:", accountId);
      const response = await apiClient.get(`/api/Cart/GetCartByAccountId?accountId=${accountId}`);
      console.log("GetCartByAccountId response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error.response?.data || error);
      throw new Error(
        error.response?.data?.message || "Error fetching cart"
      );
    }
  },

  addProductToCart: async (cartId, productData) => {
    try {
      console.log("Adding to cart:", { cartId, productData });
      const response = await apiClient.post(
        `/api/CartProduct?cartId=${cartId}`,
        productData
      );
      console.log("AddProductToCart response:", response.data);
      if (response.data === "Add Success") {
        return response.data;
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error);
      throw new Error(
        error.response?.data?.message || "Error adding product to cart"
      );
    }
  },

  removeProductFromCart: async (cartId, cartProductIds) => {
    try {
      console.log("Removing from cart:", { cartId, cartProductIds });
      const response = await apiClient.delete(
        `/api/CartProduct?cartId=${cartId}`,
        { data: cartProductIds }
      );
      console.log("RemoveProductFromCart response:", response.data);
      return response.data; // Backend có thể không trả gì, nhưng giữ để tương thích
    } catch (error) {
      console.error("Error removing product:", error.response?.data || error);
      throw new Error(
        error.response?.data?.message || "Error removing product from cart"
      );
    }
  },

  updateProductQuantity: async (cartId, productData) => {
    try {
      console.log("Updating quantity:", { cartId, productData });
      const response = await apiClient.put(
        `/api/CartProduct?cartId=${cartId}`,
        productData
      );
      console.log("UpdateProductQuantity response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating quantity:", error.response?.data || error);
      throw new Error(
        error.response?.data?.message || "Error updating product quantity"
      );
    }
  },

  getProductById: async (productId) => {
    try {
      console.log("Fetching product:", productId);
      const response = await apiClient.get(`/api/Product/${productId}`);
      console.log("GetProductById response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error.response?.data || error);
      throw new Error(
        error.response?.data?.message || "Error fetching product details"
      );
    }
  },
};

export default CartService;