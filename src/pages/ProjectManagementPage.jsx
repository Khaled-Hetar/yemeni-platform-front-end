import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaEdit, FaRegClock, FaDollarSign, FaCheck, FaStar } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import apiClient from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    open: { text: "مفتوح", bg: "bg-blue-100", text_color: "text-blue-800" },
    in_progress: { text: "قيد التنفيذ", bg: "bg-yellow-100", text_color: "text-yellow-800" },
    completed: { text: "مكتمل", bg: "bg-green-100", text_color: "text-green-800" },
    rated: { text: "مكتمل", bg: "bg-green-100", text_color: "text-green-800" },
    default: { text: status, bg: "bg-gray-100", text_color: "text-gray-800" },
  };
  const style = statusStyles[status] || statusStyles.default;
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${style.bg} ${style.text_color}`}>
      {style.text}
    </span>
  );
};


const ProjectManagementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchUserProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/user/projects');
        
        const projectsWithStatus = response.data.map(p => ({ ...p, status: p.status || 'open' }));
        setProjects(projectsWithStatus);
      } catch (err) {
        console.error("فشل في جلب المشاريع:", err);
        setError("حدث خطأ أثناء تحميل مشاريعك.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProjects();
  }, [user, navigate]);


  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا المشروع؟")) return;
    try {
      await apiClient.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((proj) => proj.id !== id));
    } catch (err) {
      console.error("فشل في حذف المشروع:", err);
      alert("حدث خطأ أثناء محاولة حذف المشروع.");
    }
  };

  const handleCompleteProject = async (projectId) => {
    if (!window.confirm("هل تؤكد أن المشروع قد اكتمل؟ سيؤدي هذا إلى إنهاء العقد.")) return;
    try {
      // نرسل طلب لتحديث حالة المشروع إلى "completed"
      // const response = await apiClient.patch(`/projects/${projectId}`, { status: 'completed' });
      // نحدّث الحالة في الواجهة لتعكس التغيير فورًا
      setProjects(prevProjects =>
        prevProjects.map(p => p.id === projectId ? { ...p, status: 'completed' } : p)
      );
    } catch (err) {
      console.error("فشل في إنهاء المشروع:", err);
      alert("حدث خطأ أثناء محاولة إنهاء المشروع.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">جاري تحميل مشاريعك...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-sky-700">إدارة مشاريعي</h1>
        <Link
          to="/projects/new"
          className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-xl hover:bg-sky-700 transition"
        >
          <FaPlus /> مشروع جديد
        </Link>
      </div>

      <div className="grid gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-6 rounded-2xl shadow border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-neutral-800 flex items-center gap-2">
                    <MdOutlineWorkOutline className="text-sky-600" /> {project.title}
                  </h2>

                  <StatusBadge status={project.status} />
                </div>

                <div className="flex gap-2">
                  {project.status === 'in_progress' && (
                    <button
                      onClick={() => handleCompleteProject(project.id)}
                      className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                    >
                      <FaCheck /> إنهاء المشروع
                    </button>
                  )}
                  {project.status === 'completed' && (
                    <button
                      onClick={() => navigate(`/projects/${project.id}/review`)} // توجيه لصفحة التقييم
                      className="flex items-center gap-1 bg-purple-500 text-white px-3 py-1 rounded-lg hover:bg-purple-600"
                    >
                      <FaStar /> تقييم المستقل
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/projects/edit/${project.id}`)}
                    className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                  >
                    <FaEdit /> تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                  >
                    <FaTrash /> حذف
                  </button>
                </div>
              </div>

              <p className="text-neutral-600 mt-3 line-clamp-2">{project.description}</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mt-4 text-sm text-neutral-700">
                <div className="flex items-center gap-2">
                  <FaDollarSign className="text-green-600" />
                  <span>
                    الميزانية: ${project.budget_min} - ${project.budget_max}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaRegClock className="text-red-600" />
                  <span>
                    الموعد النهائي:{" "}
                    {new Date(project.deadline).toLocaleDateString("ar-EG")}
                  </span>
                </div>
                <Link
                  to={`/projects/${project.id}`}
                  className="bg-sky-600 text-white px-4 py-2 rounded-xl hover:bg-sky-700 transition"
                >
                  عرض التفاصيل
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <p className="text-gray-500">لم تقم بإضافة أي مشاريع حتى الآن.</p>
            <Link
              to="/projects/new"
              className="mt-4 inline-block bg-sky-600 text-white px-6 py-3 rounded-xl hover:bg-sky-700 transition"
            >
              إضافة مشروع جديد
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManagementPage;
