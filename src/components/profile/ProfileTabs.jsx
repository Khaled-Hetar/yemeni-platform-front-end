// src/components/profile/ProfileTabs.jsx
import React from 'react';

const TabButton = ({ children, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors duration-300 
      ${isActive ? 'text-cyan-600 border-cyan-600' : 'text-gray-500 border-transparent hover:text-cyan-500 hover:border-cyan-500'}`}
    role="tab"
    aria-selected={isActive}
  >
    {children}
  </button>
);

const ProfileTabs = ({ activeTab, setActiveTab, counts }) => (
  <div className="bg-white p-2 rounded-xl shadow-md border border-gray-200">
    <nav className="border-b border-gray-200" role="tablist" aria-label="ملف المستخدم">
      <div className="flex space-x-2 space-x-reverse">
        <TabButton isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          نظرة عامة
        </TabButton>
        <TabButton isActive={activeTab === 'services'} onClick={() => setActiveTab('services')}>
          الخدمات ({counts.services})
        </TabButton>
        <TabButton isActive={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')}>
          معرض الأعمال ({counts.projects})
        </TabButton>
        <TabButton isActive={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')}>
          التقييمات ({counts.reviews})
        </TabButton>
      </div>
    </nav>
  </div>
);

export default ProfileTabs;
