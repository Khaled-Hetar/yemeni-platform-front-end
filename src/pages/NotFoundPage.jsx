import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="max-w-md">
        <FiAlertTriangle className="mx-auto text-6xl text-yellow-400 mb-6" />

        <h1 className="text-5xl font-extrabold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">الصفحة غير موجودة</h2>

        <p className="text-gray-500 leading-relaxed mb-8">
          عذراً، لا يمكننا العثور على الصفحة التي تبحث عنها. ربما تم حذفها أو أن الرابط الذي اتبعته غير صحيح.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-3 px-8 
            rounded-full hover:bg-cyan-700 transition-transform transform hover:scale-105 shadow-lg"
        >
          <FiHome />
          <span>العودة إلى الصفحة الرئيسية</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
