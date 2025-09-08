import React from 'react';
import { Link } from 'react-router-dom';

const HelpOptionCard = ({ to, onClick, icon, title, description, ariaLabel }) => {
  const cardContent = (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow hover:shadow-md transition-shadow duration-300 flex flex-col items-center min-h-[180px] text-center">
      <div className="text-cyan-600 text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-neutral-800">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  if (to) {
    return (
      <Link to={to} aria-label={ariaLabel} title={description}>
        {cardContent}
      </Link>
    );
  }

  // إذا كان هناك إجراء خارجي، استخدم <div> مع معالج النقر
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      className="cursor-pointer"
      aria-label={ariaLabel}
      title={description}
    >
      {cardContent}
    </div>
  );
};

export default HelpOptionCard;
