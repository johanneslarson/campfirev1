import { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/logo.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-accentDark text-white p-4 flex items-center justify-between">
      {/* Logo and Brand Name */}
      <div className="flex items-center">
        <img src={logoImage} alt="Campfire Logo" className="h-8 w-8 mr-2" />
        <span className="text-xl font-bold">Campfire</span>
      </div>

      {/* Menu button for mobile */}
      <button 
        className="md:hidden text-white text-xl" 
        aria-label="Toggle navigation menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* Navigation Links */}
      <nav 
        className={`absolute md:static top-full left-0 w-full md:w-auto bg-accentDark md:bg-transparent 
                   ${menuOpen ? "block" : "hidden"} md:block mt-2 md:mt-0`}
        aria-label="Main Navigation"
      >
        <ul className="md:flex md:space-x-6">
          <li><Link to="/" className="block px-4 py-2 hover:text-primary">Home</Link></li>
          <li><Link to="/search" className="block px-4 py-2 hover:text-primary">Search</Link></li>
          <li><Link to="/playlist" className="block px-4 py-2 hover:text-primary">Playlist</Link></li>
          <li><Link to="/dashboard" className="block px-4 py-2 hover:text-primary">Royalties</Link></li>
          <li><Link to="/settings" className="block px-4 py-2 hover:text-primary">Settings</Link></li>
        </ul>
      </nav>

      <div className="absolute right-0 mt-2 w-48 bg-dark-lighter rounded-md shadow-lg py-1 z-50">
        <ul>
          <li><Link to="/profile" className="block px-4 py-2 hover:text-primary">Profile</Link></li>
          <li><Link to="/settings" className="block px-4 py-2 hover:text-primary">Settings</Link></li>
          <li><hr className="my-1 border-dark" /></li>
          <li><button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:text-primary">Logout</button></li>
        </ul>
      </div>
    </header>
  );
}

export default Header; 