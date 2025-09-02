import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('forgotEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('صيغة البريد الإلكتروني غير صحيحة.');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/forgot-password', { email });
      
      localStorage.setItem('forgotEmail', email); 
      setEmailSent(true);

    } catch (apiError) {
      const message = apiError.response?.data?.message || 'حدث خطأ ما، يرجى المحاولة مرة أخرى.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {!emailSent ? (
          <>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-cyan-700 mb-2">استعادة كلمة المرور</h2>
              <p className="text-neutral-600 text-sm">
                أدخل بريدك الإلكتروني المسجّل وسنرسل لك التعليمات.
              </p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                  focus:border-cyan-500 placeholder-gray-400"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center font-semibold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 
                text-white font-semibold rounded-full hover:opacity-90 transition duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جارٍ الإرسال...' : 'إرسال التعليمات'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold text-green-600 mb-3">✅ تم إرسال التعليمات</h2>
            <p className="text-neutral-700">
                إذا كان البريد الإلكتروني
                <strong className="font-semibold">{email}</strong>
                مسجلاً لدينا، فستصلك رسالة تحتوي على رابط لإعادة تعيين كلمة المرور خلال الدقائق القادمة.
            </p>
            <p className="text-sm text-neutral-500 mt-4">
              (يرجى التحقق من مجلد الرسائل غير المرغوب فيها Spam)
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-cyan-600 hover:underline">
            العودة إلى تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
