// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../api/axiosConfig';

// 1. إنشاء السياق
const AuthContext = createContext(null);

// 2. إنشاء المزوّد (Provider)
export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // حالة تحميل أولية للتحقق من التوكن

  // --- دالة تحديث المستخدم ---
  const setUser = useCallback((newUserData) => {
    setUserState(newUserData);
    if (newUserData) {
      localStorage.setItem('user', JSON.stringify(newUserData));
    } else {
      localStorage.removeItem('user');
    }
  }, []);

  // --- التحقق من التوكن عند تحميل التطبيق ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserState(parsedUser);
        setIsAuthenticated(true);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // --- تسجيل الدخول ---
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUserState(userData);
    setIsAuthenticated(true);
  };

  // --- تسجيل الخروج ---
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete apiClient.defaults.headers.common['Authorization'];
    setUserState(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook مخصص
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
