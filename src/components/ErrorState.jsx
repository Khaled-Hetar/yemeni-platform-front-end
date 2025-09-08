import React from 'react';
import { FiAlertCircle } from "react-icons/fi";

const ErrorState = ({ message = "حدث خطأ غير متوقع.", onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
    <FiAlertCircle className="text-red-500 text-5xl mb-4" />
    <h2 className="text-xl font-bold text-gray-800 mb-2">عذرًا، حدث خطأ ما</h2>
    <p className="text-red-600 font-semibold mb-6">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry} 
        className="bg-sky-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-sky-700 transition"
      >
        إعادة المحاولة
      </button>
    )}
  </div>
);

export default ErrorState;
