import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api"; // uses token from localStorage automatically

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Fetch cart
  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await api.get("/cart/view"); // relative path
      setCartItems(res.data.data.items || []);
    } catch (err) {
      console.error("Unable to retrieve cart", err.response?.data || err.message);
    }
  };

  // Fetch wishlist
  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const res = await api.get("/wishlist");
      setWishlist(res.data.wishlist.products || []);
    } catch (err) {
      console.error("Unable to retrieve wishlist", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    // Fetch products
    api
      .get("/products/getproducts") // relative path
      .then((res) => setProducts(res.data.data || []))
      .catch((err) => console.log("Unable to retrieve products", err));

    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
        return;
      }
      fetchCart();
      fetchWishlist();
    }
  }, [user, navigate]);

  // ---------------- CART FUNCTIONS ----------------
  const addToCart = async (productId) => {
    if (!user) {
      alert("Please login to add items to the cart");
      return navigate("/login");
    }
    try {
      await api.post("/cart/add", { productId, quantity: 1 });
      setCartItems((prev) => [...prev, { product: { _id: productId }, quantity: 1 }]);
    } catch (err) {
      console.error("Add to cart failed", err.response?.data || err.message);
      await fetchCart(); // sync
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
    } catch (err) {
      console.error("Remove from cart failed", err.response?.data || err.message);
      await fetchCart();
    }
  };

  // ---------------- WISHLIST FUNCTIONS ----------------
  const addToWishlist = async (productId) => {
    if (!user) {
      alert("Please login to add to wishlist");
      return navigate("/login");
    }
    try {
      const res = await api.post("/wishlist/add", { productId });
      setWishlist(res.data.wishlist.products || []);
    } catch (err) {
      console.error("Add to wishlist failed", err.response?.data || err.message);
      await fetchWishlist();
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await api.delete(`/wishlist/remove/${productId}`);
      setWishlist(res.data.wishlist.products || []);
    } catch (err) {
      console.error("Remove from wishlist failed", err.response?.data || err.message);
      await fetchWishlist();
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] px-6 py-10">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
        Explore Our <span className="text-blue-600">Products</span>
      </h1>
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No Products Available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => {
            const inCart = cartItems.some((item) => item.product._id === product._id);
            const inWishlist = wishlist.some((p) => p._id === product._id);

            return (
              <div
                key={product._id}
                className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between transition-transform hover:scale-105"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                  <p className="text-blue-600 font-bold mt-1">${product.price}</p>
                  <p className="text-sm text-gray-500 mt-2">{product.description}</p>
                </div>

                {inCart ? (
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
                  >
                    Remove from Cart
                  </button>
                ) : (
                  <button
                    onClick={() => addToCart(product._id)}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
                  >
                    Add to Cart
                  </button>
                )}

                {inWishlist ? (
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="mt-2 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded transition"
                  >
                    Remove from Wishlist
                  </button>
                ) : (
                  <button
                    onClick={() => addToWishlist(product._id)}
                    className="mt-2 bg-pink-400 hover:bg-pink-500 text-white py-2 rounded transition"
                  >
                    Add to Wishlist
                  </button>
                )}

                <button
                  onClick={() => navigate(`/reviews/${product._id}`)}
                  className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
                >
                  View Reviews
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
