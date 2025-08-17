import axios from "axios";

const API = "http://localhost:4000/api/wishlist"; // adjust port if different

// Get wishlist
export const getWishlist = async (token) => {
  return axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Add product to wishlist
export const addToWishlist = async (productId, token) => {
  return axios.post(
    `${API}/add`,
    { productId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Remove product from wishlist
export const removeFromWishlist = async (productId, token) => {
  return axios.post(
    `${API}/remove`,
    { productId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
