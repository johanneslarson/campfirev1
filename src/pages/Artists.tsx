import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlaybackContext } from "../context/PlaybackContext";
import { getAllArtists, getTracksByArtist, getAllArtistsSync, getTracksByArtistSync, Artist, Track, getIsInitialized } from "../services/data";
import { FaIcons } from "../utils/icons";

function Artists() {
  const { playTrack } = useContext(PlaybackContext);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artistTracks, setArtistTracks] = useState<Record<string, Track[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if data is initialized
        if (!getIsInitialized()) {
          console.log("Data not initialized yet, setting up interval check");
          const checkInterval = setInterval(() => {
            if (getIsInitialized()) {
              clearInterval(checkInterval);
              loadData();
            }
          }, 200);
          return;
        }

        // Get all artists
        const allArtists = await getAllArtists();
        console.log("Artists loaded:", allArtists);
        
        // Display all artists from the API
        setArtists(allArtists);
        
        // Get tracks for each artist and build a map
        const tracks: Record<string, Track[]> = {};
        for (const artist of allArtists) {
          try {
            const artistTracks = await getTracksByArtist(artist.id);
            // Remove duplicate tracks by ID
            const uniqueTracks = Array.from(
              new Map(artistTracks.map(track => [track.id, track])).values()
            );
            tracks[artist.id] = uniqueTracks;
          } catch (error) {
            console.error(`Error fetching tracks for artist ${artist.name}:`, error);
            tracks[artist.id] = [];
          }
        }

        // Sort artists by track count (ascending: fewest tracks first)
        const sortedArtists = [...allArtists].sort((a, b) => {
          const aCount = tracks[a.id]?.length || 0;
          const bCount = tracks[b.id]?.length || 0;
          if (aCount !== bCount) {
            return aCount - bCount;
          }
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });

        setArtistTracks(tracks);
        setArtists(sortedArtists);
      } catch (error) {
        console.error("Error loading artists:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primaryLight"></div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-10 pb-6 max-w-screen-xl mx-auto space-y-8">
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
                {artist.imageUrl ? (
                  <div className="w-16 h-16 min-w-[4rem] rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={artist.imageUrl} 
                      alt={`${artist.name}`} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="bg-dark-lighter w-16 h-16 min-w-[4rem] rounded-full flex items-center justify-center text-primaryLight flex-shrink-0">
                    <FaIcons.FaMusic size={24} />
                  </div>
                )}
                <div>
                  <Link to={`/artists/${artist.id}`} className="text-2xl font-bold text-accent hover:text-primaryLight transition-colors">
                    {artist.name}
                  </Link>
                  <p className="text-gray-400 text-sm">
                    {artist.bio 
                      ? (artist.bio.length > 150 
                          ? `${artist.bio.substring(0, 150)}...` 
                          : artist.bio)
                      : "No bio available"}
                  </p>
                </div>
              </div>
              
              {/* Tracks List */}
              <div className="bg-dark-lighter rounded-campfire overflow-hidden">
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
                          <span className="text-gray-300 w-4 text-center">{index + 1}</span>
                          <div className="ml-2">
                            <p className="font-medium text-accent">{track.title}</p>
                            <p className="text-sm text-gray-300">{track.genre}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handlePlayTrack(track)} 
                          className="p-2 text-primaryLight hover:text-primaryDark transition-colors"
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