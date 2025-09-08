// src/components/payments/PaymentMethodCard.jsx
import React from 'react';
import { FaPaypal, FaCreditCard } from "react-icons/fa";

const PaymentMethodCard = ({ method }) => {
  const isPaypal = method.type.toLowerCase() === "paypal";
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl shadow-md bg-gradient-to-r from-cyan-600 to-cyan-300 text-white">
      <div className="text-3xl">
        {isPaypal ? <FaPaypal /> : <FaCreditCard />}
      </div>
      <div>
        <div className="text-sm font-semibold">{method.type}</div>
        <div className="text-xs">{method.masked_details}</div>
      </div>
    </div>
  );
};

export default PaymentMethodCard;
