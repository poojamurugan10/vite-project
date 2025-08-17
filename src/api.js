import axios from "axios";

const api = axios.create({
  baseURL: "https://ecom-backend-zed3.onrender.com/api",
});

// Automatically attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
