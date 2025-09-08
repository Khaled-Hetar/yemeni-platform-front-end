// src/pages/EditUserProfile.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { isEqual } from 'lodash';
import Select from 'react-select';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FiUser } from 'react-icons/fi';

// استيراد خدمة الـ API
import { updateUserProfile } from '../components/services/userService';

// استيراد المكونات الفرعية
import ProfileImageUploader from '../components/edit-profile/ProfileImageUploader';
import FormField from '../components/edit-profile/FormField';
import ActionButtons from '../components/email-verification/ActionButtons'; // تم تغيير الاسم ليكون أوضح
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import Notification from '../pages/Notifications'; // مكون لعرض الإشعارات

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
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

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
        setNotification({ show: true, type: 'error', message: 'لا يمكن تحميل بيانات المستخدم.' });
      })
      .finally(() => setLoading(false));
  }, [user?.id, navigate]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  }, [errors]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const validateForm = useCallback(() => {
    const n = {};
    if (!formData.firstname.trim()) n.firstname = 'الاسم الأول مطلوب.';
    if (!formData.lastname.trim())  n.lastname  = 'الاسم الأخير مطلوب.';
    if (formData.phone && !isValidPhoneNumber(formData.phone)) n.phone = 'رقم الهاتف غير صالح.';
    setErrors(n);
    return Object.keys(n).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || saving) return;

    setSaving(true);
    setNotification({ show: false, message: '', type: 'success' });

    try {
      const updatedUser = await updateUserProfile(user.id, formData, imageFile);
      
      setUser(updatedUser);
      setOriginalData(updatedUser); // تحديث الحالة الأصلية بعد الحفظ
      setImageFile(null); // إعادة تعيين ملف الصورة

      setNotification({ show: true, type: 'success', message: 'تم الحفظ بنجاح!' });
      
    } catch (err) {
      console.error('فشل في تحديث بيانات المستخدم:', err);
      const errorMessage = err.response?.data?.message || 'حدث خطأ أثناء حفظ التغييرات.';
      setNotification({ show: true, type: 'error', message: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const hasChanged = !isEqual(formData, originalData) || imageFile !== null;

  if (loading) return <LoadingState message="جاري تحميل بياناتك..." />;
  if (!originalData) return <ErrorState message="لا يمكن تحميل بيانات المستخدم." />;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 my-8 rounded-2xl shadow-lg border border-gray-200">
      <header className="flex items-center gap-3 mb-8 border-b pb-4">
        <FiUser className="text-cyan-600 text-2xl" />
        <h2 className="text-2xl font-bold text-gray-800">تعديل الملف الشخصي</h2>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        <ProfileImageUploader preview={preview} onImageChange={handleImageChange} />

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField id="firstname" name="firstname" label="الاسم الأول" value={formData.firstname} onChange={handleChange} error={errors.firstname} />
            <FormField id="lastname" name="lastname" label="الاسم الأخير" value={formData.lastname} onChange={handleChange} error={errors.lastname} />
            <FormField id="email" name="email" label="البريد الإلكتروني" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
            
            <div>
              <label htmlFor="phone" className="block mb-1 font-medium text-gray-700">رقم الهاتف</label>
              <PhoneInput id="phone" international defaultCountry="YE" value={formData.phone} onChange={(val) => handleChange({ target: { name: 'phone', value: val || '' }})} className={`PhoneInputInput ${errors.phone ? 'PhoneInputInput--error' : ''}`} />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <FormField id="birthdate" name="birthdate" label="تاريخ الميلاد" type="date" value={formData.birthdate} onChange={handleChange} error={errors.birthdate} />

            <div>
              <label htmlFor="gender" className="block mb-1 font-medium text-gray-700">الجنس</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-cyan-500">
                <option value="" disabled>اختر الجنس...</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="country" className="block mb-1 font-medium text-gray-700">الدولة</label>
              <Select id="country" name="country" options={countryOptions} value={countryOptions.find((o) => o.value === formData.country) || null} onChange={(opt) => handleChange({ target: { name: 'country', value: opt ? opt.value : '' }})} placeholder="ابحث عن دولتك أو اخترها..." isClearable isRtl styles={{ control: (base) => ({ ...base, borderRadius: '0.375rem', padding: '0.1rem' }) }} />
            </div>
          </div>

          <Notification notification={notification} />

          <ActionButtons onCancel={() => navigate(-1)} isSaving={saving} hasChanged={hasChanged} />
        </div>
      </form>
    </div>
  );
};

export default EditUserProfile;
