import React, { useEffect, useState } from 'react';
import { FiBookOpen, FiSearch } from "react-icons/fi";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { id: 1, name: 'الرئيسية', path: '/' },
    { id: 2, name: 'الخدمات', path: '/services' },
    { id: 3, name: 'المشاريع', path: '/projects' },
    { id: 4, name: 'أخرى', path: '/others' },
  ];

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 0);
      setHideNavbar(currentScrollY > lastScrollY && currentScrollY > 100);
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleNavbar = () => {
    setOpen(!open);
    setSearchOpen(false);
  };

  const closeNavbar = () => {
    setOpen(false);
    setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setOpen(false);
  };

  return (
    <nav className='mb-23'>
      <div
        id="navbar"
        className={`flex items-center justify-between w-full h-[8ch] backdrop-blur-sm px-4 md:px-16 
          fixed top-0 transition-all ease-in-out duration-300 z-50 border-b border-neutral-200
          ${isScrolled ? 'bg-sky-50/30 border-sky-200' : 'bg-transparent'}
          ${hideNavbar ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="flex items-center gap-4">
          <Link to="/" className="text-lg font-semibold text-sky-700 flex items-center gap-x-2 
          whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded">
            <FiBookOpen size={24} />
          </Link>

          <div className="flex items-center gap-2">
            <div className="md:hidden">
              {!searchOpen ? (
                <button onClick={toggleSearch} className="text-neutral-600 focus:outline-none 
                focus:ring-2 focus:ring-cyan-500 rounded" aria-label="فتح البحث">
                  <FiSearch size={24} />
                </button>
              ) : (
                <input type="search" name='search' autoFocus placeholder="ابحث هنا..." className="w-full px-4 py-2 
                  rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-sky-300
                  text-sm" onBlur={() => setSearchOpen(false)} aria-label="حقل البحث" />
              )}
            </div>

            <div className="hidden md:block w-[200px]">
              <input type="search" placeholder="ابحث هنا..."
                className="w-full px-4 py-2 rounded-xl border border-neutral-300 focus:outline-none 
                focus:ring-2 focus:ring-sky-300 text-sm" aria-label="حقل البحث" />
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <ul className="hidden lg:flex flex-row items-center gap-7 text-base text-neutral-700 font-normal">
            {navItems.map((item) => (
              <li key={item.id} className={`hover:text-sky-700 ease-in-out duration-300 text-xl font-bold 
                ${location.pathname === item.path ? 'text-sky-700' : 'text-neutral-600'} cursor-pointer`}>
                <Link to={item.path} className="focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded"
                  tabIndex={0} aria-current={location.pathname === item.path ? 'page' : undefined}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to={`/profile/${user.id}`} className="flex items-center gap-2 group">
                  <img src={user.avatar_url} alt={user.name} className="w-9 h-9 rounded-full object-cover 
                    border-2 border-sky-200 group-hover:border-sky-400 transition" />
                  <span className="text-sm font-medium text-neutral-700 group-hover:text-sky-700 transition">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-red-600 
                  hover:bg-red-700 text-white text-base duration-300">
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-base text-neutral-800 hover:text-sky-700 duration-300 
                  focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded" tabIndex={0}>
                  تسجيل الدخول
                </Link>
                
                <Link to="/signup" className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white 
                  text-base duration-300 inline-block focus:outline-none focus:ring-2 focus:ring-cyan-500" tabIndex={0}>
                  اشترك الآن
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            {!searchOpen && (
              <>
                {isAuthenticated ? (
                  <button onClick={toggleNavbar} className="text-neutral-600 focus:outline-none 
                    focus:ring-2 focus:ring-cyan-500 rounded" aria-label="فتح القائمة الجانبية">
                    <FaBars size={24} />
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="text-base text-neutral-800 hover:text-sky-700 duration-300 
                      focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded" tabIndex={0}>
                      تسجيل الدخول
                    </Link>
                    <Link to="/signup" className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white 
                      text-base duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500" tabIndex={0}>
                      اشترك الآن
                    </Link>
                    <button onClick={toggleNavbar} className="text-neutral-600 focus:outline-none 
                      focus:ring-2 focus:ring-cyan-500 rounded" aria-label="فتح القائمة الجانبية">
                      <FaBars size={24} />
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${open ? 'opacity-100 visible' : 'opacity-0 invisible'} 
      ${location.pathname === '/' ? 'bg-transparent' : 'bg-white/10'}`} onClick={closeNavbar} aria-hidden={open ? 'false' : 'true'} />

      {/* القائمة الجانبية */}
      <div className={`fixed top-2 right-0 h-full w-56 bg-neutral-100 z-50 transform transition-transform duration-300 md:hidden 
        ${open ? 'translate-x-0' : 'translate-x-full'}`} role="menu" aria-label="القائمة الجانبية">
        <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200">
          <Link to="/" className="text-lg font-semibold text-sky-700 flex items-center gap-x-2 
            focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded" tabIndex={0} aria-label="الرئيسية - المنصة اليمنية">
            <span>المنصة اليمنية</span>
            <FiBookOpen size={24} />
          </Link>
          <button onClick={toggleNavbar} className="text-neutral-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded"
            aria-label="إغلاق القائمة الجانبية">
            <IoMdClose size={24} />
          </button>
        </div>

        <ul className="flex flex-col gap-4 p-4 text-xl font-bold text-neutral-700">
          {navItems.map((item) => (
            <li key={item.id} className={`hover:text-sky-700 ease-in-out duration-300 
            ${location.pathname === item.path ? 'text-sky-700' : 'text-neutral-600'} cursor-pointer`}
              onClick={closeNavbar}>
              <Link to={item.path} className="focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded"
                tabIndex={0} aria-current={location.pathname === item.path ? 'page' : undefined}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-neutral-200">
          {isAuthenticated ? (
            <div className="space-y-3">
              <Link to={`/profile/${user.id}`} onClick={closeNavbar}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100">
                <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                <span className="font-medium text-neutral-800">{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="w-full text-left p-2 rounded-md text-red-600 hover:bg-red-50">
                تسجيل الخروج
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link to="/login" onClick={closeNavbar}
                className="block w-full text-center py-2 px-4 rounded-md bg-sky-600 text-white">
                تسجيل الدخول
              </Link>
              
              <Link to="/signup" onClick={closeNavbar} 
                className="block w-full text-center py-2 px-4 rounded-md bg-neutral-800 text-white">
                اشترك الآن
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
