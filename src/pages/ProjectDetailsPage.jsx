// src/pages/ProjectDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft } from "react-icons/fa";

// استيراد المكونات
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import ProjectHeader from '../components/project-details/ProjectHeader';
import ProjectStats from '../components/project-details/ProjectStats';
import ProjectActions from '../components/project-details/ProjectActions';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        // التحسين المنطقي: جلب كل البيانات في طلب واحد
        const response = await apiClient.get(`/projects/${id}?with=user,proposals.user`);
        setProject(response.data);
      } catch (err) {
        setError("لا يمكن العثور على هذا المشروع.");
        console.error("فشل في جلب تفاصيل المشروع:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <LoadingState message="جاري تحميل تفاصيل المشروع..." />;
  if (error) return <ErrorState message={error} onRetry={() => navigate('/projects')} />;
  if (!project) return <ErrorState message="المشروع غير موجود." />;

  const isOwner = user && project.user && user.id === project.user.id;

  // ===============================================================
  // قسم الـ JSX (تم الحفاظ عليه كما هو من تصميمك الأصلي 100%)
  // ===============================================================
  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg border">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-sky-600 font-semibold mb-6">
          <FaArrowLeft />
          <span>العودة</span>
        </button>

        <ProjectHeader title={project.title} createdAt={project.created_at} user={project.user} />

        <main className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-700 mb-2">وصف المشروع</h2>
            <p className="text-neutral-600 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          <ProjectStats project={project} />
          
          <ProjectActions project={project} isOwner={isOwner} />
        </main>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
