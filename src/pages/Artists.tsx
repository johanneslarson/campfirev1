import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlaybackContext } from "../context/PlaybackContext";
import { getAllArtistsSync, getTracksByArtistSync, Artist, Track } from "../services/data";
import { FaIcons } from "../utils/icons";

function Artists() {
  const { playTrack } = useContext(PlaybackContext);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artistTracks, setArtistTracks] = useState<Record<string, Track[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get all artists and order them as specified
    const allArtists = getAllArtistsSync();
    
    // Define the order we want: SYM1, Patrick Amunson, Hans Larson Trio
    const orderedArtistIds = [
      "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f", // SYM1
      "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e", // Patrick Amunson
      "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"  // Hans Larson Trio
    ];
    
    // Sort artists according to our desired order
    const orderedArtists = [];
    for (const id of orderedArtistIds) {
      const artist = allArtists.find(a => a.id === id);
      if (artist) {
        orderedArtists.push(artist);
      }
    }
    
    setArtists(orderedArtists);
    
    // Get tracks for each artist
    const tracks: Record<string, Track[]> = {};
    for (const artist of orderedArtists) {
      tracks[artist.id] = getTracksByArtistSync(artist.id);
    }
    
    setArtistTracks(tracks);
    setLoading(false);
  }, []);

  const handlePlayTrack = (track: Track) => {
    console.log("Artists page: Playing track:", track);
    // Force a small delay to ensure context is ready
    setTimeout(() => {
      playTrack(track);
    }, 0);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-accent">Artists</h1>
      
      {artists.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No artists available</p>
        </div>
      ) : (
        <div className="space-y-12">
          {artists.map(artist => (
            <section key={artist.id} className="space-y-4">
              {/* Artist Header */}
              <div className="flex items-center space-x-4">
                <div className="bg-dark-lighter w-16 h-16 rounded-full flex items-center justify-center text-primary">
                  <FaIcons.FaMusic size={24} />
                </div>
                <div>
                  <Link to={`/artist/${artist.id}`} className="text-2xl font-bold text-accent hover:text-primary transition-colors">
                    {artist.name}
                  </Link>
                  <p className="text-gray-400 text-sm">{artist.bio}</p>
                </div>
              </div>
              
              {/* Tracks List */}
              <div className="bg-dark-lighter rounded-spotify overflow-hidden">
                {artistTracks[artist.id]?.length > 0 ? (
                  <ul>
                    {artistTracks[artist.id].map((track, index) => (
                      <li 
                        key={track.id}
                        className={`flex items-center justify-between p-4 hover:bg-dark-light transition-colors ${
                          index !== artistTracks[artist.id].length - 1 ? 'border-b border-dark' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-gray-300 w-8 text-right">{index + 1}</span>
                          <div className="ml-4">
                            <p className="font-medium text-accent">{track.title}</p>
                            <p className="text-sm text-gray-300">{track.genre}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handlePlayTrack(track)} 
                          className="p-2 text-primary hover:text-primaryDark transition-colors"
                          aria-label={`Play ${track.title}`}
                        >
                          <FaIcons.FaPlay />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-gray-300 p-4">
                    No tracks available for this artist yet.
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export default Artists; 