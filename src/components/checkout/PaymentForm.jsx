import React from 'react';

const PaymentForm = ({ paymentMethod }) => {
  if (paymentMethod === 'card') {
    return (
      <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded-xl text-blue-700">
        سيتم تحويلك إلى صفحة دفع آمنة لإدخال تفاصيل بطاقتك.
      </div>
    );
  }
  if (paymentMethod === 'paypal') {
    return (
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-xl text-yellow-700">
        سيتم تحويلك إلى صفحة PayPal لإتمام الدفع.
      </div>
    );
  }
  if (paymentMethod === 'wallet') {
    return (
      <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-xl text-green-700">
        سيتم خصم المبلغ من رصيد المحفظة الخاصة بك.
      </div>
    );
  }
  return null;
};

export default PaymentForm;
