import { useState } from "react";
import { getAllTracksSync, Track } from "../services/data";

function PlaylistBuilder() {
  const allTracks = getAllTracksSync();
  const [playlist, setPlaylist] = useState<Track[]>([]);

  const handleAdd = (track: Track) => {
    // Avoid adding duplicates
    if (!playlist.find(t => t.id === track.id)) {
      setPlaylist([...playlist, track]);
    }
  };

  const handleRemove = (trackId: string) => {
    setPlaylist(playlist.filter(t => t.id !== trackId));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Build Your Playlist</h2>
      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* All Tracks list */}
        <div className="md:w-1/2 mb-6 md:mb-0">
          <h3 className="text-xl font-semibold mb-2">All Tracks</h3>
          <ul className="max-h-64 overflow-y-auto border p-2">
            {allTracks.map((track: Track) => (
              <li key={track.id} className="flex justify-between items-center py-1">
                <span>{track.title} – {track.artist_name}</span>
                <button 
                  onClick={() => handleAdd(track)} 
                  className="text-primary hover:underline"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Playlist (Selected tracks) */}
        <div className="md:w-1/2">
          <h3 className="text-xl font-semibold mb-2">Your Playlist</h3>
          <ul className="max-h-64 overflow-y-auto border p-2">
            {playlist.map((track: Track) => (
              <li key={track.id} className="flex justify-between items-center py-1">
                <span>{track.title} – {track.artist_name}</span>
                <button 
                  onClick={() => handleRemove(track.id)} 
                  className="text-primary hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
            {playlist.length === 0 && (
              <li className="text-sm text-gray-500">No tracks added yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PlaylistBuilder; 