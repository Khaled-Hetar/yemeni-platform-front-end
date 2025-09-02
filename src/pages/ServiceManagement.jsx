import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import {
  FiLoader, FiAlertTriangle, FiPlusCircle, FiEdit, FiTrash2,
  FiEyeOff, FiEye, FiStar, FiClipboard } from 'react-icons/fi';

const ServiceManagementCard = ({ service, onDelete, onToggleStatus }) => {
  const isActive = service.status !== 'paused';
  const averageRating = service.reviews?.length > 0
    ? (service.reviews.reduce((acc, r) => acc + r.rating, 0) / service.reviews.length).toFixed(1)
    : 'جديد';

  return (
    <div className={`bg-white rounded-2xl shadow-md border transition-all duration-300 
      ${!isActive ? 'bg-gray-100 opacity-70' : 'hover:shadow-lg'}`}>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-neutral-800 mb-2 line-clamp-2">{service.title}</h3>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full 
              ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}
          >
            {isActive ? 'نشط' : 'موقف مؤقتاً'}
          </span>
        </div>
        
        <p className="text-sm text-green-600 font-bold mb-4">${service.price}</p>
        
        <div className="flex justify-around text-center text-sm text-neutral-600 border-y py-3 mb-4">
          <div className="px-2">
            <p className="font-bold text-lg text-neutral-800">{service.orders?.length || 0}</p>
            <p className="text-xs">الطلبات</p>
          </div>

          <div className="border-l"></div>

          <div className="px-2">
            <p className="font-bold text-lg text-neutral-800">{service.reviews?.length || 0}</p>
            <p className="text-xs">التقييمات</p>
          </div>

          <div className="border-l"></div>

          <div className="px-2">
            <p className="font-bold text-lg text-neutral-800 flex items-center justify-center gap-1">
              <FiStar className="text-yellow-400" />
              {averageRating}
            </p>
            <p className="text-xs">متوسط التقييم</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50/70 px-5 py-3 flex justify-end gap-2 rounded-b-2xl">
        <button 
          onClick={() => onToggleStatus(service.id, isActive ? 'paused' : 'active')}
          className="flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 
            font-semibold p-2 rounded-md hover:bg-gray-200 transition"
          title={isActive ? 'إيقاف مؤقت' : 'إعادة تفعيل'}
        >
          {isActive ? <FiEyeOff /> : <FiEye />}
        </button>

        <button 
          onClick={() => alert('سيتم بناء صفحة تعديل الخدمة لاحقاً')}
          className="flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 
            font-semibold p-2 rounded-md hover:bg-gray-200 transition"
          title="تعديل"
        >
          <FiEdit />
        </button>

        <button 
          onClick={() => onDelete(service.id)}
          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 
            font-semibold p-2 rounded-md hover:bg-red-100 transition"
          title="حذف"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};


const ServiceManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchSellerServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/user/services?with=orders,reviews');
        setServices(response.data);
      } catch (err) {
        setError("فشل في تحميل قائمة خدماتك.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerServices();
  }, [isAuthenticated, navigate]);


  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الخدمة؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    
    try {
      await apiClient.delete(`/services/${serviceId}`);
      setServices(prevServices => prevServices.filter(s => s.id !== serviceId));
    } catch (error) {
      console.error(`فشل في حذف الخدمة ${serviceId}:`, error);
      alert("حدث خطأ أثناء محاولة حذف الخدمة.");
    }
  };

  const handleToggleStatus = async (serviceId, newStatus) => {
    const originalServices = [...services];
    setServices(prevServices => 
      prevServices.map(s => 
        s.id === serviceId ? { ...s, status: newStatus } : s
      )
    );
    try {
      await apiClient.patch(`/services/${serviceId}/status`, { status: newStatus });
    } catch (error) {
      console.error(`فشل في تحديث حالة الخدمة ${serviceId}:`, error);
      setServices(originalServices);
      alert("حدث خطأ أثناء تحديث حالة الخدمة.");
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-sky-700">إدارة خدماتي</h1>
        <Link
          to="/add-service"
          className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 
            rounded-xl hover:bg-sky-700 transition shadow-sm"
        >
          <FiPlusCircle />
           إضافة خدمة جديدة
        </Link>
      </div>

      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <ServiceManagementCard 
              key={service.id} 
              service={service} 
              onDelete={handleDeleteService}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
          <FiClipboard size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">لم تقم بإضافة أي خدمات حتى الآن.</p>
          <Link
            to="/add-service"
            className="mt-4 inline-block bg-sky-600 text-white px-6 py-3 
              rounded-xl hover:bg-sky-700 transition"
          >
            أضف خدمتك الأولى
          </Link>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
