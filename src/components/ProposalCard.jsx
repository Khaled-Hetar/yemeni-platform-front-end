// src/components/ProposalCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare } from 'react-icons/fi';

const ProposalCard = ({ proposal }) => {
  if (!proposal || !proposal.user) return null;

  return (
    <div className="bg-white border rounded-lg p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        {/* معلومات مقدم العرض */}
        <div className="flex items-center gap-3">
          <img 
            src={proposal.user.avatar_url || `https://i.pravatar.cc/150?u=${proposal.user.email}`} 
            alt={proposal.user.name} 
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <Link to={`/profile/${proposal.user.id}`} className="font-bold text-gray-800 hover:text-sky-600 transition-colors">
              {proposal.user.name}
            </Link>
            <p className="text-sm text-gray-500">{proposal.user.jobTitle || 'مستقل محترف'}</p>
          </div>
        </div>
        {/* السعر والمدة */}
        <div className="text-left flex-shrink-0">
          <p className="font-bold text-green-600 text-lg">${proposal.price}</p>
          <p className="text-sm text-gray-500">{proposal.duration} أيام</p>
        </div>
      </div>

      {/* رسالة العرض */}
      <p className="text-gray-700 my-4 leading-relaxed line-clamp-4">
        {proposal.message}
      </p>

      {/* أزرار التحكم */}
      <div className="flex items-center gap-3 border-t pt-3">
        <button className="flex-1 bg-sky-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-700 transition">
          قبول العرض
        </button>
        <button className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2">
          <FiMessageSquare />
          مراسلة
        </button>
      </div>
    </div>
   );
};

export default ProposalCard;
