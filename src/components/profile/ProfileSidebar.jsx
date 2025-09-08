// src/components/profile/ProfileSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiMessageSquare } from "react-icons/fi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const DisplayStars = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
  }
  return <div className="flex items-center gap-1">{stars}</div>;
};

const ProfileSidebar = ({ profile, averageRating, reviewsCount, isOwner, onStartConversation }) => {
  const fullName = profile.name || `${profile.firstname || ''} ${profile.lastname || ''}`.trim();
  const joinDate = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('ar-EG') : 'غير محدد';

  return (
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
          <span className="text-sm text-gray-500">({reviewsCount} تقييم)</span>
        </div>
        <p className="text-sm text-neutral-600 text-center mt-3 border-t pt-3">
          <span className="font-semibold text-neutral-700">تاريخ الانضمام: </span>{joinDate}
        </p>
        <div className="mt-6">
          {isOwner ? (
            <Link to="/edit-profile" className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-3 rounded-lg hover:bg-cyan-700 transition-colors">
              <FiEdit /><span>تعديل الملف الشخصي</span>
            </Link>
          ) : (
            <button onClick={onStartConversation} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">
              <FiMessageSquare /><span>تواصل معي</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
