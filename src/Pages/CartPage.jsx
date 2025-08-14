import React from "react";
import PaymentButton from "./PaymentButton";

export default function CartPage() {
  const totalAmount = 500; 
  return (
    <div>
      <h2>Total: ₹{totalAmount}</h2>
      <PaymentButton amount={totalAmount} />
    </div>
  );
}
