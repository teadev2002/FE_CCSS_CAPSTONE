import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7071/api",
  headers: {
    "Content-Type": "application/json",
  },
});
// Thêm interceptor để tự động thêm token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default apiClient;
