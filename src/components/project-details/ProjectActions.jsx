import React from 'react';
import { Link } from 'react-router-dom';
import ProposalCard from './ProposalCard';

const ProjectActions = ({ project, isOwner }) => (
  <div className="pt-6">
    {isOwner ? (
      <>
        <h2 className="text-xl font-semibold text-neutral-700 mb-4">العروض المستلمة</h2>
        {project.proposals && project.proposals.length > 0 ? (
          <div className="space-y-4">
            {project.proposals.map(proposal => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">لم يتم تقديم أي عروض لهذا المشروع بعد.</p>
        )}
      </>
    ) : (
      <div className="text-center pt-6">
        <Link
          to={`/submit-proposal/${project.id}`}
          className="bg-sky-600 text-white font-bold py-3 px-10 rounded-full hover:bg-sky-700 transition-transform transform hover:scale-105 inline-block"
        >
          تقديم عرض الآن
        </Link>
      </div>
    )}
  </div>
);

export default ProjectActions;
