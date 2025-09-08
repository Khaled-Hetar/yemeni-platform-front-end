import React from 'react';

const AccountTypeOption = ({ id, value, label, description, checked, onChange }) => (
  <label 
    htmlFor={id} 
    className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${checked ? 'border-cyan-500 bg-cyan-50' : 'border-gray-300'}`}
  >
    <input
      type="radio"
      id={id}
      name="accountType"
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
      className="accent-cyan-600 w-4 h-4 ml-3"
    />
    <span>{label} <span className="text-sm text-neutral-600">{description}</span></span>
  </label>
);

const AccountTypeSelector = ({ accountType, onAccountTypeChange, error }) => (
  <div>
    <p className="text-lg font-semibold text-neutral-700">أكمل ملفك الشخصي</p>
    <p className="text-sm text-gray-500 mb-4">اختر نوع حسابك وأخبرنا المزيد عنك.</p>
    <div className="space-y-2">
      <AccountTypeOption 
        id="buyer"
        value="buyer"
        label="باحث عن خدمة"
        description="(أريد توظيف مستقلين)"
        checked={accountType === 'buyer'}
        onChange={onAccountTypeChange}
      />
      <AccountTypeOption 
        id="freelancer"
        value="freelancer"
        label="مقدم خدمات"
        description="(أبحث عن مشاريع لتنفيذها)"
        checked={accountType === 'freelancer'}
        onChange={onAccountTypeChange}
      />
    </div>
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

export default AccountTypeSelector;
