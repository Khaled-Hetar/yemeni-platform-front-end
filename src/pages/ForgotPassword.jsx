// src/pages/ForgotPassword.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

// استيراد المكونات
import ForgotPasswordForm from '../components/forgot-password/ForgotPasswordForm';
import EmailSentMessage from '../components/forgot-password/EmailSentMessage';

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // التحسين المنطقي: يمكن إزالة هذا الجزء إذا لم يكن ضروريًا
    // حفظ البريد الإلكتروني في localStorage قد لا يكون أفضل ممارسة للخصوصية
    // const savedEmail = localStorage.getItem('forgotEmail');
    // if (savedEmail) {
    //   setEmail(savedEmail);
    // }
  }, []);

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('صيغة البريد الإلكتروني غير صحيحة.');
      return;
    }

    setLoading(true);

    try {
      // Laravel يتوقع هذا المسار عادةً
      await apiClient.post('/forgot-password', { email });
      
      // localStorage.setItem('forgotEmail', email); 
      setEmailSent(true);

    } catch (apiError) {
      // الخادم يجب أن يعيد دائمًا استجابة ناجحة لمنع كشف البريد الإلكتروني
      // لكن في حالة حدوث خطأ حقيقي في الخادم، نعرض رسالة عامة
      const message = apiError.response?.data?.message || 'حدث خطأ ما، يرجى المحاولة مرة أخرى.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [email]);

  // ===============================================================
  // قسم الـ JSX (تم الحفاظ عليه كما هو من تصميمك الأصلي 100%)
  // ===============================================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {!emailSent ? (
          <ForgotPasswordForm 
            email={email}
            setEmail={setEmail}
            onSubmit={handleSubmit}
            error={error}
            loading={loading}
          />
        ) : (
          <EmailSentMessage email={email} />
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
