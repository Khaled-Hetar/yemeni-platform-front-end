import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => (
  <Link to={`/projects/${project.id}`} className="border rounded-lg p-4 hover:shadow-md transition-shadow block group bg-white">
    <h4 className="font-semibold text-gray-800 group-hover:text-sky-600 transition-colors">{project.title}</h4>
    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{project.description}</p>
    <div className="text-xs text-green-600 font-bold mt-2">${project.budget_min} - ${project.budget_max}</div>
  </Link>
);

export default ProjectCard;
