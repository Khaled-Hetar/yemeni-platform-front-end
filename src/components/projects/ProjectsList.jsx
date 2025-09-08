import React from 'react';
import ProjectCard from './ProjectCard';
import LoadingState from '../LoadingState';
import ErrorState from '../ErrorState';

const ProjectsList = ({ loading, error, projects }) => {
  if (loading) {
    return <LoadingState message="جاري تحميل المشاريع..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow">
        <p className="text-gray-500">لا توجد مشاريع متاحة في الوقت الحالي.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectsList;
