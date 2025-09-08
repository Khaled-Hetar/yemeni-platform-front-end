// src/components/service-details/SellerInfoCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiDollarSign } from "react-icons/fi";

const SellerInfoCard = ({ service, onContact, isContacting, isOwner }) => {
  const { user, price, id: serviceId } = service;

  if (!user) return null;

  return (
    <div className="sticky top-24">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col items-center text-center">
          <img src={user.avatar_url} alt={user.name} className="w-24 h-24 rounded-full mb-4 border-4 border-white shadow-md" />
          <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
          <Link to={`/profile/${user.id}`} className="text-sm text-cyan-600 hover:underline">عرض الملف الشخصي</Link>
        </div>
        <div className="border-t my-6"></div>
        <div className="space-y-4">
          <Link
            to={`/checkout/${serviceId}`}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            <FiDollarSign />
            <span>اطلب الخدمة الآن (${price})</span>
          </Link>
          <button 
            onClick={onContact}
            disabled={isContacting || isOwner}
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-3 rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FiMessageSquare />
            <span>{isContacting ? 'جاري التحضير...' : 'تواصل مع البائع'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerInfoCard;
