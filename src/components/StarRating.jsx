// src/components/StarRating.jsx

import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

/**
 * مكون تفاعلي لعرض واختيار تقييم بالنجوم.
 * @param {object} props - الخصائص.
 * @param {number} props.rating - القيمة الحالية للتقييم (من 0 إلى 5).
 * @param {function} props.setRating - دالة لتحديث قيمة التقييم في المكون الأب.
 */
const StarRating = ({ rating, setRating }) => {
  // حالة داخلية لتتبع النجمة التي يحوم فوقها المؤشر
  const [hover, setHover] = useState(null);

  return (
    <div className="flex justify-center my-4" dir="ltr"> {/* dir="ltr" to keep stars left-to-right */}
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;

        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              // عند النقر، يتم استدعاء الدالة من المكون الأب لتحديث الحالة هناك
              onClick={() => setRating(ratingValue)}
              className="hidden" // إخفاء زر الراديو الفعلي
            />
            <FaStar
              className="cursor-pointer transition-colors duration-200"
              // لون النجمة يعتمد على قيمة التقييم الحالية أو قيمة التحويم
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              size={40}
              // تحديث حالة التحويم عند مرور الماوس
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
