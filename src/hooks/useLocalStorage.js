import { useState } from 'react';
import { localStorageUtils } from '../utils/localStorage';

// Hook مخصص لاستخدام Local Storage مع React
export const useLocalStorage = (key, initialValue) => {
  // الحصول على القيمة من Local Storage أو استخدام القيمة الافتراضية
  const [storedValue, setStoredValue] = useState(() => {
    return localStorageUtils.getItem(key, initialValue);
  });

  // دالة لتحديث القيمة
  const setValue = (value) => {
    try {
      // السماح بتمرير دالة كما في useState العادي
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // تحديث الحالة
      setStoredValue(valueToStore);
      
      // حفظ في Local Storage
      localStorageUtils.setItem(key, valueToStore);
    } catch (error) {
      console.error(`خطأ في حفظ البيانات للمفتاح ${key}:`, error);
    }
  };

  // دالة لحذف القيمة
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      localStorageUtils.removeItem(key);
    } catch (error) {
      console.error(`خطأ في حذف البيانات للمفتاح ${key}:`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};


// Hook لإدارة التفضيلات
export const usePreferences = () => {
  const [preferences, setPreferences] = useLocalStorage('yemeni_platform_user_preferences', {
    language: 'ar',
    theme: 'light',
    notifications: true,
    emailNotifications: true
  });

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
      lastUpdated: new Date().toISOString()
    }));
  };

  return { preferences, updatePreference, setPreferences };
};

// Hook لإدارة سلة التسوق
export const useCart = () => {
  const [cartItems, setCartItems] = useLocalStorage('yemeni_platform_cart_items', []);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity = (updatedItems[existingItemIndex].quantity || 1) + 1;
        return updatedItems;
      } else {
        return [...prevItems, { ...item, quantity: 1, addedAt: new Date().toISOString() }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };
};

// Hook لإدارة عمليات البحث الأخيرة
export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useLocalStorage('yemeni_platform_recent_searches', []);

  const addRecentSearch = (searchTerm) => {
    setRecentSearches(prevSearches => {
      // إزالة البحث إذا كان موجوداً مسبقاً
      const filteredSearches = prevSearches.filter(term => term !== searchTerm);
      
      // إضافة البحث الجديد في المقدمة
      const newSearches = [searchTerm, ...filteredSearches];
      
      // الاحتفاظ بآخر 10 عمليات بحث فقط
      return newSearches.slice(0, 10);
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return { recentSearches, addRecentSearch, clearRecentSearches };
};

// Hook لإدارة الإشعارات
export const useNotifications = () => {
  const [notifications, setNotifications] = useLocalStorage('yemeni_platform_notifications', []);

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prevNotifications => {
      const updatedNotifications = [newNotification, ...prevNotifications];
      // الاحتفاظ بآخر 50 إشعار فقط
      return updatedNotifications.slice(0, 50);
    });
  };

  const markAsRead = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== notificationId)
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
    getUnreadCount
  };
};

export default {
  useLocalStorage,
  usePreferences,
  useCart,
  useRecentSearches,
  useNotifications
};

