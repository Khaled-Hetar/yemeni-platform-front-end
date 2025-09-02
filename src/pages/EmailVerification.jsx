import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const EmailVerificationNotice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [email, setEmail] = useState('بريدك الإلكتروني');
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    } else {
      const locEmail = location.state?.email;
      if (locEmail) {
        localStorage.setItem('pending_email', locEmail);
        setEmail(locEmail);
      } else {
        setEmail(localStorage.getItem('pending_email') || 'بريدك الإلكتروني');
      }
    }
  }, [user, location.state?.email]);

  const handleResend = async () => {
    setResending(true);
    setMessage('');
    try {
      await apiClient.post('/email/verification-notification');
      setMessage('✅ تم إرسال رابط التفعيل مرة أخرى بنجاح.');
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء محاولة إعادة الإرسال.';
      setMessage(`❌ ${errorMessage}`);
    } finally {
      setResending(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('pending_email');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-sky-700 mb-4">تحقق من بريدك الإلكتروني</h2>
        <p className="text-neutral-700 text-base mb-2">
          لقد أرسلنا رابط تفعيل إلى:
        </p>
        <p className="text-cyan-600 font-semibold text-lg mb-4 break-all">{email}</p>
        <p className="text-sm text-neutral-600 mb-6">
          يرجى النقر على الرابط الموجود في الرسالة لإكمال عملية التسجيل.
            

          إذا لم تجد الرسالة، يرجى التحقق من مجلد الرسائل غير المرغوب فيها (Spam).
        </p>
        {message && (
          <p
            className={`mb-4 text-sm font-medium ${
              message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
        <button
          onClick={handleResend}
          disabled={resending}
          className="w-full mb-3 py-2 px-4 bg-cyan-600 text-white rounded-lg 
            font-medium hover:bg-cyan-700 transition disabled:opacity-60"
        >
          {resending ? '...جاري الإرسال' : 'إعادة إرسال رابط التفعيل'}
        </button>
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 border border-gray-300 text-gray-700 
            rounded-lg font-medium hover:bg-gray-100 transition"
        >
          العودة إلى تسجيل الدخول
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationNotice;
