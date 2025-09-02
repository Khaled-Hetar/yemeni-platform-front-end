import { Link } from "react-router-dom";
import React from "react";

const HomePage = () => {
  return (
    <main className="bg-white font-sans text-gray-800 leading-relaxed">
      {/* Hero Section */}
      <section className="bg-cyan-800 text-white py-20 px-6 md:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
              أهلاً بك في{" "}
              <p className="text-orange-400 text-6xl mt-4 text-center">المنصة اليمنية</p>
            </h1>
            <p className="text-xl md:text-2xl max-w-lg drop-shadow-sm">
              أنجز مشاريعك باحترافية عبر الإنترنت مع نخبة من أفضل المستقلين في الوطن العربي، بكل سهولة وأمان.
            </p>
          </div>
          <div className="md:w-1/2 max-w-lg">
            <img
              src="src\assets\image\new\hello.svg"
              alt="hero"
              className="w-full rounded-xl shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-cyan-800 mb-14 tracking-wide">
            كيف تعمل المنصة اليمنية؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-center justify-items-center">
            {["تصفح الخدمات", "اطلب الخدمة", "استلم خدمتك"].map((step, i) => (
              <div
                key={i}
                className={`bg-white p-8 rounded-3xl shadow-lg text-center flex flex-col items-center w-[300px] h-[250px]
                ${i === 2 ? "mx-auto" : ""}`}
                style={{ maxWidth: i === 2 ? "300px" : "auto" }}
              >
                <div className="text-4xl font-extrabold text-emerald-600 mb-5 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100">
                  {i + 1}
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  {i === 0
                    ? "استكشف الخدمات"
                    : i === 1
                    ? "قدم طلبك"
                    : "استلم طلبك"}
                </h3>
                <p className="text-base text-gray-700 leading-relaxed max-w-xs">
                  {i === 0
                    ? "ابدأ بتصفح مجموعة واسعة من الخدمات واختر الأنسب لاحتياجاتك."
                    : i === 1
                    ? "قم بطلب الخدمة وتواصل مباشرة مع المستقل لمتابعة تنفيذها."
                    : "تسلم خدمتك بكل احترافية في الوقت المحدد وبجودة مضمونة."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-12 px-6 bg-orange-50">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
    <div className="px-4 md:px-6">
      <h2 className="text-4xl font-bold text-cyan-700 mb-6 tracking-tight flex items-center justify-center">
        لماذا تختار المنصة اليمنية؟
      </h2>
      <p className="mb-6 text-gray-700 text-lg leading-relaxed flex items-center justify-center drop-shadow-sm">
        نقدم لك بيئة احترافية وآمنة تجمع بين أصحاب المشاريع والمستقلين بكل ثقة وشفافية:
      </p>
      <h3 className="text-2xl font-bold text-green-700 mb-4">
        لأصحاب المشاريع:
      </h3>
      <ul className="list-disc list-inside space-y-3 text-base text-gray-800">
        <li>ضمان كامل لحقوقك في جميع التعاملات</li>
        <li>عمولة رمزية بنسبة 10٪ فقط عند إتمام الطلب</li>
        <li>خيارات دفع متعددة وآمنة 100٪</li>
      </ul>
    </div>
    <div className="max-w-md mx-auto md:mx-0 px-4 md:px-6">
      <img
        src="src\assets\image\pic-1.svg"
        alt="لماذا تختارنا"
        className="w-full rounded-xl shadow-lg"
        loading="lazy"
      />
    </div>
  </div>

  {/* قسم المستقلين */}
  <div className="max-w-7xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
    <div className="order-2 md:order-1 max-w-md mx-auto md:mx-0 px-4 md:px-6">
      <img
        src="src\assets\image\new\freelancer.svg"
        alt="فوائد للمستقلين"
        className="w-full rounded-xl shadow-lg"
        loading="lazy"
      />
    </div>
    <div className="order-1 md:order-2 px-4 md:px-6">
      <h3 className="text-2xl font-bold text-green-700 mb-4">
        للمستقلين:
      </h3>
      <ul className="list-disc list-inside space-y-3 text-base text-gray-800">
        <li>فرص عمل مستمرة في مختلف المجالات</li>
        <li>واجهة سهلة لإدارة الطلبات والتواصل</li>
        <li>سحب الأرباح بمرونة من خلال وسائل موثوقة</li>
        <li>بناء سمعتك وتقييمك من خلال إنجازاتك</li>
      </ul>
    </div>
  </div>
</section>


      {/* Categories */}
      <section className="py-12 px-6 bg-orange-50 text-center">
        <h2 className="text-4xl font-bold mb-6 tracking-wide text-cyan-800">
          الأقسام الرئيسية
        </h2>
        <p className="max-w-2xl mx-auto text-gray-700 mb-12 text-base">
          تصفّح أهم الأقسام في المنصة اليمنية واختر ما يناسب طبيعة مشروعك بكل سهولة
        </p>
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 max-w-7xl mx-auto px-2">
          {[
            ["💼", "الأعمال"],
            ["💻", "البرمجة والتطوير"],
            ["📢", "التسويق والإعلان"],
            ["🎨", "التصميم والإبداع"],
            ["🎥", "المونتاج والفيديو"],
            ["🎙️", "الصوت والهندسة الصوتية"],
            ["🌐", "الكتابة والترجمة"],
            ["👨‍🏫", "التدريب والاستشارات"],
            ["💳", "الخدمات المالية"],
          ].map(([icon, label], i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer h-[150px] w-[150px]"
            >
              <div className="text-4xl mb-3 text-emerald-600">{icon}</div>
              <p className="text-base font-semibold text-gray-800">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 px-6 bg-cyan-900 text-white text-center">
        <h2 className="text-3xl font-extrabold mb-5 tracking-tight">
          ابدأ رحلتك المهنية مع المنصة اليمنية
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-base leading-relaxed">
          كن جزءًا من مجتمعنا النشط وابدأ في توسيع نطاق أعمالك بثقة وأمان عبر منصتنا.
        </p>
        <Link
          to="/signup"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-3xl transition duration-300 shadow-lg hover:shadow-xl"
        >
          سجل الآن
        </Link>
      </section>
    </main>
  );
};

export default HomePage;