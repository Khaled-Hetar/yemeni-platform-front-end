import React from 'react';

const FormField = ({ id, name, label, value, onChange, error, type = 'text', placeholder = '' }) => (
  <div>
    <label htmlFor={id} className="block mb-1 font-medium text-gray-700">{label}</label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 
        ${error ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-cyan-500'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default FormField;
