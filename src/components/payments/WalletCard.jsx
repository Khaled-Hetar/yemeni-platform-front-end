// src/components/payments/WalletCard.jsx
import React from 'react';
import { FaWallet } from "react-icons/fa";

const WalletCard = ({ balance }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl shadow-md bg-gradient-to-r from-neutral-700 to-neutral-500 text-white">
    <div className="text-3xl">
      <FaWallet />
    </div>
    <div>
      <div className="text-sm font-semibold">المحفظة</div>
      <div className="text-xs">
        الرصيد: ${Number(balance).toFixed(2)}
      </div>
    </div>
  </div>
);

export default WalletCard;
