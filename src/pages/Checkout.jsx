import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaCreditCard, FaPaypal, FaWallet, FaCheckCircle } from "react-icons/fa";
import { FiLoader, FiAlertCircle, FiShoppingCart } from "react-icons/fi";
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

// --- مكونات الحالة لتحسين UX ---
const LoadingState = ({ message = "جاري التحميل..." }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
    <FiLoader className="animate-spin text-sky-600 text-4xl mb-4" />
    <p className="text-gray-600 font-semibold">{message}</p>
  </div>
);

const ErrorState = ({ message = "حدث خطأ غير متوقع.", onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
    <FiAlertCircle className="text-red-500 text-5xl mb-4" />
    <h2 className="text-xl font-bold text-gray-800 mb-2">عذرًا، حدث خطأ ما</h2>
    <p className="text-red-600 font-semibold mb-6">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry} 
        className="bg-sky-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-sky-700 transition"
      >
        إعادة المحاولة
      </button>
    )}
  </div>
);

const SuccessState = () => (
  <div className="max-w-2xl mx-auto p-8 text-center bg-white rounded-2xl shadow-lg my-8 border">
    <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
    <h2 className="text-2xl font-bold text-gray-800 mb-2">تم إنشاء طلبك بنجاح!</h2>
    <p className="text-gray-600 mb-6">سيتم الآن توجيهك إلى لوحة التحكم لمتابعة حالة طلبك.</p>
  </div>
);

const PaymentMethodButton = ({ method, icon, label, activeMethod, setActiveMethod }) => (
  <button type="button" onClick={() => setActiveMethod(method)}
    className={`flex-1 flex items-center justify-center gap-3 p-4 border-2 rounded-lg transition-all duration-200
      ${activeMethod === method ? "border-sky-500 bg-sky-50 shadow-inner" : "border-gray-200 bg-white hover:border-gray-300"}`}>
    {icon}
    <span className="font-semibold">{label}</span>
  </button>
);

// --- المكون الرئيسي ---
const CheckoutPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/checkout/${serviceId}` } });
      return;
    }
    apiClient.get(`/services/${serviceId}?with=user`)
      .then(res => setService(res.data))
      .catch(() => setError("لا يمكن العثور على الخدمة المطلوبة."))
      .finally(() => setLoading(false));
  }, [serviceId, isAuthenticated, navigate]);

  const { servicePrice, commission, totalPrice } = useMemo(() => {
    const price = service?.price || 0;
    const comm = price * 0.10; // 10% commission
    return { servicePrice: price, commission: comm, totalPrice: price + comm };
  }, [service]);

  const handleConfirmPayment = async () => {
    setProcessing(true);
    setError("");
    try {
      // إرسال طلب للخادم لبدء جلسة الدفع
      const response = await apiClient.post(`/services/${serviceId}/checkout`, {
        payment_method: paymentMethod,
      });

      // إذا أعاد الخادم رابط توجيه (مثل PayPal أو صفحة دفع مستضافة)
      if (response.data.redirect_url) {
        window.location.href = response.data.redirect_url;
      } else {
        // إذا تمت العملية بنجاح مباشرة (مثل الدفع من المحفظة)
        setSuccess(true);
        setTimeout(() => navigate('/dashboard/orders'), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "فشل في بدء عملية الدفع.");
      setProcessing(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error && !service) return <ErrorState message={error} />;
  if (success) return <SuccessState />;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- قسم تفاصيل الدفع --- */}
        <main className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border">
          <header className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">إتمام عملية الدفع</h1>
            <p className="text-gray-500 mt-2">أنت على وشك شراء خدمة "{service?.title}".</p>
          </header>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">اختر وسيلة الدفع</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <PaymentMethodButton method="card" icon={<FaCreditCard />} label="بطاقة ائتمان" activeMethod={paymentMethod} setActiveMethod={setPaymentMethod} />
                <PaymentMethodButton method="paypal" icon={<FaPaypal />} label="PayPal" activeMethod={paymentMethod} setActiveMethod={setPaymentMethod} />
              </div>
            </div>
            
            {/* ملاحظة: هنا يجب عرض مكونات بوابة الدفع، وليس حقول إدخال يدوية */}
            {paymentMethod === 'card' && (
              <div className="p-4 bg-gray-100 rounded-lg border">
                <p className="text-sm text-gray-700">سيتم عرض حقول إدخال البطاقة الآمنة هنا باستخدام مكتبة بوابة الدفع (مثل Stripe Elements).</p>
              </div>
            )}

            {error && <p className="text-red-500 text-center font-semibold bg-red-50 p-3 rounded-lg">{error}</p>}
          </div>
        </main>

        {/* --- قسم ملخص الطلب --- */}
        <aside className="lg:sticky lg:top-24 h-fit bg-white p-6 sm:p-8 rounded-xl shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-4">ملخص الطلب</h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between"><p>سعر الخدمة:</p> <p className="font-medium">${servicePrice.toFixed(2)}</p></div>
            <div className="flex justify-between"><p>عمولة المنصة (10%):</p> <p className="font-medium">${commission.toFixed(2)}</p></div>
            <div className="border-t my-3"></div>
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <p>الإجمالي للدفع:</p>
              <p>${totalPrice.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-8">
            <button onClick={handleConfirmPayment} disabled={processing} className="w-full flex items-center justify-center gap-3 bg-sky-600 text-white font-bold py-3 rounded-lg hover:bg-sky-700 transition-transform hover:scale-105 disabled:opacity-50">
              {processing ? <FiLoader className="animate-spin" /> : <FiShoppingCart />}
              <span>{processing ? 'جاري المعالجة...' : 'ادفع الآن'}</span>
            </button>
            <p className="text-xs text-gray-500 mt-3 text-center">بالنقر على "ادفع الآن"، أنت توافق على شروط الخدمة.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
