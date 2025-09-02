import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // your axios instance
import { AuthContext } from "../Context/AuthContext";

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "seller") {
      navigate("/"); // Redirect if not seller
    } else {
      fetchSellerProducts();
    }
  }, [user, navigate]);

  const fetchSellerProducts = async () => {
    try {
      const res = await api.get("/products/getproducts");
      // Filter only products added by this seller
      const sellerProducts = res.data.filter(
        (p) => p.sellerId === user._id
      );
      setProducts(sellerProducts);
    } catch (err) {
      console.error("Failed to fetch products:", err.response || err.message);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Seller Dashboard</h1>

      <div className="flex justify-center mb-6">
        <Link
          to="/seller/add-product"
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          + Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">You have no products yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-500">${product.price}</p>
              <p className="text-gray-400 text-sm">Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
