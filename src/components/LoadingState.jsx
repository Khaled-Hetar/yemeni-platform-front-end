import React from 'react';
import { FiLoader } from "react-icons/fi";

const LoadingState = ({ message = "جاري التحميل..." }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
    <FiLoader className="animate-spin text-sky-600 text-4xl mb-4" />
    <p className="text-gray-600 font-semibold">{message}</p>
  </div>
);

export default LoadingState;
