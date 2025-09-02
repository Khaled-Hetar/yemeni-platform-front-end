import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { FiLoader, FiAlertTriangle, FiEye } from 'react-icons/fi';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: { text: "في الانتظار", bg: "bg-yellow-100", text_color: "text-yellow-800" },
    in_progress: { text: "قيد التنفيذ", bg: "bg-blue-100", text_color: "text-blue-800" },
    completed: { text: "مكتمل", bg: "bg-green-100", text_color: "text-green-800" },
    cancelled: { text: "ملغي", bg: "bg-red-100", text_color: "text-red-800" },
    default: { text: status, bg: "bg-gray-100", text_color: "text-gray-800" },
  };

  const style = statusStyles[status] || statusStyles.default;
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${style.bg} ${style.text_color}`}>
      {style.text}
    </span>
  );
};

const OrdersManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchSellerOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/user/seller-orders?with=user,service');
        
        // يمكن إزالة هذا السطر إذا كان الخادم يعيد دائماً حالة للطلب
        const ordersWithStatus = response.data.map(o => ({ ...o, status: o.status || 'pending' }));
        setOrders(ordersWithStatus);

      } catch (err) {
        setError("فشل في تحميل قائمة الطلبات.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerOrders();
  }, [isAuthenticated, navigate]); 

  const handleUpdateStatus = async (orderId, newStatus) => {
    const originalOrders = [...orders];
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      await apiClient.patch(`/orders/${orderId}/status`, { status: newStatus });
    } catch (error) {
      console.error(`فشل في تحديث حالة الطلب ${orderId}:`, error);
      setOrders(originalOrders);
      alert("حدث خطأ أثناء تحديث حالة الطلب.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-cyan-600 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <FiAlertTriangle className="text-red-500 text-4xl mb-3" />
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-sky-700 mb-8">إدارة الطلبات الواردة</h1>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="border-b-2 border-gray-200 bg-gray-50">
                <tr className="text-gray-600">
                  <th className="p-4 font-semibold">الخدمة المطلوبة</th>
                  <th className="p-4 font-semibold">المشتري</th>
                  <th className="p-4 font-semibold">تاريخ الطلب</th>
                  <th className="p-4 font-semibold">السعر</th>
                  <th className="p-4 font-semibold">الحالة</th>
                  <th className="p-4 font-semibold">الإجراءات</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">
                      <Link to={`/services/${order.service?.id}`} className="hover:underline">
                        {order.service?.title || 'خدمة محذوفة'}
                      </Link>
                    </td>
                    <td className="p-4 text-gray-600">
                      <Link to={`/profile/${order.user?.id}`} className="hover:underline">
                        {order.user?.name || 'مستخدم محذوف'}
                      </Link>
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-4 text-green-600 font-bold">
                      ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'in_progress')}
                              className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
                              قبول
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                              رفض
                            </button>
                          </>
                        )}
                        {order.status === 'in_progress' && (
                          <button onClick={() => handleUpdateStatus(order.id, 'completed')}
                            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                            تسليم العمل
                          </button>
                        )}
                        <Link to={`/orders/${order.id}/details`}
                          className="text-gray-500 hover:text-sky-600 p-1 rounded-full hover:bg-gray-200">
                          <FiEye />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p>لا توجد لديك أي طلبات واردة حتى الآن.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersManagement;
