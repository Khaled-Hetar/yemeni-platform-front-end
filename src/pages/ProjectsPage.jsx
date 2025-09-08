import React, { useState, useEffect } from "react";
import apiClient from '../api/axiosConfig';
import ProjectsList from '../components/projects/ProjectsList';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/projects?with=user&status=open');
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

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-sky-700">المشاريع المفتوحة</h1>
          <p className="text-gray-600 mt-2">تصفح أحدث المشاريع وابدأ في تقديم عروضك اليوم.</p>
        </header>
        
        <main>
          <ProjectsList 
            loading={loading}
            error={error}
            projects={projects}
          />
        </main>
      </div>
    </div>
  );
};

export default ProjectsPage;
