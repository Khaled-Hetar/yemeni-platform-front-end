import React from 'react';
import ServiceCard from '../../services/ServiceCard'; // إعادة استخدام المكون

const ServicesTab = ({ services, userName }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border">
    <h3 className="text-lg font-semibold text-cyan-700 mb-4">خدمات يقدمها {userName}</h3>
    {services.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(service => <ServiceCard key={service.id} service={service} />)}
      </div>
    ) : (
      <p className="text-gray-500 text-center py-8">لا توجد خدمات لعرضها حاليًا.</p>
    )}
  </div>
);

export default ServicesTab;
