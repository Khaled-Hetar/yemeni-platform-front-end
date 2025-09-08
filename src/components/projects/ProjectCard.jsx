import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegClock, FaDollarSign, FaUserTie } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";

const ProjectCard = ({ project }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className="bg-white p-6 rounded-2xl shadow border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-neutral-800 flex items-center gap-2">
          <MdOutlineWorkOutline className="text-sky-600" />
          <Link to={`/projects/${project.id}`} className="hover:underline">{project.title}</Link>
        </h2>
        {project.user && (
          <Link to={`/profile/${project.user.id}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-sky-700 flex-shrink-0">
            <img src={project.user.avatar_url} alt={project.user.name} className="w-6 h-6 rounded-full object-cover" />
            <span>{project.user.name}</span>
          </Link>
        )}
      </div>

      <p className="text-neutral-600 mt-3 line-clamp-2">{project.description}</p>

      <div className="flex flex-wrap gap-x-6 gap-y-3 justify-between items-center mt-4 pt-4 border-t text-sm text-neutral-700">
        <div className="flex items-center gap-2" title="الميزانية">
          <FaDollarSign className="text-green-600" />
          <span>${project.budget_min} - ${project.budget_max}</span>
        </div>
        <div className="flex items-center gap-2" title="الموعد النهائي للتسليم">
          <FaRegClock className="text-red-600" />
          <span>{formatDate(project.deadline)}</span>
        </div>
        <div className="flex items-center gap-2" title="عدد العروض المقدمة">
          <FaUserTie className="text-blue-600" />
          <span>{project.proposals_count || 0} عروض</span>
        </div>
        <Link
          to={`/projects/${project.id}`} 
          className="bg-sky-600 text-white px-4 py-2 rounded-xl hover:bg-sky-700 transition-colors duration-200"
        >
          قدّم عرضك
        </Link>
      </div>
    </article>
  );
};

export default ProjectCard;
