import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { FaDollarSign, FaClock, FaCommentDots, FaArrowLeft } from "react-icons/fa";

const SubmitProposalPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    price: '',
    duration: '',
    message: '',
  });
  
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
      if (!projectId) {
        setError("لم يتم تحديد معرّف المشروع في الرابط.");
        setLoadingProject(false);
        return;
      }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const proposalData = {
      price: formData.price,
      duration: formData.duration,
      message: formData.message,
    };

    try {
      await apiClient.post(`/projects/${projectId}/proposals`, proposalData);
      
      setSuccess(true);
      setTimeout(() => navigate(`/projects/${projectId}`), 3000);

    } catch (apiError) {
      console.error('فشل إرسال العرض:', apiError);
      if (apiError.response && apiError.response.status === 422) {
        setError("يرجى التأكد من أن جميع البيانات المدخلة صحيحة.");
      } else {
        setError('حدث خطأ أثناء إرسال العرض. قد تكون قدمت عرضاً لهذا المشروع من قبل.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProject) return <div className="p-8 text-center">جاري تحميل تفاصيل المشروع...</div>;
  if (error && !project) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!project) return <div className="p-8 text-center text-gray-500">لا توجد بيانات للمشروع.</div>;

  if (success) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center bg-white rounded-2xl shadow my-8">
        <h2 className="text-2xl font-bold text-green-600 mb-4">✅ تم إرسال عرضك بنجاح!</h2>
        <p className="text-neutral-600">سيتم الآن إعادتك إلى صفحة المشروع.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow border my-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-sky-600 font-semibold mb-6">
        <FaArrowLeft />
        <span>العودة إلى تفاصيل المشروع</span>
      </button>

      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-sky-700">تقديم عرض للمشروع</h1>
        <p className="text-neutral-600 mt-1">{project.title}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="price" className="text-neutral-700 font-medium mb-1 flex items-center gap-2">
            <FaDollarSign className="text-green-600" /> السعر المقترح (بالدولار)
          </label>
          <input 
            type="number" 
            id="price" 
            name="price" 
            value={formData.price} 
            onChange={handleChange} 
            required 
            className="w-full p-3 border rounded-xl focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label htmlFor="duration" className="text-neutral-700 font-medium mb-1 flex items-center gap-2">
            <FaClock className="text-red-500" /> المدة المطلوبة (بالأيام)
          </label>
          <input 
            type="number" 
            id="duration" 
            name="duration" 
            value={formData.duration} 
            onChange={handleChange} 
            required 
            className="w-full p-3 border rounded-xl focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label htmlFor="message" className="text-neutral-700 font-medium mb-1 flex items-center gap-2">
            <FaCommentDots className="text-sky-600" /> رسالة إلى صاحب المشروع
          </label>
          <textarea 
            id="message" 
            name="message" 
            value={formData.message} 
            onChange={handleChange} 
            required 
            className="w-full p-3 border rounded-xl resize-none min-h-[120px] focus:outline-none focus:border-cyan-500"
          />
        </div>

        {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

        <button 
          type="submit" 
          disabled={submitting} 
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl text-lg 
            font-medium w-full transition disabled:opacity-50">
          {submitting ? 'جارٍ الإرسال...' : 'إرسال العرض'}
        </button>
      </form>
    </div>
  );
};

export default SubmitProposalPage;
