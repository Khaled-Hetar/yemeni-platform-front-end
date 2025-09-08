import React from 'react';
import { Link } from 'react-router-dom';

const InvalidLinkMessage = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-full max-w-md text-center p-8">
      <p className="text-red-600 font-semibold">{error}</p>
      <Link to="/forgot-password" className="text-cyan-600 hover:underline block mt-4">
        اطلب رابطاً جديداً
      </Link>
    </div>
  </div>
);

export default InvalidLinkMessage;
