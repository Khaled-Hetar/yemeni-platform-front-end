import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { FaDollarSign, FaClock, FaFileAlt, FaHeading, FaArrowLeft } from "react-icons/fa";

const EditProjectPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [deadline, setDeadline] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/projects/${id}`);
        const project = response.data;

        setTitle(project.title);
        setDescription(project.description);
        setBudgetMin(project.budget_min);
        setBudgetMax(project.budget_max);
        setDeadline(project.deadline ? new Date(project.deadline).toISOString().split("T")[0] : "");

      } catch (err) {
        console.error("فشل في جلب بيانات المشروع:", err);
        if (err.response && err.response.status === 404) {
          setError("لم يتم العثور على المشروع.");
        } else {
          setError("حدث خطأ أثناء تحميل بيانات المشروع.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const updatedData = {
      title,
      description,
      budget_min: budgetMin,
      budget_max: budgetMax,
      deadline,
    };

    try {
      await apiClient.put(`/projects/${id}`, updatedData);
      
      navigate("/project-management");

    } catch (err) {
      console.error("فشل في تحديث المشروع:", err);
      if (err.response) {
        if (err.response.status === 403) {
          setError("غير مصرح لك بتعديل هذا المشروع.");
        } else if (err.response.status === 422) {
          setError("يرجى التأكد من أن جميع البيانات المدخلة صحيحة.");
        } else {
          setError("حدث خطأ أثناء تعديل المشروع.");
        }
      } else {
        setError("حدث خطأ في الاتصال بالخادم.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">جاري تحميل بيانات المشروع...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow border my-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-sky-600 font-semibold mb-6"
      >
        <FaArrowLeft />
        <span>العودة</span>
      </button>

      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-sky-700">تعديل المشروع</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-neutral-700 font-medium mb-1 flex items-center gap-2">
            <FaHeading className="text-sky-600" /> عنوان المشروع
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border rounded-xl focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="text-neutral-700 font-medium mb-1 flex items-center gap-2">
            <FaFileAlt className="text-sky-600" /> وصف المشروع
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 border rounded-xl resize-none min-h-[120px] focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-neutral-700 font-medium mb-1 flex items-center gap-2">
              <FaDollarSign className="text-green-600" /> أقل ميزانية
            </label>
            <input
              type="number"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              required
              className="w-full p-3 border rounded-xl focus:outline-none focus:border-cyan-500"
            />
          </div>
          
          <div>
            <label className="text-neutral-700 font-medium mb-1 flex items-center gap-2">
              <FaDollarSign className="text-green-600" /> أعلى ميزانية
            </label>
            <input
              type="number"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              required
              className="w-full p-3 border rounded-xl focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="text-neutral-700 font-medium mb-1 flex items-center gap-2">
            <FaClock className="text-red-500" /> الموعد النهائي
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            className="w-full p-3 border rounded-xl focus:outline-none focus:border-cyan-500"
          />
        </div>

        {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl text-lg font-medium w-full transition disabled:opacity-50"
        >
          {submitting ? "جارٍ الحفظ..." : "حفظ التعديلات"}
        </button>
      </form>
    </div>
  );
};

export default EditProjectPage;
