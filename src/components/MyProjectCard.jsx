// src/components/MyProjectCard.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit, FaRegClock, FaDollarSign, FaCheck, FaStar } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";

const StatusBadge = ({ status }) => { /* ... نفس كود StatusBadge ... */ };

const MyProjectCard = ({ project, onDelete, onComplete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300">
      <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-6">
        <div className="flex items-center gap-3">
          <Link to={`/projects/${project.id}`} className="group">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 group-hover:text-sky-600">
              <MdOutlineWorkOutline className="text-sky-500" /> {project.title}
            </h2>
          </Link>
          <StatusBadge status={project.status} />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {project.status === 'in_progress' && (
            <button onClick={() => onComplete(project.id)} className="text-xs flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-md hover:bg-green-200 font-semibold">
              <FaCheck /> إنهاء
            </button>
          )}
          {project.status === 'completed' && (
            <button onClick={() => navigate(`/projects/${project.id}/review`)} className="text-xs flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-md hover:bg-purple-200 font-semibold">
              <FaStar /> تقييم
            </button>
          )}
          <button onClick={() => navigate(`/projects/edit/${project.id}`)} className="text-xs flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-md hover:bg-yellow-200 font-semibold">
            <FaEdit /> تعديل
          </button>
          <button onClick={() => onDelete(project.id)} className="text-xs flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-200 font-semibold">
            <FaTrash /> حذف
          </button>
        </div>
      </div>

      <p className="text-gray-600 mt-3 line-clamp-2">{project.description}</p>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-gray-700 border-t pt-4">
        <div className="flex items-center gap-2"><FaDollarSign className="text-green-500" /><span>الميزانية: ${project.budget_min} - ${project.budget_max}</span></div>
        <div className="flex items-center gap-2"><FaRegClock className="text-red-500" /><span>الانتهاء: {new Date(project.deadline).toLocaleDateString("ar-EG")}</span></div>
      </div>
    </div>
  );
};

export default MyProjectCard;
