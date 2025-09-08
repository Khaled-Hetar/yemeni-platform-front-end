// src/components/forms/Notification.jsx

import React from 'react';

/**
 * مكون لعرض إشعارات النجاح أو الخطأ.
 * @param {object} props
 * @param {'success' | 'error'} props.type - نوع الإشعار.
 * @param {string} props.message - نص الرسالة.
 */
const Notification = ({ type, message }) => {
  if (!message) {
    return null;
  }

  const baseClasses = "p-3 mt-4 rounded-md text-center text-sm font-semibold";
  const typeClasses = type === 'success' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
    </div>
  );
};

export default Notification;
