import React from 'react';
import { Link } from 'react-router-dom';

const AuthButtons = ({ isAuthenticated, user, onLogout, isMobile = false }) => {
  if (isAuthenticated) {
    return (
      <div className={isMobile ? "space-y-3" : "hidden md:flex items-center gap-4"}>
        <Link to={`/profile/${user.id}`} className="flex items-center gap-2 group">
          <img src={user.avatar_url} alt={user.name} className={`object-cover rounded-full ${isMobile ? 'w-8 h-8' : 'w-9 h-9'} border-2 border-sky-200 group-hover:border-sky-400 transition`} />
          <span className={`font-medium group-hover:text-sky-700 transition ${isMobile ? 'text-neutral-800' : 'text-sm text-neutral-700'}`}>{user.name}</span>
        </Link>
        <button onClick={onLogout} className={`w-full text-left rounded-md ${isMobile ? 'p-2 text-red-600 hover:bg-red-50' : 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-base duration-300'}`}>
          تسجيل الخروج
        </button>
      </div>
    );
  }

  return (
    <div className={isMobile ? "space-y-3" : "hidden md:flex items-center gap-4"}>
      <Link to="/login" className={`focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded ${isMobile ? 'block w-full text-center py-2 px-4 rounded-md bg-sky-600 text-white' : 'text-base text-neutral-800 hover:text-sky-700 duration-300'}`}>
        تسجيل الدخول
      </Link>
      <Link to="/register" className={`focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isMobile ? 'block w-full text-center py-2 px-4 rounded-md bg-neutral-800 text-white' : 'px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-base duration-300 inline-block'}`}>
        اشترك الآن
      </Link>
    </div>
  );
};

export default AuthButtons;
