import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import api from "../api";
import Navbar from "../Components/Navbar";

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const fetchSellerProducts = async () => {
    try {
      if (!user) return;
      const res = await api.get(`/products/getproducts?seller=${user._id}&limit=50&sort=newest`);
      setProducts(res.data.products || []);
      console.log("Seller products:", res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/delete/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("Product deleted!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to delete product");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await api.post("/cart/add", { productId });
      alert("Added to cart!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to add to cart");
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await api.post("/wishlist/add", { productId });
      alert("Added to wishlist!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to add to wishlist");
    }
  };

  useEffect(() => {
    if (!user || user.role !== "seller") navigate("/");
    else fetchSellerProducts();
  }, [user, navigate]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6 text-center">Seller Dashboard</h1>

      <div className="flex justify-center mb-6">
        <Link
          to="/seller/add-product"
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded shadow flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold">{p.name}</h2>
                <p className="text-gray-500">{p.brand}</p>
                <p className="text-gray-700">{p.description}</p>
                <p className="text-blue-600 font-bold mt-2">${p.price}</p>
                <p className="text-gray-400 mt-1">Stock: {p.countInStock}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => (window.location.href = `/seller/edit-product/${p._id}`)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleAddToCart(p._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleAddToWishlist(p._id)}
                  className="bg-pink-500 hover:bg-pink-600 text-white py-1 px-3 rounded"
                >
                  Add to Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
