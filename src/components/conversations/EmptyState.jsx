// src/components/EmptyState.jsx
import React from 'react';
import { FiInbox } from 'react-icons/fi'; // استخدام أيقونة مناسبة

/**
 * مكون لعرض حالة عدم وجود بيانات.
 * @param {object} props - الخصائص
 * @param {string} props.message - الرسالة الرئيسية التي سيتم عرضها.
 * @param {string} [props.details] - تفاصيل إضافية (اختياري).
 * @param {React.ReactNode} [props.icon] - أيقونة مخصصة (اختياري).
 * @param {string} [props.actionText] - نص زر الإجراء (اختياري).
 * @param {() => void} [props.onAction] - الدالة التي سيتم استدعاؤها عند النقر على الزر (اختياري).
 */
const EmptyState = ({ message, details, icon, actionText, onAction }) => {
  return (
    <div className="text-center py-16 px-6 flex flex-col items-center bg-gray-50 rounded-2xl">
      <div className="text-gray-400 mb-4">
        {icon || <FiInbox size={48} />}
      </div>
      <h3 className="text-xl font-semibold text-gray-700">{message}</h3>
      {details && (
        <p className="text-gray-500 mt-2 max-w-sm">{details}</p>
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-5 py-2 bg-cyan-600 text-white text-sm font-semibold rounded-lg hover:bg-cyan-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
