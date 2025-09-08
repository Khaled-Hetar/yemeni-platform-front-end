import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    const googleAuthUrl = `${import.meta.env.VITE_API_URL}/auth/google/redirect`;
    window.location.href = googleAuthUrl;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-2 w-full max-w-xs 
      bg-white border border-gray-300 p-2 rounded-2xl shadow 
      hover:bg-gray-100 transition font-medium text-gray-800"
    >
      <FcGoogle className="w-6 h-6" />
      المتابعة باستخدام جوجل
    </button>
  );
};

export default GoogleLoginButton;
