// src/pages/SubmitReviewPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

// استيراد المكونات
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import ReviewHeader from '../components/submit-review/ReviewHeader';
import ReviewForm from '../components/submit-review/ReviewForm';

const SubmitReviewPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // التحسين المنطقي: جلب المشروع مع المستقل في طلب واحد
        const response = await apiClient.get(`/projects/${projectId}?with=freelancer`);
        const projectData = response.data;

        if (!projectData.freelancer) {
          setError("لا يوجد مستقل مرتبط بهذا المشروع لتقييمه.");
        } else if (projectData.status !== 'completed') {
          // لا يمكن تقييم مشروع لم يكتمل بعد
          setError("لا يمكن تقييم هذا المشروع إلا بعد اكتماله.");
        }
        setProject(projectData);
      } catch (err) {
        setError("فشل في تحميل بيانات المشروع.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const handleSubmitReview = useCallback(async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("يرجى تحديد تقييم بالنجوم.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // التحسين المنطقي: استخدام نقطة نهاية متداخلة
      await apiClient.post(`/projects/${projectId}/reviews`, {
        rating: rating,
        comment: comment,
      });
      
      alert("شكرًا لك على تقييمك!");
      navigate(`/profile/${project.freelancer.id}`);

    } catch (err) {
      setError("حدث خطأ أثناء إرسال التقييم. قد تكون قيمت هذا المشروع من قبل.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }, [projectId, rating, comment, navigate, project?.freelancer.id]);

  if (loading) return <LoadingState message="جاري تحميل صفحة التقييم..." />;
  if (error) return <ErrorState message={error} />;
  if (!project || !project.freelancer) return <ErrorState message="بيانات المشروع أو المستقل غير مكتملة." />;

  // ===============================================================
  // قسم الـ JSX (تم الحفاظ عليه كما هو من تصميمك الأصلي 100%)
  // ===============================================================
  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg border">
        <ReviewHeader project={project} freelancer={project.freelancer} />
        <main>
          <ReviewForm 
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            onSubmit={handleSubmitReview}
            isSubmitting={submitting}
          />
        </main>
      </div>
    </div>
  );
};

export default SubmitReviewPage;
