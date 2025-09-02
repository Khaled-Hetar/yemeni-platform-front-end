import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { 
  FiBriefcase, 
  FiPlusCircle, 
  FiDollarSign, 
  FiFileText, 
  FiLoader, 
  FiAlertTriangle,
  FiArrowRight
} from 'react-icons/fi';

// مكونات فرعية (يمكن وضعها في ملف منفصل لإعادة الاستخدام)
const StatCard = ({ icon, title, value, color, to }) => (
  <Link to={to} className={`block bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-${color}-500 transition-all duration-300`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </Link>
);

const SummaryListCard = ({ title, items, renderItem, viewAllLink, emptyMessage }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col">
    <h2 className="text-xl font-semibold text-neutral-700 mb-4">{title}</h2>
    <div className="space-y-4 flex-grow">
      {items.length > 0 ? (
        items.map(renderItem)
      ) : (
        <p className="text-gray-500 text-center py-8">{emptyMessage}</p>
      )}
    </div>
    <div className="mt-4 text-center">
      <Link to={viewAllLink} className="text-sm font-semibold text-cyan-600 hover:underline flex items-center justify-center gap-1">
        <span>عرض الكل</span>
        <FiArrowRight size={14} />
      </Link>
    </div>
  </div>
);


const BuyerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ projects: 0, orders: 0, balance: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuyerData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const [projectsRes, ordersRes, transactionsRes] = await Promise.all([
          apiClient.get(`/projects?userId=${user.id}&_sort=id&_order=desc`),
          apiClient.get(`/orders?userId=${user.id}&_sort=id&_order=desc&_expand=service`),
          apiClient.get(`/transactions?userId=${user.id}`),
        ]);

        const balance = transactionsRes.data.reduce((acc, tx) => {
          return tx.type === 'deposit' ? acc + tx.amount : acc - tx.amount;
        }, 0);

        setStats({
          projects: projectsRes.data.length,
          orders: ordersRes.data.length,
          balance: balance.toFixed(2),
        });

        setRecentProjects(projectsRes.data.slice(0, 3));

      } catch (err) {
        console.error("فشل في جلب بيانات لوحة التحكم:", err);
        setError("حدث خطأ أثناء تحميل بياناتك.");
      } finally {
        setLoading(false);
      }
    };
    fetchBuyerData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <FiLoader className="animate-spin text-cyan-600 text-5xl" />
        <p className="mt-4 text-gray-600">جاري تجهيز لوحة التحكم...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <FiAlertTriangle className="text-red-500 text-5xl" />
        <p className="mt-4 text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
            <p className="text-neutral-500 mt-1">مرحباً بعودتك، {user?.name || 'مستخدم'}!</p>
          </div>
          <div className="flex gap-2">
            <Link to="/projects/new" className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-xl hover:bg-cyan-700 transition shadow-sm">
              <FiPlusCircle /> انشر مشروعاً
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={<FiDollarSign size={22}/>} title="رصيد المحفظة" value={`$${stats.balance}`} color="green" to="/payments" />
          <StatCard icon={<FiBriefcase size={22}/>} title="المشاريع المنشورة" value={stats.projects} color="indigo" to="/project-management" />
          <StatCard icon={<FiFileText size={22}/>} title="الطلبات المكتملة" value={stats.orders} color="sky" to="/orders-history" />
        </div>

        <SummaryListCard
          title="آخر مشاريعك المنشورة"
          items={recentProjects}
          viewAllLink="/project-management"
          emptyMessage="لم تقم بنشر أي مشاريع بعد."
          renderItem={(project) => (
            <Link key={project.id} to={`/projects/${project.id}`} className="block p-3 rounded-lg hover:bg-gray-50 transition">
              <p className="font-semibold text-neutral-800 truncate">{project.title}</p>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
            </Link>
          )}
        />
      </div>
    </div>
  );
};

export default BuyerDashboard;
