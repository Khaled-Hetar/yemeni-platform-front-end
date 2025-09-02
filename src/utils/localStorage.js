// نظام إدارة Local Storage للمنصة اليمنية

// مفاتيح التخزين المحلي
export const STORAGE_KEYS = {
  USER_DATA: 'yemeni_platform_user_data',
  AUTH_TOKEN: 'yemeni_platform_auth_token',
  REMEMBERED_LOGIN: 'yemeni_platform_remembered_login',
  USER_PREFERENCES: 'yemeni_platform_user_preferences',
  CART_ITEMS: 'yemeni_platform_cart_items',
  RECENT_SEARCHES: 'yemeni_platform_recent_searches',
  DRAFT_PROPOSALS: 'yemeni_platform_draft_proposals',
  CHAT_HISTORY: 'yemeni_platform_chat_history',
  NOTIFICATIONS: 'yemeni_platform_notifications',
  THEME_SETTINGS: 'yemeni_platform_theme_settings'
};

// وظائف عامة للتعامل مع Local Storage
export const localStorageUtils = {
  // حفظ البيانات
  setItem: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error);
      return false;
    }
  },

  // استرجاع البيانات
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('خطأ في استرجاع البيانات:', error);
      return defaultValue;
    }
  },

  // حذف عنصر محدد
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('خطأ في حذف البيانات:', error);
      return false;
    }
  },

  // مسح جميع البيانات المتعلقة بالمنصة
  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('خطأ في مسح البيانات:', error);
      return false;
    }
  },

  // التحقق من وجود مفتاح
  hasItem: (key) => {
    return localStorage.getItem(key) !== null;
  }
};

// وظائف خاصة ببيانات المستخدم
export const userStorage = {
  // حفظ بيانات المستخدم
  saveUserData: (userData) => {
    return localStorageUtils.setItem(STORAGE_KEYS.USER_DATA, {
      ...userData,
      lastUpdated: new Date().toISOString()
    });
  },

  // استرجاع بيانات المستخدم
  getUserData: () => {
    return localStorageUtils.getItem(STORAGE_KEYS.USER_DATA);
  },

  // حفظ رمز المصادقة
  saveAuthToken: (token) => {
    return localStorageUtils.setItem(STORAGE_KEYS.AUTH_TOKEN, {
      token,
      timestamp: new Date().toISOString()
    });
  },

  // استرجاع رمز المصادقة
  getAuthToken: () => {
    const authData = localStorageUtils.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return authData ? authData.token : null;
  },

  // حذف بيانات المصادقة
  clearAuth: () => {
    localStorageUtils.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorageUtils.removeItem(STORAGE_KEYS.USER_DATA);
  },

  // التحقق من تسجيل الدخول
  isLoggedIn: () => {
    return localStorageUtils.hasItem(STORAGE_KEYS.AUTH_TOKEN) && 
           localStorageUtils.hasItem(STORAGE_KEYS.USER_DATA);
  }
};

// وظائف خاصة ببيانات تذكر تسجيل الدخول
export const rememberLoginStorage = {
  // حفظ بيانات تذكر تسجيل الدخول
  saveRememberedLogin: (email, password) => {
    return localStorageUtils.setItem(STORAGE_KEYS.REMEMBERED_LOGIN, {
      email,
      password,
      timestamp: new Date().toISOString()
    });
  },

  // استرجاع بيانات تذكر تسجيل الدخول
  getRememberedLogin: () => {
    return localStorageUtils.getItem(STORAGE_KEYS.REMEMBERED_LOGIN);
  },

  // حذف بيانات تذكر تسجيل الدخول
  clearRememberedLogin: () => {
    return localStorageUtils.removeItem(STORAGE_KEYS.REMEMBERED_LOGIN);
  }
};

// وظائف خاصة بتفضيلات المستخدم
export const preferencesStorage = {
  // حفظ التفضيلات
  savePreferences: (preferences) => {
    const currentPrefs = localStorageUtils.getItem(STORAGE_KEYS.USER_PREFERENCES, {});
    return localStorageUtils.setItem(STORAGE_KEYS.USER_PREFERENCES, {
      ...currentPrefs,
      ...preferences,
      lastUpdated: new Date().toISOString()
    });
  },

  // استرجاع التفضيلات
  getPreferences: () => {
    return localStorageUtils.getItem(STORAGE_KEYS.USER_PREFERENCES, {
      language: 'ar',
      theme: 'light',
      notifications: true,
      emailNotifications: true
    });
  },

  // حفظ تفضيل محدد
  savePreference: (key, value) => {
    const preferences = preferencesStorage.getPreferences();
    preferences[key] = value;
    return preferencesStorage.savePreferences(preferences);
  }
};

