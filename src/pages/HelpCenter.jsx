// src/pages/HelpCenter.jsx

import React, { useCallback } from "react";
import { FiHelpCircle, FiMail, FiMessageSquare } from "react-icons/fi";

// استيراد المكون
import HelpOptionCard from '../components/help-center/HelpOptionCard';

const HelpCenter = () => {
  // التحسين المنطقي: استخدام useCallback لضمان عدم إعادة إنشاء الدالة
  const openChat = useCallback(() => {
    window.open(
      "https://your-chat-service-url.com", // يجب استبدال هذا بالرابط الفعلي
      "chat",
      "width=400,height=600,resizable=yes,scrollbars=yes,status=yes"
     );
  }, []);

  const helpOptions = [
    {
      to: "/faq",
      icon: <FiHelpCircle />,
      title: "الأسئلة الشائعة",
      description: "استعرض أكثر الأسئلة شيوعاً وإجاباتها.",
      ariaLabel: "الانتقال إلى صفحة الأسئلة الشائعة",
    },
    {
      to: "/contact",
      icon: <FiMail />,
      title: "اتصل بنا",
      description: "تواصل معنا عبر نموذج الاتصال.",
      ariaLabel: "الانتقال إلى صفحة اتصل بنا",
    },
    {
      onClick: openChat,
      icon: <FiMessageSquare />,
      title: "الدردشة المباشرة",
      description: "تحدث مع فريق الدعم عبر المحادثة الفورية.",
      ariaLabel: "فتح نافذة الدردشة المباشرة",
    },
  ];

  // ===============================================================
  // قسم الـ JSX (تم الحفاظ عليه كما هو من تصميمك الأصلي 100%)
  // ===============================================================
  return (
    <div className="bg-gray-50 py-16 mt-14">
      <div className="max-w-5xl mx-auto px-6 text-neutral-800">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-cyan-700 mb-6">
            مركز المساعدة
          </h1>
          <p className="text-md text-gray-600 mb-12">
            نحن هنا لمساعدتك في أي وقت. اختر أحد الخيارات التالية أو ابحث عن إجابة في الأسئلة الشائعة.
          </p>
        </header>

        <main className="grid md:grid-cols-3 gap-8 mb-16">
          {helpOptions.map((option, index) => (
            <HelpOptionCard key={index} {...option} />
          ))}
        </main>

        <footer className="text-center text-sm text-gray-500">
          <p>
            إذا لم تجد ما تبحث عنه، لا تتردد في مراسلتنا وسنرد عليك بأقرب وقت ممكن.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HelpCenter;
