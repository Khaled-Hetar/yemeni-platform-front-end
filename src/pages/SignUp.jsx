import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';


const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return Math.min(score, 5);
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstname) newErrors.firstname = 'الاسم الأول مطلوب.';
    if (!formData.lastname) newErrors.lastname = 'الاسم الأخير مطلوب.';
    if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين.';
    if (formData.password.length < 8) newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.';
    if (!agreedToTerms) newErrors.terms = 'يجب الموافقة على الشروط والأحكام للمتابعة.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await apiClient.post('/register', {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });
      
      const { user, token } = response.data;

      login(user, token);
      navigate('/account-type');

    } catch (error) {
  if (error.response && error.response.status === 422) {
      const validationErrors = error.response.data.errors;
      const newErrors = {};
      // تحويل أخطاء Laravel إلى شكل يمكن للواجهة عرضه
      for (const key in validationErrors) {
        // Laravel يرسل اسم الحقل كمفتاح، والخطأ كمصفوفة
        newErrors[key] = validationErrors[key][0];
      }
      setErrors(newErrors);
    } else {
      // معالجة الأخطاء الأخرى
      setErrors({ api: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.' });
    }
    console.error("Signup Error:", error);
  }
 finally {
      setLoading(false);
    }
  };

  const getStrengthInfo = () => {
    switch (passwordStrength) {
      case 1: return { color: 'bg-red-500', text: 'ضعيفة' };
      case 2: return { color: 'bg-yellow-500', text: 'متوسطة' };
      case 3: return { color: 'bg-blue-500', text: 'جيدة' };
      case 4: return { color: 'bg-sky-500', text: 'قوية' };
      case 5: return { color: 'bg-green-500', text: 'قوية جداً' };
      default: return { color: 'bg-gray-300', text: '' };
    }
  };
  const strengthInfo = getStrengthInfo();

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-4 my-8">
      <h2 className="text-2xl font-bold text-center text-cyan-700 mb-4">إنشاء حساب جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstname" className="font-bold">الاسم الأول:</label>
            <input type="text" id="firstname" name="firstname" placeholder="خالد"
              required value={formData.firstname} onChange={handleChange}
              className={`w-full p-2 mt-1 border-2 rounded-md outline-none 
              ${errors.firstname ? 'border-red-500' : 'border-gray-300 focus:border-cyan-500'}`} />
            {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>}
          </div>

          <div>
            <label htmlFor="lastname" className="font-bold">الاسم الأخير:</label>
            <input type="text" id="lastname" name="lastname" placeholder="هتار"
              required value={formData.lastname} onChange={handleChange}
              className={`w-full p-2 mt-1 border-2 rounded-md outline-none 
              ${errors.lastname ? 'border-red-500' : 'border-gray-300 focus:border-cyan-500'}`} />
            {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="font-bold">البريد الإلكتروني:</label>
          <input type="email" id="email" name="email" placeholder="example@gmail.com"
            required value={formData.email} onChange={handleChange}
            className={`w-full p-2 mt-1 border-2 rounded-md outline-none 
            ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-cyan-500'}`} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div className="relative">
          <label htmlFor="password" className="font-bold">كلمة المرور:</label>
          <input type={showPassword ? 'text' : 'password'} id="password" name="password"
            placeholder="********" required value={formData.password} onChange={handleChange}
            className={`w-full p-2 mt-1 border-2 rounded-md outline-none ${errors.password ? 'border-red-500'
              : 'border-gray-300'}`} />
          <span onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-[60%] -translate-y-1/2 text-xl text-gray-500 cursor-pointer"><FaEye /></span>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          {formData.password && (
            <div className="space-y-1 mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-300 ${strengthInfo.color}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}>
                </div>
              </div>
              <p className="text-xs text-right text-gray-500">{strengthInfo.text}</p>
            </div>
          )}
        </div>

        <div className="relative">
          <label htmlFor="confirmPassword" className="font-bold">تأكيد كلمة المرور:</label>
          <input type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword" name="confirmPassword" placeholder="********" required
            value={formData.confirmPassword} onChange={handleChange}
            className={`w-full p-2 mt-1 border-2 rounded-md outline-none ${errors.confirmPassword
              ? 'border-red-500' : 'border-gray-300'}`} />
          <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute left-3 top-[60%] -translate-y-1/2 text-xl text-gray-500 cursor-pointer"><FaEye /></span>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        <div className="space-y-1">
          <div className="flex items-center"><input type="checkbox" id="terms" checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500" />
            <label htmlFor="terms" className="mr-2 text-sm text-gray-700">
              أقر بأنني قرأت ووافقت على
              <Link to="/terms" className="text-cyan-600 hover:underline">
                شروط الاستخدام</Link> و <Link to="/privacy" className="text-cyan-600 hover:underline">سياسة الخصوصية</Link>.
            </label>
          </div>
          {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
        </div>

        {errors.api && <p className="text-red-600 text-center font-semibold">{errors.api}</p>}
        <button type="submit" disabled={loading}
          className={`w-full p-3 bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-300 
          text-white rounded-full text-lg font-medium transition ${loading ? 'opacity-50 cursor-not-allowed'
              : 'hover:opacity-90'}`}>
          {loading ? 'جارٍ المعالجة...' : 'إنشاء الحساب'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
