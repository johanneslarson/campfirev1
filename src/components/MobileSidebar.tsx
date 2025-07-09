import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaIcons } from "../utils/icons";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface MobileSidebarProps {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

function MobileSidebar({ isOpen, toggleMenu, closeMenu }: MobileSidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Header Bar - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-dark-lighter text-white md:hidden z-30 border-b border-dark">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <img src="/assets/logo.png" alt="Campfire Logo" className="h-9 w-9 mr-2" />
          <span className="text-2xl font-bold text-accent">Campfire</span>
        </div>

        {/* Menu Button */}
        <button 
          className="text-accent hover:text-primary focus:outline-none transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <FaIcons.FaTimes size={24} /> : <FaIcons.FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar - Higher z-index than header */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-dark-lighter text-white transition-transform duration-300 ease-in-out z-50 md:hidden overflow-y-auto`}
      >
        <div className="p-4 flex items-center border-b border-dark">
            <img src="/assets/logo.png" alt="Campfire Logo" className="h-9 w-9 mr-2" />
            <span className="text-2xl font-bold text-accent">Campfire</span>
        </div>
        <nav>
          <ul className="space-y-2 px-4 py-2">
            <li>
              <Link
                to="/"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/' ? 'bg-dark text-white' : 'text-accent hover:text-white'
                }`}
                onClick={closeMenu}
              >
                <FaIcons.FaHome className="h-5 w-5 mr-3" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/artists"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname.startsWith('/artists') ? 'bg-dark text-white' : 'text-accent hover:text-white'
                }`}
                onClick={closeMenu}
              >
                <FaIcons.FaUsers className="h-5 w-5 mr-3" />
                <span>Artists</span>
              </Link>
            </li>
            <li>
              <Link
                to="/map"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/map' ? 'bg-dark text-white' : 'text-accent hover:text-white'
                }`}
                onClick={closeMenu}
              >
                <FaIcons.FaMap className="h-5 w-5 mr-3" />
                <span>Music Map</span>
              </Link>
            </li>
            <li>
              <Link
                to="/communities"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname.startsWith('/communities') ? 'bg-dark text-white' : 'text-accent hover:text-white'
                }`}
                onClick={closeMenu}
              >
                <FaIcons.FaUsers className="h-5 w-5 mr-3" />
                <span>Communities</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/dashboard' ? 'bg-dark text-white' : 'text-accent hover:text-white'
                }`}
                onClick={closeMenu}
              >
                <FaIcons.FaDollarSign className="h-5 w-5 mr-3" />
                <span>Royalties</span>
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/settings' ? 'bg-dark text-white' : 'text-accent hover:text-white'
                }`}
                onClick={closeMenu}
              >
                <FaIcons.FaCog className="h-5 w-5 mr-3" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default MobileSidebar; 