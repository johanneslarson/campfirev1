import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaIcons } from '../utils/icons';
import { getAllArtists, Artist, getAllCommunities, Community } from '../services/data';

interface ArtistDetail extends Artist {
  communityName?: string;
  genres?: string[];
}

const Communities: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [artistDetails, setArtistDetails] = useState<Record<string, ArtistDetail>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);

  useEffect(() => {
    // Load community data from static JSON
    const loadCommunities = async () => {
      try {
        setIsLoading(true);
        const data = getAllCommunities();
        setCommunities(data);
      } catch (err) {
        console.error('Failed to load communities:', err);
        setError('Failed to load communities data.');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Load artist details
    const loadArtistDetails = async () => {
      try {
        const allArtists = await getAllArtists();
        const artistsMap: Record<string, ArtistDetail> = {};
        
        allArtists.forEach(artist => {
          artistsMap[artist.id] = { ...artist };
        });
        
        setArtistDetails(artistsMap);
      } catch (err) {
        console.error('Failed to load artist details:', err);
      }
    };
    
    loadCommunities();
    loadArtistDetails();
  }, []);

  // Set initial selected community (first one in the list)
  useEffect(() => {
    if (communities.length > 0 && !selectedCommunity) {
      setSelectedCommunity(communities[0].name);
    }
  }, [communities, selectedCommunity]);

  const handleCommunitySelect = (communityName: string) => {
    setSelectedCommunity(communityName);
  };

  const selectedCommunityData = communities.find(c => c.name === selectedCommunity);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold mb-8 text-accent">Artist Communities</h1>
      
      {error && (
        <div className="bg-red-900 text-white p-4 rounded-md mb-8">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Community Navigation - Left Side */}
        <div className="order-last md:order-first">
          <div className="bg-dark-lighter rounded-xl p-5 mb-6">
            <h2 className="text-xl font-bold mb-4 text-accent">Communities</h2>
            <ul className="space-y-2">
              {communities.map(community => (
                <li key={community.name}>
                  <button
                    onClick={() => handleCommunitySelect(community.name)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center ${
                      selectedCommunity === community.name
                        ? 'bg-primaryDark text-white'
                        : 'hover:bg-dark-light text-gray-300 hover:text-primaryLight'
                    }`}
                  >
                    <FaIcons.FaMapMarkerAlt className="mr-2" />
                    <span>{community.name}</span>
                    <span className="ml-auto bg-dark text-accent rounded-full px-2 py-0.5 text-xs">
                      {community.artists.length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-dark-lighter rounded-xl p-5">
            <h2 className="text-xl font-bold mb-4 text-accent">About Communities</h2>
            <p className="text-gray-300 text-sm">
              Campfire supports local music scenes by organizing artists into geographic communities.
              Discover new artists from specific regions and support your local music ecosystem.
            </p>
            <div className="mt-4">
              <Link to="/map" className="flex items-center text-primaryLight hover:text-primary transition-colors">
                <FaIcons.FaMap className="mr-2" />
                <span>View Music Map</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Artist Grid - Right Side */}
        <div className="md:col-span-2">
          <div className="bg-dark-lighter rounded-xl p-5">
            <h2 className="text-2xl font-bold mb-6 text-accent flex items-center">
              <FaIcons.FaMapMarkerAlt className="mr-2 text-primaryLight" />
              {selectedCommunityData?.name || 'Select a Community'}
              <span className="text-sm font-normal ml-2 text-gray-400">
                ({selectedCommunityData?.artists.length || 0} artists)
              </span>
            </h2>
            
            {selectedCommunityData && selectedCommunityData.artists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCommunityData.artists.map(artist => {
                  const artistDetail = artistDetails[artist.id];
                  return (
                    <Link 
                      key={artist.id}
                      to={`/artist/${artist.id}`}
                      className="bg-dark rounded-lg overflow-hidden hover:shadow-lg transition-shadow hover:opacity-90"
                    >
                      <div className="h-56 overflow-hidden">
                        <img
                          src={artistDetail?.imageUrl || `/assets/artists/${artist.name.replace(/ /g, '')}.jpg`}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/default-artist.jpg';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-accent">{artist.name}</h3>
                        {artistDetail?.genres && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {artistDetail.genres.slice(0, 2).map((genre: string, idx: number) => (
                              <span 
                                key={idx}
                                className="text-xs bg-primaryDark bg-opacity-30 text-primaryLight px-2 py-1 rounded-full"
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                <FaIcons.FaUserFriends size={48} className="mb-4 opacity-50" />
                <p>No artists found in this community.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communities; 