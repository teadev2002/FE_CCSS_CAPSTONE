import { apiClient } from "../../../api/apiClient.js";

// Service xử lý các yêu cầu API cho Location
const LocationService = {
    // Lấy danh sách tất cả địa điểm từ API
    getAllLocations: async () => {
        try {
            const response = await apiClient.get("/api/Location");
            return response.data; // Trả về dữ liệu danh sách địa điểm
        } catch (error) {
            console.error("Error fetching all locations:", error);
            throw error;
        }
    },

    // Lấy thông tin địa điểm theo ID
    getLocationById: async (locationId) => {
        if (!locationId) {
            throw new Error("Location ID is required");
        }
        try {
            const response = await apiClient.get(`/api/Location/${locationId}`);
            return response.data; // Trả về dữ liệu địa điểm
        } catch (error) {
            console.error(`Error fetching location with ID ${locationId}:`, error);
            throw error;
        }
    },

    // Tạo địa điểm mới
    createLocation: async (locationData) => {
        try {
            const response = await apiClient.post("/api/Location", locationData);
            return response.data; // Trả về dữ liệu phản hồi từ API
        } catch (error) {
            console.error("Error creating location:", error);
            throw error;
        }
    },

    // Cập nhật địa điểm theo ID
    updateLocation: async (locationId, locationData) => {
        if (!locationId) {
            throw new Error("Location ID is required for update");
        }
        try {
            const response = await apiClient.put(`/api/Location/${locationId}`, locationData);
            return response.data; // Trả về dữ liệu phản hồi từ API
        } catch (error) {
            console.error(`Error updating location with ID ${locationId}:`, error);
            throw error;
        }
    },

    // Xóa địa điểm theo ID
    deleteLocation: async (locationId) => {
        if (!locationId) {
            throw new Error("Location ID is required for deletion");
        }
        try {
            await apiClient.delete(`/api/Location/${locationId}`);
            console.log(`Location with ID ${locationId} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting location with ID ${locationId}:`, error);
            throw error;
        }
    },
};

export default LocationService;