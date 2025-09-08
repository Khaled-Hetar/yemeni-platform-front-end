// src/pages/Notifications.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

// استيراد المكونات
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import NotificationHeader from '../components/notifications/NotificationHeader';
import NotificationList from '../components/notifications/NotificationList';
import EmptyState from '../components/notifications/EmptyState';

const Notifications = () => {
  const { isAuthenticated } = useAuth();
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

  const handleMarkAsRead = useCallback(async (notificationId) => {
    const originalNotifications = [...notifications];
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n)
    );
    try {
      await apiClient.patch(`/notifications/${notificationId}/mark-as-read`);
    } catch (error) {
      console.error(`فشل في تحديث الإشعار ${notificationId}:`, error);
      setNotifications(originalNotifications);
      alert("حدث خطأ أثناء تحديث الإشعار.");
    }
  }, [notifications]);

  const handleMarkAllAsRead = useCallback(async () => {
    const unreadIds = notifications.filter(n => !n.read_at).map(n => n.id);
    if (unreadIds.length === 0) return;

    const originalNotifications = [...notifications];
    setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    try {
      await apiClient.post('/user/notifications/mark-all-as-read');
    } catch (error) {
      console.error("فشل في تحديث كل الإشعارات:", error);
      setNotifications(originalNotifications);
      alert("حدث خطأ أثناء تحديث جميع الإشعارات.");
    }
  }, [notifications]);

  const handleDeleteAll = useCallback(async () => {
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
  }, []);

  const handleNotificationClick = useCallback((notification) => {
    if (!notification.read_at) {
      handleMarkAsRead(notification.id);
    }
    if (notification.data.link) {
      navigate(notification.data.link);
    }
  }, [handleMarkAsRead, navigate]);

  if (loading) return <LoadingState message="جاري تحميل الإشعارات..." />;
  if (error) return <ErrorState message={error} onRetry={fetchNotifications} />;

  // ===============================================================
  // قسم الـ JSX (تم الحفاظ عليه كما هو من تصميمك الأصلي 100%)
  // ===============================================================
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <NotificationHeader 
          onMarkAllAsRead={handleMarkAllAsRead}
          onDeleteAll={handleDeleteAll}
          hasNotifications={notifications.length > 0}
        />
        <main>
          {notifications.length > 0 ? (
            <NotificationList 
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
            />
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
    </div>
  );
};

export default Notifications;
