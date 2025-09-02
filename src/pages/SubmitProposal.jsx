import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaDollarSign, FaClock, FaCommentDots } from "react-icons/fa";
import apiClient from './api/axiosConfig';

const SubmitProposalPage = () => {
  // --- نقطة طباعة 1: هل نحصل على projectId من الرابط؟ ---
  const { projectId } = useParams();
  console.log('[SubmitProposal] 1. projectId من الرابط هو:', projectId);

  const navigate = useNavigate();

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
    const fetchProject = async () => {
      setLoadingProject(true);
      setError('');
      console.log('[SubmitProposal] 2. useEffect بدأ لجلب المشروع.');

      if (!projectId) {
        console.error('[SubmitProposal] خطأ فادح: projectId هو undefined. لا يمكن المتابعة.');
        setError("لم يتم تحديد معرّف المشروع في الرابط.");
        setLoadingProject(false);
        return;
      }

      try {
        const requestUrl = `/projects/${projectId}`;
        console.log('[SubmitProposal] 3. سيتم طلب المشروع من الرابط:', requestUrl);
        const response = await apiClient.get(requestUrl);
        
        // --- نقطة طباعة 4: ماذا أعاد الخادم؟ ---
        console.log('[SubmitProposal] 4. تم استلام استجابة للمشروع:', response);
        setProject(response.data);

      } catch (err) {
        console.error('[SubmitProposal] 5. فشل جلب المشروع!', err);
        setError("لا يمكن العثور على المشروع المطلوب. تأكد من صحة الرابط.");
      } finally {
        setLoadingProject(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    console.log('[SubmitProposal] 6. تم الضغط على زر إرسال العرض.');

    const currentUserId = "1"; 

    const proposalData = {
      // تحويل القيم الرقمية قبل الإرسال
      price: Number(formData.price),
      duration: Number(formData.duration),
      message: formData.message,
      projectId: projectId,
      userId: currentUserId,
      submittedAt: new Date().toISOString(),
    };

    // --- نقطة طباعة 7: ما هي البيانات التي سنرسلها؟ ---
    console.log('[SubmitProposal] 7. البيانات التي سيتم إرسالها (proposalData):', proposalData);

    try {
      const postUrl = '/proposals';
      console.log('[SubmitProposal] 8. سيتم إرسال POST إلى الرابط:', postUrl);
      const response = await apiClient.post(postUrl, proposalData);

      // --- نقطة طباعة 9: ماذا كانت نتيجة الإرسال؟ ---
      console.log('[SubmitProposal] 9. نجح الإرسال! استجابة الخادم:', response);
      
      setSuccess(true);
      setTimeout(() => navigate(`/projects/${projectId}`), 3000);

    } catch (apiError) {
      // --- نقطة طباعة 10: لماذا فشل الإرسال؟ ---
      console.error('[SubmitProposal] 10. فشل إرسال العرض!', apiError);
      if (apiError.response) {
        console.error('   - بيانات الخطأ:', apiError.response.data);
        console.error('   - حالة الخطأ:', apiError.response.status);
      }
      setError('حدث خطأ أثناء إرسال العرض. يرجى مراجعة الكونسول.');
    } finally {
      setSubmitting(false);
    }
  };

  // ... باقي كود JSX يبقى كما هو ...
  if (loadingProject) return <div className="p-8 text-center">جاري تحميل تفاصيل المشروع...</div>;
  if (error && !project) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!project) return <div className="p-8 text-center text-gray-500">لا توجد بيانات للمشروع.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow border border-gray-200 mt-6">
      {success ? (
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-green-600 mb-4">✅ تم إرسال عرضك بنجاح!</h2>
          <p className="text-gray-600">سيتم الآن إعادتك إلى صفحة المشروع.</p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-sky-700 mb-4">تقديم عرض للمشروع</h1>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-neutral-800">{project.title}</h2>
            <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{project.description}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ... حقول النموذج ... */}
             <div>
              <label htmlFor="price">السعر</label>
              <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="duration">المدة</label>
              <input type="number" id="duration" name="duration" value={formData.duration} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="message">الرسالة</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} required />
            </div>
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            <button type="submit" disabled={submitting}>
              {submitting ? 'جارٍ الإرسال...' : 'إرسال العرض'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default SubmitProposalPage;
