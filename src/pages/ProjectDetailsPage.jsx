import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { FaRegClock, FaDollarSign, FaUserTie, FaArrowLeft } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';

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
        const response = await apiClient.get(`/projects/${id}?with=user,proposals`);
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

  if (loading) {
    return <div className="p-8 text-center">جاري تحميل تفاصيل المشروع...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>{error}</p>
        <button onClick={() => navigate('/projects')}
          className="mt-4 text-sky-600 hover:underline">
          العودة إلى قائمة المشاريع
        </button>
      </div>
    );
  }

  const isOwner = user && project.user && user.id === project.user.id;
  const ownerName = project.user ? `${project.user.firstname} ${project.user.lastname}` : 'صاحب المشروع';

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg border my-8">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-sky-600 font-semibold mb-6">
        <FaArrowLeft />
        <span>العودة</span>
      </button>

      <div className="border-b pb-4 mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">{project.title}</h1>
          <p className="text-sm text-gray-500 mt-2">
            نُشر في: {new Date(project.createdAt).toLocaleDateString('ar-EG')}
          </p>
        </div>

        {project.user && (
          <Link to={`/profile/${project.user.id}`}
            className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition">
            <img src={project.user.avatar_url} alt={ownerName}
              className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="text-sm text-gray-500">صاحب المشروع</p>
              <p className="font-semibold text-neutral-700">{ownerName}</p>
            </div>
          </Link>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-neutral-700 mb-2">وصف المشروع</h2>
          <p className="text-neutral-600 leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-green-50 p-4 rounded-lg">
            <FaDollarSign className="mx-auto text-2xl text-green-600 mb-2" />
            <p className="font-semibold text-neutral-700">الميزانية</p>
            <p className="text-sm text-neutral-600">${project.budget_min} - ${project.budget_max}</p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <FaRegClock className="mx-auto text-2xl text-red-600 mb-2" />
            <p className="font-semibold text-neutral-700">الموعد النهائي</p>
            <p className="text-sm text-neutral-600">{new Date(project.deadline).toLocaleDateString('ar-EG')}</p>
          </div>

          <div className="bg-sky-50 p-4 rounded-lg">
            <FaUserTie className="mx-auto text-2xl text-sky-600 mb-2" />
            <p className="font-semibold text-neutral-700">العروض المقدمة</p>
            <p className="text-sm text-neutral-600">{project.proposals?.length || 0} عروض</p>
          </div>

        </div>

        {isOwner ? (
          <div className="pt-6">
            <h2 className="text-xl font-semibold text-neutral-700 mb-4">العروض المستلمة</h2>
            {project.proposals && project.proposals.length > 0 ? (
              <div className="space-y-4">
                {project.proposals.map(proposal => (
                  <div key={proposal.id} className="border rounded-lg p-4 bg-gray-50">
                    <p>{proposal.message}</p>
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                      <span>السعر: ${proposal.price}</span>
                      <span>المدة: {proposal.duration} أيام</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">لم يتم تقديم أي عروض بعد.</p>
            )}
          </div>
          
        ) : (
          <div className="text-center pt-6">
            <Link
              to={`/submit-proposal/${project.id}`}
                className="bg-sky-600 text-white font-bold py-3 px-10 rounded-full 
                hover:bg-sky-700 transition-transform transform hover:scale-105 inline-block"
            >
              تقديم عرض الآن
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
