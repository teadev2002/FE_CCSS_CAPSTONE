// import apiClient from "../api/apiClient.js";
import { apiClient, formDataClient } from "../api/apiClient.js";
const AuthService = {
  // Login function
  login: async (email, password) => {
    try {
      const response = await apiClient.post("/Auth", null, {
        params: {
          email,
          password,
        },
      });

      const tokens = {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };

      // Store tokens in localStorage
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  // Sign up function
  signup: async (name, email, password, birthday, phone, role = "3") => {
    try {
      const response = await apiClient.post(`/Auth/register/`, {
        name,
        email,
        password,
        description: "New user", // Add a default description since it's required by the API but not in the form
        birthday,
        phone,
      });

      return response.data; // Return the response data (e.g., "Please enter code")
    } catch (error) {
      throw new Error(error.response?.data?.message || "Sign up failed");
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("accessToken");
    return !!token; // Returns true if token exists, false otherwise
  },

  // Get tokens from localStorage
  getTokens: () => {
    return {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
  },

  // Logout function (to be used in Navbar)
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

export default AuthService;
