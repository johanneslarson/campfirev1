import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaIcons } from "../utils/icons";

interface MobileSidebarProps {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

function MobileSidebar({ isOpen, toggleMenu, closeMenu }: MobileSidebarProps) {
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
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-dark-lighter text-white md:hidden z-30">
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
        style={{ paddingTop: '4rem' }} // Add space for the fixed header
      >
        <nav>
          <ul className="space-y-2 px-4 py-2">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 rounded-lg transition-colors ${
                    isActive ? 'bg-primaryDark text-white' : 'text-gray-300 hover:bg-dark-light hover:text-primaryLight'
                  }`
                }
                end
                onClick={closeMenu}
              >
                <FaIcons.FaHome className="mr-3" size={18} />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/artists" 
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 rounded-lg transition-colors ${
                    isActive ? 'bg-primaryDark text-white' : 'text-gray-300 hover:bg-dark-light hover:text-primaryLight'
                  }`
                }
                onClick={closeMenu}
              >
                <FaIcons.FaUserFriends className="mr-3" size={18} />
                <span>Artists</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/search" 
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 rounded-lg transition-colors ${
                    isActive ? 'bg-primaryDark text-white' : 'text-gray-300 hover:bg-dark-light hover:text-primaryLight'
                  }`
                }
                onClick={closeMenu}
              >
                <FaIcons.FaSearch className="mr-3" size={18} />
                <span>Search</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/playlist" 
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 rounded-lg transition-colors ${
                    isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-dark-light'
                  }`
                }
                onClick={closeMenu}
              >
                <FaIcons.FaListUl className="mr-3" size={18} />
                <span>Playlist</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 rounded-lg transition-colors ${
                    isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-dark-light'
                  }`
                }
                onClick={closeMenu}
              >
                <FaIcons.FaChartBar className="mr-3" size={18} />
                <span>Royalties</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/settings" 
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 rounded-lg transition-colors ${
                    isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-dark-light'
                  }`
                }
                onClick={closeMenu}
              >
                <FaIcons.FaCog className="mr-3" size={18} />
                <span>Settings</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/map" 
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 rounded-lg transition-colors ${
                    isActive ? 'bg-primaryDark text-white' : 'text-gray-300 hover:bg-dark-light hover:text-primaryLight'
                  }`
                }
                onClick={closeMenu}
              >
                <FaIcons.FaMap className="mr-3" size={18} />
                <span>Music Map</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default MobileSidebar; 