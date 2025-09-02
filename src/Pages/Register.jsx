import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "", 
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!userData.role) {
      alert("Please select a role");
      return;
    }

    try {
      const res = await axios.post(
        "https://ecom-backend-zed3.onrender.com/api/auth/register",
        userData
      );

      console.log("Registered user:", res.data.user); // check role here

      alert("Registration Successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Error registering user");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <form
        onSubmit={handleRegister}
        className="bg-white/70 backdrop-blur-md shadow-xl rounded-xl p-10 w-full max-w-md border border-white/40"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create an Account
        </h2>

        <input
          type="text"
          placeholder="Enter Your Name"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Enter Your Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Enter Your Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          required
        />

       
        <select
          value={userData.role}
          onChange={(e) => setUserData({ ...userData, role: e.target.value })}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
          required
        >
          <option value="">Select Role</option>
          <option value="customer">Buyer</option> 
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
