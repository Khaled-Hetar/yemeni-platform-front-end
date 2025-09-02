import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

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

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(''); 
  };

  const handleSubmit = async (e) => {
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
        navigate('/settings');
      }, 3000);

    } catch (apiError) {
      const message = apiError.response?.data?.message || 'حدث خطأ أثناء تحديث كلمة المرور.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const iconClass = "absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 cursor-pointer";
  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-cyan-700 mb-6 text-center">تغيير كلمة المرور</h2>

        {success ? (
          <div className="text-center text-green-600 font-semibold">
            ✅ تم تحديث كلمة المرور بنجاح!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="current_password" className="block mb-1 font-medium text-neutral-700">كلمة المرور الحالية</label>
              <div className="relative">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  id="current_password"
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <span onClick={() => setShowOldPassword(!showOldPassword)} className={iconClass}>
                  {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block mb-1 font-medium text-neutral-700">كلمة المرور الجديدة</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <span onClick={() => setShowNewPassword(!showNewPassword)} className={iconClass}>
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            
            <div>
              <label htmlFor="password_confirmation" className="block mb-1 font-medium text-neutral-700">تأكيد كلمة المرور</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={iconClass}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
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
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
