import React from 'react';

const TabButton = ({ children, isActive, onClick }) => (
  <button 
    onClick={onClick} 
    className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold border-b-2 transition-colors duration-200 
      ${isActive 
        ? 'text-sky-600 border-sky-600' 
        : 'text-gray-500 border-transparent hover:text-sky-500 hover:border-gray-200'
      }`}
  >
    {children}
  </button>
);

export default TabButton;
