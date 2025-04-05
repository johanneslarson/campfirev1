import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
import Player from "./components/Player";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import ArtistProfile from "./pages/ArtistProfile";
import Search from "./pages/Search";
import Playlist from "./pages/Playlist";
import RoyaltiesDashboard from "./pages/RoyaltiesDashboard";
import Settings from "./pages/Settings";
import MusicMap from "./pages/MusicMap";
import { initializeData } from "./services/data";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  // Initialize data from the backend
  useEffect(() => {
    const loadData = async () => {
      try {
        await initializeData();
      } catch (err) {
        console.error("Failed to initialize data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

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
        {isLoading ? (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryLight mx-auto mb-4"></div>
              <p className="text-lg">Loading Campfire...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center p-6 max-w-md">
              <div className="text-primaryLight text-5xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
              <p className="mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-primaryLight hover:bg-primaryDark text-white px-4 py-2 rounded transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artist/:id" element={<ArtistProfile />} />
            <Route path="/map" element={<MusicMap />} />
            <Route path="/search" element={<Search />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/dashboard" element={<RoyaltiesDashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<div className="p-8 text-center text-accent">404 - Page Not Found</div>} />
          </Routes>
        )}
      </main>
      
      <Player />
    </div>
  );
}

export default App;
