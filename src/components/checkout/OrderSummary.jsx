import React from 'react';

const OrderSummary = ({ service }) => {
  if (!service) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-neutral-700 mb-3">ملخص الخدمة</h3>
      <div className="bg-sky-50/30 border border-sky-100 p-4 rounded-xl">
        <div className="flex justify-between mb-2">
          <span className="text-neutral-700 font-medium">اسم الخدمة:</span>
          <span className="text-neutral-800">{service.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-700 font-medium">السعر:</span>
          <span className="font-bold text-lg text-sky-700">${Number(service.price).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
