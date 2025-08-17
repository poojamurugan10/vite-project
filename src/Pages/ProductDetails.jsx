import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const ProductDetails = () => {
  const { id } = useParams(); // product id from URL
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  // ✅ Fetch product + reviews + cart + wishlist
  useEffect(() => {
    axios
      .get(`https://ecom-backend-zed3.onrender.com/api/products/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch((err) => console.error("Error fetching product", err));

    axios
      .get(`https://ecom-backend-zed3.onrender.com/api/reviews/product/${id}`)
      .then((res) => setReviews(res.data.data || []))
      .catch((err) => console.error("Error fetching reviews", err));

    if (user) {
      axios
        .get("https://ecom-backend-zed3.onrender.com/api/cart/view", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setCartItems(res.data.data.items || []));

      axios
        .get("https://ecom-backend-zed3.onrender.com/api/wishlist/view", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setWishlist(res.data.data.products || []));
    }
  }, [id, user]);

  // ✅ Add to Cart
  const addToCart = async () => {
    if (!user) return alert("Login required");
    await axios.post(
      "https://ecom-backend-zed3.onrender.com/api/cart/add",
      { productId: id, quantity: 1 },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setCartItems([...cartItems, { product: { _id: id }, quantity: 1 }]);
  };

  // ✅ Remove from Cart
  const removeFromCart = async () => {
    if (!user) return alert("Login required");
    await axios.delete(
      `https://ecom-backend-zed3.onrender.com/api/cart/remove/${id}`,
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setCartItems(cartItems.filter((item) => item.product._id !== id));
  };

  // ✅ Add to Wishlist
  const addToWishlist = async () => {
    if (!user) return alert("Login required");
    await axios.post(
      "https://ecom-backend-zed3.onrender.com/api/wishlist/add",
      { productId: id },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setWishlist([...wishlist, { _id: id }]);
  };

  // ✅ Remove from Wishlist
  const removeFromWishlist = async () => {
    if (!user) return alert("Login required");
    await axios.delete(
      `https://ecom-backend-zed3.onrender.com/api/wishlist/remove/${id}`,
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setWishlist(wishlist.filter((p) => p._id !== id));
  };

  // ✅ Add Review
  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Login required");

    const res = await axios.post(
      "https://ecom-backend-zed3.onrender.com/api/reviews/add",
      { productId: id, rating: newReview.rating, comment: newReview.comment },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setReviews([...reviews, res.data.data]);
    setNewReview({ rating: 5, comment: "" });
  };

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  const inCart = cartItems.some((item) => item.product._id === id);
  const inWishlist = wishlist.some((p) => p._id === id);

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-blue-600 font-bold text-xl mb-6">${product.price}</p>

      {/* Cart & Wishlist Buttons */}
      <div className="flex gap-4 mb-6">
        {inCart ? (
          <button
            onClick={removeFromCart}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Remove from Cart
          </button>
        ) : (
          <button
            onClick={addToCart}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add to Cart
          </button>
        )}

        {inWishlist ? (
          <button
            onClick={removeFromWishlist}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Remove from Wishlist
          </button>
        ) : (
          <button
            onClick={addToWishlist}
            className="bg-pink-500 text-white px-4 py-2 rounded"
          >
            ❤️ Add to Wishlist
          </button>
        )}
      </div>

      {/* Reviews */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-3">Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li
                key={r._id}
                className="border p-3 rounded shadow-sm bg-gray-50"
              >
                <strong>{r.user?.name || "Anonymous"}</strong> - ⭐ {r.rating}
                <p>{r.comment}</p>
              </li>
            ))}
          </ul>
        )}

        {user && (
          <form onSubmit={submitReview} className="mt-6">
            <h3 className="text-xl font-medium mb-2">Add a Review</h3>
            <select
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: e.target.value })
              }
              className="border rounded p-2 mr-2"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Write a comment"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              className="border rounded p-2 mr-2 w-64"
              required
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
