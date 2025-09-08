import React from 'react';
import StarRating from '../shared/StarRating';

const ReviewForm = ({ rating, setRating, comment, setComment, onSubmit, isSubmitting }) => (
  <form onSubmit={onSubmit} className="mt-8 space-y-6">
    <div>
      <label className="block text-center font-medium text-gray-700 mb-2">
        تقييمك (من 1 إلى 5 نجوم)
      </label>
      <StarRating rating={rating} onRatingChange={setRating} />
    </div>
    <div>
      <label htmlFor="comment" className="block mb-1 font-medium text-gray-700">
        أضف تعليقًا (اختياري)
      </label>
      <textarea
        id="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="صف تجربتك مع المستقل..."
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
        rows={4}
      />
    </div>
    <div className="pt-4 border-t">
      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white font-bold py-3 rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'جارٍ الإرسال...' : 'إرسال التقييم'}
      </button>
    </div>
  </form>
);

export default ReviewForm;
