// src/components/profile/tabs/PortfolioTab.jsx
import React from 'react';
import ProjectCard from '../../projects/ProjectCard'; // إعادة استخدام المكون

const PortfolioTab = ({ projects, userName }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border">
    <h3 className="text-lg font-semibold text-cyan-700 mb-4">أعمال ومشاريع {userName}</h3>
    {projects.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map(project => <ProjectCard key={project.id} project={project} />)}
      </div>
    ) : (
      <p className="text-gray-500 text-center py-8">لا توجد مشاريع في معرض الأعمال حاليًا.</p>
    )}
  </div>
);

export default PortfolioTab;
