import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const ServiceCard = ({ service, onDeleteDraft }) => {
  const navigate = useNavigate();

  if (!service) {
    return null; 
  }

  const handleCardClick = () => {
    if (service.isDraft) {
      navigate("/addservice", { state: { draft: true } });
    } else {
      navigate(`/services/${service.id}`);
    }
  };

  const getStars = (reviews = []) => {
    if (!reviews || reviews.length === 0) {
      return { stars: Array.from({ length: 5 }, (_, i) => <FaRegStar key={i} className="text-gray-300" />), avg: 0 };
    }

    const avg = reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;
    const stars = Array.from({ length: 5 }, (_, i) => {
      if (avg >= i + 1) return <FaStar key={i} className="text-yellow-400" />;
      if (avg >= i + 0.5) return <FaStarHalfAlt key={i} className="text-yellow-400" />;
      return <FaRegStar key={i} className="text-gray-300" />;
    });
    return { stars, avg };
  };

  const { stars, avg } = getStars(service.reviews);
  const totalReviews = service.reviews ? service.reviews.length : 0;

  const userName = service.user ? `${service.user.firstname} ${service.user.lastname}` : 'مستخدم غير معروف';

  return (
    <motion.div
      layout 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={handleCardClick}
      className={`relative flex flex-col bg-white rounded-xl shadow-md hover:shadow-cyan-100 
        transition-shadow duration-300 cursor-pointer overflow-hidden group border 
        ${service.isDraft ? "border-2 border-yellow-400" : "border-gray-200"}`}
    >
      {service.isDraft && (
        <div className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-md z-10">
          مسودة
        </div>
      )}

      <div className="w-full h-44 overflow-hidden">
        <img
            src={service.main_image_url || '/img/placeholder.png'}
            alt={`صورة عرض لخدمة ${service.title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer" 
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-md text-gray-800 mb-4 h-12 line-clamp-2 flex-grow">
          {service.title}
        </h3>
        
        <div className="mt-auto pt-3 border-t border-gray-100">
          {service.user && (
            <div className="flex items-center gap-2 mb-3">
              <img
                src={service.user.avatar_url}
                alt={userName}
                className="w-8 h-8 rounded-full border-2 border-white shadow"
              />
              <span className="text-gray-600 text-sm font-medium">{userName}</span>
            </div>
          )}

          <div className="flex items-center">
            {stars}
            <span className="text-xs text-gray-500 mr-1.5">
              {avg > 0 ? `${avg.toFixed(1)} (${totalReviews})` : "جديد"}
            </span>
          </div>
        </div>

        {service.isDraft && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteDraft();
            }}
            className="text-red-500 hover:text-red-700 text-xs font-semibold mt-2 text-right"
          >
            حذف المسودة
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ServiceCard;
