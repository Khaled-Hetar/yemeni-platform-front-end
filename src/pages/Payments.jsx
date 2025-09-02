import React, { useState, useEffect } from "react";
import { FaPaypal, FaCreditCard, FaWallet, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { MdAddCard } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import apiClient from '../api/axiosConfig'; 
import { useAuth } from '../context/AuthContext';

const PaymentsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

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

  const handleAddPaymentMethod = () => {
    alert("ميزة إضافة طريقة دفع ستُفعل لاحقاً");
  };

  if (loading) {
    return <div className="p-8 text-center">جاري تحميل بيانات المدفوعات...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h2 className="text-3xl font-bold text-sky-700">سجل المدفوعات</h2>

      <section className="bg-white border border-gray-200 rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold text-neutral-700 mb-4">سجل المعاملات</h2>

        <div className="space-y-5">
          {transactions.length > 0 ? transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4 last:border-b-0">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-full mt-1 
                    ${tx.type === "deposit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {tx.type === "deposit" ? <FaArrowDown /> : <FaArrowUp />}
                </div>

                <div>
                  <p className="text-neutral-700 font-medium">{tx.description}</p>
                  <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString('ar-EG')}</p>
                  {tx.serviceId && (
                    <p className="text-sm mt-1 text-neutral-600">
                      <span className="font-semibold">الخدمة ID:</span>{" "}
                      <Link to={`/services/${tx.serviceId}`}
                        className="text-sky-600 hover:underline">
                        {tx.serviceId}
                      </Link>
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`font-semibold text-lg 
                  ${tx.type === "deposit" ? "text-green-600" : "text-red-600"}`}>
                {tx.type === "deposit" ? "+" : "-"}${tx.amount.toFixed(2)}
              </div>
            </div>
          )) : (
            <p className="text-gray-500 text-center py-4">لا توجد معاملات لعرضها.</p>
          )}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-700">طرق الدفع</h2>

          <button 
            onClick={handleAddPaymentMethod} 
            className="flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-xl hover:bg-sky-200 transition">
              <MdAddCard /> إضافة طريقة دفع
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <div 
              key={method.id} 
              className="flex items-center gap-4 p-4 rounded-xl shadow-md
              bg-gradient-to-r from-cyan-600 to-cyan-300 text-white">
              
              <div className="text-3xl">
                {method.type.toLowerCase() === "paypal" ? <FaPaypal /> : <FaCreditCard />}
              </div>

              <div>
                <div className="text-sm font-semibold">{method.type}</div>
                <div className="text-xs">{method.masked_details}</div>
              </div>
            </div>
          ))}

          <div
            className="flex items-center gap-4 p-4 rounded-xl shadow-md
              bg-gradient-to-r from-neutral-700 to-neutral-500 text-white">
            <div className="text-3xl">
              <FaWallet />
            </div>

            <div>
              <div className="text-sm font-semibold">المحفظة</div>
              <div className="text-xs">
                الرصيد: ${walletBalance.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentsPage;
