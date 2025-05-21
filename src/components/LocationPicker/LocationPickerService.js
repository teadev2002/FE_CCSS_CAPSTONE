// src/services/LocationPickerService.js
import { apiClient } from "../../api/apiClient.js";
import { toast } from "react-toastify";

const LocationPickerService = {
  getDistricts: async () => {
    try {
      const response = await apiClient.post(`/api/Delivery/districts/202`);
      if (response.data.code !== 200) {
        throw new Error(response.data.message || "Error fetching districts");
      }
      const districts = response.data.data.map((district) => ({
        id: String(district.districtId), // Ensure string
        name: district.districtName,
      }));
      console.log("Districts fetched:", districts);
      return districts;
    } catch (error) {
      console.error("Districts error:", error);
      toast.error(error.message);
      throw error;
    }
  },

  getStreets: async (districtId) => {
    try {
      const response = await apiClient.post(
        `/api/Delivery/wards/${districtId}`
      );
      if (response.data.code !== 200) {
        throw new Error(response.data.message || "Error fetching streets");
      }
      const streets =
        response.data.data && Array.isArray(response.data.data)
          ? response.data.data.map((street, index) => ({
              id: String(street.wardId || `fallback-${index}`), // Fallback for missing wardId
              name: street.wardName || "Unknown Street",
            }))
          : [];
      // Check for duplicate IDs
      const uniqueIds = new Set(streets.map((s) => s.id));
      if (uniqueIds.size !== streets.length) {
        console.warn("Duplicate street IDs detected:", streets);
        toast.warn("Duplicate street IDs found. Contact support.");
      }
      console.log("Streets fetched:", streets);
      if (streets.length === 0) {
        toast.warn("No streets found for this district.");
      }
      return streets;
    } catch (error) {
      console.error("Streets error:", error);
      toast.error(error.message || "Failed to fetch streets");
      return [];
    }
  },
};

export default LocationPickerService;
