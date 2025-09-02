import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';


const AccountTypePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState('');
  const [specialty, setSpecialty] = useState('program');
  const [jobTitle, setJobTitle] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');
  const [skillsList, setSkillsList] = useState([]);
  const [aboutYou, setAboutYou] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const ABOUT_YOU_MAX_LENGTH = 100;
  const ABOUT_YOU_MIN_LENGTH = 50;

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newSkill = currentSkill.trim();
      if (newSkill && !skillsList.includes(newSkill)) {
        setSkillsList([...skillsList, newSkill]);
      }
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter(skill => skill !== skillToRemove));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!accountType) {
      newErrors.accountType = "يرجى اختيار نوع الحساب.";
    }
    if (accountType === 'freelancer') {
      if (!specialty) newErrors.specialty = "يرجى اختيار تخصصك.";
      if (!jobTitle.trim()) newErrors.jobTitle = "المسمى الوظيفي مطلوب.";
      if (aboutYou.trim().length < ABOUT_YOU_MIN_LENGTH) {
        newErrors.aboutYou = `النبذة يجب أن تكون ${ABOUT_YOU_MIN_LENGTH} حرفاً على الأقل.`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setSpecialty('program');
    setJobTitle('');
    setCurrentSkill('');
    setSkillsList([]);
    setAboutYou('');
    setErrors({});
  };

  const handleSubmit = async (e) => {
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
          specialty,
          jobTitle,
          skills: skillsList,
          aboutYou,
        })
      };

      const response = await apiClient.patch(`/users/${user.id}`, dataToUpdate);

      const updatedUser = response.data;
      setUser(updatedUser);

      if (accountType === 'freelancer') {
        navigate('/dashboard');
      } else {
        navigate('/services');
      }

    } catch (error) {
      console.error("فشل في تحديث الحساب:", error);
      setErrors({ api: "حدث خطأ أثناء تحديث البيانات. يرجى المحاولة مرة أخرى." });
    } finally {
      setLoading(false);
    }
  };

  const placeholderMap = {
    management: { job: 'مثل: مستشار إداري', skills: 'مثال: تحليل الأعمال، التخطيط' },
    program: { job: 'مثل: مطور واجهات أمامية', skills: 'مثال: React, Laravel, API' },
    design: { job: 'مثل: مصمم فيديو أو مهندس صوت', skills: 'مثال: Adobe Premiere, After Effects' },
    marketing: { job: 'مثل: مدير تسويق رقمي', skills: 'مثال: SEO, Google Ads' },
    contentIndustry: { job: 'مثل: كاتب محتوى إبداعي', skills: 'مثال: كتابة المقالات، ترجمة' },
    training: { job: 'مثل: مدرب عن بعد', skills: 'مثال: إعداد دورات، دعم فني' },
    other: { job: 'مثل: مقدم خدمات عامة', skills: 'مثال: خدمات متنوعة حسب الطلب' },
  };

  const currentPlaceholders = placeholderMap[specialty] || {};

  return (
    <div className="py-8 px-4 bg-gray-50 min-h-screen">
      <div className="w-full max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-2xl space-y-6 text-right"
        >
          <div>
            <p className="text-lg font-semibold text-neutral-700">أكمل ملفك الشخصي</p>
            <p className="text-sm text-gray-500 mb-4">اختر نوع حسابك وأخبرنا المزيد عنك.</p>
            <div className="space-y-2">
              <label htmlFor="buyer" className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${accountType === 'buyer' ? 'border-cyan-500 bg-cyan-50' : 'border-gray-300'}`}>
                <input
                  type="radio"
                  id="buyer"
                  name="accountType"
                  value="buyer"
                  onChange={() => handleAccountTypeChange("buyer")}
                  className="accent-cyan-600 w-4 h-4 ml-3"
                />
                <span>باحث عن خدمة <span className="text-sm text-neutral-600">(أريد توظيف مستقلين)</span></span>
              </label>
              
              <label htmlFor="freelancer" className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${accountType === 'freelancer' ? 'border-cyan-500 bg-cyan-50' : 'border-gray-300'}`}>
                <input
                  type="radio"
                  id="freelancer"
                  name="accountType"
                  value="freelancer"
                  onChange={() => handleAccountTypeChange("freelancer")}
                  className="accent-cyan-600 w-4 h-4 ml-3"
                />
                <span>مقدم خدمات <span className="text-sm text-neutral-600">(أبحث عن مشاريع لتنفيذها)</span></span>
              </label>
            </div>

            {errors.accountType && <p className="text-red-600 text-sm mt-1">{errors.accountType}</p>}
          </div>

          {accountType === 'freelancer' && (
            <div className="space-y-6 border-t pt-6 animate-fade-in">
              <div>
                <label htmlFor="specialty" className="block mb-2 font-medium text-neutral-700">مجال التخصص:</label>
                <select
                  id="specialty"
                  name="specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-white font-bold px-4 py-2 rounded-lg border 
                    border-gray-300 focus:outline-none focus:border-cyan-500">
                  {Object.entries(placeholderMap).map(([key, { job }]) => (
                    <option key={key} value={key}>{job.replace('مثل: ', '')}</option>
                  ))}
                </select>

                {errors.specialty && <p className="text-red-600 text-sm mt-1">{errors.specialty}</p>}
              </div>

              <div>
                <label htmlFor="jobTitle" className="block mb-2 font-medium text-neutral-700">المسمى الوظيفي:</label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-gray-50 px-4 py-2 rounded-md border 
                  border-gray-300 focus:outline-none focus:border-cyan-500"
                  placeholder={currentPlaceholders.job}
                />

                {errors.jobTitle && <p className="text-red-600 text-sm mt-1">{errors.jobTitle}</p>}
              </div>

              <div>
                <label htmlFor="Skills" className="block mb-2 font-medium text-neutral-700">المهارات (اضغط Enter أو , لإضافة مهارة):</label>
                <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md bg-gray-50">
                  {skillsList.map(skill => (
                    <div
                      key={skill}
                      className="flex items-center gap-2 bg-cyan-100 text-cyan-800 text-sm font-semibold px-2 py-1 rounded-md">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-cyan-600 hover:text-cyan-800">
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    id="Skills"
                    name="Skills"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    className="flex-grow bg-transparent outline-none p-1"
                    placeholder={skillsList.length === 0 ? currentPlaceholders.skills : ''}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="aboutYou" className="block mb-2 font-medium text-neutral-700">نبذة عنك:</label>
                <textarea
                  id="aboutYou"
                  name="aboutYou"
                  rows="5"
                  value={aboutYou}
                  onChange={(e) => setAboutYou(e.target.value)}
                  maxLength={ABOUT_YOU_MAX_LENGTH}
                  className="w-full resize-none bg-gray-50 px-4 py-2 rounded-md 
                    border border-gray-300 focus:outline-none focus:border-cyan-500"
                  placeholder="أكتب نبذة مختصرة عن خبراتك ومهاراتك لجذب العملاء...">
                </textarea>
                <div className="text-left text-xs text-gray-400 mt-1">
                  {aboutYou.length} / {ABOUT_YOU_MAX_LENGTH}
                </div>

                {errors.aboutYou && <p className="text-red-600 text-sm mt-1">{errors.aboutYou}</p>}
              </div>
            </div>
          )}

          {errors.api && <p className="text-red-600 text-sm text-center">{errors.api}</p>}

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-300 text-white px-8 py-3 
                rounded-full font-semibold hover:opacity-90 transition duration-200 disabled:opacity-50">
              {loading ? 'جاري الحفظ...' : 'حفظ ومتابعة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountTypePage;
