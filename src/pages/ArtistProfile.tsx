import { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { PlaybackContext } from "../context/PlaybackContext";
import { getArtistById, getTracksByArtist } from "../services/data";
import { FaIcons } from "../utils/icons";

function ArtistProfile() {
  const { id } = useParams(); 
  const artistId = id ? parseInt(id, 10) : NaN;
  const artist = getArtistById(artistId);
  const { playTrack } = useContext(PlaybackContext);

  if (!artist) {
    return <div className="p-8 text-center text-accent">Artist not found.</div>;
  }

  const tracks = getTracksByArtist(artist.id);

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
            No tracks available for this artist yet.
          </p>
        )}
      </section>
    </div>
  );
}

export default ArtistProfile; 