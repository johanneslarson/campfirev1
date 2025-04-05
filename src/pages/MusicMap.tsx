import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { FaIcons } from "../utils/icons";

// Define US map topology JSON URL
const US_MAP_TOPO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// API URL
const API_URL = "http://localhost:8081/api";

// Mobile breakpoint
const MOBILE_BREAKPOINT = 768;

interface Community {
  name: string;
  artists: { id: string; name: string; }[];
}

interface ArtistDetail {
  id: string;
  name: string;
  bio?: string;
  imageUrl?: string;
}

// Marker coordinates for communities - explicitly typed as [number, number] tuples
const markers = [
  { name: "Twin Cities", coordinates: [-94.0, 45.5] as [number, number] }, // Moved further NW
  { name: "DMV", coordinates: [-77.8, 39.3] as [number, number] } // Moved further NW
];

const MusicMap: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [artistDetails, setArtistDetails] = useState<ArtistDetail[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Check if device is mobile on mount and window resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIsMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Set map as ready after initial render
  useEffect(() => {
    // Small delay to ensure map is fully rendered
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fetch community data from back-end
    const fetchCommunities = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/communities`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setCommunities(data);
        setError(null); // Clear any existing error when successful
      } catch (err) {
        console.error('Failed to load communities', err);
        
        // Create fallback data if API fails
        const fallbackData: Community[] = [
          {
            name: "Twin Cities",
            artists: [
              { id: "118809eb-e984-4d75-8de8-791d25de5b3a", name: "SYM1" },
              { id: "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0", name: "Patrick Amunson" },
              { id: "d7d9451b-695f-4a33-a214-1b3839bb2083", name: "Hans Larson Trio" }
            ]
          },
          {
            name: "DMV",
            artists: [
              { id: "5f767b5c-75e2-4246-9687-893be2cb3900", name: "Kiyan Saifi" }
            ]
          }
        ];
        
        setCommunities(fallbackData);
        // Only show error if fallback data isn't available or is empty
        if (!fallbackData || fallbackData.length === 0) {
          setError('Failed to load community data. Please try again later.');
        } else {
          setError(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCommunities();
  }, []);

  // Fetch detailed artist information for the selected community's artists
  useEffect(() => {
    if (!selectedCommunity) return;

    // Hardcoded artist details (normally would be fetched from API)
    const artistDetailsMap: Record<string, ArtistDetail> = {
      "118809eb-e984-4d75-8de8-791d25de5b3a": {
        id: "118809eb-e984-4d75-8de8-791d25de5b3a",
        name: "SYM1",
        bio: "Unsubscribed from reality as we know it, SYM1, (pronounced sim-ONE or si-MOAN) is a vocalist, producer, and performer using eurodance and alternative aesthetics to inspire a renaissance of early 2000s rave culture.",
        imageUrl: "/assets/artists/SYM1.png"
      },
      "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0": {
        id: "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0",
        name: "Patrick Amunson",
        bio: "Patrick Jae Amunson is a versatile musician and producer with a diverse background in rock, electronic, and classical-inspired music.",
        imageUrl: "/assets/artists/Patrick Amunson.jpeg"
      },
      "d7d9451b-695f-4a33-a214-1b3839bb2083": {
        id: "d7d9451b-695f-4a33-a214-1b3839bb2083",
        name: "Hans Larson Trio",
        bio: "The Hans Larson Trio is a jazz ensemble known for their innovative compositions and improvisational style. Led by drummer Hans Larson, the group explores the boundaries of traditional jazz.",
        imageUrl: "/assets/artists/Hans Larson Trio.jpeg"
      },
      "5f767b5c-75e2-4246-9687-893be2cb3900": {
        id: "5f767b5c-75e2-4246-9687-893be2cb3900",
        name: "Kiyan Saifi",
        bio: "Kiyan Saifi is an experimental guitarist who currently performs with DC-based bands: Red Sunflower, Opposite Tiger, Fateful Encounter, Sense Memory, as well as in a duo with his brother Teymour Saifi.",
        imageUrl: "/assets/artists/KiyanSaifi.jpg"
      }
    };

    const details = selectedCommunity.artists.map(artist => 
      artistDetailsMap[artist.id] || { id: artist.id, name: artist.name }
    );
    
    setArtistDetails(details);
    setShowPopup(true);
  }, [selectedCommunity]);

  // Handler for clicking a region marker
  const handleRegionClick = (regionName: string, e?: React.MouseEvent) => {
    // Prevent event bubbling if event exists
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const community = communities.find(c => c.name === regionName);
    setSelectedCommunity(community || null);
  };
  
  // Handler for closing the popup
  const handleClosePopup = (e?: React.MouseEvent) => {
    // Prevent event bubbling if event exists
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setShowPopup(false);
    // Don't reset selectedCommunity immediately to avoid flashing
    setTimeout(() => {
      if (!showPopup) setSelectedCommunity(null);
    }, 300);
  };

  const MapContent = (
    <>
      <Geographies geography={US_MAP_TOPO_URL}>
        {({ geographies }) => geographies.map(geo => (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            fill="#131211" // dark brand color
            stroke="#ed5a24" // primary orange for border lines
            strokeWidth={0.5}
            style={{
              default: {
                fill: "#131211",
                stroke: "#ed5a24",
                strokeWidth: 0.5,
                outline: "none"
              },
              hover: {
                fill: "#2a2826",
                stroke: "#ed5a24",
                strokeWidth: 0.5,
                outline: "none",
                cursor: "pointer"
              },
              pressed: {
                fill: "#af3f16",
                stroke: "#ed5a24",
                strokeWidth: 0.5,
                outline: "none"
              }
            }}
          />
        ))}
      </Geographies>
      
      {markers.map(({ name, coordinates }) => (
        <Marker key={name} coordinates={coordinates}>
          <g
            onClick={(e) => {
              e.preventDefault();
              handleRegionClick(name, e);
            }}
            className="cursor-pointer focus:outline-none"
          >
            <FaIcons.FaMapMarkerAlt color="#f1ead1" size={24} />
            <foreignObject
              x="-50"
              y="-40"
              width="100"
              height="30"
              className="pointer-events-auto"
            >
              <div 
                className="bg-accent text-primaryDark px-3 py-1 rounded-lg text-center text-sm w-full border border-primary cursor-pointer font-semibold outline-none focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleRegionClick(name, e);
                }}
                style={{ minWidth: '80px' }}
              >
                {name}
              </div>
            </foreignObject>
          </g>
        </Marker>
      ))}
    </>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryLight mx-auto mb-4"></div>
          <p className="text-lg">Loading Music Communities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 px-3 sm:p-4 relative">
      <h1 className="text-2xl sm:text-3xl font-bold mb-0 sm:mb-1 text-primaryLight pl-2 sm:pl-4 pt-0 sm:pt-6">Music Map</h1>
      
      {error && (
        <div className="bg-dark-lighter p-2 sm:p-3 rounded-lg mb-1 sm:mb-2 text-primaryLight mx-2 sm:mx-4">
          <p>{error}</p>
          <p className="mt-1 text-gray-300">Using fallback data instead.</p>
        </div>
      )}
      
      <p className="mb-1 sm:mb-4 text-gray-300 text-xs sm:text-base pl-2 sm:pl-4">Explore music communities across the United States and discover artists from each region.</p>
      
      <div 
        className="bg-dark-lighter p-0 rounded-lg overflow-hidden mx-2 sm:mx-4 mb-2" 
        style={{ 
          height: isMobile ? 'calc(100vh - 280px)' : 'calc(100vh - 160px)', 
          minHeight: isMobile ? '240px' : '400px',
          maxHeight: isMobile ? '400px' : 'none'
        }}
      >
        <ComposableMap 
          projection="geoAlbersUsa" 
          className={`w-full h-full ${mapReady ? 'opacity-100' : 'opacity-90'}`}
          style={{ transition: 'opacity 0.3s ease' }}
        >
          {isMobile ? (
            <ZoomableGroup 
              zoom={1.0} 
              center={[-82, 40]} 
              minZoom={1} 
              maxZoom={4}
              translateExtent={[[-100, -100], [800, 500]]}
              className="touch-none"
              style={{ pointerEvents: mapReady ? 'auto' : 'none' }}
            >
              {MapContent} 
            </ZoomableGroup>
          ) : (
            // Render directly without ZoomableGroup on desktop
            MapContent 
          )}
        </ComposableMap>
      </div>
      
      {showPopup && selectedCommunity && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4" 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={(e) => handleClosePopup(e)}
        >
          <div 
            className="bg-dark-lighter rounded-lg max-w-3xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-3 sm:p-4 border-b border-dark-light">
              <h2 className="text-xl sm:text-2xl font-bold text-primaryLight">
                {selectedCommunity.name} Music Scene
              </h2>
              <button onClick={handleClosePopup} className="text-accent hover:text-primaryLight text-xl">
                <FaIcons.FaTimes />
              </button>
            </div>
            
            <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(90vh-70px)] sm:max-h-[calc(80vh-80px)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {artistDetails.map(artist => (
                  <div key={artist.id} className="bg-dark p-3 sm:p-4 rounded-lg flex flex-col h-full">
                    <div className="flex items-center mb-2 sm:mb-3">
                      {artist.imageUrl ? (
                        <img 
                          src={artist.imageUrl} 
                          alt={artist.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg mr-3 sm:mr-4"
                        />
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-dark-light rounded-lg mr-3 sm:mr-4 flex items-center justify-center">
                          <FaIcons.FaUser size={36} className="text-accent" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-primaryLight mb-1">
                          {artist.name}
                        </h3>
                        <Link 
                          to={`/artist/${artist.id}`}
                          className="text-accent hover:text-primaryLight inline-flex items-center text-sm"
                        >
                          <span>Artist Profile</span>
                          <FaIcons.FaArrowRight className="ml-2" size={12} />
                        </Link>
                      </div>
                    </div>
                    
                    {artist.bio && (
                      <p className="text-accent text-xs sm:text-sm flex-grow mb-3 sm:mb-4">
                        {artist.bio}
                      </p>
                    )}
                    
                    <Link 
                      to={`/artist/${artist.id}`}
                      className="bg-primary hover:bg-primaryDark text-white py-2 px-4 rounded-lg text-center transition-colors mt-auto"
                    >
                      Listen to Tracks
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicMap; 