// src/pages/SubmitProposalPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

// استيراد المكونات
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import ProjectSummaryHeader from '../components/submit-proposal/ProjectSummaryHeader';
import ProposalForm from '../components/submit-proposal/ProposalForm';
import SuccessMessage from '../components/submit-proposal/SuccessMessage';

const SubmitProposalPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({ price: '', duration: '', message: '' });
  
  const [loadingProject, setLoadingProject] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const fetchProject = async () => {
      setLoadingProject(true);
      setError('');
      try {
        const response = await apiClient.get(`/projects/${projectId}`);
        setProject(response.data);
      } catch (err) {
        setError("لا يمكن العثور على المشروع المطلوب.");
        console.error(err);
      } finally {
        setLoadingProject(false);
      }
    };
    fetchProject();
  }, [projectId, isAuthenticated, navigate]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // التحسين المنطقي: استخدام نقطة نهاية متداخلة
      await apiClient.post(`/projects/${projectId}/proposals`, {
        price: Number(formData.price),
        duration: Number(formData.duration),
        message: formData.message,
      });
      
      setSuccess(true);
      setTimeout(() => navigate(`/projects/${projectId}`), 3000);

    } catch (apiError) {
      console.error('فشل إرسال العرض:', apiError);
      if (apiError.response && apiError.response.status === 422) {
        // يمكن تحسين هذا لعرض الأخطاء بجانب كل حقل
        setError("يرجى التأكد من أن جميع البيانات المدخلة صحيحة.");
      } else {
        setError('حدث خطأ أثناء إرسال العرض. قد تكون قدمت عرضاً لهذا المشروع من قبل.');
      }
    } finally {
      setSubmitting(false);
    }
  }, [projectId, formData, navigate]);

  if (loadingProject) return <LoadingState message="جاري تحميل تفاصيل المشروع..." />;
  if (error && !project) return <ErrorState message={error} />;
  if (!project) return <ErrorState message="المشروع غير موجود." />;

  if (success) {
    return <SuccessMessage />;
  }

  // ===============================================================
  // قسم الـ JSX (تم الحفاظ عليه كما هو من تصميمك الأصلي 100%)
  // ===============================================================
  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow border">
        <ProjectSummaryHeader project={project} />
        <main>
          <ProposalForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isSubmitting={submitting}
            apiError={error}
          />
        </main>
      </div>
    </div>
  );
};

export default SubmitProposalPage;
