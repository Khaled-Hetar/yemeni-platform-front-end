// src/pages/AccountTypePage.jsx

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

// استيراد المكونات
import AccountTypeSelector from '../components/account-type/AccountTypeSelector';
import FreelancerForm from '../components/account-type/FreelancerForm';

const placeholderMap = {
  management: { job: 'مثل: مستشار إداري', skills: 'مثال: تحليل الأعمال، التخطيط' },
  program: { job: 'مثل: مطور واجهات أمامية', skills: 'مثال: React, Laravel, API' },
  design: { job: 'مثل: مصمم فيديو أو مهندس صوت', skills: 'مثال: Adobe Premiere, After Effects' },
  marketing: { job: 'مثل: مدير تسويق رقمي', skills: 'مثال: SEO, Google Ads' },
  contentIndustry: { job: 'مثل: كاتب محتوى إبداعي', skills: 'مثال: كتابة المقالات، ترجمة' },
  training: { job: 'مثل: مدرب عن بعد', skills: 'مثال: إعداد دورات، دعم فني' },
  other: { job: 'مثل: مقدم خدمات عامة', skills: 'مثال: خدمات متنوعة حسب الطلب' },
};

const ABOUT_YOU_MAX_LENGTH = 100;
const ABOUT_YOU_MIN_LENGTH = 50;

const AccountTypePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState('');
  const [freelancerData, setFreelancerData] = useState({
    specialty: 'program',
    jobTitle: '',
    currentSkill: '',
    skillsList: [],
    aboutYou: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFreelancerDataChange = (e) => {
    const { name, value } = e.target;
    setFreelancerData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newSkill = freelancerData.currentSkill.trim();
      if (newSkill && !freelancerData.skillsList.includes(newSkill)) {
        setFreelancerData(prev => ({
          ...prev,
          skillsList: [...prev.skillsList, newSkill],
          currentSkill: '',
        }));
      } else {
        setFreelancerData(prev => ({ ...prev, currentSkill: '' }));
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setFreelancerData(prev => ({
      ...prev,
      skillsList: prev.skillsList.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleAccountTypeChange = useCallback((type) => {
    setAccountType(type);
    setFreelancerData({
      specialty: 'program', jobTitle: '', currentSkill: '', skillsList: [], aboutYou: '',
    });
    setErrors({});
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!accountType) {
      newErrors.accountType = "يرجى اختيار نوع الحساب.";
    }
    if (accountType === 'freelancer') {
      if (!freelancerData.specialty) newErrors.specialty = "يرجى اختيار تخصصك.";
      if (!freelancerData.jobTitle.trim()) newErrors.jobTitle = "المسمى الوظيفي مطلوب.";
      if (freelancerData.aboutYou.trim().length < ABOUT_YOU_MIN_LENGTH) {
        newErrors.aboutYou = `النبذة يجب أن تكون ${ABOUT_YOU_MIN_LENGTH} حرفاً على الأقل.`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (loading || !validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      if (!user || !user.id) {
        setErrors({ api: "خطأ: لم يتم العثور على المستخدم. يرجى تسجيل الدخول مرة أخرى." });
        setLoading(false);
        return;
      }

      const dataToUpdate = {
        accountType: accountType,
        ...(accountType === 'freelancer' && {
          specialty: freelancerData.specialty,
          jobTitle: freelancerData.jobTitle,
          skills: freelancerData.skillsList,
          aboutYou: freelancerData.aboutYou,
        })
      };

      const response = await apiClient.patch(`/users/${user.id}`, dataToUpdate);
      const updatedUser = response.data;
      setUser(updatedUser);

      navigate(accountType === 'freelancer' ? '/dashboard' : '/services');

    } catch (error) {
      console.error("فشل في تحديث الحساب:", error);
      setErrors({ api: "حدث خطأ أثناء تحديث البيانات. يرجى المحاولة مرة أخرى." });
    } finally {
      setLoading(false);
    }
  }, [ user, accountType, freelancerData, navigate, setUser, loading ]);

  return (
    <div className="py-8 px-4 mt-20 bg-gray-50 min-h-screen">
      <div className="w-full max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-6 border border-gray-300 rounded-lg shadow-2xl space-y-6 text-right">
          <AccountTypeSelector 
            accountType={accountType}
            onAccountTypeChange={handleAccountTypeChange}
            error={errors.accountType}
          />

          {accountType === 'freelancer' && (
            <FreelancerForm 
              specialty={freelancerData.specialty}
              onSpecialtyChange={handleFreelancerDataChange}
              jobTitle={freelancerData.jobTitle}
              onJobTitleChange={handleFreelancerDataChange}
              currentSkill={freelancerData.currentSkill}
              onCurrentSkillChange={(e) => setFreelancerData(p => ({ ...p, currentSkill: e.target.value }))}
              skillsList={freelancerData.skillsList}
              onSkillKeyDown={handleSkillKeyDown}
              onRemoveSkill={removeSkill}
              aboutYou={freelancerData.aboutYou}
              onAboutYouChange={handleFreelancerDataChange}
              placeholders={placeholderMap}
              errors={errors}
              maxLength={ABOUT_YOU_MAX_LENGTH}
              minLength={ABOUT_YOU_MIN_LENGTH}
            />
          )}

          {errors.api && <p className="text-red-600 text-sm text-center">{errors.api}</p>}

          <div className="text-center pt-4">
            <button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-300 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition duration-200 disabled:opacity-50">
              {loading ? 'جاري الحفظ...' : 'حفظ ومتابعة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountTypePage;
