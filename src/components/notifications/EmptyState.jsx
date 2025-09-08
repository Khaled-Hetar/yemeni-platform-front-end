import React from 'react';
import { FiBell } from 'react-icons/fi';

const EmptyState = () => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
    <div className="p-12 text-center text-gray-500">
      <FiBell size={48} className="mx-auto text-gray-300 mb-4" />
      <p>لا توجد لديك أي إشعارات حتى الآن.</p>
    </div>
  </div>
);

export default EmptyState;
