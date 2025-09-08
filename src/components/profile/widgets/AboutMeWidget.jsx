import React from 'react';

const AboutMeWidget = ({ aboutYou }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">نبذة عني</h3>
    <p className="text-gray-600 leading-relaxed">{aboutYou || 'لا توجد نبذة شخصية بعد.'}</p>
  </div>
);

export default AboutMeWidget;
