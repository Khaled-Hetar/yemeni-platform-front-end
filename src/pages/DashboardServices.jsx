import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaCog, 
  FaClipboardList, 
  FaLayerGroup, 
  FaEnvelope, 
  FaBell, 
  FaPlusCircle 
} from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { useAuth } from './context/AuthContext';
import apiClient from './api/axiosConfig';
import { FiLoader, FiAlertTriangle } from 'react-icons/fi';

// ===================================================================
// 1. المكونات الفرعية (تم تحسينها قليلاً)
// ===================================================================

const SidebarItem = ({ icon, label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 ${
        isActive 
          ? "bg-sky-100 text-sky-700 font-bold" 
          : "text-neutral-600 hover:bg-gray-100 hover:text-neutral-800"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
    <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-neutral-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// ===================================================================
// 2. المكون الرئيسي للوحة التحكم
// ===================================================================

const SellerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ orders: 0, services: 0, messages: 0, rating: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 3. جلب شامل للبيانات ---
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // جلب الطلبات والخدمات والمحادثات الخاصة بالمستخدم
        const [ordersRes, servicesRes, conversationsRes] = await Promise.all([
          apiClient.get(`/orders?sellerId=${user.id}&_expand=user`), // طلبات على خدماتي
          apiClient.get(`/services?userId=${user.id}`),
          apiClient.get(`/conversations?participants_like=${user.id}`), // محاكاة للفلترة
        ]);

        setStats({
          orders: ordersRes.data.length,
          services: servicesRes.data.length,
          messages: conversationsRes.data.length,
          rating: "98%", // قيمة وهمية للتقييم
        });
        
        setRecentOrders(ordersRes.data.slice(0, 5)); // آخر 5 طلبات

      } catch (err) {
        setError("فشل في تحميل بيانات لوحة التحكم.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-cyan-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* الشريط الجانبي */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-sky-700">لوحة تحكم البائع</h1>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <SidebarItem icon={<MdSpaceDashboard />} label="نظرة عامة" to="/dashboard" />
          <SidebarItem icon={<FaClipboardList />} label="إدارة الطلبات" to="/orders-management" />
          <SidebarItem icon={<FaLayerGroup />} label="إدارة خدماتي" to="/service-management" />
          <SidebarItem icon={<FaEnvelope />} label="صندوق الوارد" to="/conversations" />
          <SidebarItem icon={<FaBell />} label="الإشعارات" to="/notifications" />
        </nav>
        <div className="mt-auto p-4 border-t border-gray-200">
          <SidebarItem icon={<FaCog />} label="الإعدادات" to="/settings" />
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 p-6 lg:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">مرحباً {user?.name} 👋</h2>
            <p className="text-sm text-neutral-500">هنا ملخص لنشاطك اليوم.</p>
          </div>
          <Link to="/add-service" className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-xl hover:bg-cyan-700 transition shadow-sm">
            <FaPlusCircle /> أضف خدمة
          </Link>
        </header>

        {error ? (
          <div className="flex flex-col items-center justify-center text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <FiAlertTriangle className="text-red-500 text-3xl mb-2" />
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="الطلبات الجارية" value={stats.orders} icon={<FaClipboardList />} color="sky" />
              <StatCard title="إجمالي الخدمات" value={stats.services} icon={<FaLayerGroup />} color="indigo" />
              <StatCard title="المحادثات" value={stats.messages} icon={<FaEnvelope />} color="amber" />
              <StatCard title="التقييم الإيجابي" value={stats.rating} icon={<FaBell />} color="green" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">الطلبات الحديثة</h3>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-sm text-neutral-500">لا توجد طلبات جديدة حالياً.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right">
                    <thead className="border-b-2 border-gray-200">
                      <tr className="text-gray-500">
                        <th className="p-3 font-semibold">الخدمة</th>
                        <th className="p-3 font-semibold">المشتري</th>
                        <th className="p-3 font-semibold">السعر</th>
                        <th className="p-3 font-semibold">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 font-medium text-gray-800">{order.service?.title || 'خدمة محذوفة'}</td>
                          <td className="p-3 text-gray-600">{order.user?.firstname || 'مستخدم'}</td>
                          <td className="p-3 text-gray-600 font-medium">${order.totalAmount?.toFixed(2)}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium">
                              جاري التنفيذ
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SellerDashboard;
