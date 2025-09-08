// src/components/notifications/NotificationItem.jsx
import React from 'react';
import { FiBell, FiMessageSquare, FiFileText, FiStar, FiClipboard } from 'react-icons/fi';

const NotificationIcon = ({ type }) => {
  const iconMap = {
    new_proposal: <FiFileText className="text-blue-500" />,
    new_order: <FiClipboard className="text-green-500" />,
    new_message: <FiMessageSquare className="text-purple-500" />,
    new_review: <FiStar className="text-yellow-500" />,
    default: <FiBell className="text-gray-500" />,
  };
  return (
    <div className="p-3 bg-gray-100 rounded-full">
      {iconMap[type] || iconMap.default}
    </div>
  );
};

const NotificationItem = ({ notification, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-start gap-4 p-4 transition cursor-pointer 
      ${notification.read_at ? 'bg-white hover:bg-gray-50' : 'bg-sky-50 hover:bg-sky-100'}`}
  >
    <NotificationIcon type={notification.data.type} />
    <div className="flex-grow">
      <p className="text-sm text-gray-800">{notification.data.message}</p>
      <p className="text-xs text-gray-500 mt-1">
        {new Date(notification.created_at).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}
      </p>
    </div>
    {!notification.read_at && (
      <div className="w-2.5 h-2.5 bg-sky-500 rounded-full self-center flex-shrink-0"></div>
    )}
  </li>
);

export default NotificationItem;
