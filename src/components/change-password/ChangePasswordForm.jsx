import React from 'react';
import PasswordField from './PasswordField';

const ChangePasswordForm = ({ formData, setFormData, onSubmit, loading, error }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <PasswordField 
        id="current_password"
        name="current_password"
        label="كلمة المرور الحالية"
        value={formData.current_password}
        onChange={handleChange}
      />
      <PasswordField 
        id="password"
        name="password"
        label="كلمة المرور الجديدة"
        value={formData.password}
        onChange={handleChange}
      />
      <PasswordField 
        id="password_confirmation"
        name="password_confirmation"
        label="تأكيد كلمة المرور"
        value={formData.password_confirmation}
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
  );
};

export default ChangePasswordForm;
