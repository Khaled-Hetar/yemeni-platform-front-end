import React from "react";

const TermsAndPrivacy = () => {
  const formattedDate = new Date().toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 bg-gray-50 rounded-lg shadow-md text-neutral-800">
      <h1 className="text-3xl font-extrabold text-cyan-700 mb-10 text-center">
        شروط الاستخدام وسياسة الخصوصية
      </h1>

      {/* شروط الاستخدام */}
      <section className="mb-14" aria-label="شروط الاستخدام">
        <h2 className="text-2xl font-semibold text-neutral-700 mb-5">
          شروط الاستخدام
        </h2>
        <p className="mb-6 leading-relaxed text-base">
          باستخدامك لمنصتنا، فإنك توافق على الالتزام بجميع الشروط والأحكام
          المذكورة أدناه.
        </p>
        <ul className="list-disc pl-6 space-y-3 text-sm text-neutral-700">
          <li>يُمنع استخدام المنصة لأي أنشطة غير قانونية.</li>
          <li>يلتزم المستخدم بتقديم معلومات صحيحة وحديثة عند التسجيل.</li>
          <li>يحق للإدارة تعليق الحسابات المخالفة أو حذفها دون إشعار مسبق.</li>
          <li>تُستخدم الخدمات المتوفرة كما هي دون أي ضمانات.</li>
        </ul>
      </section>

      {/* سياسة الخصوصية */}
      <section aria-label="سياسة الخصوصية">
        <h2 className="text-2xl font-semibold text-neutral-700 mb-5">
          سياسة الخصوصية
        </h2>
        <p className="mb-6 leading-relaxed text-base">
          نحن نلتزم بحماية خصوصية مستخدمينا. توضح هذه السياسة كيفية جمعنا للمعلومات واستخدامها.
        </p>
        <ul className="list-disc pl-6 space-y-3 text-sm text-neutral-700">
          <li>نقوم بجمع البيانات الأساسية مثل الاسم والبريد الإلكتروني لتحسين تجربة المستخدم.</li>
          <li>لا نقوم ببيع أو مشاركة معلوماتك مع جهات خارجية بدون موافقتك.</li>
          <li>نستخدم تقنيات التتبع لتحليل استخدام الموقع وتحسين خدماتنا.</li>
          <li>يحق للمستخدم طلب حذف بياناته من المنصة في أي وقت.</li>
        </ul>
      </section>

      <p className="mt-14 text-xs text-gray-500 text-center">
        تاريخ آخر تحديث: {formattedDate}
      </p>
    </div>
  );
};

export default TermsAndPrivacy;
