import React from "react";

const TermItem = ({ number, title, children }) => (
  <li>
    <h2 className="text-xl font-semibold text-neutral-700 mb-3">
      {number}. {title}
    </h2>
    <p>{children}</p>
  </li>
);

const TermsOfService = () => {
  const lastUpdated = new Date().toLocaleDateString("ar-EG", {
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
        className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-300 text-neutral-800 leading-relaxed"
        role="document" // تحسين إمكانية الوصول
      >
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-cyan-700">
            شروط الخدمة
          </h1>
        </header>

        <main>
          <ol className="space-y-10">
            <TermItem number={1} title="القبول بالشروط">
              باستخدامك لهذه المنصة، فإنك توافق على الالتزام بجميع الشروط والبنود المنصوص عليها في هذه الوثيقة.
              إذا كنت لا توافق على أي جزء من الشروط، فلا يجوز لك استخدام المنصة.
            </TermItem>

            <TermItem number={2} title="استخدام المنصة">
              يجب على المستخدم الالتزام بالاستخدام السليم للمنصة وعدم إساءة استخدامها أو استخدامها لأغراض غير مشروعة.
              يحق للإدارة اتخاذ الإجراءات اللازمة ضد أي انتهاك.
            </TermItem>

            <TermItem number={3} title="الحسابات والمحتوى">
              يتحمل المستخدم مسؤولية الحفاظ على سرية بيانات الحساب. لا يجوز نشر أو مشاركة محتوى يخالف السياسات أو القوانين.
            </TermItem>

            <TermItem number={4} title="التعديلات على الشروط">
              نحتفظ بالحق في تعديل شروط الخدمة في أي وقت. سيتم إشعار المستخدمين بالتعديلات عند نشرها عبر المنصة.
            </TermItem>
          </ol>
        </main>

        <footer className="mt-16 text-xs text-gray-500 text-center">
          <p>تاريخ آخر تحديث: {lastUpdated}</p>
        </footer>
      </article>
    </div>
  );
};

export default TermsOfService;
