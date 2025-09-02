import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    axios
      .get("https://ecom-backend-zed3.onrender.com/api/cart/view", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setCartItems(res.data.data.items || []);
        calculateTotal(res.data.data.items || []);
      })
      .catch((err) => console.error("Error fetching cart:", err));
  }, [user, navigate]);

  const calculateTotal = (items) => {
    const sum = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    setTotal(sum);
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await axios.delete(
        `https://ecom-backend-zed3.onrender.com/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const updatedItems = res.data.data.items || [];
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const proceedToPayment = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
  
    navigate("/payment", { state: { cartItems, total } });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Your Shopping Cart 🛒
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          {cartItems.map((item) => (
            <div
              key={item.product._id}
              className="flex justify-between items-center border-b py-4"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.product.name}
                </h2>
                <p className="text-gray-600">
                  ${item.product.price} × {item.quantity}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              Total: ${total.toFixed(2)}
            </h2>
            <button
              onClick={proceedToPayment}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
