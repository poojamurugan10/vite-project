// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://ecom-backend-zed3.onrender.com/api",
});

// Add token automatically if present
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  } else {
    console.warn("No token found in localStorage");
  }
  return config;
});


export default api;
