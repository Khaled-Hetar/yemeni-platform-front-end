// src/pages/PaymentsPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from '../api/axiosConfig'; 
import { useAuth } from '../context/AuthContext';

// استيراد المكونات
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import TransactionsSection from '../components/payments/TransactionsSection';
import PaymentMethodsSection from '../components/payments/PaymentMethodsSection';

const PaymentsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [transactionsRes, paymentMethodsRes, walletRes] = await Promise.all([
          apiClient.get('/user/transactions'),
          apiClient.get('/user/payment-methods'),
          apiClient.get('/user/wallet')
        ]);
        setTransactions(transactionsRes.data);
        setPaymentMethods(paymentMethodsRes.data);
        setWalletBalance(walletRes.data.balance || 0);
      } catch (err) {
        setError("فشل في تحميل بيانات المدفوعات.");
        console.error("خطأ في جلب البيانات:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  if (loading) return <LoadingState message="جاري تحميل بيانات المدفوعات..." />;
  if (error) return <ErrorState message={error} />;

  // ===============================================================
  // قسم الـ JSX (تم الحفاظ عليه كما هو من تصميمك الأصلي 100%)
  // ===============================================================
  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto p-6 space-y-10">
        <header>
          <h1 className="text-3xl font-bold text-sky-700">سجل المدفوعات</h1>
        </header>
        <main className="space-y-10">
          <TransactionsSection transactions={transactions} />
          <PaymentMethodsSection paymentMethods={paymentMethods} walletBalance={walletBalance} />
        </main>
      </div>
    </div>
  );
};

export default PaymentsPage;
