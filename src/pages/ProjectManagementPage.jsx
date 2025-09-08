// src/pages/ProjectManagementPage.jsx

import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import apiClient from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

// استيراد المكونات
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import ManagedProjectCard from '../components/project-management/ManagedProjectCard';
import ConfirmationModal from '../components/project-management/ConfirmationModal';

const ProjectManagementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // حالات النافذة المنبثقة
  const [modalState, setModalState] = useState({ isOpen: false, action: null, projectId: null });
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchUserProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // التحسين المنطقي: استخدام نقطة نهاية مخصصة ومحمية
      const response = await apiClient.get('/user/projects');
      setProjects(response.data.map(p => ({ ...p, status: p.status || 'open' })));
    } catch (err) {
      console.error("فشل في جلب المشاريع:", err);
      setError("حدث خطأ أثناء تحميل مشاريعك.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserProjects();
  }, [user, navigate, fetchUserProjects]);

  const openModal = (action, projectId) => {
    setModalState({ isOpen: true, action, projectId });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, action: null, projectId: null });
  };

  const handleConfirmAction = async () => {
    const { action, projectId } = modalState;
    if (!action || !projectId) return;

    setIsActionLoading(true);
    try {
      if (action === 'delete') {
        await apiClient.delete(`/projects/${projectId}`);
        setProjects((prev) => prev.filter((proj) => proj.id !== projectId));
      } else if (action === 'complete') {
        await apiClient.patch(`/projects/${projectId}/complete`);
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'completed' } : p));
      }
      closeModal();
    } catch (err) {
      console.error(`فشل في ${action} المشروع:`, err);
      alert(`حدث خطأ أثناء محاولة ${action === 'delete' ? 'حذف' : 'إنهاء'} المشروع.`);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) return <LoadingState message="جاري تحميل مشاريعك..." />;
  if (error) return <ErrorState message={error} onRetry={fetchUserProjects} />;

  // ===============================================================
  // قسم الـ JSX (تم الحفاظ عليه كما هو من تصميمك الأصلي 100%)
  // ===============================================================
  return (
    <>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-sky-700">إدارة مشاريعي</h1>
          <Link to="/projects/new" className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-xl hover:bg-sky-700 transition">
            <FaPlus /> مشروع جديد
          </Link>
        </header>

        <main>
          {projects.length > 0 ? (
            <div className="grid gap-6">
              {projects.map((project) => (
                <ManagedProjectCard 
                  key={project.id} 
                  project={project}
                  onDelete={() => openModal('delete', project.id)}
                  onComplete={() => openModal('complete', project.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <p className="text-gray-500">لم تقم بإضافة أي مشاريع حتى الآن.</p>
              <Link to="/projects/new" className="mt-4 inline-block bg-sky-600 text-white px-6 py-3 rounded-xl hover:bg-sky-700 transition">
                إضافة مشروع جديد
              </Link>
            </div>
          )}
        </main>
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmAction}
        isLoading={isActionLoading}
        title={modalState.action === 'delete' ? "تأكيد الحذف" : "تأكيد الإنهاء"}
        message={modalState.action === 'delete' ? "هل أنت متأكد أنك تريد حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء." : "هل تؤكد أن المشروع قد اكتمل؟ سيؤدي هذا إلى إنهاء العقد."}
        confirmText={modalState.action === 'delete' ? "نعم، احذف" : "نعم، أنهِ المشروع"}
      />
    </>
  );
};

export default ProjectManagementPage;