// وظائف خاصة بسلة التسوق
export const cartStorage = {
  // إضافة عنصر للسلة
  addToCart: (item) => {
    const cart = localStorageUtils.getItem(STORAGE_KEYS.CART_ITEMS, []);
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    } else {
      cart.push({ ...item, quantity: 1, addedAt: new Date().toISOString() });
    }
    
    return localStorageUtils.setItem(STORAGE_KEYS.CART_ITEMS, cart);
  },

  // إزالة عنصر من السلة
  removeFromCart: (itemId) => {
    const cart = localStorageUtils.getItem(STORAGE_KEYS.CART_ITEMS, []);
    const updatedCart = cart.filter(item => item.id !== itemId);
    return localStorageUtils.setItem(STORAGE_KEYS.CART_ITEMS, updatedCart);
  },

  // استرجاع عناصر السلة
  getCartItems: () => {
    return localStorageUtils.getItem(STORAGE_KEYS.CART_ITEMS, []);
  },

  // مسح السلة
  clearCart: () => {
    return localStorageUtils.removeItem(STORAGE_KEYS.CART_ITEMS);
  },

  // تحديث كمية عنصر
  updateQuantity: (itemId, quantity) => {
    const cart = localStorageUtils.getItem(STORAGE_KEYS.CART_ITEMS, []);
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
      return localStorageUtils.setItem(STORAGE_KEYS.CART_ITEMS, cart);
    }
    return false;
  }
};

// وظائف خاصة بالبحث الأخير
export const searchStorage = {
  // إضافة بحث جديد
  addRecentSearch: (searchTerm) => {
    const recentSearches = localStorageUtils.getItem(STORAGE_KEYS.RECENT_SEARCHES, []);
    
    // إزالة البحث إذا كان موجوداً مسبقاً
    const filteredSearches = recentSearches.filter(term => term !== searchTerm);
    
    // إضافة البحث الجديد في المقدمة
    filteredSearches.unshift(searchTerm);
    
    // الاحتفاظ بآخر 10 عمليات بحث فقط
    const limitedSearches = filteredSearches.slice(0, 10);
    
    return localStorageUtils.setItem(STORAGE_KEYS.RECENT_SEARCHES, limitedSearches);
  },

  // استرجاع عمليات البحث الأخيرة
  getRecentSearches: () => {
    return localStorageUtils.getItem(STORAGE_KEYS.RECENT_SEARCHES, []);
  },

  // مسح عمليات البحث الأخيرة
  clearRecentSearches: () => {
    return localStorageUtils.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
  }
};

// وظائف خاصة بمسودات العروض
export const proposalStorage = {
  // حفظ مسودة عرض
  saveDraftProposal: (proposalId, proposalData) => {
    const drafts = localStorageUtils.getItem(STORAGE_KEYS.DRAFT_PROPOSALS, {});
    drafts[proposalId] = {
      ...proposalData,
      lastSaved: new Date().toISOString()
    };
    return localStorageUtils.setItem(STORAGE_KEYS.DRAFT_PROPOSALS, drafts);
  },

  // استرجاع مسودة عرض
  getDraftProposal: (proposalId) => {
    const drafts = localStorageUtils.getItem(STORAGE_KEYS.DRAFT_PROPOSALS, {});
    return drafts[proposalId] || null;
  },

  // حذف مسودة عرض
  deleteDraftProposal: (proposalId) => {
    const drafts = localStorageUtils.getItem(STORAGE_KEYS.DRAFT_PROPOSALS, {});
    delete drafts[proposalId];
    return localStorageUtils.setItem(STORAGE_KEYS.DRAFT_PROPOSALS, drafts);
  },

  // استرجاع جميع المسودات
  getAllDrafts: () => {
    return localStorageUtils.getItem(STORAGE_KEYS.DRAFT_PROPOSALS, {});
  }
};

// وظائف خاصة بالإشعارات
export const notificationStorage = {
  // حفظ إشعار
  saveNotification: (notification) => {
    const notifications = localStorageUtils.getItem(STORAGE_KEYS.NOTIFICATIONS, []);
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    notifications.unshift(newNotification);
    
    // الاحتفاظ بآخر 50 إشعار فقط
    const limitedNotifications = notifications.slice(0, 50);
    
    return localStorageUtils.setItem(STORAGE_KEYS.NOTIFICATIONS, limitedNotifications);
  },

  // استرجاع الإشعارات
  getNotifications: () => {
    return localStorageUtils.getItem(STORAGE_KEYS.NOTIFICATIONS, []);
  },

  // تحديد إشعار كمقروء
  markAsRead: (notificationId) => {
    const notifications = localStorageUtils.getItem(STORAGE_KEYS.NOTIFICATIONS, []);
    const notificationIndex = notifications.findIndex(n => n.id === notificationId);
    
    if (notificationIndex > -1) {
      notifications[notificationIndex].read = true;
      return localStorageUtils.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
    return false;
  },

  // مسح جميع الإشعارات
  clearNotifications: () => {
    return localStorageUtils.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  }
};

export default {
  localStorageUtils,
  userStorage,
  rememberLoginStorage,
  preferencesStorage,
  cartStorage,
  searchStorage,
  proposalStorage,
  notificationStorage
};

