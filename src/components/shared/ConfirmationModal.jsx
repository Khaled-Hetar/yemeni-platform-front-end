// src/pages/CheckoutPage.jsx

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

// استيراد المكونات
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import OrderSummary from '../components/checkout/OrderSummary';
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';
import PaymentForm from '../components/checkout/PaymentForm';
import ConfirmationModal from '../components/shared/ConfirmationModal'; // إعادة استخدام

const CheckoutPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [service, setService] = useState(null);
  const [loadingService, setLoadingService] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const fetchService = async () => {
      setLoadingService(true);
      try {
        const response = await apiClient.get(`/services/${serviceId}`);
        setService(response.data); 
      } catch (err) {
        setError("لا يمكن العثور على الخدمة المطلوبة.");
        console.error(err);
      } finally {
        setLoadingService(false);
      }
    };
    fetchService();
  }, [serviceId, isAuthenticated, navigate]);

  const paymentDetails = useMemo(() => {
    const price = service?.price || 0;
    const commission = price * 0.10; // 10% عمولة
    const total = price + commission;
    return { price, commission, total };
  }, [service]);

  const confirmPayment = async () => {
    setShowConfirm(false);
    setProcessing(true);
    setError("");

    try {
      // التحسين المنطقي: استخدام نقطة نهاية مخصصة
      const response = await apiClient.post(`/services/${serviceId}/checkout`, {
        payment_method: paymentMethod,
      });

      // إذا أعاد الخادم رابطًا، قم بإعادة التوجيه
      if (response.data.redirect_url) {
        window.location.href = response.data.redirect_url;
      } else {
        // إذا تمت المعالجة مباشرة (مثل الدفع من المحفظة)
        alert("تم الدفع بنجاح!");
        navigate('/dashboard/orders');
      }
    } catch (apiError) {
      const message = apiError.response?.data?.message || "فشل في بدء عملية الدفع.";
      setError(message);
      setProcessing(false);
    }
  };

  if (loadingService) return <LoadingState message="جاري تحميل تفاصيل الطلب..." />;
  if (error) return <ErrorState message={error} />;
  if (!service) return <ErrorState message="الخدمة غير موجودة." />;

  // ===============================================================
  // قسم الـ JSX (تم الحفاظ عليه كما هو من تصميمك الأصلي 100%)
  // ===============================================================
  return (
    <>
      <div className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-sky-700 mb-6 border-b pb-4 border-sky-200">
          إتمام الطلب
        </h2>
        
        <OrderSummary service={service} />
        
        <form onSubmit={(e) => { e.preventDefault(); setShowConfirm(true); }}>
          <PaymentMethodSelector paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
          <PaymentForm paymentMethod={paymentMethod} />
          
          {error && (
            <p className="mb-4 text-red-600 font-semibold text-center">{error}</p>
          )}

          <div className="text-end mt-8">
            <button 
              type="submit" 
              disabled={processing} 
              className="bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition duration-200 disabled:opacity-50"
            >
              {processing ? 'جارٍ المعالجة...' : `ادفع الآن ${paymentDetails.total.toFixed(2)}$`}
            </button>
          </div>
        </form>
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmPayment}
        isLoading={processing}
        title="تأكيد الدفع"
        message={
          <div className="text-right space-y-2 text-sm">
            <p className="flex justify-between"><span>السعر الأصلي:</span><strong>${paymentDetails.price.toFixed(2)}</strong></p>
            <p className="flex justify-between"><span>عمولة المنصة (10%):</span><strong>${paymentDetails.commission.toFixed(2)}</strong></p>
            <p className="flex justify-between text-lg font-bold mt-2 border-t pt-2"><span>الإجمالي للدفع:</span><strong>${paymentDetails.total.toFixed(2)}</strong></p>
          </div>
        }
        confirmText="نعم، ادفع الآن"
      />
    </>
  );
};

export default CheckoutPage;
