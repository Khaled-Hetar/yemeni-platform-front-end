import React from "react";
import { FiHelpCircle, FiMail, FiMessageSquare } from "react-icons/fi";
import { Link } from "react-router-dom";

const HelpCenter = () => {
  const openChat = () => {
    window.open(
      "https://your-chat-service-url.com", 
      "chat",
      "width=400,height=600,resizable=yes,scrollbars=yes,status=yes"
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 text-neutral-800">
      <h1 className="text-3xl font-bold text-cyan-700 mb-6 text-center">
        مركز المساعدة
      </h1>
      <p className="text-center text-sm text-gray-600 mb-12">
        نحن هنا لمساعدتك في أي وقت. اختر أحد الخيارات التالية أو ابحث عن إجابة في الأسئلة الشائعة.
      </p>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Link
          to="/faq"
          className="p-6 bg-white rounded-xl border border-gray-200 shadow 
            hover:shadow-md transition flex flex-col items-center min-h-[180px]"
          aria-label="الأسئلة الشائعة"
          title="استعرض أكثر الأسئلة شيوعاً وإجاباتها"
        >
          <FiHelpCircle className="text-cyan-600 text-3xl mb-4" />
          <h3 className="text-lg font-semibold mb-2">الأسئلة الشائعة</h3>
          <p className="text-sm text-gray-600 text-center">استعرض أكثر الأسئلة شيوعاً وإجاباتها.</p>
        </Link>

        <Link
          to="/contact"
          className="p-6 bg-white rounded-xl border border-gray-200 shadow 
            hover:shadow-md transition flex flex-col items-center min-h-[180px]"
          aria-label="اتصل بنا"
          title="تواصل معنا عبر نموذج الاتصال"
        >
          <FiMail className="text-cyan-600 text-3xl mb-4" />
          <h3 className="text-lg font-semibold mb-2">اتصل بنا</h3>
          <p className="text-sm text-gray-600 text-center">تواصل معنا عبر نموذج الاتصال.</p>
        </Link>

        <div
          onClick={openChat}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => { if (e.key === 'Enter') openChat(); }}
          className="p-6 bg-white rounded-xl border border-gray-200 shadow 
            cursor-pointer flex flex-col items-center min-h-[180px]"
          aria-label="الدردشة المباشرة"
          title="تحدث مع فريق الدعم عبر المحادثة الفورية"
        >
          <FiMessageSquare className="text-cyan-600 text-3xl mb-4" />
          <h3 className="text-lg font-semibold mb-2">الدردشة المباشرة</h3>
          <p className="text-sm text-gray-600 text-center">تحدث مع فريق الدعم عبر المحادثة الفورية.</p>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        إذا لم تجد ما تبحث عنه، لا تتردد في مراسلتنا وسنرد عليك بأقرب وقت ممكن.
      </div>
    </div>
  );
};

export default HelpCenter;
