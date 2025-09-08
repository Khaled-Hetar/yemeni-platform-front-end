// src/components/layout/PaymentMethods.jsx
import React from 'react';

const PaymentMethods = ({ title, methods }) => (
  <div>
    <h3 className="text-cyan-600 text-lg mb-3 font-semibold">{title}</h3>
    <div className="flex flex-wrap gap-3">
      {methods.map((method, i) => (
        <a key={i} href={method.link} target="_blank" rel="noopener noreferrer" title={method.name}>
          <img src={method.image} alt={method.name} className="w-10 h-10 object-contain" />
        </a>
      ))}
    </div>
  </div>
);

export default PaymentMethods;
