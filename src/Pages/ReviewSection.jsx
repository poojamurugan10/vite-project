import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const Reviews = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { productId } = useParams(); // productId will come from route
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Fetch reviews
  useEffect(() => {
    axios
      .get(`https://ecom-backend-zed3.onrender.com/api/review/${productId}`)
      .then((res) => setReviews(res.data))
      .catch((err) =>
        console.error("Error fetching reviews:", err.response?.data || err.message)
      );
  }, [productId]);

  // Add review
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `https://ecom-backend-zed3.onrender.com/api/review/add/${productId}`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setReviews([...reviews, res.data.review]);
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Error adding review:", err.response?.data || err.message);
    }
  };

  // Delete review
  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(
        `https://ecom-backend-zed3.onrender.com/api/review/${reviewId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error("Error deleting review:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 px-6 py-10">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        Product <span className="text-yellow-600">Reviews</span>
      </h1>

      {/* Review List */}
      {reviews.length === 0 ? (
        <p className="text-center text-gray-600">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <p className="text-yellow-600 font-bold">
                  ⭐ {review.rating} / 5
                </p>
                <p className="text-gray-700 mt-1">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-1">
                  By {review.user?.name || "Anonymous"}
                </p>
              </div>
              {user && review.user && review.user._id === user._id && (
                <button
                  onClick={() => handleDelete(review._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Review */}
      {user ? (
        <form
          onSubmit={handleAddReview}
          className="mt-8 bg-white shadow-md rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add a Review
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select rating</option>
              <option value="1">⭐ 1</option>
              <option value="2">⭐⭐ 2</option>
              <option value="3">⭐⭐⭐ 3</option>
              <option value="4">⭐⭐⭐⭐ 4</option>
              <option value="5">⭐⭐⭐⭐⭐ 5</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2"
              rows="3"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-600 mt-8">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 underline"
          >
            Login
          </button>{" "}
          to leave a review
        </p>
      )}
    </div>
  );
};

export default Reviews;
