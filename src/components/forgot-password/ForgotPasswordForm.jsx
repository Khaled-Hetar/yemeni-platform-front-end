// src/components/forgot-password/ForgotPasswordForm.jsx
import React from 'react';

const ForgotPasswordForm = ({ email, setEmail, onSubmit, error, loading }) => (
  <>
    <header className="mb-6 text-center">
      <h2 className="text-2xl font-bold text-cyan-700 mb-2">استعادة كلمة المرور</h2>
      <p className="text-neutral-600 text-sm">
        أدخل بريدك الإلكتروني المسجّل وسنرسل لك التعليمات.
      </p>
    </header>
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="example@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 placeholder-gray-400"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center font-semibold">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 text-white font-semibold rounded-full hover:opacity-90 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'جارٍ الإرسال...' : 'إرسال التعليمات'}
      </button>
    </form>
  </>
);

export default ForgotPasswordForm;
