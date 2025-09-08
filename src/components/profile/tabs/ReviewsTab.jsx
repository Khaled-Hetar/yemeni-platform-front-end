// src/components/profile/tabs/ReviewsTab.jsx
import React from 'react';
import ReviewCard from './ReviewCard'; // سننشئ هذا المكون الآن

const ReviewsTab = ({ reviews, userName }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border">
    <h3 className="text-lg font-semibold text-cyan-700 mb-4">تقييمات حصل عليها {userName}</h3>
    {reviews.length > 0 ? (
      <div className="space-y-4">
        {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
      </div>
    ) : (
      <p className="text-gray-500 text-center py-8">لم يحصل هذا المستخدم على أي تقييمات بعد.</p>
    )}
  </div>
);

export default ReviewsTab;
