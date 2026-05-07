import axios from "axios";

const API_BASE_URL = "https://campus-connect-backend-hlty.onrender.com/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Bearer token to every request automatically (except login)
api.interceptors.request.use(
  (config) => {
    const url = config.url || "";
    if (!url.includes("/auth/login")) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses globally (token expired / unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't redirect on login failures — let the login page handle its own errors
      const url = error.config?.url || "";
      if (!url.includes("/auth/login")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
