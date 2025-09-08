import React from 'react';
import whyUsImage from '../../assets/image/pic-1.svg';
import freelancerImage from '../../assets/image/new/freelancer.svg';

const WhyUsSection = () => (
  <section className="py-12 px-6 bg-orange-50">
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-4xl font-bold text-cyan-700 mb-6 tracking-tight">
        لماذا تختار المنصة اليمنية؟
      </h2>
      <p className="mb-12 text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto drop-shadow-sm">
        نقدم لك بيئة احترافية وآمنة تجمع بين أصحاب المشاريع والمستقلين بكل ثقة وشفافية:
      </p>
    </div>
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div className="px-4 md:px-6">
        <h3 className="text-2xl font-bold text-green-700 mb-4">لأصحاب المشاريع:</h3>
        <ul className="list-disc list-inside space-y-3 text-base text-gray-800">
          <li>ضمان كامل لحقوقك في جميع التعاملات</li>
          <li>عمولة رمزية بنسبة 10٪ فقط عند إتمام الطلب</li>
          <li>خيارات دفع متعددة وآمنة 100٪</li>
        </ul>
      </div>
      <div className="max-w-md mx-auto md:mx-0 px-4 md:px-6">
        <img src={whyUsImage} alt="رجل أعمال يحلل الرسوم البيانية" className="w-full rounded-xl shadow-lg" loading="lazy" />
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div className="order-2 md:order-1 max-w-md mx-auto md:mx-0 px-4 md:px-6">
        <img src={freelancerImage} alt="مستقل يعمل بسعادة من المنزل" className="w-full rounded-xl shadow-lg" loading="lazy" />
      </div>
      <div className="order-1 md:order-2 px-4 md:px-6">
        <h3 className="text-2xl font-bold text-green-700 mb-4">للمستقلين:</h3>
        <ul className="list-disc list-inside space-y-3 text-base text-gray-800">
          <li>فرص عمل مستمرة في مختلف المجالات</li>
          <li>واجهة سهلة لإدارة الطلبات والتواصل</li>
          <li>سحب الأرباح بمرونة من خلال وسائل موثوقة</li>
          <li>بناء سمعتك وتقييمك من خلال إنجازاتك</li>
        </ul>
      </div>
    </div>
  </section>
);

export default WhyUsSection;
