// src/components/layout/Navbar.jsx
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBookOpen, FiSearch } from "react-icons/fi";
import { FaBars } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import NavLinks from './NavLinks';
import AuthButtons from './AuthButtons';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  const lastScrollY = useRef(window.scrollY);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = useMemo(() => [
    { id: 1, name: 'الرئيسية', path: '/' },
    { id: 2, name: 'الخدمات', path: '/services' },
    { id: 3, name: 'المشاريع', path: '/projects' },
    { id: 4, name: 'أخرى', path: '/others' },
  ], []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      setHideNavbar(currentScrollY > lastScrollY.current && currentScrollY > 100);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const authProps = { isAuthenticated, user, onLogout: handleLogout };

  return (
    // التحسين الهيكلي: استخدام header بدلاً من nav
    <header className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${hideNavbar ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className={`flex items-center justify-between w-full h-20 px-2 md:px-16 transition-colors duration-300 border-b ${isScrolled ? 'bg-white/80 backdrop-blur-sm border-gray-200' : 'bg-transparent border-transparent'}`}>
        
        <div className="flex items-center gap-4">
          <Link to="/" className="text-lg font-semibold text-sky-700 flex items-center gap-x-2">
            <FiBookOpen size={24} />
          </Link>
          <div className="hidden md:block w-[200px]">
            <input type="search" placeholder="ابحث هنا..." className="w-full px-4 py-2 rounded-xl border bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-300 text-sm" />
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <NavLinks items={navItems} />
        </div>

        <div className="flex items-center gap-4">
          <AuthButtons {...authProps} />
          <div className="lg:hidden">
            <button onClick={() => setMenuOpen(true)} className="text-neutral-600" aria-label="فتح القائمة" aria-controls="sidebar-menu" aria-expanded={isMenuOpen}>
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </div>
      <MobileMenu isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} navItems={navItems} authProps={authProps} />
    </header>
  );
};

export default Navbar;
