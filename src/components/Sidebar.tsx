import { NavLink } from "react-router-dom";
import { FaIcons } from "../utils/icons";

function Sidebar() {
  return (
    <aside className="w-64 bg-dark-lighter min-h-screen p-4">
      <div className="mb-8 flex items-center">
        <img src="/assets/logo.png" alt="Campfire Logo" className="h-10 w-10 mr-3" />
        <span className="text-xl font-bold text-white">Campfire</span>
      </div>
      
      <nav aria-label="Main Navigation">
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-dark-light hover:text-white'
                }`
              }
              end
            >
              <FaIcons.FaHome className="mr-3" size={18} />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/artists" 
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-dark-light hover:text-white'
                }`
              }
            >
              <FaIcons.FaUserFriends className="mr-3" size={18} />
              <span>Artists</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/search" 
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-dark-light hover:text-white'
                }`
              }
            >
              <FaIcons.FaSearch className="mr-3" size={18} />
              <span>Search</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/playlist" 
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-dark-light hover:text-white'
                }`
              }
            >
              <FaIcons.FaListUl className="mr-3" size={18} />
              <span>Playlist</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-dark-light hover:text-white'
                }`
              }
            >
              <FaIcons.FaChartBar className="mr-3" size={18} />
              <span>Royalties</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/settings" 
              className={({ isActive }) =>
                `flex items-center py-2 px-4 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-dark-light hover:text-white'
                }`
              }
            >
              <FaIcons.FaCog className="mr-3" size={18} />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar; 