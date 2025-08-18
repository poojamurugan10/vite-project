import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch User Orders
  const fetchOrders = () => {
    if (!user || !user.token) {
      navigate("/login");
      return;
    }
    axios
      .get("https://ecom-backend-zed3.onrender.com/api/orders/myorders", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setOrders(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        alert("Error in fetching orders");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [user, navigate]);

  /// ✅ Proceed to Razorpay Checkout
const proceedToPayment = async (totalAmount, orderId, products) => {
  if (!user || !user.token) {
    navigate("/login");
    return;
  }

  try {
    // 1️⃣ Create Razorpay order in backend with products
    const res = await axios.post(
      "https://ecom-backend-zed3.onrender.com/api/payments/checkout",
      { amount: totalAmount, orderId, products }, // ✅ send products too
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    const { orderId: razorpayOrderId, amount, currency, key } = res.data;

    // 2️⃣ Razorpay options
    const options = {
      key,
      amount,
      currency,
      name: "E-Comm Store",
      description: "Order Payment",
      order_id: razorpayOrderId,
      handler: async function (response) {
        try {
          // 3️⃣ Verify Payment in Backend
          const verifyRes = await axios.post(
            "https://ecom-backend-zed3.onrender.com/api/payments/verify",
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId, // ✅ our DB order
            },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );

          if (verifyRes.data.success) {
            alert("✅ Payment successful!");
            fetchOrders(); // refresh orders
          } else {
            alert("❌ Payment verification failed");
          }
        } catch (err) {
          console.error("Verification error:", err);
          alert("❌ Error verifying payment");
        }
      },
      prefill: { email: user.email },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Payment error", err.response?.data || err.message);
    alert("Error in processing payment");
  }
};


  // ✅ Cancel Order
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await axios.put(
        `https://ecom-backend-zed3.onrender.com/api/payments/cancel/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (res.data.success) {
        alert("✅ Order cancelled!");
        fetchOrders(); // refresh list
      } else {
        alert("❌ Could not cancel order");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("❌ Error cancelling order");
    }
  };

  return (
    <div className="p=5 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Your Orders
      </h1>
      {loading ? (
        <p className="text-center">Loading Orders....</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders placed yet.</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          {orders.map((order) => {
            return (
              <div
                key={order._id}
                className="bg-white shadow-md rounded p-5 mb-6"
              >
                <h2 className="text-xl font-semibold mb-2">
                  Order Id: <span className="text-blue-500">{order._id}</span>
                </h2>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      order.status === "Paid"
                        ? "text-green-600"
                        : order.status === "Cancelled"
                        ? "text-red-600"
                        : "text-yellow-500"
                    }
                  >
                    {order.status}
                  </span>
                </p>
                <p>
                  <strong>Total Price:</strong>{" "}
                  <span className="text-green-500">₹{order.totalPrice}</span>
                </p>
                <h3 className="text-lg font-semibold mt-4 mb-2">🛍️ Items:</h3>
                {order.products?.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded p-2 mb-2 flex justify-between items-center"
                  >
                    <span>{item?.product?.name || "Product Not Found"}</span>
                    <span>
                      ₹{item?.product?.price || 0} ❌ {item.quantity}
                    </span>
                  </div>
                ))}

                {/* ✅ Buttons for Pending Orders */}
                {order.status === "Pending" && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() =>
                        proceedToPayment(order.totalPrice, order._id)
                      }
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded shadow"
                    >
                      Proceed to Payment
                    </button>
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded shadow"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Order;
