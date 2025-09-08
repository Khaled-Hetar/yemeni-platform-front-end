import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter';
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


const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    password_confirmation: '', // مطابقة لاسم الحقل في Laravel
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name] || errors.api) {
      setErrors(prev => ({ ...prev, [name]: null, api: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = 'الاسم الأول مطلوب.';
    if (!formData.lastname.trim()) newErrors.lastname = 'الاسم الأخير مطلوب.';
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة.';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.';
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'كلمتا المرور غير متطابقتين.';
    }
    if (!agreedToTerms) {
      newErrors.terms = 'يجب الموافقة على الشروط والأحكام.';
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
      const response = await apiClient.post('/register', formData);
      const { user, token } = response.data;

      // تسجيل دخول المستخدم الجديد فورًا
      login(user, token);

      // توجيه المستخدم لإكمال ملفه الشخصي
      navigate('/account-type');

    } catch (error) {
      if (error.response && error.response.status === 422) {
        // معالجة أخطاء التحقق من Laravel (Validation Errors)
        const laravelErrors = error.response.data.errors;
        const newErrors = {};
        for (const key in laravelErrors) {
          newErrors[key] = laravelErrors[key][0];
        }
        setErrors(newErrors);
      } else {
        setErrors({ api: 'حدث خطأ غير متوقع. قد يكون البريد الإلكتروني مستخدماً بالفعل.' });
      }
      console.error("Signup Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white p-6 mt-20 md:p-8 rounded-xl shadow-lg border border-gray-300">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">إنشاء حساب جديد</h2>
            <p className="text-gray-500 mt-2">انضم إلى مجتمع المنصة اليمنية وابدأ رحلتك.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField id="firstname" label="الاسم الأول" type="text" value={formData.firstname} onChange={handleChange} error={errors.firstname} placeholder="خالد" />
            <InputField id="lastname" label="الاسم الأخير" type="text" value={formData.lastname} onChange={handleChange} error={errors.lastname} placeholder="هتار" />
          </div>
          
          <InputField id="email" label="البريد الإلكتروني" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="example@email.com" />
          
          <div>
            <InputField id="password" label="كلمة المرور" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} error={errors.password} placeholder="********">
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </InputField>
            {formData.password && <PasswordStrengthMeter password={formData.password} />}
          </div>

          <InputField id="password_confirmation" label="تأكيد كلمة المرور" type={showConfirmPassword ? "text" : "password"} value={formData.password_confirmation} onChange={handleChange} error={errors.password_confirmation} placeholder="********">
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </InputField>

          <div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                أوافق على <Link to="/terms" className="font-medium text-sky-600 hover:underline">شروط الاستخدام</Link> و <Link to="/privacy" className="font-medium text-sky-600 hover:underline">سياسة الخصوصية</Link>.
              </label>
            </div>
            {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}
          </div>

          {errors.api && <div className="text-red-600 text-center text-sm font-semibold p-3 bg-red-50 rounded-lg border border-red-200">{errors.api}</div>}

          <button type="submit" disabled={loading} className="w-full p-3 bg-sky-600 text-white rounded-lg text-base font-semibold hover:bg-sky-700 transition-colors duration-200 disabled:opacity-60">
            {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب والمتابعة'}
          </button>

          <p className="text-center text-sm text-gray-600 pt-4">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="font-semibold text-sky-600 hover:underline">
              سجل الدخول من هنا
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
