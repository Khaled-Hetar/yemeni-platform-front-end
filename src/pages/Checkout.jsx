import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCreditCard, FaPaypal, FaWallet } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [service, setService] = useState(null);
  const [loadingService, setLoadingService] = useState(true);
  
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardData, setCardData] = useState({ cardName: "", cardNumber: "", expiry: "", cvv: "" });
  const [billingAddress, setBillingAddress] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchService = async () => {
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

  const servicePrice = service?.price || 0;
  const commission = servicePrice * 0.1;
  const totalPrice = servicePrice + commission;

  const validateForm = () => {
    setError("");
    if (paymentMethod === "card") {
      const { cardName, cardNumber, expiry, cvv } = cardData;
      if (!cardName.trim() || !cardNumber.trim() || !expiry.trim() || !cvv.trim()) {
        setError("يرجى ملء جميع حقول بطاقة الائتمان");
        return false;
      }
      if (!/^\d{16}$/.test(cardNumber.replace(/\s+/g, ""))) {
        setError("رقم البطاقة غير صحيح. يجب أن يحتوي على 16 رقمًا.");
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        setError("تاريخ الانتهاء يجب أن يكون بالشكل MM/YY");
        return false;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        setError("رمز التحقق (CVV) غير صحيح");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirm(true);
  };

  const confirmPayment = async () => {
    setShowConfirm(false);
    setProcessing(true);
    setError("");

    try {
      const response = await apiClient.post(`/services/${serviceId}/checkout`, {
        payment_method: paymentMethod,
      });

      if (response.data.redirect_url) {
        window.location.href = response.data.redirect_url;
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard/orders');
        }, 3000);
      }
    } catch (apiError) {
      const message = apiError.response?.data?.message || "فشل في بدء عملية الدفع.";
      setError(message);
      setProcessing(false);
    }
  };

  const cancelPayment = () => {
    setShowConfirm(false);
  };

  if (loadingService) {
    return <div className="p-8 text-center">جاري تحميل تفاصيل الطلب...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-2xl shadow-lg border border-gray-200 relative">
      <h2 className="text-2xl font-bold text-sky-700 mb-6 border-b pb-4 border-sky-200">
        إتمام الطلب
      </h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-700 mb-3 flex items-center gap-2">
          ملخص الخدمة
        </h3>

        <div className="bg-sky-50/30 border border-sky-100 p-4 rounded-xl">
          <div className="flex justify-between mb-2">
            <span className="text-neutral-700 font-medium">اسم الخدمة:</span>
            <span className="text-neutral-800">{service?.title || '...'}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-700 font-medium">السعر الإجمالي:</span>
            <span className="font-bold text-lg text-sky-700">${servicePrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-700 mb-3 flex items-center gap-2">
          اختر وسيلة الدفع
        </h3>

        <div className="flex gap-4">
          <button 
            type="button" 
            onClick={() => setPaymentMethod("card")} 
            className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl transition 
              ${paymentMethod === "card" ? "border-cyan-500 bg-cyan-50" : "border-gray-300 hover:bg-gray-50"}`}
          >
            <FaCreditCard className="text-cyan-600" /> بطاقة ائتمان
          </button>

          <button 
            type="button" 
            onClick={() => setPaymentMethod("paypal")} 
            className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl transition 
              ${paymentMethod === "paypal" ? "border-cyan-500 bg-cyan-50" : "border-gray-300 hover:bg-gray-50"}`}
          >
            <FaPaypal className="text-cyan-600" /> PayPal
          </button>

          <button 
            type="button" 
            onClick={() => setPaymentMethod("wallet")} 
            className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl transition 
              ${paymentMethod === "wallet" ? "border-cyan-500 bg-cyan-50" : "border-gray-300 hover:bg-gray-50"}`}
          >
            <FaWallet className="text-cyan-600" /> المحفظة
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {paymentMethod === "card" && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-700 mb-3 flex items-center gap-2">
              تفاصيل بطاقة الائتمان
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="اسم حامل البطاقة" 
                value={cardData.cardName} 
                onChange={(e) => setCardData((prev) => ({ ...prev, cardName: e.target.value }))}
                className="p-3 border rounded-xl focus:outline-none focus:border-cyan-500"
              />
              <input 
                type="text" 
                placeholder="رقم البطاقة (16 رقم)" 
                maxLength={19} 
                value={cardData.cardNumber} 
                onChange={(e) => { let val = e.target.value.replace(/\D/g, ""); 
                  val = val.match(/.{1,4}/g)?.join(" ") || "";
                  setCardData((prev) => ({ ...prev, cardNumber: val }))}}
                className="p-3 border rounded-xl focus:outline-none focus:border-cyan-500"
              />

              <input 
                type="text" 
                placeholder="تاريخ الانتهاء (MM/YY)" 
                maxLength={5} 
                value={cardData.expiry} 
                onChange={(e) => {
                  let val = e.target.value;
                  if (val.length === 2 && !val.includes("/")) {
                    val = val + "/"; 
                  }
                  if (val.length > 5) return; setCardData((prev) => ({ ...prev, expiry: val }));
                }}
                className="p-3 border rounded-xl focus:outline-none focus:border-cyan-500" />
              <input 
                type="text" 
                placeholder="رمز التحقق (CVV)" 
                maxLength={4} 
                value={cardData.cvv} 
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setCardData((prev) => ({ ...prev, cvv: val }));
                }} className="p-3 border rounded-xl focus:outline-none focus:border-cyan-500" />
            </div>
          </div>
        )}

        {paymentMethod === "paypal" && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-xl text-yellow-700">
            سيتم تحويلك إلى صفحة PayPal لإتمام الدفع.
          </div>
        )}

        {paymentMethod === "wallet" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-xl text-green-700">
            سيتم خصم المبلغ من رصيد المحفظة الخاصة بك.
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-700 mb-3 flex items-center gap-2">
            <MdLocationOn className="text-cyan-600" /> عنوان الفوترة (اختياري)
          </h3>
          <input 
            type="text" 
            placeholder="العنوان الكامل" 
            value={billingAddress} 
            onChange={(e) => setBillingAddress(e.target.value)}
            className="w-full p-3 border rounded-xl focus:outline-none focus:border-cyan-500" />
        </div>

        {error && !showConfirm && (
          <p className="mb-4 text-red-600 font-semibold text-center">{error}</p>
        )}

        {success && (
          <p className="mb-4 text-green-600 font-semibold text-center">
            تم إتمام الدفع بنجاح!
          </p>
        )}

        <div className="text-end">
          <button 
            type="submit" 
            disabled={processing} 
            className="bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 text-white font-semibold 
              py-3 px-8 rounded-full hover:opacity-90 transition duration-200 disabled:opacity-50">
            {processing ? 'جارٍ المعالجة...' : 'تأكيد الدفع'}
          </button>
        </div>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-lg">
            <h3 className="text-lg font-semibold mb-4">هل أنت متأكد من إتمام الدفع؟</h3>

            <div className="mb-6 text-right space-y-2 text-sm">
              <p className="flex justify-between">
                <span>السعر الأصلي:</span>
                <strong>${servicePrice.toFixed(2)}</strong>
              </p>

              <p className="flex justify-between">
                <span>عمولة المنصة (10%):</span>
                <strong>${commission.toFixed(2)}</strong>
              </p>

              <p className="flex justify-between text-lg font-bold mt-2 border-t pt-2">
                <span>الإجمالي للدفع:</span>
                <strong>${totalPrice.toFixed(2)}</strong>
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={confirmPayment}
                disabled={processing}
                className="px-6 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition disabled:opacity-50">
                {processing ? 'لحظة...' : 'نعم، ادفع الآن'}
              </button>

              <button
                onClick={cancelPayment}
                disabled={processing}
                className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
