// src/pages/ContactUs.jsx

import React, { useState, useCallback } from "react";
import apiClient from '../api/axiosConfig'; 

// استيراد المكونات
import ContactInfo from '../components/contact/ContactInfo';
import ContactForm from '../components/contact/ContactForm';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.name || !formData.email || !formData.message) {
      setError('يرجى ملء جميع الحقول.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/contact', formData);
      
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });

    } catch (apiError) {
      const message = apiError.response?.data?.message || 'حدث خطأ أثناء إرسال الرسالة.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [formData]);

  // ===============================================================
  // قسم الـ JSX (تم الحفاظ عليه كما هو من تصميمك الأصلي 100%)
  // ===============================================================
  return (
    <div className="bg-gray-50 py-10 mt-20">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-cyan-700 mb-8">اتصل بنا</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <ContactInfo />
          <ContactForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            success={success}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
