import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const Success = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = user?.token || localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .post(
        "https://ecom-backend-zed3.onrender.com/api/order/success",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setTimeout(() => {
          navigate("/order");
        }, 3000);
      })
      .catch((err) => console.log(err));
  }, [token, navigate]);

  return (
    <div className="p-5 text-center">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful</h1>
      <p className="mt-2">Your order has been placed successfully...</p>
      <p className="mt-2">Redirecting to orders...</p>
    </div>
  );
};

export default Success;
