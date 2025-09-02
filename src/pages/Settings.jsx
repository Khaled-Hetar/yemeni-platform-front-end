import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiBell, FiLock, FiMoon, FiGlobe, FiCreditCard, FiChevronRight, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleDeleteAccount = () => {
    if (window.confirm("هل أنت متأكد تماماً؟ سيتم حذف حسابك وجميع بياناتك بشكل نهائي ولا يمكن التراجع عن هذا الإجراء."))
      alert("سيتم بناء ميزة حذف الحساب لاحقاً.");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-sky-700 text-center mb-10">
        الإعدادات العامة
      </h2>

      <div className="bg-white rounded-2xl shadow border border-gray-100 mb-8 divide-y divide-gray-100 overflow-hidden">
        <SettingItem
          to="/edit-profile"
          icon={<FiUser size={24} />}
          title="إعدادات الحساب"
          description="تحديث معلوماتك الشخصية وبيانات الاتصال"
        />

        <SettingItem
          to="/change-password"
          icon={<FiLock size={24} />}
          title="الأمان وكلمة المرور"
          description="تغيير كلمة المرور وتأمين حسابك"
        />

        <SettingItem
          to="/payments"
          icon={<FiCreditCard size={24} />}
          title="الرصيد والمدفوعات"
          description="عرض سجل المعاملات وإدارة طرق الدفع"
        />

        <SettingItem
          to="/settings/notifications"
          icon={<FiBell size={24} />}
          title="تفضيلات الإشعارات"
          description="إدارة إعدادات التنبيهات التي تصلك"
        />

        <SettingItem
          to="/settings/language"
          icon={<FiGlobe size={24} />}
          title="اللغة والمنطقة"
          description="تغيير لغة الواجهة والمنطقة الزمنية"
        />

        <SettingItem
          to="/settings/theme"
          icon={<FiMoon size={24} />}
          title="المظهر"
          description="التبديل بين الوضع الفاتح والداكن"
        />
      </div>

      <div className="bg-white rounded-2xl shadow border border-red-200 p-5">
        <h3 className="text-xl font-semibold text-red-700 mb-3 flex items-center gap-2">
          <FiAlertTriangle />
          منطقة الخطر
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-neutral-800">حذف الحساب</h4>
            <p className="text-sm text-neutral-500 mt-1">
              سيتم حذف جميع بياناتك بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            حذف حسابي
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingItem = ({ to, icon, title, description }) => (
  <Link
    to={to}
    className="flex items-center justify-between gap-4 p-5 hover:bg-sky-50 transition duration-150 group"
  >
    <div className="flex items-center gap-5">
      <div className="p-3 rounded-full bg-sky-100 text-sky-600 group-hover:bg-sky-200 transition">
        {icon}
      </div>
      
      <div>
        <h3 className="font-semibold text-lg text-neutral-800">{title}</h3>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
    </div>
    <FiChevronRight size={20} className="text-gray-400 group-hover:text-sky-600 transition" />
  </Link>
);

export default SettingsPage;
