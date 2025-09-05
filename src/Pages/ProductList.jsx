import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import api from "../api";

const ProductList = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      let endpoint = "/products/getproducts";

      //  If seller, fetch only their products
      if (user?.role === "seller") {
        endpoint = `/products/getproducts?seller=${user._id}&limit=50`; // fetch enough products
    } else {
      endpoint = `/products/getproducts?limit=50`; // fetch more for homepage
    }

      const res = await api.get(endpoint);
      const productsArray = res.data.products || res.data || [];
    setProducts(productsArray);
    console.log("Products API response:", res.data);
  } catch (error) {
    console.error("Error fetching products:", error.response?.data || error.message);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/delete/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Product List</h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md p-4 rounded-lg flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-500">{product.brand}</p>
                <p className="text-gray-700 mt-2">{product.description}</p>
                <p className="text-blue-600 font-bold mt-2">${product.price}</p>
                <p className="text-gray-400 mt-1">Stock: {product.stock}</p>
              </div>

              {/*  Edit / Delete only for seller */}
              {user?.role === "seller" && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => (window.location.href = `/seller/edit-product/${product._id}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
