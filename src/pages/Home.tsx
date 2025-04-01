import { useContext } from "react";
import { Link } from "react-router-dom";
import { PlaybackContext } from "../context/PlaybackContext";
import { getFeaturedTracks, getPlatformStats, getCommunityStories } from "../services/data";
import { FaIcons } from "../utils/icons";

function Home() {
  const { playTrack } = useContext(PlaybackContext);
  const featuredTracks = getFeaturedTracks();
  const stats = getPlatformStats();
  const stories = getCommunityStories();

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primaryDark to-primary rounded-spotify p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome to Campfire</h1>
        <p className="text-xl opacity-90">
          Ethical music streaming for artists and listeners
        </p>
      </div>

      {/* Featured Tracks Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-accent">Featured Tracks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredTracks.map(track => (
            <div key={track.id} className="bg-dark-lighter rounded-spotify overflow-hidden">
              <div className="p-5">
                <h3 className="font-bold text-xl mb-1 text-accent">{track.title}</h3>
                <p className="text-gray-300 mb-1">
                  <Link to={`/artist/${track.artistId}`} className="hover:text-primary">
                    {track.artistName}
                  </Link>
                </p>
                <p className="text-sm text-gray-400">Genre: {track.genre}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Statistics */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-accent">Platform Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-dark-lighter p-6 rounded-spotify text-center">
              <p className="text-5xl font-bold text-primary mb-2">{stat.value}</p>
              <p className="text-sm text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Community Stories */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-accent">Community Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map(story => (
            <blockquote key={story.author} className="bg-dark-lighter p-6 rounded-spotify relative border-l-4 border-primary">
              <p className="italic text-accent mb-4">"{story.message}"</p>
              <footer className="text-sm text-gray-300">— {story.author}</footer>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home; 