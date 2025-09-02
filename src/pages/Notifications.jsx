import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { 
  FiLoader, FiAlertTriangle, FiBell, FiCheckCircle, FiTrash2,
  FiMessageSquare, FiFileText, FiStar, FiClipboard } from 'react-icons/fi';

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

const Notifications = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/user/notifications');
      setNotifications(response.data);
    } catch (err) {
      setError("فشل في تحميل الإشعارات.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchNotifications();
  }, [isAuthenticated, navigate, fetchNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    const originalNotifications = [...notifications];
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    try {
      await apiClient.patch(`/notifications/${notificationId}`, { read: true });
    } catch (error) {
      console.error(`فشل في تحديث الإشعار ${notificationId}:`, error);
      setNotifications(originalNotifications);
      alert("حدث خطأ أثناء تحديث الإشعار.");
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;

    const originalNotifications = [...notifications];
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await apiClient.post('/user/notifications/mark-all-as-read');
    } catch (error) {
      console.error("فشل في تحديث كل الإشعارات:", error);
      setNotifications(originalNotifications);
      alert("حدث خطأ أثناء تحديث جميع الإشعارات.");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("هل أنت متأكد من حذف جميع الإشعارات؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    
    const originalNotifications = [...notifications];
    setNotifications([]);
    try {
      await apiClient.delete('/user/notifications/delete-all');
    } catch (error) {
      console.error("فشل في حذف الإشعارات:", error);
      setNotifications(originalNotifications);
      alert("حدث خطأ أثناء حذف الإشعارات.");
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-cyan-600 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <FiAlertTriangle className="text-red-500 text-4xl mb-3" />
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-sky-700">الإشعارات</h1>
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-gray-600 hover:text-sky-600 font-semibold flex items-center gap-1">
              <FiCheckCircle /> تمييز الكل كمقروء
            </button>

            <button
              onClick={handleDeleteAll}
              className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1">
              <FiTrash2 /> حذف الكل
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {notifications.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`flex items-start gap-4 p-4 transition cursor-pointer 
                  ${notification.read ? 'bg-white hover:bg-gray-50' : 'bg-sky-50 hover:bg-sky-100'}`}
              >
                <NotificationIcon type={notification.type} />
                <div className="flex-grow">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2.5 h-2.5 bg-sky-500 rounded-full self-center flex-shrink-0"></div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <FiBell size={48} className="mx-auto text-gray-300 mb-4" />
            <p>لا توجد لديك أي إشعارات حتى الآن.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;