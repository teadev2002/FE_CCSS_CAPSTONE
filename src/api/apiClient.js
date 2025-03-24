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

// import axios from "axios";

// const apiClient = axios.create({
//   baseURL: "https://localhost:7071/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Thêm interceptor để tự động thêm token
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Hàm hỗ trợ gửi dữ liệu multipart/form-data
// const createFormDataClient = (config = {}) => {
//   return axios.create({
//     baseURL: "https://localhost:7071/api",
//     headers: {
//       "Content-Type": "multipart/form-data",
//       ...config.headers,
//     },
//   });
// };

// // Thêm interceptor cho client multipart/form-data
// const formDataClient = createFormDataClient();
// formDataClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export { apiClient, formDataClient };
