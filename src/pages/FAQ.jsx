import React, { useState } from "react";

const faq = [
  {
    question: "ما هي منصة المنصة اليمنية؟",
    answer: "المنصة اليمنية هي منصة رقمية تربط بين أصحاب المهارات والمستفيدين من خدماتهم داخل اليمن بطريقة احترافية وآمنة.",
  },
  {
    question: "كيف يمكن لأصحاب المهارات الاستفادة من المنصة اليمنية؟",
    answer: "يمكنهم إنشاء حسابات، عرض خدماتهم، التقديم على المشاريع، وتحقيق دخل من مهاراتهم بطريقة مرنة.",
  },
  {
    question: "كيف يضمن المنصة اليمنية حقوقي كمشتري؟",
    answer: "يتم حفظ المبلغ لدى المنصة حتى يتم تسليم الخدمة وفقًا للمواصفات المتفق عليها، وبعدها يتم تحويل المبلغ للبائع.",
  },
  {
    question: "كيف يضمن المنصة اليمنية حقوقي كمستقل؟",
    answer: "المنصة تضمن لك استلام أموالك عند تنفيذ الخدمة حسب الاتفاق، وتوفر آليات للتحكيم في حال النزاعات.",
  },
  {
    question: "ما هي مستويات الباعة (المستقلين) في المنصة اليمنية؟",
    answer: "هناك عدة مستويات للبائعين، تبدأ من بائع جديد وتترقى حسب التقييمات وعدد المشاريع المنجزة.",
  },
  {
    question: "ما هي مستويات المشترين في المنصة اليمنية؟",
    answer: "يتم تصنيف المشترين وفقاً لتفاعلهم ومعدل إتمام المشاريع وتقييماتهم من قبل المستقلين.",
  },
  {
    question: "ما المميزات الممنوحة لمستويات الباعة (المستقلين) المختلفة؟",
    answer: "كل مستوى يمنح مزايا مثل عدد أكبر من العروض، أولوية في الظهور، أدوات تحليل متقدمة، ودعم مخصص.",
  },
  {
    question: "ما هي وسائل سحب الأرباح المتوفرة في المنصة اليمنية؟",
    answer: "توفر المنصة وسائل مثل التحويل البنكي المحلي، المحافظ الإلكترونية، وخيارات أخرى حسب المنطقة.",
  },
  // الأسئلة الأصلية التي أضفتها
  {
    question: "كيف يمكنني التسجيل كمقدم خدمة؟",
    answer: "بإمكانك التسجيل كمقدم خدمة من خلال النقر على زر 'سجل معنا' واتباع الخطوات المطلوبة لتعبئة بياناتك وتوثيق حسابك.",
  },
  {
    question: "هل يمكنني تعديل بياناتي بعد التسجيل؟",
    answer: "نعم، يمكنك تعديل بياناتك الشخصية من خلال صفحة الإعدادات في لوحة التحكم الخاصة بك.",
  },
  {
    question: "ما هي طرق الدفع المتاحة؟",
    answer: "نقبل حالياً عدة وسائل دفع مثل البطاقات البنكية، والتحويلات المحلية، وسيتم إضافة وسائل أخرى قريباً.",
  },
  {
    question: "كيف يتم التواصل بيني وبين العميل؟",
    answer: "يمكنك التواصل مع العميل من خلال نظام الرسائل داخل المنصة بمجرد قبول الطلب أو بدء العمل.",
  },
  {
    question: "ماذا أفعل إذا واجهت مشكلة مع أحد العملاء؟",
    answer: "بإمكانك التواصل مع فريق الدعم الفني من خلال صفحة 'اتصل بنا' أو إرسال بلاغ عبر النظام.",
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-neutral-800">
      <h1 className="text-3xl font-bold text-cyan-700 mb-8 text-center">الأسئلة الشائعة</h1>
      
      <div className="space-y-4">
        {faq.map((faq, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow border border-gray-200 cursor-pointer"
            onClick={() => toggle(index)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') toggle(index); }}
            aria-expanded={openIndex === index}
            aria-controls={`faq-content-${index}`}
          >
            <h2 className="text-lg font-semibold text-cyan-800 mb-2 flex justify-between items-center">
              {faq.question}
              <span>{openIndex === index ? "−" : "+"}</span>
            </h2>
            {openIndex === index && (
              <p
                id={`faq-content-${index}`}
                className="text-sm leading-relaxed text-neutral-700 mt-2"
              >
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
