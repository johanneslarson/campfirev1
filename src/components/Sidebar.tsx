import { NavLink } from "react-router-dom";
import { FaIcons } from "../utils/icons";

function Sidebar() {
  return (
    <aside className="w-64 bg-dark-lighter min-h-screen p-4">
      <div className="mb-5 mt-4 flex items-center justify-start pl-1">
        <img src="/assets/logo.png" alt="Campfire Logo" className="h-11 w-11 mr-2.5" />
        <span className="text-[34px] font-bold text-accent tracking-normal">Campfire</span>
      </div>
      
      <nav aria-label="Main Navigation">
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors text-[17px] ${
                  isActive ? 'bg-primaryDark text-white' : 'text-gray-300 hover:bg-dark-light hover:text-primaryLight'
                }`
              }
              end
            >
              <FaIcons.FaHome className="mr-3" size={19} />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/artists" 
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors text-[17px] ${
                  isActive ? 'bg-primaryDark text-white' : 'text-gray-300 hover:bg-dark-light hover:text-primaryLight'
                }`
              }
            >
              <FaIcons.FaUserFriends className="mr-3" size={19} />
              <span>Artists</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/map" 
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors text-[17px] ${
                  isActive ? 'bg-primaryDark text-white' : 'text-gray-300 hover:bg-dark-light hover:text-primaryLight'
                }`
              }
            >
              <FaIcons.FaMap className="mr-3" size={19} />
              <span>Music Map</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/search" 
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors text-[17px] ${
                  isActive ? 'bg-primaryDark text-white' : 'text-gray-300 hover:bg-dark-light hover:text-primaryLight'
                }`
              }
            >
              <FaIcons.FaSearch className="mr-3" size={19} />
              <span>Search</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/playlist" 
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors text-[17px] ${
                  isActive ? 'bg-primaryDark text-white' : 'text-gray-300 hover:bg-dark-light hover:text-primaryLight'
                }`
              }
            >
              <FaIcons.FaListUl className="mr-3" size={19} />
              <span>Playlist</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors text-[17px] ${
                  isActive ? 'bg-primaryDark text-white' : 'text-gray-300 hover:bg-dark-light hover:text-primaryLight'
                }`
              }
            >
              <FaIcons.FaChartBar className="mr-3" size={19} />
              <span>Royalties</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/settings" 
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors text-[17px] ${
                  isActive ? 'bg-primaryDark text-white' : 'text-gray-300 hover:bg-dark-light hover:text-primaryLight'
                }`
              }
            >
              <FaIcons.FaCog className="mr-3" size={19} />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar; 