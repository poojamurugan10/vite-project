import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Filter from "../Components/Filter";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // ---------------- FETCH FUNCTIONS ----------------
  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await api.get("/cart/view");
      setCartItems(res.data.data?.items || []);
    } catch (err) {
      console.error("Unable to retrieve cart", err.response?.data || err.message);
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const res = await api.get("/wishlist");
      setWishlist(res.data.wishlist?.products || []);
    } catch (err) {
      console.error("Unable to retrieve wishlist", err.response?.data || err.message);
    }
  };

  // ---------------- USE EFFECT ----------------
  useEffect(() => {
    api.get("/products/getproducts?limit=50&sort=newest")
      .then((res) => {
        setProducts(res.data.products || []);
        setFilteredProducts(res.data.products || []);
      })
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
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add items");
      return navigate("/login");
    }

    try {
      await api.post("/cart/add", { productId, quantity: 1 });
      setCartItems((prev) => [...prev, { product: { _id: productId }, quantity: 1 }]);
    } catch (err) {
      console.error("Add to cart failed", err.response?.data || err.message);
      await fetchCart();
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
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add items");
      return navigate("/login");
    }

    try {
      const res = await api.post("/wishlist/add", { productId });
      setWishlist(res.data.wishlist?.products || []);
    } catch (err) {
      console.error("Add to wishlist failed", err.response?.data || err.message);
      await fetchWishlist();
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await api.delete(`/wishlist/remove/${productId}`);
      setWishlist(res.data.wishlist?.products || []);
    } catch (err) {
      console.error("Remove from wishlist failed", err.response?.data || err.message);
      await fetchWishlist();
    }
  };

  // ---------------- FILTER FUNCTION ----------------
  const handleFilterChange = ({ category, brand, sort }) => {
    let temp = [...products];

    // Filter by category
    if (category) temp = temp.filter((p) => p.category === category);

    // Filter by brand
    if (brand) temp = temp.filter((p) => p.brand === brand);

    // Sort
    if (sort === "newest") temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === "oldest") temp.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sort === "priceAsc") temp.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") temp.sort((a, b) => b.price - a.price);

    setFilteredProducts(temp);
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] px-6 py-10">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
        Explore Our <span className="text-blue-600">Products</span>
      </h1>

      {/* FILTER COMPONENT */}
      {products.length !== 0 && (
        <Filter
          onFilterChange={handleFilterChange}
          categories={[...new Set(products.map((p) => p.category))]}
          brands={[...new Set(products.map((p) => p.brand))]}
        />
      )}

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600 mt-6">No Products Available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {filteredProducts.map((product) => {
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
                  <p className="text-sm text-gray-400 mt-1">Stock: {product.stock}</p>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  {inCart ? (
                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
                    >
                      Remove from Cart
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(product._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
                    >
                      Add to Cart
                    </button>
                  )}

                  {inWishlist ? (
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="bg-pink-500 hover:bg-pink-600 text-white py-2 rounded transition"
                    >
                      Remove from Wishlist
                    </button>
                  ) : (
                    <button
                      onClick={() => addToWishlist(product._id)}
                      className="bg-pink-400 hover:bg-pink-500 text-white py-2 rounded transition"
                    >
                      Add to Wishlist
                    </button>
                  )}

                  <button
                    onClick={() => navigate(`/reviews/${product._id}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
                  >
                    View Reviews
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
