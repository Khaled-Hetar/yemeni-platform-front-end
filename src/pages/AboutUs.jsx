import React from "react";

const AboutUs = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-sky-700 mb-10 text-center border-b border-sky-300 pb-4">
        من نحن
      </h2>

      <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
        <p>
          نحن منصة يمنية متخصصة تهدف إلى تسهيل الربط بين مقدمي الخدمات والباحثين عنها في شتى المجالات، من خلال واجهة سهلة الاستخدام وتجربة سلسة تضمن رضا جميع الأطراف.
        </p>

        <p>
          نسعى لبناء مجتمع موثوق من المستقلين والعملاء، حيث نوفر نظام تقييم ومراجعات يضمن الشفافية والمصداقية. كما نلتزم بدعم الاقتصاد المحلي من خلال تمكين الكفاءات اليمنية من تقديم خدماتهم بسهولة وأمان.
        </p>

        <p>
          منذ انطلاقتنا، ونحن نركز على تقديم حلول مبتكرة تلبي احتياجات السوق اليمني وتسهم في تطويره رقمياً. رؤيتنا هي أن نصبح المنصة الأولى للخدمات في اليمن.
        </p>
      </div>

      <div className="mt-14">
        <h3 className="text-2xl font-semibold text-sky-600 mb-5">قيمنا:</h3>
        <ul className="list-disc list-inside text-neutral-700 space-y-3 text-lg">
          <li>الشفافية والثقة</li>
          <li>دعم وتمكين المجتمع المحلي</li>
          <li>الابتكار المستمر</li>
          <li>تجربة مستخدم متميزة</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;
