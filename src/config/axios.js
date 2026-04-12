import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      `[Axios] ${config.method?.toUpperCase()} ${config.url}`,
      config.data,
    );
    return config;
  },
  (error) => {
    console.error("[Axios] Request error:", error);
    return Promise.reject(error);
  },
);

// Interceptor para manejar errores
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[Axios] Response:`, response.status, response.data);
    return response;
  },
  (error) => {
    console.error(
      "[Axios] Response error:",
      error.response?.status,
      error.response?.data,
    );
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
