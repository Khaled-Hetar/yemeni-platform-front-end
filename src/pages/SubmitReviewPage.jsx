// src/pages/SubmitReviewPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex justify-center my-4">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
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

const SubmitReviewPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [freelancer, setFreelancer] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        setError("لم يتم تحديد المشروع.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/projects/${projectId}?with=freelancer`);
        const projectData = response.data;

        setProject(projectData);

        if (projectData.freelancer) {
          setFreelancer(projectData.freelancer);
        } else {
          setError("لا يوجد مستقل مرتبط بهذا المشروع.");
        }
      } catch (err) {
        setError("فشل في تحميل بيانات المشروع.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("يرجى تحديد تقييم بالنجوم.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const reviewData = {
      rating: rating,
      comment: comment,
    };

    try {
      await apiClient.post(`/projects/${projectId}/reviews`, reviewData);
      
      alert("شكرًا لك على تقييمك!");
      navigate(`/profile/${freelancer.id}`);

    } catch (err) {
      setError("حدث خطأ أثناء إرسال التقييم. قد تكون قيمت هذا المشروع من قبل.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">جاري تحميل...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!project || !freelancer) return <div className="p-8 text-center">لا يمكن عرض صفحة التقييم.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 my-8 bg-white rounded-2xl shadow-lg border">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-sky-700">تقييم الخدمة المقدمة</h1>
        <p className="text-gray-600 mt-2">
          لقد أكملت مشروع <span className="font-semibold">"{project.title}"</span>.
            

          ما هو تقييمك للمستقل <span className="font-semibold">{freelancer.name}</span>؟
        </p>
      </div>

      <form onSubmit={handleSubmitReview} className="mt-8 space-y-6">
        <div>
          <label className="block text-center font-medium text-gray-700 mb-2">
            تقييمك (من 1 إلى 5 نجوم)
          </label>
          <StarRating rating={rating} setRating={setRating} />
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
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white 
              font-bold py-3 rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'جارٍ الإرسال...' : 'إرسال التقييم'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitReviewPage;
