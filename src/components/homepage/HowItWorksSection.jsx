import React, { useMemo } from 'react';

const HowItWorksSection = () => {
  const steps = useMemo(() => [
    { title: "استكشف الخدمات", description: "ابدأ بتصفح مجموعة واسعة من الخدمات واختر الأنسب لاحتياجاتك." },
    { title: "قدم طلبك", description: "قم بطلب الخدمة وتواصل مباشرة مع المستقل لمتابعة تنفيذها." },
    { title: "استلم طلبك", description: "تسلم خدمتك بكل احترافية في الوقت المحدد وبجودة مضمونة." }
  ], []);

  return (
    <section className="py-12 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-cyan-800 mb-14 tracking-wide">
          كيف تعمل المنصة اليمنية؟
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-center justify-items-center">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-3xl shadow-lg text-center flex flex-col items-center w-full max-w-[300px] h-[250px]"
            >
              <div className="text-4xl font-extrabold text-emerald-600 mb-5 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100">
                {i + 1}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-base text-gray-700 leading-relaxed max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
