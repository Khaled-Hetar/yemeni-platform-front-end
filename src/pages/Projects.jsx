import React, { useState, useEffect } from "react";
import { FaRegClock, FaDollarSign, FaUserTie } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import apiClient from '../api/axiosConfig';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get('/projects?with=user');
        setProjects(response.data);
      } catch (err) {
        setError("فشل في تحميل المشاريع المتاحة.");
        console.error("خطأ في جلب المشاريع:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []); 

  if (loading) {
    return <div className="p-8 text-center">جاري تحميل المشاريع...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-sky-700">المشاريع المفتوحة</h1>

      <div className="grid gap-6">
        {projects.length > 0 ? projects.map((project) => (
          <div
            key={project.id}
            className="bg-white p-6 rounded-2xl shadow border border-gray-200 hover:shadow-lg transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-neutral-800 flex items-center gap-2">
                <MdOutlineWorkOutline className="text-sky-600" /> {project.title}
              </h2>
              {project.user && (
                <Link to={`/profile/${project.user.id}`}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-sky-700">
                  <img src={project.user.avatar_url} alt={project.user.name}
                    className="w-6 h-6 rounded-full object-cover" />
                  <span>{project.user.name}</span>
                </Link>
              )}
            </div>

            <p className="text-neutral-600 mt-3 line-clamp-2">{project.description}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-between 
              items-start sm:items-center mt-4 text-sm text-neutral-700">
              <div className="flex items-center gap-2">
                <FaDollarSign className="text-green-600" />
                <span>الميزانية: ${project.budget_min} - ${project.budget_max}</span>
              </div>

              <div className="flex items-center gap-2">
                <FaRegClock className="text-red-600" />
                <span>الموعد النهائي: {new Date(project.deadline).toLocaleDateString('ar-EG')}</span>
              </div>

              <div className="flex items-center gap-2">
                <FaUserTie className="inline ml-1" />
                <span>{project.proposals_count || 0} عروض</span>
              </div>
              
              <Link
                to={`/projects/${project.id}`} 
                className="bg-sky-600 text-white px-4 py-2 rounded-xl hover:bg-sky-700 transition"
              >
                قدّم عرضك الآن
              </Link>
            </div>
          </div>
        )) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <p className="text-gray-500">لا توجد مشاريع متاحة في الوقت الحالي.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
