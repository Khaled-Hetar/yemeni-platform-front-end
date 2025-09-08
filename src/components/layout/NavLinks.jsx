import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavLinks = ({ items, onItemClick, isMobile = false }) => {
  const location = useLocation();

  const mobileItemClass = "hover:text-sky-700 ease-in-out duration-300 text-xl font-bold cursor-pointer";
  const desktopItemClass = "hover:text-sky-700 ease-in-out duration-300 text-xl font-bold cursor-pointer";

  return (
    <ul className={isMobile ? "flex flex-col gap-4 p-4" : "hidden lg:flex flex-row items-center gap-7"}>
      {items.map((item) => (
        <li
          key={item.id}
          className={`${isMobile ? mobileItemClass : desktopItemClass} ${location.pathname === item.path ? 'text-sky-700' : 'text-neutral-600'}`}
          onClick={onItemClick}
        >
          <Link to={item.path} className="focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded" tabIndex={0} aria-current={location.pathname === item.path ? 'page' : undefined}>
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
