import axios from "axios";

const API = "http://localhost:4000/api/reviews"; // adjust if needed

// Get reviews for a product
export const getReviews = async (productId) => {
  return axios.get(`${API}/${productId}`);
};

// Add a review
export const addReview = async (productId, rating, comment, token) => {
  return axios.post(
    API,
    { productId, rating, comment },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
