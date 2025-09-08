// src/components/services/ServiceCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ServiceCard = ({ service }) => {
  if (!service || !service.user) {
    return null;
  }

  const {
    id,
    title,
    price,
    main_image_url,
    user,
    average_rating = 0,
    reviews_count = 0
  } = service;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col group"
    >
      <Link to={`/services/${id}`} className="block">
        <div className="relative">
          <img
            src={main_image_url || 'https://via.placeholder.com/400x250?text=No+Image'}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          {/* رابط للملف الشخصي للمستخدم */}
          <Link to={`/profile/${user.id}`} className="flex items-center gap-2 min-w-0">
            <img
              src={user.avatar_url || 'https://via.placeholder.com/40?text=U'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
            />
            <span className="text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors truncate">
              {user.name}
            </span>
          </Link>

          {/* عرض التقييم */}
          <div className="flex items-center gap-1 text-sm text-gray-500 flex-shrink-0">
            <FaStar className="text-yellow-400" />
            <span className="font-bold text-gray-700">{average_rating.toFixed(1 )}</span>
            <span className="hidden sm:inline">({reviews_count})</span>
          </div>
        </div>
        {/* =============================================================== */}
        {/* نهاية التعديل */}
        {/* =============================================================== */}

        {/* عنوان الخدمة */}
        <Link to={`/services/${id}`} className="block flex-grow">
          <h3 className="text-md font-semibold text-gray-800 hover:text-cyan-700 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* السعر وزر الطلب */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <p className="text-lg font-bold text-cyan-600">
            ${price.toFixed(2)}
          </p>
          <Link
            to={`/checkout/${id}`}
            className="text-sm font-semibold text-cyan-700 hover:underline"
          >
            اطلب الآن
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
