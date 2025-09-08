import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit, FaRegClock, FaDollarSign, FaCheck, FaStar } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    open: { text: "مفتوح", bg: "bg-blue-100", text_color: "text-blue-800" },
    in_progress: { text: "قيد التنفيذ", bg: "bg-yellow-100", text_color: "text-yellow-800" },
    completed: { text: "مكتمل", bg: "bg-green-100", text_color: "text-green-800" },
    rated: { text: "مكتمل ومُقيّم", bg: "bg-purple-100", text_color: "text-purple-800" },
    default: { text: status, bg: "bg-gray-100", text_color: "text-gray-800" },
  };
  const style = statusStyles[status] || statusStyles.default;
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${style.bg} ${style.text_color}`}>{style.text}</span>;
};

const ManagedProjectCard = ({ project, onDelete, onComplete }) => {
  const navigate = useNavigate();

  return (
    <article className="bg-white p-6 rounded-2xl shadow border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-neutral-800 flex items-center gap-2">
            <MdOutlineWorkOutline className="text-sky-600" /> {project.title}
          </h2>
          <StatusBadge status={project.status} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {project.status === 'in_progress' && (
            <button onClick={() => onComplete(project.id)} className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 text-xs">
              <FaCheck /> إنهاء
            </button>
          )}
          {project.status === 'completed' && (
            <button onClick={() => navigate(`/projects/${project.id}/review`)} className="flex items-center gap-1 bg-purple-500 text-white px-3 py-1 rounded-lg hover:bg-purple-600 text-xs">
              <FaStar /> تقييم
            </button>
          )}
          <button onClick={() => navigate(`/projects/edit/${project.id}`)} className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 text-xs">
            <FaEdit /> تعديل
          </button>
          <button onClick={() => onDelete(project.id)} className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-xs">
            <FaTrash /> حذف
          </button>
        </div>
      </div>
      <p className="text-neutral-600 mt-3 line-clamp-2">{project.description}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mt-4 pt-4 border-t text-sm text-neutral-700">
        <div className="flex items-center gap-2">
          <FaDollarSign className="text-green-600" />
          <span>الميزانية: ${project.budget_min} - ${project.budget_max}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaRegClock className="text-red-600" />
          <span>الموعد النهائي: {new Date(project.deadline).toLocaleDateString("ar-EG")}</span>
        </div>
        <Link to={`/projects/${project.id}`} className="bg-sky-600 text-white px-4 py-2 rounded-xl hover:bg-sky-700 transition text-xs">
          عرض التفاصيل
        </Link>
      </div>
    </article>
  );
};

export default ManagedProjectCard;
