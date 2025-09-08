import React from 'react';
import { Link } from 'react-router-dom';
import DisplayStars from '@/components/profile/ReviewCard'; // افترض أن هذا المكون موجود

// رابط لصورة افتراضية
const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?u=default';

const ReviewCard = ({ review } ) => {
  // التحقق من وجود المراجع (reviewer)
  const reviewer = review.reviewer;

  // إذا لم يكن هناك مراجع، لا تعرض أي شيء لتجنب الأخطاء
  if (!reviewer) {
    return null; 
  }

  return (
    <div className="border-b py-4 last:border-b-0">
      <div className="flex items-start gap-4">
        <Link to={`/profile/${reviewer.id}`}>
          <img 
            // استخدام الصورة الرمزية أو الصورة الافتراضية
            src={reviewer.avatar_url || DEFAULT_AVATAR} 
            alt={reviewer.name} 
            className="w-12 h-12 rounded-full object-cover" 
            // معالجة خطأ تحميل الصورة
            onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
          />
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Link to={`/profile/${reviewer.id}`}>
              <h4 className="font-semibold text-gray-800 hover:underline">{reviewer.name}</h4>
            </Link>
            <span className="text-xs text-gray-500">
              {new Date(review.created_at).toLocaleDateString('ar-EG')}
            </span>
          </div>
          <div className="my-1">
            <DisplayStars rating={review.rating} />
          </div>
          <p className="text-sm text-gray-600">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
