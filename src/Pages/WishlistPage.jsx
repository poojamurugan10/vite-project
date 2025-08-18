import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  const token = user?.token || localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("https://ecom-backend-zed3.onrender.com/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setWishlist(res.data.wishlist.products || []))
      .catch((err) => console.error("Error fetching wishlist:", err));
  }, [token, navigate]);

  const removeFromWishlist = async (productId) => {
    try {
      const res = await axios.delete(
        `https://ecom-backend-zed3.onrender.com/api/wishlist/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlist(res.data.wishlist.products || []);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Your Wishlist ❤️
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-600">No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between hover:scale-105 transition"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {product.name}
                </h2>
                <p className="text-blue-600 font-bold mt-1">${product.price}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {product.description}
                </p>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
                >
                  Remove from Wishlist
                </button>
                <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-2 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
