import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import Select from 'react-select';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FiUser, FiCamera, FiSave, FiXCircle } from 'react-icons/fi';
import { isEqual } from 'lodash';

const arabCountries = [
  "الأردن","الإمارات العربية المتحدة","البحرين","الجزائر","جزر القمر","جيبوتي",
  "السعودية","السودان","الصومال","العراق","الكويت","لبنان","ليبيا",
  "مصر","المغرب","موريتانيا","عُمان","فلسطين","قطر","سوريا","تونس","اليمن"
].sort((a, b) => a.localeCompare(b, 'ar'));

const countryOptions = arabCountries.map((country) => ({ value: country, label: country }));

const EditUserProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [originalData, setOriginalData] = useState(null); 
  const [formData, setFormData] = useState({
    firstname: '', lastname: '', email: '', phone: '',
    birthdate: '', gender: '', country: '', avatar_url: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ type: '', message: '' });

  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    setLoading(true);
    apiClient.get(`/users/${user.id}`)
      .then(res => {
        const u = res.data || {};
        const initialData = {
          firstname: u.firstname || '', lastname: u.lastname || '',
          email: u.email || '', phone: u.phone || '',
          birthdate: u.birthdate || '', gender: u.gender || '',
          country: u.country || '', avatar_url: u.avatar_url || '',
        };
        setFormData(initialData);
        setOriginalData(initialData); 
        setPreview(u.avatar_url || null);
      })
      .catch(err => {
        console.error('فشل في جلب بيانات المستخدم:', err);
        setNotification({ type: 'error', message: 'لا يمكن تحميل بيانات المستخدم.' });
      })
      .finally(() => setLoading(false));
  }, [user?.id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const handlePhoneChange = (value) => {
    setFormData((p) => ({ ...p, phone: value || '' }));
    if (errors.phone) setErrors((p) => ({ ...p, phone: null }));
  };

  const handleCountryChange = (opt) => {
    setFormData((p) => ({ ...p, country: opt ? opt.value : '' }));
    if (errors.country) setErrors((p) => ({ ...p, country: null }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const n = {};
    if (!formData.firstname.trim()) n.firstname = 'الاسم الأول مطلوب.';
    if (!formData.lastname.trim())  n.lastname  = 'الاسم الأخير مطلوب.';
    if (!formData.email.trim())     n.email     = 'البريد الإلكتروني مطلوب.';
    if (formData.phone && !isValidPhoneNumber(formData.phone)) n.phone = 'رقم الهاتف غير صالح.';
    setErrors(n);
    return Object.keys(n).length === 0;
  };

  const handleCancel = () => {
    setFormData(originalData);
    setPreview(originalData.avatar_url);
    setImageFile(null);
    setErrors({});
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || saving) return;

    setSaving(true);
    setNotification({ type: '', message: '' });

    try {
      let finalAvatarUrl = formData.avatar_url;

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('avatar', imageFile);

        const uploadResponse = await apiClient.post('/upload-avatar', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        finalAvatarUrl = uploadResponse.data.avatar_url;
      }

      const textDataToUpdate = {
        ...formData,
        name: `${formData.firstname.trim()} ${formData.lastname.trim()}`,
        avatar_url: finalAvatarUrl,
      };
      
      const updateUserResponse = await apiClient.patch(`/users/${user.id}`, textDataToUpdate);
      const updatedUser = updateUserResponse.data.user || updateUserResponse.data;
      setUser({ ...user, ...updatedUser });

      setNotification({ type: 'success', message: 'تم الحفظ بنجاح!' });
      navigate(`/profile/${user.id}`, { replace: true });
      
    } catch (err) {
      console.error('فشل في تحديث بيانات المستخدم:', err);
      const errorMessage = err.response?.data?.message || 'حدث خطأ أثناء حفظ التغييرات.';
      setNotification({ type: 'error', message: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const hasChanged = !isEqual(formData, originalData) || imageFile !== null;

  if (loading) return <div className="text-center p-10">جاري تحميل بياناتك...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 my-8 rounded-2xl shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <FiUser className="text-cyan-600 text-2xl" />
        <h2 className="text-2xl font-bold text-gray-800">تعديل الملف الشخصي</h2>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative group">
          <img
            src={preview || 'https://via.placeholder.com/150'}
            alt="معاينة"
            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md"
          />
          <label
            htmlFor="image-upload"
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 
              rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
            <FiCamera className="text-white text-3xl" />
          </label>
        </div>

        <input
          type="file"
          id="image-upload"
          name="image-upload"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <p className="text-sm text-gray-500 mt-2">انقر على الصورة لتغييرها</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstname" className="block mb-1 font-medium text-gray-700">الاسم الأول</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 
              ${errors.firstname ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-cyan-500'}`}
            />

            {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
          </div>

          <div>
            <label htmlFor="lastname" className="block mb-1 font-medium text-gray-700">الاسم الأخير</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 
                ${errors.lastname ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-cyan-500'}`}
            />
            {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">البريد الإلكتروني</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 
                ${errors.email ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-cyan-500'}`} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 font-medium text-gray-700">رقم الهاتف</label>
            <PhoneInput 
              id="phone" 
              international 
              defaultCountry="YE" 
              value={formData.phone} 
              onChange={handlePhoneChange} 
              className={`PhoneInputInput ${errors.phone ? 'PhoneInputInput--error' : ''}`}
            />

            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="birthdate" className="block mb-1 font-medium text-gray-700">تاريخ الميلاد</label>
            <input 
              type="date" 
              id="birthdate" 
              name="birthdate" 
              value={formData.birthdate} 
              onChange={handleChange} 
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>

          <div>
            <label htmlFor="gender" className="block mb-1 font-medium text-gray-700">الجنس</label>
            <select 
              id="gender" 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-cyan-500">
              <option value="" disabled>اختر الجنس...</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label 
            htmlFor="country" 
              className="block mb-1 font-medium text-gray-700">
              الدولة
            </label>
            <Select 
              id="country" 
              name="country" 
              options={countryOptions} 
              value={countryOptions.find((o) => o.value === formData.country) || null} 
              onChange={handleCountryChange} 
              placeholder="ابحث عن دولتك أو اخترها..." 
              isClearable 
              isRtl 
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: state.isFocused ? '#0891B2' : '#D1D5DB',
                  boxShadow: state.isFocused ? '0 0 0 2px #67E8F9' : 'none',
                  '&:hover': { borderColor: '#9CA3AF' },
                  borderRadius: '0.375rem',
                  padding: '0.1rem'
                }), menu: (base) => ({ ...base, zIndex: 50 })
              }}
            />
            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
          </div>
        </div>

        {notification.message &&
          <div
            className={`p-3 mt-4 rounded-md text-center text-sm font-semibold 
              ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {notification.message}
          </div>}

        <div className="flex justify-end gap-4 pt-4 border-t mt-8">
          <button 
            type="button" 
            onClick={handleCancel} 
            disabled={saving} 
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 
              text-gray-800 font-semibold py-2 px-6 rounded-lg transition">
            <FiXCircle />
            <span>إلغاء</span>
          </button>

          <button
            type="submit"
            disabled={!hasChanged || saving}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold 
              py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave />
            <span>{saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserProfile;
