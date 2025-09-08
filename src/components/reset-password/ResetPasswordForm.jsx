import React from 'react';

const FormField = ({ id, label, value, onChange, error }) => (
  <div>
    <label htmlFor={id} className="block mb-1 font-medium text-neutral-700">{label}</label>
    <input
      type="password"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${error ? 'border-red-500' : 'border-gray-300 focus:border-cyan-500'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const ResetPasswordForm = ({ formData, setFormData, onSubmit, error, loading }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-cyan-700 mb-6 text-center">تعيين كلمة مرور جديدة</h2>
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <FormField 
          id="password"
          label="كلمة المرور الجديدة"
          value={formData.password}
          onChange={handleChange}
        />
        <FormField 
          id="confirmPassword"
          label="تأكيد كلمة المرور"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        {error && (
          <p className="text-red-600 text-sm font-semibold text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 text-white font-semibold rounded-full hover:opacity-90 transition duration-200 disabled:opacity-50"
        >
          {loading ? 'جارٍ التحديث...' : 'تحديث كلمة المرور'}
        </button>
      </form>
    </>
  );
};

export default ResetPasswordForm;
