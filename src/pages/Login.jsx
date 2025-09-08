import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import Divider from '../components/auth/Divider';


const InputField = ({ id, label, type, value, onChange, error, placeholder, children }) => (
  <div>
    <label htmlFor={id} className="block mb-2 font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-3 border rounded-lg outline-none transition duration-200 bg-gray-50
           ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'}`}
      />
      {children}
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // إزالة الخطأ عند بدء الكتابة
    if (errors[name] || errors.api) {
      setErrors(prev => ({ ...prev, [name]: null, api: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة.';
    }
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // إرسال طلب POST إلى نقطة نهاية /login في Laravel
      const response = await apiClient.post('/login', formData);

      const { user, token } = response.data;

      // استدعاء دالة login من AuthContext لحفظ بيانات المستخدم والتوكن
      login(user, token);

      // توجيه المستخدم إلى لوحة التحكم أو الصفحة الرئيسية بعد تسجيل الدخول
      navigate('/dashboard');

    } catch (error) {
      const errorMessage = error.response?.status === 401
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
        : 'حدث خطأ ما. يرجى المحاولة مرة أخرى.';
      setErrors({ api: errorMessage });
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white mt-8 p-6 md:p-8 rounded-xl shadow-lg border border-gray-300">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">أهلاً بك!</h2>
            <p className="text-gray-500 mt-2">سجل دخولك للمتابعة إلى المنصة اليمنية.</p>
        </div>
        
        <GoogleLoginButton />

        <Divider />

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <InputField
            id="email"
            label="البريد الإلكتروني"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="example@email.com"
          />
          
          <InputField
            id="password"
            label="كلمة المرور"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="********"
          >
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </InputField>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
              تذكرني
            </label>
            <Link to="/forgot-password" className="font-medium text-sky-600 hover:underline">
              هل نسيت كلمة المرور؟
            </Link>
          </div>

          {errors.api && (
            <div className="text-red-600 text-center text-sm font-semibold p-3 bg-red-50 rounded-lg border border-red-200">{errors.api}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-sky-600 text-white rounded-lg text-base font-semibold hover:bg-sky-700 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>

          <p className="text-center text-sm text-gray-600 pt-4">
            ليس لديك حساب؟{' '}
            <Link to="/register" className="font-semibold text-sky-600 hover:underline">
              أنشئ حساباً جديداً
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
