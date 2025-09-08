import React from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const ProjectSummaryHeader = ({ project }) => {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-sky-600 font-semibold mb-6"
      >
        <FaArrowLeft />
        <span>العودة إلى تفاصيل المشروع</span>
      </button>
      <header className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-sky-700">تقديم عرض للمشروع</h1>
        <p className="text-neutral-600 mt-1">{project.title}</p>
      </header>
    </>
  );
};

export default ProjectSummaryHeader;
