import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    token: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    const emailFromUrl = searchParams.get('email');

    if (tokenFromUrl && emailFromUrl) {
      setFormData(prev => ({
        ...prev,
        token: tokenFromUrl,
        email: emailFromUrl,
      }));
    } else {
      setError("رابط إعادة التعيين غير صالح أو منتهي الصلاحية.");
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    // التحقق من المدخلات
    if (!formData.password || !formData.confirmPassword) {
      setError('يجب ملء كلا الحقلين.');
      return;
    }
    if (formData.password.length < 8) {
      setError('يجب أن تكون كلمة المرور 8 أحرف على الأقل.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    setLoading(true);

    try {
      // إرسال البيانات المطلوبة إلى الخادم
      await apiClient.post('/reset-password', {
        token: formData.token,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });

      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);

    } catch (apiError) {
      const message = apiError.response?.data?.message || 'فشل في تحديث كلمة المرور.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!formData.token && error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md text-center p-8">
          <p className="text-red-600 font-semibold">{error}</p>
          <Link to="/forgot-password" className="text-cyan-600 hover:underline block mt-4">
            اطلب رابطاً جديداً
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {success ? (
          <div className="text-center">
            <h2 className="text-xl font-bold text-green-600 mb-3">✅ تم تحديث كلمة المرور بنجاح!</h2>
            <p className="text-neutral-700">سيتم الآن تحويلك إلى صفحة تسجيل الدخول...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-cyan-700 mb-6 text-center">تعيين كلمة مرور جديدة</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="password" className="block mb-1 font-medium text-neutral-700">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block mb-1 font-medium text-neutral-700">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm font-semibold text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                  className="w-full py-2 bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 text-white 
                font-semibold rounded-full hover:opacity-90 transition duration-200 disabled:opacity-50"
              >
                {loading ? 'جارٍ التحديث...' : 'تحديث كلمة المرور'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
