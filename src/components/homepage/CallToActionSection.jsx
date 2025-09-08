import React from 'react';
import { Link } from 'react-router-dom';

const CallToActionSection = () => (
  <section className="py-12 px-6 bg-cyan-900 text-white text-center">
    <h2 className="text-3xl font-extrabold mb-5 tracking-tight">
      ابدأ رحلتك المهنية مع المنصة اليمنية
    </h2>
    <p className="max-w-2xl mx-auto mb-8 text-base leading-relaxed">
      كن جزءًا من مجتمعنا النشط وابدأ في توسيع نطاق أعمالك بثقة وأمان عبر منصتنا.
    </p>
    <Link to="/register" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-3xl transition duration-300 shadow-lg hover:shadow-xl">
      سجل الآن
    </Link>
  </section>
);

export default CallToActionSection;
