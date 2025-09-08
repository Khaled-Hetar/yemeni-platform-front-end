// src/components/ProjectCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegClock, FaDollarSign, FaUserTie } from 'react-icons/fa';
import { MdOutlineWorkOutline } from 'react-icons/md';

// دالة مساعدة لتنسيق التاريخ بشكل أفضل
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ProjectCard = ({ project }) => {
  if (!project) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-lg hover:border-sky-200 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <Link to={`/projects/${project.id}`} className="group">
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-sky-600 transition-colors flex items-center gap-3">
            <MdOutlineWorkOutline className="text-sky-500 flex-shrink-0" />
            {project.title}
          </h2>
        </Link>
        {project.user && (
          <Link to={`/profile/${project.user.id}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-sky-700 transition-colors flex-shrink-0">
            <img src={project.user.avatar_url || `https://i.pravatar.cc/150?u=${project.user.email}`} alt={project.user.name} className="w-7 h-7 rounded-full object-cover" />
            <span className="font-medium">{project.user.name}</span>
          </Link>
         )}
      </div>

      <p className="text-gray-600 line-clamp-3 leading-relaxed mb-5">
        {project.description}
      </p>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-700 border-t pt-4">
        <div className="flex items-center gap-2" title="الميزانية">
          <FaDollarSign className="text-green-500" />
          <span className="font-semibold">${project.budget_min} - ${project.budget_max}</span>
        </div>
        <div className="flex items-center gap-2" title="الموعد النهائي للتسليم">
          <FaRegClock className="text-red-500" />
          <span>{formatDate(project.deadline)}</span>
        </div>
        <div className="flex items-center gap-2" title="عدد العروض المقدمة">
          <FaUserTie className="text-blue-500" />
          <span>{project.proposals_count || 0} عروض</span>
        </div>
      </div>

      <div className="mt-5">
        <Link to={`/projects/${project.id}`} className="inline-block w-full sm:w-auto text-center bg-sky-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-sky-700 transition-transform hover:scale-105">
          عرض التفاصيل وتقديم عرض
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
