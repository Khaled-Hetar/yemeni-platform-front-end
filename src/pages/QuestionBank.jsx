import React from "react";
import { FiSearch } from "react-icons/fi";

const questions = [
  {
    id: 1,
    category: "الحسابات",
    question: "كيف يمكنني تعديل بياناتي الشخصية؟",
    answer: "يمكنك تعديل بياناتك من خلال صفحة الإعدادات ثم النقر على زر التعديل."
  },
  {
    id: 2,
    category: "الخدمات",
    question: "كيف أضيف خدمة جديدة؟",
    answer: "ادخل إلى لوحة التحكم ثم اختر (إضافة خدمة) واملأ البيانات المطلوبة."
  },
  {
    id: 3,
    category: "الطلبات",
    question: "هل يمكنني إلغاء الطلب بعد إرساله؟",
    answer: "نعم، يمكنك ذلك في حال لم يتم قبوله بعد من قبل مقدم الخدمة."
  },
  {
    id: 4,
    category: "المدفوعات",
    question: "ما طرق الدفع المتاحة؟",
    answer: "نقبل الدفع عبر البطاقات البنكية، المحافظ الإلكترونية، والتحويل البنكي."
  },
];

const QuestionBank = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 text-neutral-800">
      <h1 className="text-3xl font-bold text-cyan-700 mb-8 text-center">بنك الأسئلة</h1>

      {/* Search Bar */}
      <div className="flex items-center mb-10 max-w-md mx-auto rounded-full border border-gray-300 overflow-hidden bg-white">
        <input
          type="text"
          placeholder="ابحث عن سؤال..."
          className="flex-grow px-4 py-2 text-sm outline-none"
        />
        <button className="p-2 px-4 bg-cyan-600 text-white">
          <FiSearch />
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
            <div className="text-sm text-cyan-600 font-medium mb-1">{q.category}</div>
            <h2 className="text-lg font-semibold mb-2">{q.question}</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{q.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionBank;
