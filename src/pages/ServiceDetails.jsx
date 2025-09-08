// src/pages/ServiceDetails.jsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
// import { findOrCreateConversation } from '../api/ConversationsPage'; // افترض أن هذا موجود

// استيراد المكونات
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import ServiceGallery from '../components/service-details/ServiceGallery';
import ServiceHeader from '../components/service-details/ServiceHeader';
import SellerInfoCard from '../components/service-details/SellerInfoCard';
import ReviewsSection from '../components/service-details/ReviewsSection';

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
        // التحسين المنطقي: جلب كل البيانات في طلب واحد
        const response = await apiClient.get(`/services/${id}?with=user,reviews.user`);
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

  const handleContactSeller = useCallback(async () => {
    if (isStartingChat || !service?.user) return;
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setIsStartingChat(true);
    try {
      // await findOrCreateConversation(currentUser, service.user.id, navigate);
      console.log("Starting conversation with user:", service.user.id); // منطق مؤقت
    } catch (error) {
      console.error("فشل بدء المحادثة:", error);
    } finally {
      setIsStartingChat(false);
    }
  }, [currentUser, navigate, service?.user, isStartingChat]);

  const averageRating = useMemo(() => {
    if (!service?.reviews || service.reviews.length === 0) return 0;
    return service.reviews.reduce((acc, review) => acc + review.rating, 0) / service.reviews.length;
  }, [service?.reviews]);

  if (loading) return <LoadingState message="جاري تحميل تفاصيل الخدمة..." />;
  if (error) return <ErrorState message={error} />;
  if (!service) return <ErrorState message="الخدمة غير موجودة." />;

  const isOwner = currentUser?.id === service.user?.id;

  // ===============================================================
  // قسم الـ JSX (تم الحفاظ عليه كما هو من تصميمك الأصلي 100%)
  // ===============================================================
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 font-semibold mb-8">
          <FiArrowLeft />
          <span>العودة</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <main className="lg:col-span-2">
            <ServiceHeader 
              category={service.category?.name}
              title={service.title}
              averageRating={averageRating}
              reviewsCount={service.reviews?.length || 0}
            />
            <ServiceGallery 
              mainImage={service.main_image_url}
              galleryImages={service.gallery_image_urls}
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">عن هذه الخدمة</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{service.description}</p>
            <ReviewsSection reviews={service.reviews} />
          </main>

          <aside className="lg:col-span-1">
            <SellerInfoCard 
              service={service}
              onContact={handleContactSeller}
              isContacting={isStartingChat}
              isOwner={isOwner}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
