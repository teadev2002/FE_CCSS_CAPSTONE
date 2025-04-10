import { apiClient, formDataClient } from "../api/apiClient.js";

const AuthService = {
  // Login function
  login: async (email, password) => {
    try {
      const response = await apiClient.post("/api/Auth", null, {
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
  signup: async (name, email, password, birthday, phone) => {
    try {
      const response = await apiClient.post(`/api/Auth/register/`, {
        name,
        email,
        password,
        description: "New user",
        birthday,
        phone,
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Sign up failed");
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("accessToken");
    return !!token;
  },

  // Get tokens from localStorage
  getTokens: () => {
    return {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
  },

  // Logout function
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("cartId");
    localStorage.removeItem("accountId");
  },

  // Forgot password function
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.put(
        `/api/Auth/${encodeURIComponent(email)}`
      );
      return response.data; // Giả định API trả về thông báo như "Please check your email"
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Forgot password failed"
      );
    }
  },
};

export default AuthService;
