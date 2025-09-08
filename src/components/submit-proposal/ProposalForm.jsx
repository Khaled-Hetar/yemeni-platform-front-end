import React from 'react';
import { FaDollarSign, FaClock, FaCommentDots } from "react-icons/fa";

const FormField = ({ id, name, label, value, onChange, error, type = 'text', required = true, icon, rows }) => (
  <div>
    <label htmlFor={id} className="text-neutral-700 font-medium mb-1 flex items-center gap-2">
      {icon} {label}
    </label>
    {type === 'textarea' ? (
      <textarea 
        id={id} 
        name={name} 
        value={value} 
        onChange={onChange} 
        required={required} 
        rows={rows || 4}
        className={`w-full p-3 border rounded-xl resize-none min-h-[120px] focus:outline-none ${error ? 'border-red-500' : 'focus:border-cyan-500'}`}
      />
    ) : (
      <input 
        type={type} 
        id={id} 
        name={name} 
        value={value} 
        onChange={onChange} 
        required={required} 
        className={`w-full p-3 border rounded-xl focus:outline-none ${error ? 'border-red-500' : 'focus:border-cyan-500'}`}
      />
    )}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const ProposalForm = ({ formData, setFormData, onSubmit, isSubmitting, apiError }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormField 
        id="price"
        name="price"
        label="السعر المقترح (بالدولار)"
        type="number"
        value={formData.price}
        onChange={handleChange}
        icon={<FaDollarSign className="text-green-600" />}
      />
      <FormField 
        id="duration"
        name="duration"
        label="المدة المطلوبة (بالأيام)"
        type="number"
        value={formData.duration}
        onChange={handleChange}
        icon={<FaClock className="text-red-500" />}
      />
      <FormField 
        id="message"
        name="message"
        label="رسالة إلى صاحب المشروع"
        type="textarea"
        value={formData.message}
        onChange={handleChange}
        icon={<FaCommentDots className="text-sky-600" />}
      />
      
      {apiError && <p className="text-red-500 text-center font-semibold">{apiError}</p>}

      <button 
        type="submit" 
        disabled={isSubmitting} 
        className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl text-lg font-medium w-full transition disabled:opacity-50"
      >
        {isSubmitting ? 'جارٍ الإرسال...' : 'إرسال العرض'}
      </button>
    </form>
  );
};

export default ProposalForm;
