import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlaybackContext } from "../context/PlaybackContext";
import { getFeaturedTracks, getPlatformStats, getCommunityStories, Track, getIsInitialized } from "../services/data";
import { FaIcons } from "../utils/icons";

function Home() {
  const { playTrack } = useContext(PlaybackContext);
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [stats, setStats] = useState(getPlatformStats());
  const [stories, setStories] = useState(getCommunityStories());
  const [isReady, setIsReady] = useState(getIsInitialized());

  // Use effect to update when data is available
  useEffect(() => {
    // Check if data is initialized
    if (getIsInitialized()) {
      updateHomeData();
    } else {
      // Poll occasionally until data is initialized
      const checkInterval = setInterval(() => {
        if (getIsInitialized()) {
          clearInterval(checkInterval);
          updateHomeData();
          setIsReady(true);
        }
      }, 100);
      
      // Clean up interval on unmount
      return () => clearInterval(checkInterval);
    }
  }, []);
  
  const updateHomeData = () => {
    // Get tracks and update state
    getFeaturedTracks()
      .then(tracks => {
        console.log("Home: Updated featured tracks:", tracks);
        setFeaturedTracks(tracks);
      })
      .catch(err => {
        console.error("Error loading featured tracks:", err);
        setFeaturedTracks([]);
      });
    
    // Update stats
    setStats(getPlatformStats());
  };

  const handlePlayTrack = (track: Track) => {
    console.log("Home page: Playing track:", track);
    // Force a small delay to ensure context is ready
    setTimeout(() => {
      playTrack(track);
    }, 0);
  };

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primaryDark to-primaryLight rounded-spotify p-4 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">Welcome to Campfire</h1>
        <p className="text-lg sm:text-xl opacity-90">
          Ethical music streaming for artists and listeners
        </p>
      </div>

      {/* Featured Tracks Section */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-accent">Featured Tracks</h2>
        {featuredTracks.length === 0 ? (
          <div className="bg-dark-lighter rounded-spotify p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryLight mx-auto mb-4"></div>
            <p className="text-gray-400">Loading featured tracks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {featuredTracks.map(track => (
              <div key={track.id} className="bg-dark-lighter rounded-spotify overflow-hidden group relative">
                <div className="p-4 sm:p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg sm:text-xl mb-1 text-accent">{track.title}</h3>
                      <p className="text-gray-300 mb-1">
                        <Link to={`/artist/${track.artist_id}`} className="hover:text-primary">
                          {track.artist_name}
                        </Link>
                      </p>
                      <p className="text-sm text-gray-400">Genre: {track.genre}</p>
                    </div>
                    <button 
                      onClick={() => handlePlayTrack(track)}
                      className="bg-primaryLight hover:bg-primaryDark text-white p-3 rounded-full transition-all flex-shrink-0 transform hover:scale-105"
                      aria-label={`Play ${track.title}`}
                    >
                      <FaIcons.FaPlay size={14} />
                    </button>
                  </div>
                </div>
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                  onClick={() => handlePlayTrack(track)}
                >
                  <div className="bg-primaryLight hover:bg-primaryDark p-4 rounded-full">
                    <FaIcons.FaPlay className="text-white" size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Platform Statistics */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-accent">Platform Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-dark-lighter p-4 sm:p-6 rounded-spotify text-center">
              <p className="text-3xl sm:text-5xl font-bold text-primaryLight mb-1 sm:mb-2">{stat.value}</p>
              <p className="text-sm text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Community Stories */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-accent">Community Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {stories.map(story => (
            <blockquote key={story.author} className="bg-dark-lighter p-4 sm:p-6 rounded-spotify relative border-l-4 border-primaryLight">
              <p className="italic text-accent mb-3 sm:mb-4">{story.message}</p>
              <footer className="text-sm text-gray-300">— {story.author}</footer>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home; 