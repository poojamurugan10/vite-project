import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import { AuthContext } from "./Context/AuthContext";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Cart from "./Pages/Cart";
import WishlistPage from "./Pages/WishlistPage";
import ProductList from "./Pages/ProductList";
import ProductDetails from "./Pages/ProductDetails";
import AdminDashboard from "./Admin/AdminDashboard";
import SellerDashboard from "./Admin/SellerDashboard";
import AddProduct from "./Pages/AddProduct";
import NotFound from "./Pages/NotFound";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />
          }
        />

        {/* Seller Dashboard */}
        <Route
          path="/seller"
          element={
            user?.role === "seller" ? <SellerDashboard /> : <Navigate to="/" />
          }
        />

        {/* Add Product Page */}
        <Route
          path="/seller/add-product"
          element={
            user?.role === "seller" ? <AddProduct /> : <Navigate to="/" />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
