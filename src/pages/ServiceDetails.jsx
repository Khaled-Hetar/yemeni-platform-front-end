import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiMessageSquare } from "react-icons/fi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import apiClient from '../api/axiosConfig';

import { useAuth } from '../context/AuthContext';
import { findOrCreateConversation } from '../api/ConversationsPage';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user: currentUser } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStartingChat, setIsStartingChat] = useState(false);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/services/${id}?with=user,reviews`);
        setService(response.data);
      } catch (err) {
        setError("لا يمكن العثور على هذه الخدمة أو حدث خطأ ما.");
        console.error("فشل في جلب البيانات:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServiceDetails();
  }, [id]);

  const handleContactSeller = async () => {
    if (isStartingChat) return;

    if (!currentUser) {
      alert("يرجى تسجيل الدخول أولاً لبدء محادثة.");
      navigate('/login');
      return;
    }

    if (!service || !service.user) {
      alert("حدث خطأ، لا يمكن العثور على معلومات البائع.");
      return;
    }

    setIsStartingChat(true);
    try {
      await findOrCreateConversation(currentUser, service.user.id, navigate);
    } catch (error) {
      console.error("فشل بدء المحادثة من صفحة التفاصيل:", error);
    } finally {
      setIsStartingChat(false);
    }
  };

  if (loading) {
    return <div className="text-center p-10">جاري تحميل تفاصيل الخدمة...</div>;
  }

  if (error || !service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-10">
        <h2 className="text-3xl font-bold text-gray-700 mb-4">{error || "الخدمة غير موجودة"}</h2>
        <p className="text-gray-500 mb-6">عذرًا، قد تكون هذه الخدمة قد حُذفت أو أن الرابط غير صحيح.</p>
        <button onClick={() => navigate("/services")}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white 
            font-semibold rounded-lg hover:bg-cyan-700 transition-colors">
          <FiArrowLeft />
          <span>العودة إلى كل الخدمات</span>
        </button>
      </div>
    );
  }

  const getStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-gray-300" />);
    }
    return stars;
  };

  const overallRating = service.reviews && service.reviews.length > 0 
    ? service.reviews.reduce((acc, review) => acc + review.rating, 0) / service.reviews.length
    : 0;

  const userName = service.user ? `${service.user.name}` : 'مستخدم غير معروف';

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 font-semibold mb-8">
          <FiArrowLeft />
          <span>العودة</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span className="text-cyan-600 font-semibold text-sm">{service.category?.name || 'قسم غير محدد'}</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">{service.title}</h1>
            </div>
            
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-6">
              <div className="flex items-center gap-1">{getStars(overallRating)}</div>
              <span className="text-gray-700 font-bold">{overallRating > 0 ? overallRating.toFixed(1) : 'جديد'}</span>
              <span className="text-gray-500 text-sm">({service.reviews?.length || 0} تقييم)</span>
            </div>

            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="w-full rounded-2xl shadow-lg mb-8"
            >
              {[service.main_image_url, ...(service.gallery_image_urls || [])]
                .filter(Boolean)
                .map((img, index) => (
                  <SwiperSlide key={index}>
                    <img src={img} alt={`صورة عرض ${index + 1}`} className="w-full h-auto max-h-[450px] object-cover" />
                  </SwiperSlide>
              ))}
            </Swiper>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">عن هذه الخدمة</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{service.description}</p>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                {service.user && (
                  <>
                    <div className="flex flex-col items-center text-center">
                      <img src={service.user.avatar_url} alt={userName}
                        className="w-24 h-24 rounded-full mb-4 border-4 border-white shadow-md" />
                      <h3 className="text-xl font-bold text-gray-800">{userName}</h3>
                      <Link to={`/profile/${service.user.id}`}
                        className="text-sm text-cyan-600 hover:underline">عرض الملف الشخصي</Link>
                    </div>

                    <div className="border-t my-6"></div>

                    <button 
                      onClick={handleContactSeller}
                      disabled={isStartingChat || currentUser?.id === service.user.id}
                      className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-3 
                        rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <FiMessageSquare />
                      <span>{isStartingChat ? 'جاري التحضير...' : 'تواصل مع البائع'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
