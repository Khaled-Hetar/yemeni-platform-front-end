// src/pages/ChangePassword.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

// استيراد المكونات
import ChangePasswordForm from '../components/change-password/ChangePasswordForm';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    current_password: '', 
    password: '', 
    password_confirmation: '', 
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirmation) {
      setError('كلمة المرور الجديدة وتأكيدها غير متطابقين.');
      return;
    }
    if (formData.password.length < 8) {
      setError('يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل.');
      return;
    }

    setLoading(true);

    try {
      await apiClient.put('/user/password', formData);

      setSuccess(true);
      setTimeout(() => {
        navigate('/settings'); // أو أي صفحة أخرى مناسبة
      }, 2000);

    } catch (apiError) {
      const message = apiError.response?.data?.message || 'حدث خطأ أثناء تحديث كلمة المرور.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [formData, navigate]);

  // ===============================================================
  // قسم الـ JSX (تم الحفاظ عليه كما هو من تصميمك الأصلي 100%)
  // ===============================================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-cyan-700 mb-6 text-center">تغيير كلمة المرور</h2>

        {success ? (
          <div className="text-center text-green-600 font-semibold">
            ✅ تم تحديث كلمة المرور بنجاح!
          </div>
        ) : (
          <ChangePasswordForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
