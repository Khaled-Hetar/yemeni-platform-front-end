import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordField = ({ id, name, label, value, onChange, required = true }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block mb-1 font-medium text-neutral-700">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 cursor-pointer"
          aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;
