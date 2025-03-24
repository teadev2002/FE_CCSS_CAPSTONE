import axios from "axios";

// Base URL của API
const BASE_URL = "https://localhost:7071/api";

// Hàm lấy danh sách Product
export const getProducts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/Product`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch products: " + error.message);
    }
};

// Hàm lấy danh sách ProductImage
export const getProductImages = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/ProductImage`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch product images: " + error.message);
    }
};

// Hàm kết hợp dữ liệu Product và ProductImage
export const getCombinedProductData = async () => {
    try {
        const [products, images] = await Promise.all([getProducts(), getProductImages()]);

        // Kết hợp dữ liệu
        const combinedData = products
            .filter((product) => product.isActive) // Chỉ lấy sản phẩm active
            .map((product) => {
                const productImage = images.find((img) => img.productId === product.productId);
                return {
                    id: product.productId,
                    name: product.productName,
                    description: product.description,
                    quantity: product.quantity,
                    price: product.price,
                    image: productImage ? productImage.urlImage : "https://via.placeholder.com/300", // Hình mặc định
                };
            });

        return combinedData;
    } catch (error) {
        throw new Error("Failed to fetch combined product data: " + error.message);
    }
};