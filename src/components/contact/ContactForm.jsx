import React from 'react';

const FormField = ({ id, label, type = 'text', value, onChange, placeholder, required = true, rows }) => (
  <div>
    <label htmlFor={id} className="block mb-2 text-sm font-medium text-neutral-700">{label}</label>
    {type === 'textarea' ? (
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        rows={rows || 4}
        placeholder={placeholder}
        className="w-full border resize-none border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition"
        required={required}
      />
    ) : (
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition"
        required={required}
      />
    )}
  </div>
);

const ContactForm = ({ formData, setFormData, onSubmit, loading, error, success }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-2xl shadow border border-gray-300 space-y-5">
      <FormField 
        id="name"
        label="الاسم الكامل"
        value={formData.name}
        onChange={handleChange}
        placeholder="أدخل اسمك الكامل"
      />
      <FormField 
        id="email"
        label="البريد الإلكتروني"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="you@example.com"
      />
      <FormField 
        id="message"
        label="الرسالة"
        type="textarea"
        value={formData.message}
        onChange={handleChange}
        placeholder="اكتب رسالتك هنا..."
      />

      {success && <p className="text-green-600 text-sm text-center">✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.</p>}
      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-4 rounded-xl transition text-sm font-semibold disabled:opacity-50"
      >
        {loading ? 'جارٍ الإرسال...' : 'إرسال'}
      </button>
    </form>
  );
};

export default ContactForm;
