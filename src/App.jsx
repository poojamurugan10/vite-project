import React, { useContext, useEffect } from "react";
import Navbar from "./Components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Cart from "./Pages/Cart";
import Order from "./Pages/Order";
import AdminDashboard from "./Admin/AdminDashboard";
import Success from "./Pages/Success";
import Cancel from "./Pages/Cancel";
import NotFound from "./Pages/NotFound";
import { AuthContext } from "./Context/AuthContext";
import WishlistPage from "./Pages/WishlistPage";
import ProductDetails from "./Pages/ProductDetails";
import Reviews from "./Pages/ReviewSection";



const App = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log("User data from authcontext", user);
  }, [user]);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/reviews/:productId" element={<Reviews />} />

        <Route path="/product/:id" element={<ProductDetails />} />
        <Route
          path="/admin"
          element={
            user && user.role?.toLowerCase() === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to={"/"} />
            )
          }
        />
         

        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
