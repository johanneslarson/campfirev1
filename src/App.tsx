import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
import Player from "./components/Player";
import Home from "./pages/Home";
import ArtistProfile from "./pages/ArtistProfile";
import Search from "./pages/Search";
import Playlist from "./pages/Playlist";
import RoyaltiesDashboard from "./pages/RoyaltiesDashboard";
import Settings from "./pages/Settings";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-dark text-accent">
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed top-0 left-0 h-full">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMenuOpen} toggleMenu={toggleMenu} closeMenu={closeMenu} />
      
      {/* Main Content */}
      <main className="flex-1 pb-28 md:ml-64 w-full pt-16 md:pt-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/dashboard" element={<RoyaltiesDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<div className="p-8 text-center text-accent">404 - Page Not Found</div>} />
        </Routes>
      </main>
      
      <Player />
    </div>
  );
}

export default App;
