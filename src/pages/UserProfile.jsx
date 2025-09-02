import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { findOrCreateConversation } from '../api/conversationApi';
import { FaMobileAlt, FaCheckCircle, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { HiOutlineIdentification } from "react-icons/hi";
import { BsShieldLock, BsClipboardCheck } from "react-icons/bs";
import { FiUser, FiCircle, FiPhone, FiBriefcase, FiLayers, FiEdit, FiMessageSquare } from "react-icons/fi";

const ServiceCard = ({ service }) => (
  <Link to={`/services/${service.id}`}
    className="border rounded-lg p-4 hover:shadow-md transition-shadow block">
    <img src={service.main_image_url} alt={service.title}
      className="w-full h-32 object-cover rounded-md mb-2" />
    <h4 className="font-semibold text-gray-800 truncate">{service.title}</h4>
    <p className="text-sm text-cyan-600 font-bold">${service.price}</p>
  </Link>
);

const ProjectCard = ({ project }) => (
  <Link to={`/projects/${project.id}`}
    className="border rounded-lg p-4 hover:shadow-md transition-shadow block">
    <h4 className="font-semibold text-gray-800">{project.title}</h4>
    <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
    <div className="text-xs text-cyan-600 font-bold mt-2">${project.budget_min} - ${project.budget_max}</div>
  </Link>
);

const TabButton = ({ children, isActive, onClick }) => (
  <button onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors duration-300 
      ${isActive ? 'text-cyan-600 border-cyan-600'
        : 'text-gray-500 border-transparent hover:text-cyan-500 hover:border-cyan-500'}`}>
    {children}
  </button>
);

const CompletionStep = ({ text, completed, icon, linkTo, isOwner }) => {
  const content = (
    <div className={`flex items-center gap-3 transition ${completed ?
      'text-gray-400' : 'text-neutral-700'} ${!completed && isOwner ?
      'hover:text-cyan-600 cursor-pointer' : ''}`}>
      <span className="flex-shrink-0">{completed ? <FaCheckCircle
        className="text-green-500 text-xl" /> : icon}</span>
      <span className={`text-base ${completed ? 'line-through' : ''}`}>{text}</span>
    </div>
  );
  if (!completed && isOwner) return <Link to={linkTo}>{content}</Link>;
  return content;
};

const DisplayStars = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
  }
  return <div className="flex items-center gap-1">{stars}</div>;
};

const ReviewCard = ({ review }) => {
  const reviewer = review.user;
  if (!reviewer) return null;

  return (
    <div className="border-b py-4 last:border-b-0">
      <div className="flex items-start gap-4">
        <img src={reviewer.avatar_url} alt={reviewer.name} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{reviewer.name}</h4>
        </div>
      </div>
    </div>
  );
};

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!userId) {
        setError("لم يتم تحديد معرّف المستخدم في الرابط.");
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

        setProfile(profileRes.data);
        setServices(servicesRes.data);
        setProjects(projectsRes.data);
        setReviews(reviewsRes.data);

      } catch (err) {
        setError("لا يمكن العثور على المستخدم أو بياناته.");
        console.error("فشل في جلب البيانات:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [userId]);

  const isOwner = currentUser?.id === userId;

  const handleStartConversation = async () => {
    if (!profile || !currentUser) return;
    try {
      const conversation = await findOrCreateConversation(currentUser.id, profile.id);
      if (conversation) navigate(`/chat/${conversation.id}`);
    } catch (err) {
      console.error("فشل في بدء المحادثة:", err);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]">جاري تحميل الملف الشخصي...</div>;
  if (error) return <div className="flex items-center justify-center min-h-[60vh] text-red-500 p-4 text-center">{error}</div>;
  if (!profile) return <div className="flex items-center justify-center min-h-[60vh]">لا توجد بيانات لعرضها.</div>;

  const fullName = profile.name || `${profile.firstname} ${profile.lastname}`;
  const joinDate = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('ar-EG') : 'غير محدد';
  
  const verifications = {
    phone_verified: profile.verifications?.phone_verified || false,
    identity_verified: profile.verifications?.identity_verified || false,
  };

  const completionSteps = [
    { text: "التحقق من رقم الهاتف", completed: verifications.phone_verified, icon: <FiPhone className="text-cyan-600 text-xl" />, linkTo: "/verify/phone" },
    { text: "توثيق الهوية", completed: verifications.identity_verified, icon: <HiOutlineIdentification className="text-cyan-600 text-xl" />, linkTo: "/verify/identity" },
    { text: "أضف مهاراتك", completed: (profile.skills?.length || 0) > 0, icon: <FaStar className="text-cyan-600 text-xl" />, linkTo: "/edit-profile" },
    { text: "أضف أعمال لمعرضك", completed: projects.length > 0, icon: <FiBriefcase className="text-cyan-600 text-xl" />, linkTo: "/projects/new" },
    { text: "أضف أول خدمة لك", completed: services.length > 0, icon: <FiLayers className="text-cyan-600 text-xl" />, linkTo: "/add-service" },
  ];

  const completedCount = completionSteps.filter(step => step.completed).length;
  const completionPercentage = Math.round((completedCount / completionSteps.length) * 100);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">
          <aside className="md:sticky md:top-24 h-fit">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg -mt-16">
                <img src={profile.avatar_url} alt={fullName} className="w-full h-full object-cover" />
              </div>

              <h2 className="text-2xl font-bold text-neutral-800 text-center mt-4">{fullName}</h2>
              <p className="text-sm text-neutral-500 text-center mt-1">{profile.jobTitle || 'مستخدم جديد'}</p>
              
              <div className="flex justify-center items-center mt-3 gap-2">
                <DisplayStars rating={averageRating} />
                <span className="font-bold text-gray-700">{averageRating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({reviews.length} تقييم)</span>
              </div>

              <p className="text-sm text-neutral-600 text-center mt-3 border-t pt-3">
                <span className="font-semibold text-neutral-700">تاريخ الانضمام: </span>{joinDate}
              </p>

              <div className="mt-6">
                {isOwner ? (
                  <Link to="/edit-profile"
                    className="w-full flex items-center justify-center gap-2 bg-cyan-600 
                      text-white font-bold py-3 rounded-lg hover:bg-cyan-700 transition-colors">
                    <FiEdit /><span>تعديل الملف الشخصي</span>
                  </Link>
                ) : (
                  <button onClick={handleStartConversation} 
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white 
                      font-bold py-3 rounded-lg hover:bg-green-700 transition-colors"><FiMessageSquare />
                      <span>تواصل معي</span>
                  </button>
                )}
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            <div className="bg-white p-2 rounded-xl shadow-md border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-2 space-x-reverse">
                  <TabButton isActive={activeTab === 'overview'}
                    onClick={() => setActiveTab('overview')}>نظرة عامة
                  </TabButton>

                  <TabButton isActive={activeTab === 'services'} 
                    onClick={() => setActiveTab('services')}>الخدمات ({services.length})
                  </TabButton>
                  
                  <TabButton isActive={activeTab === 'portfolio'} 
                    onClick={() => setActiveTab('portfolio')}>معرض الأعمال ({projects.length})
                  </TabButton>

                  <TabButton isActive={activeTab === 'reviews'} 
                    onClick={() => setActiveTab('reviews')}>التقييمات ({reviews.length})
                  </TabButton>
                </nav>
              </div>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white p-6 rounded-xl shadow-md border">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">نبذة عني</h3>
                  <p className="text-gray-600 leading-relaxed">{profile.aboutYou || 'لا توجد نبذة شخصية بعد.'}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border">
                  <div className="flex items-center gap-2 mb-4 border-b pb-2">
                    <BsShieldLock className="text-cyan-600 text-xl" />
                    <h3 className="text-lg font-semibold text-cyan-700">توثيق الحساب</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaMobileAlt className="text-2xl text-neutral-600" />
                        <div>
                          <p className="font-semibold text-neutral-700">الهاتف المحمول</p>
                          <p className={`text-sm ${verifications.phone_verified ? 'text-green-600'
                            : 'text-neutral-500'}`}>{verifications.phone_verified ? 'موثّق' : 'لم يتم التوثيق بعد'}
                          </p>
                        </div>
                      </div>

                      {!verifications.phone_verified && isOwner && <Link to="/verify/phone"
                        className="text-cyan-600 text-sm hover:underline">توثيق الآن</Link>}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <HiOutlineIdentification className="text-2xl text-neutral-600" />
                        <div>
                          <p className="font-semibold text-neutral-700">الهوية</p>
                          <p className={`text-sm ${verifications.identity_verified ? 'text-green-600'
                            : 'text-neutral-500'}`}>{verifications.identity_verified ? 'موثّق' : 'لم يتم التوثيق بعد'}
                          </p>
                        </div>
                      </div>
                      
                      {!verifications.identity_verified && isOwner && <Link to="/verify/identity"
                        className="text-cyan-600 text-sm hover:underline">توثيق الآن</Link>}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border">
                  <div className="flex items-center gap-2 mb-4 border-b pb-2">
                    <BsClipboardCheck className="text-cyan-600 text-xl" />
                    <h2 className="text-cyan-700 text-lg font-semibold">إكمال الملف الشخصي</h2>
                  </div>

                  <div className="my-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-gray-700">نسبة الاكتمال</span>
                      <span className="text-sm font-bold text-cyan-600">{completionPercentage}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}>
                      </div>
                    </div>
                  </div>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-4">
                    {completionSteps.map((step, index) => (
                      <li key={index}><CompletionStep {...step} isOwner={isOwner} /></li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="bg-white p-6 rounded-xl shadow-md border animate-fade-in">
                <h3 className="text-lg font-semibold text-cyan-700 mb-4">خدمات يقدمها {profile.firstname}</h3>
                {services.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{services.map(service => <ServiceCard key={service.id} service={service} />)}</div> : <p className="text-gray-500 text-center py-8">لا توجد خدمات لعرضها حاليًا.</p>}
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="bg-white p-6 rounded-xl shadow-md border animate-fade-in">
                <h3 className="text-lg font-semibold text-cyan-700 mb-4">
                  أعمال ومشاريع {profile.firstname}
                </h3>

                {projects.length > 0 ?
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {projects.map(project => <ProjectCard key={project.id} project={project} />)}
                  </div>
                  : <p className="text-gray-500 text-center py-8">لا توجد مشاريع في معرض الأعمال حاليًا.</p>
                }
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white p-6 rounded-xl shadow-md border animate-fade-in">
                <h3 className="text-lg font-semibold text-cyan-700 mb-4">
                  تقييمات حصل عليها {profile.firstname}
                </h3>
                
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">لم يحصل هذا المستخدم على أي تقييمات بعد.</p>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
