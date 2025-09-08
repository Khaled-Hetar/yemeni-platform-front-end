// src/pages/UserProfile.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

// استيراد المكونات
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileTabs from '../components/profile/ProfileTabs';
import OverviewTab from '../components/profile/tabs/OverviewTab';
import ServicesTab from '../components/profile/tabs/ServicesTab';
import PortfolioTab from '../components/profile/tabs/PortfolioTab';
import ReviewsTab from '../components/profile/tabs/ReviewsTab';

const UserProfile = () => {
  const { userId } = useParams();
  // const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState({
    profile: null,
    services: [],
    projects: [],
    reviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    if (!userId) {
      setError("لم يتم تحديد معرّف المستخدم.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [profileRes, servicesRes, projectsRes, reviewsRes] = await Promise.all([
        apiClient.get(`/users/${userId}`),
        apiClient.get(`/users/${userId}/services`),
        apiClient.get(`/users/${userId}/projects`),
        apiClient.get(`/users/${userId}/reviews?with=reviewer`)
      ]);

      setProfileData({
        profile: profileRes.data,
        services: servicesRes.data,
        projects: projectsRes.data,
        reviews: reviewsRes.data,
      });
    } catch (err) {
      setError("لا يمكن العثور على المستخدم أو بياناته.");
      console.error("فشل في جلب البيانات:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleStartConversation = useCallback(() => {
    // منطق بدء المحادثة
    console.log("Starting conversation...");
  }, []);

  const { profile, services, projects, reviews } = profileData;

  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  }, [reviews]);

  if (loading) return <LoadingState message="جاري تحميل الملف الشخصي..." />;
  if (error) return <ErrorState message={error} />;
  if (!profile) return <ErrorState message="لا توجد بيانات لهذا المستخدم." />;

  const isOwner = currentUser?.id === parseInt(userId, 10);
  const userName = profile.firstname || profile.name;

  const tabCounts = {
    services: services.length,
    projects: projects.length,
    reviews: reviews.length,
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'services':
        return <ServicesTab services={services} userName={userName} />;
      case 'portfolio':
        return <PortfolioTab projects={projects} userName={userName} />;
      case 'reviews':
        return <ReviewsTab reviews={reviews} userName={userName} />;
      case 'overview':
      default:
        return <OverviewTab profile={profile} servicesCount={tabCounts.services} projectsCount={tabCounts.projects} isOwner={isOwner} />;
    }
  };

  // ===============================================================
  // قسم الـ JSX (تم الحفاظ عليه كما هو من تصميمك الأصلي 100%)
  // ===============================================================
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">
          <ProfileSidebar 
            profile={profile}
            averageRating={averageRating}
            reviewsCount={tabCounts.reviews}
            isOwner={isOwner}
            onStartConversation={handleStartConversation}
          />
          <main className="space-y-6">
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} counts={tabCounts} />
            <div className="animate-fade-in">
              {renderActiveTab()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
