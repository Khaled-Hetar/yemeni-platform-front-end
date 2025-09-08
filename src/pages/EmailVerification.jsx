// src/pages/EmailVerificationNotice.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

// استيراد المكونات
import VerificationHeader from '../components/email-verification/VerificationHeader';
import ActionButtons from '../components/email-verification/ActionButtons';

const EmailVerificationNotice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [email, setEmail] = useState('بريدك الإلكتروني');
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // التحسين المنطقي: تبسيط منطق جلب البريد الإلكتروني
    const userEmail = user?.email || location.state?.email;
    if (userEmail) {
      setEmail(userEmail);
    } else {
      // كحل أخير إذا لم يتم العثور على البريد الإلكتروني
      navigate('/login');
    }
  }, [user, location.state, navigate]);

  const handleResend = useCallback(async () => {
    setResending(true);
    setMessage('');
    try {
      // Laravel Sanctum يحمي هذا المسار تلقائيًا للمستخدم المسجل
      await apiClient.post('/email/verification-notification');
      setMessage('✅ تم إرسال رابط التفعيل مرة أخرى بنجاح.');
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء محاولة إعادة الإرسال.';
      setMessage(`❌ ${errorMessage}`);
    } finally {
      setResending(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  // ===============================================================
  // قسم الـ JSX (تم الحفاظ عليه كما هو من تصميمك الأصلي 100%)
  // ===============================================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center">
        <VerificationHeader email={email} />
        <ActionButtons 
          onResend={handleResend}
          onLogout={handleLogout}
          isResending={resending}
          message={message}
        />
      </div>
    </div>
  );
};

export default EmailVerificationNotice;
