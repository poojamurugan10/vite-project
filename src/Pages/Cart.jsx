import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Cart = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // ✅ Fetch cart on page load
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    api.get("https://ecom-backend-zed3.onrender.com/api/cart/view", {
  headers: { Authorization: `Bearer ${user?.token || localStorage.getItem("token")}` }
})

      .then((res) => {
        const items = res.data?.data?.items || [];
        setCart(items);
        calculateTotal(items);
      })
      .catch((err) => console.error("Unable to retrieve cart:", err));
  }, [user, navigate]);

  // ✅ Calculate total price
  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  // ✅ Update quantity
  const updateQuantity = async (productId, change) => {
    const item = cart.find((i) => i.product._id === productId);
    if (!item || item.quantity + change < 1) return;

    try {
      await axios.put(
        `https://ecom-backend-zed3.onrender.com/api/cart/update/${productId}`,
        { change },
        {
          headers: { Authorization: `Bearer ${user.token} || localStorage.getItem("token")}` },
        }
      );

      const updatedCart = cart.map((i) =>
        i.product._id === productId
          ? { ...i, quantity: i.quantity + change }
          : i
      );
      setCart(updatedCart);
      calculateTotal(updatedCart);
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Error updating quantity");
    }
  };

  // ✅ Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(
        `https://ecom-backend-zed3.onrender.com/api/cart/remove/${productId}`,
        {
          headers: { Authorization: `Bearer ${user.token} || localStorage.getItem("token")}` },
        }
      );

      const updatedCart = cart.filter((i) => i.product._id !== productId);
      setCart(updatedCart);
      calculateTotal(updatedCart);
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Error removing item from cart");
    }
  };

  // ✅ Place order
  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty. Cannot place order.");
      return;
    }

    try {
      await axios.post(
        "https://ecom-backend-zed3.onrender.com/api/order/create",
        {},
        { headers: { Authorization: `Bearer ${user.token} || localStorage.getItem("token")}` } }
      );

      alert("Order placed successfully!");
      setCart([]);
      setTotalPrice(0);
      navigate("/order");
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Error placing order!");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🛍️ Your Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="max-w-5xl mx-auto">
          {/* Cart Items */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="bg-white shadow-lg rounded-lg p-4"
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.product.name}
                </h2>
                <p className="text-blue-600 font-bold">
                  ${item.product.price}
                </p>

                {/* Quantity Control */}
                <div className="flex items-center mt-3">
                  <button
                    onClick={() => updateQuantity(item.product._id, -1)}
                    className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-l"
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, 1)}
                    className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-r"
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Total & Place Order */}
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Total Price: ${totalPrice}
            </h2>
            <button
              onClick={placeOrder}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded text-lg shadow"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
