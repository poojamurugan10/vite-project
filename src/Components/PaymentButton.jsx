import React from "react";
import axios from "axios";

export default function PaymentButton({ amount }) {
  const handlePayment = async () => {
    try {
      // 1️⃣ Create order on backend
      const { data } = await axios.post("http://localhost:5000/api/payment/checkout", {
        amount,
      });

      if (!data.success) {
        alert("Order creation failed!");
        return;
      }

      // 2️⃣ Setup Razorpay options
      const options = {
        key: data.key,              // ✅ backend key
        amount: data.amount,        // paise
        currency: data.currency,
        name: "My Ecom Store",
        description: "Test Transaction",
        order_id: data.orderId,     // ✅ Razorpay order_id
        handler: async function (response) {
          try {
            // 3️⃣ Verify payment on backend
            const verifyRes = await axios.post("http://localhost:5000/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.dbOrderId, // 👈 your MongoDB order
            });

            if (verifyRes.data.success) {
              // Redirect on success
              window.location.href = "http://localhost:5173/payment-success";
            } else {
              window.location.href = "http://localhost:5173/payment-failed";
            }
          } catch (err) {
            console.error("Verification error:", err);
            window.location.href = "http://localhost:5173/payment-failed";
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong during payment");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="px-4 py-2 bg-green-500 text-white rounded"
    >
      Pay ₹{amount}
    </button>
  );
}
