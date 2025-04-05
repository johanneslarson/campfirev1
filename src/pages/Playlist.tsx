import { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { PlaybackContext } from "../context/PlaybackContext";
import { getAllTracksSync, Track } from "../services/data";
import { FaIcons } from "../utils/icons";

// Simple playlist interface
interface Playlist {
  id: number;
  name: string;
  description: string;
  tracks: Track[];
}

// Mock playlist data - in a real app this would come from a service
const playlists: Playlist[] = [
  {
    id: 1,
    name: "My Favorites",
    description: "A collection of my favorite tracks",
    tracks: getAllTracksSync()
  }
];

function getPlaylistById(id: number): Playlist | undefined {
  return playlists.find(p => p.id === id);
}

function Playlist() {
  const { id } = useParams();
  const playlistId = id ? parseInt(id, 10) : 1; // Default to first playlist if no ID
  const playlist = getPlaylistById(playlistId);
  const { playTrack } = useContext(PlaybackContext);

  if (!playlist) {
    return <div className="p-8 text-center text-accent">Playlist not found.</div>;
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-8">
      {/* Playlist Header */}
      <div className="bg-gradient-to-r from-primaryDark to-primary rounded-campfire p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Playlist Cover Placeholder */}
        <div className="bg-dark-lighter w-40 h-40 rounded-md flex items-center justify-center text-primary">
          <FaIcons.FaMusic size={40} />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{playlist.name}</h1>
          <p className="text-accent">{playlist.description}</p>
          <p className="text-sm text-gray-300 mt-2">{playlist.tracks?.length || 0} tracks</p>
        </div>
      </div>

      {/* Tracks Section */}
      <section>
        <h2 className="sr-only">Tracks in playlist</h2>
        
        {playlist.tracks && playlist.tracks.length > 0 ? (
          <div className="bg-dark-lighter rounded-campfire overflow-hidden">
            <ul>
              {playlist.tracks.map((track: Track, index: number) => (
                <li 
                  key={track.id}
                  className={`flex items-center justify-between p-4 hover:bg-dark-light transition-colors ${
                    index !== playlist.tracks.length - 1 ? 'border-b border-dark' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-gray-300 w-8 text-right">{index + 1}</span>
                    <div className="ml-4">
                      <p className="font-medium text-accent">{track.title}</p>
                      <p className="text-sm text-gray-300">
                        <Link to={`/artist/${track.artist_id}`} className="hover:underline">
                          {track.artist_name}
                        </Link>
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
          <p className="italic text-gray-300 bg-dark-lighter p-4 rounded-campfire">
            This playlist is empty.
          </p>
        )}
      </section>
    </div>
  );
}

export default Playlist; 