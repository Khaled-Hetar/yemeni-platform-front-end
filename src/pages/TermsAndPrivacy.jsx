// src/pages/TermsAndPrivacy.jsx

import React from "react";

const Section = ({ title, children, ...props }) => (
  <section className="mb-14" {...props}>
    <h2 className="text-2xl font-semibold text-neutral-700 mb-5">{title}</h2>
    {children}
  </section>
);

const TermsAndPrivacy = () => {
  const formattedDate = new Date().toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ===============================================================
  // قسم الـ JSX (تم الحفاظ عليه كما هو من تصميمك الأصلي 100%)
  // ===============================================================
  return (
    <div className="bg-gray-50 py-12 mt-14">
      <article 
        className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-300 text-neutral-800"
        role="document" // تحسين إمكانية الوصول
      >
        <header className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-cyan-700">
            شروط الاستخدام وسياسة الخصوصية
          </h2>
        </header>

        <main>
          {/* شروط الاستخدام */}
          <Section title="شروط الاستخدام" aria-label="شروط الاستخدام">
            <p className="mb-6 leading-relaxed text-base">
              باستخدامك لمنصتنا، فإنك توافق على الالتزام بجميع الشروط والأحكام المذكورة أدناه.
            </p>
            <ul className="list-disc pl-6 space-y-3 text-sm text-neutral-700">
              <li>يُمنع استخدام المنصة لأي أنشطة غير قانونية.</li>
              <li>يلتزم المستخدم بتقديم معلومات صحيحة وحديثة عند التسجيل.</li>
              <li>يحق للإدارة تعليق الحسابات المخالفة أو حذفها دون إشعار مسبق.</li>
              <li>تُستخدم الخدمات المتوفرة كما هي دون أي ضمانات.</li>
            </ul>
          </Section>

          {/* سياسة الخصوصية */}
          <Section title="سياسة الخصوصية" aria-label="سياسة الخصوصية">
            <p className="mb-6 leading-relaxed text-base">
              نحن نلتزم بحماية خصوصية مستخدمينا. توضح هذه السياسة كيفية جمعنا للمعلومات واستخدامها.
            </p>
            <ul className="list-disc pl-6 space-y-3 text-sm text-neutral-700">
              <li>نقوم بجمع البيانات الأساسية مثل الاسم والبريد الإلكتروني لتحسين تجربة المستخدم.</li>
              <li>لا نقوم ببيع أو مشاركة معلوماتك مع جهات خارجية بدون موافقتك.</li>
              <li>نستخدم تقنيات التتبع لتحليل استخدام الموقع وتحسين خدماتنا.</li>
              <li>يحق للمستخدم طلب حذف بياناته من المنصة في أي وقت.</li>
            </ul>
          </Section>
        </main>

        <footer className="mt-14 text-xs text-gray-500 text-center">
          <p>تاريخ آخر تحديث: {formattedDate}</p>
        </footer>
      </article>
    </div>
  );
};

export default TermsAndPrivacy;
