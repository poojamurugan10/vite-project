import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // your axios instance
import { AuthContext } from "../Context/AuthContext";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    stock: "",
    brand: "",
    description: "",
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products/create", {
        ...productData,
        sellerId: user._id, 
      });
      alert("Product added successfully!");
      navigate("/seller");
    } catch (err) {
      console.error("Failed to add product:", err.response || err.message);
      alert("Error adding product");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleAddProduct}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>

        <input
          type="text"
          placeholder="Product Name"
          className="w-full mb-4 p-3 border rounded"
          value={productData.name}
          onChange={(e) =>
            setProductData({ ...productData, name: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full mb-4 p-3 border rounded"
          value={productData.price}
          onChange={(e) =>
            setProductData({ ...productData, price: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Stock"
          className="w-full mb-4 p-3 border rounded"
          value={productData.stock}
          onChange={(e) =>
            setProductData({ ...productData, stock: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Brand"
          className="w-full mb-4 p-3 border rounded"
          value={productData.brand}
          onChange={(e) =>
            setProductData({ ...productData, brand: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Description"
          className="w-full mb-4 p-3 border rounded"
          value={productData.description}
          onChange={(e) =>
            setProductData({ ...productData, description: e.target.value })
          }
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
