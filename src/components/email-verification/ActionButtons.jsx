import React from 'react';

const ActionButtons = ({ onResend, onLogout, isResending, message }) => (
  <div className="w-full">
    {message && (
      <p className={`mb-4 text-sm font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
        {message}
      </p>
    )}
    <button
      onClick={onResend}
      disabled={isResending}
      className="w-full mb-3 py-2 px-4 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition disabled:opacity-60"
    >
      {isResending ? '...جاري الإرسال' : 'إعادة إرسال رابط التفعيل'}
    </button>
    <button
      onClick={onLogout}
      className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition"
    >
      العودة إلى تسجيل الدخول
    </button>
  </div>
);

export default ActionButtons;
