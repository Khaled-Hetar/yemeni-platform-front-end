import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const DisplayStars = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <FaStar key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"} />
    ))}
  </div>
);

const ReviewCard = ({ review }) => {
  const reviewer = review.reviewer; // Laravel سيرسل العلاقة بهذا الاسم
  if (!reviewer) return null;

  return (
    <div className="border-b py-4 last:border-b-0">
      <div className="flex items-start gap-4">
        <img src={reviewer.avatar_url} alt={reviewer.name} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <Link to={`/profile/${reviewer.id}`} className="font-semibold text-gray-800 hover:underline">{reviewer.name}</Link>
            <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString('ar-EG')}</span>
          </div>
          <DisplayStars rating={review.rating} />
          <p className="text-gray-600 mt-2">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
