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
    // --- الإدارة والأعمال ---
    management: { 
      job: 'مثل: مستشار إداري', 
      skills: 'مثال: إدارة مشاريع، تخطيط استراتيجي، تحسين الأداء' 
    },
    adminSupport: { 
      job: 'مثل: مساعد إداري افتراضي', 
      skills: 'مثال: تنظيم جداول، إدارة بريد إلكتروني، إدخال بيانات' 
    },
    hr: {
      job: 'مثل: أخصائي موارد بشرية',
      skills: 'مثال: توظيف، تدريب، إدارة موظفين'
    },
    finance: {
      job: 'مثل: مستشار مالي',
      skills: 'مثال: استشارات استثمارية، إعداد خطط مالية'
    },
    accounting: { 
      job: 'مثل: محاسب أو مدقق حسابات', 
      skills: 'مثال: ERP, QuickBooks, Excel, تقارير مالية' 
    },
    legal: { 
      job: 'مثل: مستشار قانوني', 
      skills: 'مثال: صياغة عقود، قوانين تجارية، استشارات قانونية' 
    },

    // --- البرمجة والتكنولوجيا ---
    program: { 
      job: 'مثل: مطور مواقع أو تطبيقات', 
      skills: 'مثال: React, Laravel, Node.js, API, Java, Python' 
    },
    mobile: {
      job: 'مثل: مطور تطبيقات جوال',
      skills: 'مثال: Flutter, React Native, Swift, Kotlin'
    },
    gameDev: {
      job: 'مثل: مطور ألعاب',
      skills: 'مثال: Unity, Unreal Engine, C#'
    },
    cybersecurity: { 
      job: 'مثل: محلل أمن سيبراني', 
      skills: 'مثال: Penetration Testing, Firewalls, Encryption' 
    },
    ai: { 
      job: 'مثل: مطور ذكاء اصطناعي', 
      skills: 'مثال: Python, TensorFlow, NLP, Computer Vision' 
    },
    blockchain: { 
      job: 'مثل: مطور بلوك تشين', 
      skills: 'مثال: Solidity, Ethereum, Smart Contracts' 
    },
    data: { 
      job: 'مثل: محلل بيانات أو عالم بيانات', 
      skills: 'مثال: SQL, Power BI, Python, Machine Learning' 
    },
    qa: {
      job: 'مثل: مختبر جودة برمجيات',
      skills: 'مثال: Selenium, Unit Testing, Bug Tracking'
    },
    devops: {
      job: 'مثل: مهندس DevOps',
      skills: 'مثال: Docker, Kubernetes, CI/CD'
    },
    cloud: {
      job: 'مثل: مهندس سحابة',
      skills: 'مثال: AWS, Azure, Google Cloud'
    },

    // --- التصميم والإبداع ---
    design: { 
      job: 'مثل: مصمم جرافيك أو مونتير فيديو', 
      skills: 'مثال: Photoshop, Illustrator, Premiere, After Effects' 
    },
    animation: { 
      job: 'مثل: رسام أنيميشن أو موشن جرافيك', 
      skills: 'مثال: Blender, Maya, After Effects' 
    },
    uiux: {
      job: 'مثل: مصمم واجهات وتجربة مستخدم',
      skills: 'مثال: Figma, Sketch, Wireframing, Prototyping'
    },
    photography: { 
      job: 'مثل: مصور منتجات أو مناسبات', 
      skills: 'مثال: Lightroom, Photoshop, تصوير احترافي' 
    },
    architecture: { 
      job: 'مثل: مهندس معماري أو مصمم ديكور', 
      skills: 'مثال: AutoCAD, Revit, 3ds Max' 
    },
    music: { 
      job: 'مثل: ملحن أو منتج موسيقي', 
      skills: 'مثال: FL Studio, Logic Pro, Mixing, Sound Design' 
    },
    voiceOver: {
      job: 'مثل: مؤدي صوتي',
      skills: 'مثال: تعليق إعلاني، دبلجة، كتب صوتية'
    },

    // --- التسويق والمبيعات ---
    marketing: { 
      job: 'مثل: مدير تسويق رقمي', 
      skills: 'مثال: SEO, Google Ads, Facebook Ads' 
    },
    socialMedia: {
      job: 'مثل: مدير حسابات سوشيال ميديا',
      skills: 'مثال: إدارة حملات، إنشاء محتوى، تحليل أداء'
    },
    sales: { 
      job: 'مثل: مسؤول مبيعات', 
      skills: 'مثال: CRM, إغلاق صفقات، خدمة عملاء' 
    },
    pr: {
      job: 'مثل: مسؤول علاقات عامة',
      skills: 'مثال: كتابة بيانات صحفية، تنظيم فعاليات'
    },
    ecommerce: {
      job: 'مثل: مدير متجر إلكتروني',
      skills: 'مثال: Shopify, WooCommerce, إدارة منتجات'
    },

    // --- الكتابة والمحتوى ---
    contentIndustry: { 
      job: 'مثل: كاتب محتوى إبداعي', 
      skills: 'مثال: مقالات، سيناريو، قصص، Copywriting' 
    },
    translation: { 
      job: 'مثل: مترجم تحريري أو فوري', 
      skills: 'مثال: ترجمة تقنية، أدبية، تدقيق لغوي' 
    },
    blogging: {
      job: 'مثل: مدوّن',
      skills: 'مثال: كتابة مقالات، SEO، إدارة مدونة'
    },
    technicalWriting: {
      job: 'مثل: كاتب تقني',
      skills: 'مثال: توثيق برامج، إعداد كتيبات، شروح تقنية'
    },

    // --- التعليم والتدريب ---
    training: { 
      job: 'مثل: مدرب عن بعد', 
      skills: 'مثال: إعداد دورات، Webinars, دعم فني' 
    },
    education: { 
      job: 'مثل: مدرس خصوصي', 
      skills: 'مثال: تدريس لغات، رياضيات، علوم' 
    },
    coaching: {
      job: 'مثل: مدرب تنمية بشرية',
      skills: 'مثال: مهارات قيادية، تحفيز، تطوير شخصي'
    },

    // --- خدمات أخرى ---
    customerSupport: { 
      job: 'مثل: موظف خدمة عملاء', 
      skills: 'مثال: دعم فني، الرد على استفسارات، إدارة شكاوى' 
    },
    logistics: { 
      job: 'مثل: مسؤول لوجستيات', 
      skills: 'مثال: إدارة مخزون، شحن، سلاسل إمداد' 
    },
    health: { 
      job: 'مثل: أخصائي تغذية أو دعم صحي', 
      skills: 'مثال: خطط غذائية، استشارات، متابعة مرضى' 
    },
    humanitarian: { 
      job: 'مثل: مسؤول مشاريع إنسانية', 
      skills: 'مثال: تنسيق، كتابة تقارير، إدارة فرق' 
    },
    other: { 
      job: 'مثل: مقدم خدمات عامة', 
      skills: 'مثال: خدمات متنوعة حسب الطلب' 
    }
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
