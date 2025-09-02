import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import apiClient from '../api/axiosConfig'; 

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-cyan-700 mb-8">اتصل بنا</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <FaPhoneAlt className="text-cyan-600 text-2xl mt-1" />
            <div>
              <h3 className="font-semibold text-neutral-700 text-lg">رقم الهاتف</h3>
              <p className="text-sm text-neutral-600">+96777******</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaEnvelope className="text-cyan-600 text-2xl mt-1" />
            <div>
              <h3 className="font-semibold text-neutral-700 text-lg">البريد الإلكتروني</h3>
              <p className="text-sm text-neutral-600">support@example.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaMapMarkerAlt className="text-cyan-600 text-2xl mt-1" />
            <div>
              <h3 className="font-semibold text-neutral-700 text-lg">العنوان</h3>
              <p className="text-sm text-neutral-600">الحديدة، اليمن</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow border space-y-5">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-neutral-700">الاسم الكامل</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="أدخل اسمك الكامل"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm 
                focus:outline-none focus:border-cyan-500 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-neutral-700">البريد الإلكتروني</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm 
                focus:outline-none focus:border-cyan-500 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-neutral-700">الرسالة</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="اكتب رسالتك هنا..."
              className="w-full border resize-none border-gray-300 rounded-xl px-4 py-2 text-sm 
                focus:outline-none focus:border-cyan-500 transition"
              required
            ></textarea>
          </div>

          {/* عرض رسائل النجاح أو الخطأ */}
          {success && <p className="text-green-600 text-sm text-center">✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.</p>}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-4 
              rounded-xl transition text-sm font-semibold disabled:opacity-50"
          >
            {loading ? 'جارٍ الإرسال...' : 'إرسال'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
