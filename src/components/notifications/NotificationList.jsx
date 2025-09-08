// src/components/notifications/NotificationList.jsx
import React from 'react';
import NotificationItem from './NotificationItem';

const NotificationList = ({ notifications, onNotificationClick }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
    <ul className="divide-y divide-gray-100">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification}
          onClick={() => onNotificationClick(notification)}
        />
      ))}
    </ul>
  </div>
);

export default NotificationList;
