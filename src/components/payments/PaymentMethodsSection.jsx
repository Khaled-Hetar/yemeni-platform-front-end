// src/components/payments/PaymentMethodsSection.jsx
import React from 'react';
import { MdAddCard } from "react-icons/md";
import PaymentMethodCard from './PaymentMethodCard';
import WalletCard from './WalletCard';

const PaymentMethodsSection = ({ paymentMethods, walletBalance }) => {
  const handleAddPaymentMethod = () => {
    alert("ميزة إضافة طريقة دفع ستُفعل لاحقاً");
  };

  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-700">طرق الدفع</h2>
        <button 
          onClick={handleAddPaymentMethod} 
          className="flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-xl hover:bg-sky-200 transition"
        >
          <MdAddCard /> إضافة طريقة دفع
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentMethods.map((method) => <PaymentMethodCard key={method.id} method={method} />)}
        <WalletCard balance={walletBalance} />
      </div>
    </section>
  );
};

export default PaymentMethodsSection;
