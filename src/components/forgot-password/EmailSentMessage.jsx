import React from 'react';

const EmailSentMessage = ({ email }) => (
  <div className="text-center">
    <h2 className="text-xl font-bold text-green-600 mb-3">✅ تم إرسال التعليمات</h2>
    <p className="text-neutral-700">
      إذا كان البريد الإلكتروني <strong className="font-semibold">{email}</strong> مسجلاً لدينا، فستصلك رسالة تحتوي على رابط لإعادة تعيين كلمة المرور خلال الدقائق القادمة.
    </p>
    <p className="text-sm text-neutral-500 mt-4">
      (يرجى التحقق من مجلد الرسائل غير المرغوب فيها Spam)
    </p>
  </div>
);

export default EmailSentMessage;
