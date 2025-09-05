import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; 
import { AuthContext } from "../Context/AuthContext";


const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    countInStock: "",
    brand: "",
    description: "",
    category: "",
    image: "",
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      await api.post("/products/create", {
        ...productData,
        sellerId: user._id,
      });
      alert("Product added successfully!");
      navigate("/seller"); // redirect to seller dashboard
    } catch (err) {
      console.error("Failed to add product:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error adding product");
    }
  };

  const handleChange = (field, value) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
     

      <div className="flex justify-center items-center flex-1 bg-gray-100">
        <form
          onSubmit={handleAddProduct}
          className="bg-white p-8 rounded shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>

          <input
            type="text"
            placeholder="Product Name"
            value={productData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full mb-4 p-3 border rounded"
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={productData.price ?? ""}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full mb-4 p-3 border rounded"
            required
          />

          <input
            type="number"
            placeholder="Stock"
            value={productData.countInStock ?? ""}
            onChange={(e) => handleChange("countInStock", e.target.value)}
            className="w-full mb-4 p-3 border rounded"
            required
          />

          <input
            type="text"
            placeholder="Brand"
            value={productData.brand || ""}
            onChange={(e) => handleChange("brand", e.target.value)}
            className="w-full mb-4 p-3 border rounded"
            required
          />

          <input
            type="text"
            placeholder="Category"
            value={productData.category || ""}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full mb-4 p-3 border rounded"
            required
          />

          <input
            type="text"
            placeholder="Image URL"
            value={productData.image || ""}
            onChange={(e) => handleChange("image", e.target.value)}
            className="w-full mb-4 p-3 border rounded"
            required
          />

          <textarea
            placeholder="Description"
            value={productData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full mb-4 p-3 border rounded"
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
    </div>
  );
};

export default AddProduct;
