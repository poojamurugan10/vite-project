import React from "react";
import axios from "axios";

export default function PaymentButton({ amount }) {
  const handlePayment = async () => {
    try {
      // 1️⃣ Create order on backend
      const { data } = await axios.post("http://localhost:5000/api/payment/create-order", {
        amount: amount,
      });

      if (!data.success) {
        alert("Order creation failed!");
        return;
      }

      // 2️⃣ Setup Razorpay options
      const options = {
        key: "rzp_test_R5IIEqhz9RxUJ6", 
        amount: data.amount,
        currency: data.currency,
        name: "My Ecom Store",
        description: "Test Transaction",
        order_id: data.order_id,
        handler: function (response) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
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
