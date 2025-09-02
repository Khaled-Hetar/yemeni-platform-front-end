import React from "react";

const TermsOfService = () => {
  const lastUpdated = new Date().toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="max-w-4xl mx-auto py-16 px-6 text-neutral-800 leading-relaxed">
      <header>
        <h1 className="text-3xl font-bold text-cyan-700 mb-12 text-center">
          شروط الخدمة
        </h1>
      </header>

      <ol className="space-y-10 list-inside">
        <li>
          <h2 className="text-xl font-semibold text-neutral-700 mb-3">
            القبول بالشروط
          </h2>
          <p>
            باستخدامك لهذه المنصة، فإنك توافق على الالتزام بجميع الشروط والبنود المنصوص عليها في هذه الوثيقة.
            إذا كنت لا توافق على أي جزء من الشروط، فلا يجوز لك استخدام المنصة.
          </p>
        </li>

        <li>
          <h2 className="text-xl font-semibold text-neutral-700 mb-3">
            استخدام المنصة
          </h2>
          <p>
            يجب على المستخدم الالتزام بالاستخدام السليم للمنصة وعدم إساءة استخدامها أو استخدامها لأغراض غير مشروعة.
            يحق للإدارة اتخاذ الإجراءات اللازمة ضد أي انتهاك.
          </p>
        </li>

        <li>
          <h2 className="text-xl font-semibold text-neutral-700 mb-3">
            الحسابات والمحتوى
          </h2>
          <p>
            يتحمل المستخدم مسؤولية الحفاظ على سرية بيانات الحساب. لا يجوز نشر أو مشاركة محتوى يخالف السياسات أو القوانين.
          </p>
        </li>

        <li>
          <h2 className="text-xl font-semibold text-neutral-700 mb-3">
            التعديلات على الشروط
          </h2>
          <p>
            نحتفظ بالحق في تعديل شروط الخدمة في أي وقت. سيتم إشعار المستخدمين بالتعديلات عند نشرها عبر المنصة.
          </p>
        </li>
      </ol>

      <p className="mt-16 text-xs text-gray-500 text-center">
        تاريخ آخر تحديث: {lastUpdated}
      </p>
    </main>
  );
};

export default TermsOfService;
