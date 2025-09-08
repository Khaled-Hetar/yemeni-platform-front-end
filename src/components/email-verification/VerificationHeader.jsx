import React from 'react';

const VerificationHeader = ({ email }) => (
  <header className="text-center">
    <h2 className="text-2xl font-bold text-sky-700 mb-4">تحقق من بريدك الإلكتروني</h2>
    <p className="text-neutral-700 text-base mb-2">
      لقد أرسلنا رابط تفعيل إلى:
    </p>
    <p className="text-cyan-600 font-semibold text-lg mb-4 break-all">{email}</p>
    <p className="text-sm text-neutral-600 mb-6">
      يرجى النقر على الرابط الموجود في الرسالة لإكمال عملية التسجيل.
        

      إذا لم تجد الرسالة، يرجى التحقق من مجلد الرسائل غير المرغوب فيها (Spam).
    </p>
  </header>
);

export default VerificationHeader;
