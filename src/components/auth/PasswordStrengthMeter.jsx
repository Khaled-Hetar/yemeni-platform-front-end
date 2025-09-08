import React, { useMemo } from 'react';

const PasswordStrengthMeter = ({ password }) => {
  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return Math.min(score, 5);
  };

  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  const getStrengthInfo = () => {
    switch (strength) {
      case 1: return { color: 'bg-red-500', text: 'ضعيفة' };
      case 2: return { color: 'bg-yellow-500', text: 'متوسطة' };
      case 3: return { color: 'bg-blue-500', text: 'جيدة' };
      case 4: return { color: 'bg-sky-500', text: 'قوية' };
      case 5: return { color: 'bg-green-500', text: 'قوية جداً' };
      default: return { color: 'bg-gray-200', text: '' };
    }
  };

  const strengthInfo = getStrengthInfo();

  if (!password) return null;

  return (
    <div className="space-y-1 mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${strengthInfo.color}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
      <p className="text-xs text-right text-gray-500">{strengthInfo.text}</p>
    </div>
  );
};

export default PasswordStrengthMeter;
