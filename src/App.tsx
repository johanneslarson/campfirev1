import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
import Player from "./components/Player";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import ArtistProfile from "./pages/ArtistProfile";
import Communities from "./pages/Communities";
import RoyaltiesDashboard from "./pages/RoyaltiesDashboard";
import { initializeData } from "./services/data";
import Header from "./components/Header";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  
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
    <Router>
      <div className="flex h-screen bg-dark text-white">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} closeMenu={closeMobileMenu} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleMobileMenu={toggleMobileMenu} />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/artists/:id" element={<ArtistProfile />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/dashboard" element={<RoyaltiesDashboard />} />
            </Routes>
          </main>

          {/* Player */}
          <Player />
        </div>
      </div>
    </Router>
  );
}

export default App;
