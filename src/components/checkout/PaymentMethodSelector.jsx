import React from 'react';
import { FaCreditCard, FaPaypal, FaWallet } from "react-icons/fa";

const PaymentButton = ({ id, label, icon, activePaymentMethod, onSelect }) => (
  <button 
    type="button" 
    onClick={() => onSelect(id)} 
    className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl transition 
      ${activePaymentMethod === id ? "border-cyan-500 bg-cyan-50" : "border-gray-300 hover:bg-gray-50"}`}
  >
    {icon} {label}
  </button>
);

const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod }) => {
  const methods = [
    { id: 'card', label: 'بطاقة ائتمان', icon: <FaCreditCard className="text-cyan-600" /> },
    { id: 'paypal', label: 'PayPal', icon: <FaPaypal className="text-cyan-600" /> },
    { id: 'wallet', label: 'المحفظة', icon: <FaWallet className="text-cyan-600" /> },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-neutral-700 mb-3">اختر وسيلة الدفع</h3>
      <div className="flex gap-4">
        {methods.map(method => (
          <PaymentButton 
            key={method.id}
            {...method}
            activePaymentMethod={paymentMethod}
            onSelect={setPaymentMethod}
          />
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
