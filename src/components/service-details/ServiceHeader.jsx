import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const getStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    else stars.push(<FaRegStar key={i} className="text-gray-300" />);
  }
  return stars;
};

const ServiceHeader = ({ category, title, averageRating, reviewsCount }) => (
  <div className="mb-6">
    <span className="text-cyan-600 font-semibold text-sm">{category || 'قسم غير محدد'}</span>
    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">{title}</h1>
    <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-4">
      <div className="flex items-center gap-1">{getStars(averageRating)}</div>
      <span className="text-gray-700 font-bold">{averageRating > 0 ? averageRating.toFixed(1) : 'جديد'}</span>
      <span className="text-gray-500 text-sm">({reviewsCount} تقييم)</span>
    </div>
  </div>
);

export default ServiceHeader;
