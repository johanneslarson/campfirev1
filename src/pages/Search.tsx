import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getAllTracks, Track } from "../services/data";
import { PlaybackContext } from "../context/PlaybackContext";
import { FaIcons } from "../utils/icons";

function Search() {
  const [query, setQuery] = useState("");
  const { playTrack } = useContext(PlaybackContext);
  const allTracks = getAllTracks();
  
  const filteredTracks = query 
    ? allTracks.filter(track => 
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        track.artistName.toLowerCase().includes(query.toLowerCase()) ||
        track.genre.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-accent mb-6">Search</h1>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <FaIcons.FaSearch />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for tracks, artists, or genres"
          className="block w-full pl-10 pr-3 py-3 border border-dark-light rounded-spotify bg-dark-lighter text-accent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      {query && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-accent mb-4">Results</h2>
          
          {filteredTracks.length > 0 ? (
            <div className="bg-dark-lighter rounded-spotify overflow-hidden">
              <ul>
                {filteredTracks.map((track, index) => (
                  <li 
                    key={track.id}
                    className={`flex items-center justify-between p-4 hover:bg-dark-light transition-colors ${
                      index !== filteredTracks.length - 1 ? 'border-b border-dark' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="ml-4">
                        <p className="font-medium text-accent">{track.title}</p>
                        <p className="text-sm text-gray-300">
                          <Link to={`/artist/${track.artistId}`} className="hover:underline">
                            {track.artistName}
                          </Link>
                          <span className="mx-2">•</span>
                          <span>{track.genre}</span>
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => playTrack(track)} 
                      className="p-2 text-primary hover:text-primary-dark transition-colors"
                      aria-label={`Play ${track.title}`}
                    >
                      <FaIcons.FaPlay />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="italic text-gray-300 bg-dark-lighter p-4 rounded-spotify">
              No results found for "{query}".
            </p>
          )}
        </div>
      )}

      {!query && (
        <div className="mt-12 text-center">
          <p className="text-gray-300 text-lg">Type something to search for tracks, artists, or genres.</p>
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-accent mb-4">Try searching for:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {["Folk", "Blues", "Rock", "Classical"].map(genre => (
                <button
                  key={genre}
                  onClick={() => setQuery(genre)}
                  className="px-4 py-2 bg-dark-lighter rounded-full hover:bg-dark-light text-accent"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search; 