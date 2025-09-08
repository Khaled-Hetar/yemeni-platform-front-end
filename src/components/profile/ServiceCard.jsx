import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => (
  <Link to={`/services/${service.id}`} className="border rounded-lg p-4 hover:shadow-md transition-shadow block group bg-white">
    <div className="w-full h-36 overflow-hidden rounded-md mb-3">
      <img src={service.main_image_url} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
    <h4 className="font-semibold text-gray-800 truncate group-hover:text-sky-600 transition-colors">{service.title}</h4>
    <p className="text-sm text-green-600 font-bold mt-1">${service.price}</p>
  </Link>
);

export default ServiceCard;
