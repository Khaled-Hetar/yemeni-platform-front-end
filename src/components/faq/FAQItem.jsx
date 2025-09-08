// src/components/faq/FAQItem.jsx
import React from 'react';

// إضافة قيمة افتراضية للكائن item
const FAQItem = ({ item = {}, onToggle, isOpen }) => { 
  const { question, answer } = item;

  // يمكنك إضافة تحقق إضافي إذا أردت
  if (!question) {
    return null; // لا تعرض أي شيء إذا لم يكن هناك سؤال
  }

  return (
    <div
      className="bg-white p-6 rounded-xl shadow border border-gray-200 cursor-pointer"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }}
      aria-expanded={isOpen}
      aria-controls={`faq-content-${question}`}
    >
      <h2 className="text-lg font-semibold text-cyan-800 flex justify-between items-center">
        {question}
        <span className="text-xl font-light">{isOpen ? "−" : "+"}</span>
      </h2>
      {isOpen && (
        <p
          id={`faq-content-${question}`}
          className="text-sm leading-relaxed text-neutral-700 mt-4"
        >
          {answer}
        </p>
      )}
    </div>
  );
};

export default FAQItem;
