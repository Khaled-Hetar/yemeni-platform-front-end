// src/pages/ResetPassword.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

// استيراد المكونات
import ResetPasswordForm from '../components/reset-password/ResetPasswordForm';
import SuccessMessage from '../components/reset-password/SuccessMessage';
import InvalidLinkMessage from '../components/reset-password/InvalidLinkMessage';
import LoadingState from '../components/LoadingState';

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
  const [isValidatingToken, setIsValidatingToken] = useState(true);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    const emailFromUrl = searchParams.get('email');

    if (tokenFromUrl && emailFromUrl) {
      setFormData(prev => ({ ...prev, token: tokenFromUrl, email: emailFromUrl }));
    } else {
      setError("رابط إعادة التعيين غير صالح أو منتهي الصلاحية.");
    }
    setIsValidatingToken(false);
  }, [searchParams]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(''); 

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
  }, [formData, navigate]);

  if (isValidatingToken) {
    return <LoadingState message="يتم التحقق من الرابط..." />;
  }

  if (!formData.token && error) {
    return <InvalidLinkMessage error={error} />;
  }

  // ===============================================================
  // قسم الـ JSX (تم الحفاظ عليه كما هو من تصميمك الأصلي 100%)
  // ===============================================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {success ? (
          <SuccessMessage />
        ) : (
          <ResetPasswordForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            error={error}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
