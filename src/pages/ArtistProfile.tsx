import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PlaybackContext } from "../context/PlaybackContext";
import { getArtistById, getTracksByArtist, getArtistByIdSync, getTracksByArtistSync } from "../services/data";
import { FaIcons } from "../utils/icons";
import { Artist, Track } from "../services/data";

function ArtistProfile() {
  const { id } = useParams<{ id: string }>();
  const { playTrack } = useContext(PlaybackContext);
  
  const [artist, setArtist] = useState<Artist | undefined>(id ? getArtistByIdSync(id) : undefined);
  const [tracks, setTracks] = useState<Track[]>(id ? getTracksByArtistSync(id) : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError("Artist ID is missing");
        setLoading(false);
        return;
      }
      
      try {
        const artistData = await getArtistById(id);
        if (!artistData) {
          setError("Artist not found");
          setLoading(false);
          return;
        }
        
        setArtist(artistData);
        const trackData = await getTracksByArtist(id);
        setTracks(trackData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading artist data:", err);
        setError("Failed to load artist data");
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);
  
  const handlePlayTrack = (track: Track) => {
    console.log("ArtistProfile page: Playing track:", track);
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
  
  if (error || !artist) {
    return <div className="p-8 text-center text-accent">{error || "Artist not found"}</div>;
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-8">
      {/* Artist Header */}
      <div className="bg-gradient-to-r from-primaryDark to-primary rounded-spotify p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Artist Avatar Placeholder */}
        <div className="bg-dark-lighter w-32 h-32 rounded-full flex items-center justify-center text-primary">
          <FaIcons.FaMusic size={40} />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{artist.name}</h1>
          <p className="text-accent">{artist.bio}</p>
        </div>
      </div>

      {/* Tracks Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-accent">
          {tracks.length > 0 ? `Tracks by ${artist.name}` : "No tracks available"}
        </h2>
        
        {tracks.length > 0 ? (
          <div className="bg-dark-lighter rounded-spotify overflow-hidden">
            <ul>
              {tracks.map((track, index) => (
                <li 
                  key={track.id}
                  className={`flex items-center justify-between p-4 hover:bg-dark-light transition-colors ${
                    index !== tracks.length - 1 ? 'border-b border-dark' : ''
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
          </div>
        ) : (
          <p className="italic text-gray-300 bg-dark-lighter p-4 rounded-spotify">
            No tracks available for this artist yet.
          </p>
        )}
      </section>
    </div>
  );
}

export default ArtistProfile; 