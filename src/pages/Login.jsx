import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/redirect`;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
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
    const response = await apiClient.post('/login', {
      email: formData.email,
      password: formData.password,
    });

    const { user, token } = response.data;

    login(user, token);
    navigate('/dashboard');

  } catch (error) {
    if (error.response && error.response.status === 401) {
      setErrors({ api: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
    } else if (error.response && error.response.status === 422) {
      setErrors({ api: 'البيانات المدخلة غير صحيحة.' });
    } else {
      setErrors({ api: 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.' });
    }
    console.error("Login error:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">تسجيل الدخول</h2>
        
        {/* زر الإشتراك عن طريق جوجل */}
        <div className="flex items-center justify-center mb-6">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 w-full max-w-xs 
            bg-white border border-gray-300 p-2 rounded-2xl shadow 
            hover:bg-gray-100 transition font-medium text-gray-800"
          >
            <FcGoogle className="w-6 h-6" />
            المتابعة باستخدام جوجل
          </button>
        </div>
        <div className="flex items-center gap-4 my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="text-gray-500 text-sm">أو</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <form autoComplete="off" className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-xl outline-none transition
               ${errors.email ? 'border-red-500 ring-1 ring-red-500' :
                'border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">كلمة المرور</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 border rounded-xl outline-none transition ${errors.password ? 
                'border-red-500 ring-1 ring-red-500' :
                'border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'}`}
            />
            <span onClick={() => setShowPassword(!showPassword)} className="absolute text-xl left-3 
            top-10 text-gray-500 cursor-pointer select-none">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label htmlFor="remember" className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="remember" name='remember' checked={remember}
                onChange={(e) => setRemember(e.target.checked)} className="rounded" />
              تذكرني
            </label>
            <Link to="/forgot-password" className="text-cyan-600 hover:underline">
              هل نسيت كلمة المرور؟
            </Link>
          </div>

          {errors.api && (
            <div className="text-red-600 text-center text-sm font-medium p-2 bg-red-50 rounded-lg">{errors.api}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-sky-600 text-white rounded-xl text-lg font-medium 
            hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>

          <p className="text-center text-sm text-gray-600 pt-4">
            ليس لديك حساب؟{' '}
            <Link to="/signup" className="font-medium text-cyan-600 hover:underline">
              أنشئ حساباً
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
