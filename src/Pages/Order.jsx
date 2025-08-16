import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.token) {
      navigate("/login");
      return;
    }
    axios
      .get("https://ecom-backend-zed3.onrender.com/api/order/myorders", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        const fetchedOrders = res.data.data || [];
        setOrders(fetchedOrders);
        setLoading(false);

        let combinedItems = [];
        let total = 0;
        fetchedOrders.forEach((order) => {
          combinedItems = [...combinedItems, ...order.products];
          total += order.totalPrice;
        });
        setAllItems(combinedItems);
        setTotalAmount(total);
      })
      .catch((err) => {
        console.log(err);
        alert("Error in fetching order");
        setLoading(false);
      });
  }, [user, navigate]);

  const proceedToPayment = async () => {
  if (!user || !user.token) {
    navigate("/login");
    return;
  }

  try {
    const res = await axios.post(
      "https://ecom-backend-zed3.onrender.com/api/payments/checkout",
      { amount: totalAmount },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    const { orderId, amount, currency, key } = res.data;

    const options = {
      key,
      amount,
      currency,
      name: "E-Comm Store",
      description: "Order Payment",
      order_id: orderId,
      handler: function (response) {
        alert("Payment successful!");
        console.log(response);
        // You can now verify payment on backend if needed
      },
      prefill: {
        email: user.email,
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Payment error", err.response?.data || err.message);
    alert("Error in processing payment");
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
                  <strong>Status:</strong>
                  <span className="text-yellow-500">{order.status}</span>
                </p>
                <p>
                  <strong>Total Price:</strong>
                  <span className="text-green-500">${order.totalPrice}</span>
                </p>
                <h3 className="text-lg font-semibold mt-4 mb-2">🛍️Items:</h3>
                {order.products?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="border rounded p-2 mb-2 flex justify-between items-center"
                    >
                      <span>{item?.product?.name || "Product Not Found"}</span>
                      <span>
                        {item?.product?.price || 0} ❌ {item.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {orders.some((order) => order.status === "Pending") && (
            <button
              onClick={proceedToPayment}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded shadow mt-4 mb-4"
            >
              Proceed to Payment
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Order;