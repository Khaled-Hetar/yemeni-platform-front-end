import React from 'react';
import AboutMeWidget from '../widgets/AboutMeWidget';
import VerificationWidget from '../widgets/VerificationWidget';
import CompletionWidget from '../widgets/CompletionWidget';

const OverviewTab = ({ profile, servicesCount, projectsCount, isOwner }) => (
  <div className="space-y-6">
    <AboutMeWidget aboutYou={profile.aboutYou} />
    <VerificationWidget verifications={profile.verifications || {}} isOwner={isOwner} />
    <CompletionWidget 
      profile={profile} 
      servicesCount={servicesCount} 
      projectsCount={projectsCount} 
      isOwner={isOwner} 
    />
  </div>
);

export default OverviewTab;
