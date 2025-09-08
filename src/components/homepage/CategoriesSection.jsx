import React, { useMemo } from 'react';

const CategoriesSection = () => {
  const categories = useMemo(() => [
    ["💼", "الأعمال"], ["💻", "البرمجة والتطوير"], ["📢", "التسويق والإعلان"],
    ["🎨", "التصميم والإبداع"], ["🎥", "المونتاج والفيديو"], ["🎙️", "الصوت والهندسة الصوتية"],
    ["🌐", "الكتابة والترجمة"], ["👨‍🏫", "التدريب والاستشارات"], ["💳", "الخدمات المالية"],
  ], []);

  return (
    <section className="py-12 px-6 bg-white text-center">
      <h2 className="text-4xl font-bold mb-6 tracking-wide text-cyan-800">
        الأقسام الرئيسية
      </h2>
      <p className="max-w-2xl mx-auto text-gray-700 mb-12 text-base">
        تصفّح أهم الأقسام في المنصة اليمنية واختر ما يناسب طبيعة مشروعك بكل سهولة
      </p>
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 max-w-7xl mx-auto px-2">
        {categories.map(([icon, label], i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer h-[150px] w-full flex flex-col items-center justify-center border border-gray-300">
            <div className="text-4xl mb-3 text-emerald-600">{icon}</div>
            <p className="text-base font-semibold text-gray-800">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
