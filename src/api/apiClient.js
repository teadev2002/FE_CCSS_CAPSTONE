import axios from "axios";

const BASE_URL = "https://localhost:7071";
//const BASE_URL = "http://192.168.1.7:5295";

// const BASE_URL =
//   "https://ccsswebsite-dwezcuaxdkbyhwcc.southeastasia-01.azurewebsites.net";
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": "*",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const createFormDataClient = (config = {}) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "multipart/form-data",
      ...config.headers,
    },
  });
};

const formDataClient = createFormDataClient();
formDataClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { apiClient, formDataClient };
