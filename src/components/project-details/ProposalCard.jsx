import React from 'react';
import { Link } from 'react-router-dom';

const ProposalCard = ({ proposal }) => {
  if (!proposal.user) return null;

  return (
    <div className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex justify-between items-start">
        <Link to={`/profile/${proposal.user.id}`} className="flex items-center gap-3">
          <img src={proposal.user.avatar_url} alt={proposal.user.name} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-semibold text-neutral-800 hover:underline">{proposal.user.name}</p>
            <p className="text-xs text-gray-500">{proposal.user.jobTitle || 'مستقل'}</p>
          </div>
        </Link>
        <div className="text-left">
          <p className="font-bold text-green-600 text-lg">${proposal.price}</p>
          <p className="text-xs text-gray-500">في {proposal.duration} أيام</p>
        </div>
      </div>
      <p className="text-gray-700 mt-3 pt-3 border-t">{proposal.message}</p>
    </div>
  );
};

export default ProposalCard;
