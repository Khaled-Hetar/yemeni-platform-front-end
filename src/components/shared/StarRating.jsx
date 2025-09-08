import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex justify-center my-4">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index} aria-label={`${ratingValue} نجوم`}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => onRatingChange(ratingValue)}
              className="hidden"
            />
            <FaStar
              className="cursor-pointer transition-colors"
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              size={40}
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
