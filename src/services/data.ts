// src/services/data.ts

// Define interfaces for data types
export interface Artist {
  id: string;
  name: string;
  bio?: string;
  imageUrl?: string; // Optional profile image URL
  links?: ArtistLink[]; // Optional array of links
}

export interface Track {
  id: string;
  title: string;
  artist_id: string;
  artist_name: string;
  genre: string;
  url: string;
  file_type: string;
}

export interface CommunityStory {
  author: string;
  message: string;
}

export interface RoyaltyReport {
  totalMinutes: number;
  totalAmount: number;
  breakdown: [string, number][];  // [artistName, amount] pairs
}

export interface UserProfile {
  name: string;
  email: string;
  isArtist: boolean;
}

// Define a new interface for artist links
export interface ArtistLink {
  label: string;
  url: string;
}

interface DetailedArtist {
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
  links?: Array<{ label: string; url: string }>;
}

// API URL
const API_URL = "http://localhost:8081/api";

// Local cache for data to avoid multiple fetches
let artistsCache: Artist[] = [];
let tracksCache: Track[] = [];
let isInitialized = false;

// Community stories (static for now)
const communityStories: CommunityStory[] = [
  { author: "Jane D.", message: "Campfire introduced me to amazing indie artists I would have never found!" },
  { author: "Sam G.",  message: "I love how Campfire shows exactly where my money goes. Transparency is key!" },
  { author: "Mike R.", message: "The Hans Larson Trio's 'Spain' remake blew me away! So glad I found them on Campfire." }
];

// Initial user profile
const initialUser: UserProfile = {
  name: "Alice Example",
  email: "alice@example.com",
  isArtist: false
};

// Error handler
const handleApiError = (error: any) => {
  console.error("API Error:", error);
  return null;
};

// Export the initialization state
export function getIsInitialized(): boolean {
  return isInitialized;
}

// Fetch all tracks
export async function getAllTracks(): Promise<Track[]> {
  if (tracksCache.length > 0) {
    return tracksCache;
  }
  
  try {
    console.log("Fetching tracks from API...");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_URL}/tracks`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const tracks: Track[] = await response.json();
    console.log(`Fetched ${tracks.length} tracks`);
    
    // Normalize URLs to use the full localhost prefix
    const normalizedTracks = tracks.map(track => {
      // If the URL already starts with http, leave it as is
      if (track.url.startsWith('http')) {
        return track;
      }
      
      // Otherwise, add the full hostname
      return {
        ...track,
        url: `http://localhost:8080${track.url.startsWith('/') ? '' : '/'}${track.url}`
      };
    });
    
    tracksCache = normalizedTracks;
    return normalizedTracks;
  } catch (error) {
    console.error("Failed to fetch tracks:", error);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out while fetching tracks");
    }
    throw error; // Re-throw to allow the caller to handle it
  }
}

// Synchronous version that uses cache or returns empty array
export function getAllTracksSync(): Track[] {
  return tracksCache;
}

// Get featured tracks (a curated selection)
export function getFeaturedTracks(): Promise<Track[]> {
  return new Promise((resolve, reject) => {
    // First, ensure we have loaded all tracks
    getAllTracks()
      .then((tracks) => {
        // Filter specifically chosen tracks for the featured section
        const featuredTrackIds = [
          "7b3037e3-6d71-46f8-8a6f-90a02fd0669b", // Right 1 4 Me by SYM1
          "d69762e0-536c-4be3-97a9-6505785d675c", // Live at Rhizome by Kiyan Saifi
          "6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c"  // Touch Earth Touch Sky by Hans Larson Trio
        ];
        
        const featuredTracks = tracks.filter(track => 
          featuredTrackIds.includes(track.id)
        );
        
        // Sort tracks in the same order as featuredTrackIds
        const orderedFeaturedTracks = featuredTrackIds
          .map(id => featuredTracks.find(track => track.id === id))
          .filter((track): track is Track => track !== undefined);
        
        console.log("Featured tracks:", orderedFeaturedTracks);
        
        if (orderedFeaturedTracks.length === 0) {
          console.warn("No featured tracks found, check IDs");
        }
        
        resolve(orderedFeaturedTracks);
      })
      .catch(err => {
        console.error("Error getting featured tracks:", err);
        reject(err);
      });
  });
}

// Synchronous version for initial render
export function getFeaturedTracksSync(): Track[] {
  const allTracks = getAllTracksSync();
  
  if (allTracks.length === 0) {
    return [];
  }
  
  const featuredTrackIds = [
    "7b3037e3-6d71-46f8-8a6f-90a02fd0669b", // Right 1 4 Me by SYM1
    "d69762e0-536c-4be3-97a9-6505785d675c", // Live at Rhizome by Kiyan Saifi
    "6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c"  // Touch Earth Touch Sky by Hans Larson Trio
  ];
  
  const featuredTracks = allTracks.filter(track => 
    featuredTrackIds.includes(track.id)
  );
  
  // Sort tracks in the same order as featuredTrackIds
  return featuredTrackIds
    .map(id => featuredTracks.find(track => track.id === id))
    .filter((track): track is Track => track !== undefined);
}

// Fetch all artists
export async function getAllArtists(): Promise<Artist[]> {
  if (artistsCache.length > 0) {
    return artistsCache;
  }
  
  try {
    console.log("Fetching artists from API...");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_URL}/artists`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const artists: Artist[] = await response.json();
    console.log(`Fetched ${artists.length} artists`);
    artistsCache = artists;
    return artists;
  } catch (error) {
    console.error("Failed to fetch artists:", error);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out while fetching artists");
    }
    throw error; // Re-throw to allow the caller to handle it
  }
}

// Synchronous version that uses cache or returns empty array
export function getAllArtistsSync(): Artist[] {
  return artistsCache;
}

// Get artist by ID
export async function getArtistById(id: string): Promise<Artist | undefined> {
  try {
    // First check cache
    if (artistsCache.length > 0) {
      const cachedArtist = artistsCache.find(a => a.id === id);
      if (cachedArtist) {
        return cachedArtist;
      }
    }
    
    // If not in cache, fetch from API
    const response = await fetch(`${API_URL}/artists/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch artist with ID ${id}:`, error);
    return undefined;
  }
}

// Synchronous version that only uses cache
export function getArtistByIdSync(id: string): Artist | undefined {
  return artistsCache.find(a => a.id === id);
}

// Get tracks by artist ID
export async function getTracksByArtist(artistId: string): Promise<Track[]> {
  try {
    // First check cache
    if (tracksCache.length > 0) {
      const cachedTracks = tracksCache.filter(t => t.artist_id === artistId);
      if (cachedTracks.length > 0) {
        return cachedTracks;
      }
    }
    
    // If not in cache, fetch from API
    const response = await fetch(`${API_URL}/artists/${artistId}/tracks`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch tracks for artist ${artistId}:`, error);
    return [];
  }
}

// Synchronous version that only uses cache
export function getTracksByArtistSync(artistId: string): Track[] {
  return tracksCache.filter(t => t.artist_id === artistId);
}

// Get platform stats
export function getPlatformStats(): { label: string, value: number }[] {
  return [
    { label: "Artists", value: artistsCache.length },
    { label: "Tracks", value: tracksCache.length }
  ];
}

// Get community stories
export function getCommunityStories(): CommunityStory[] {
  return communityStories;
}

// Get user royalty report
export function getUserRoyaltyReport(): RoyaltyReport {
  // Get all tracks to calculate listening shares
  const tracks = getAllTracksSync();
  
  // Filter out Hans Larson Trio tracks
  const royaltyTracks = tracks.filter(track => 
    track.artist_id !== "d7d9451b-695f-4a33-a214-1b3839bb2083"
  );
  
  // Monthly subscription amount (reduced from $10)
  const monthlyAmount = 8.50;
  
  // Define artist IDs for reference
  const sym1Id = "118809eb-e984-4d75-8de8-791d25de5b3a";
  const patrickId = "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0";
  const kiyanId = "5f767b5c-75e2-4246-9687-893be2cb3900";
  
  // Set custom distribution percentages to ensure SYM1 gets most
  const distribution: Record<string, number> = {
    [sym1Id]: 0.45,    // SYM1 gets 45%
    [patrickId]: 0.40, // Patrick gets 40%
    [kiyanId]: 0.15    // Kiyan gets 15%
  };
  
  const adjustedTotalListeningTime = 62.57; // Keep the same total minutes
  
  // Calculate artist listening time based on distribution
  const artistListeningTime: Record<string, number> = {};
  Object.keys(distribution).forEach(artistId => {
    artistListeningTime[artistId] = adjustedTotalListeningTime * distribution[artistId];
  });
  
  // Calculate artist payouts based on their share
  const breakdown: [string, number][] = [];
  const artists = getAllArtistsSync().filter(artist => 
    artist.id !== "d7d9451b-695f-4a33-a214-1b3839bb2083"
  );
  
  artists.forEach(artist => {
    const listeningTime = artistListeningTime[artist.id] || 0;
    // Artist's payout is proportional to their share of total listening time
    const amount = (listeningTime / adjustedTotalListeningTime) * monthlyAmount;
    breakdown.push([artist.name, amount]);
  });
  
  // Sort breakdown by amount (descending)
  breakdown.sort((a, b) => b[1] - a[1]);
  
  return {
    totalMinutes: adjustedTotalListeningTime,
    totalAmount: monthlyAmount,
    breakdown
  };
}

// Get user profile
export function getUserProfile(): UserProfile {
  return initialUser;
}

// Initialize data by pre-fetching
export async function initializeData(): Promise<void> {
  try {
    // Reset initialization state
    isInitialized = false;
    
    // Reset caches to ensure fresh data
    artistsCache = [];
    tracksCache = [];
    
    console.log("Starting data initialization");
    
    // Create detailed fallback data for artists with complete bios and images
    const detailedArtists: Artist[] = [
      {
        id: "118809eb-e984-4d75-8de8-791d25de5b3a",
        name: "SYM1",
        bio: "Unsubscribed from reality as we know it, SYM1, (pronounced sim-ONE or si-MOAN) is a vocalist, producer, and performer using eurodance and alternative aesthetics to inspire a renaissance of early 2000s rave culture. Additionally, she is a independent label owner and strong advocate for arts and musicians rights.",
        imageUrl: "/assets/artists/SYM1.png",
        links: [
          { label: "Website", url: "https://www.no1butsym1.com/" },
          { label: "Bandcamp", url: "https://no1butsym1.bandcamp.com/" },
          { label: "Apple Music", url: "/sym1" },
          { label: "Spotify", url: "https://open.spotify.com/artist/2nVVn..." },
          { label: "Deezer", url: "https://www.deezer.com/us/artist/5901..." },
          { label: "Instagram", url: "https://www.instagram.com/no1butsym1" }
        ]
      },
      {
        id: "5f767b5c-75e2-4246-9687-893be2cb3900",
        name: "Kiyan Saifi",
        bio: "Kiyan Saifi is an experimental guitarist who currently performs with DC-based bands: Red Sunflower, Opposite Tiger, Fateful Encounter, Sense Memory, as well as in a duo with his brother Teymour Saifi.",
        imageUrl: "/assets/artists/KiyanSaifi.jpg",
        links: [
          { label: "Instagram", url: "https://www.instagram.com/kiyansaifi" }
        ]
      },
      {
        id: "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0",
        name: "Patrick Amunson",
        bio: "Patrick Jae Amunson is a versatile musician and producer with a diverse background in rock, electronic, and classical-inspired music. As the drummer, lead vocalist, and producer for Counter Culture—known for tracks like Fuck Politics—and a key member of the alt-rock band Eleven11, Patrick has honed his craft in both live performance and studio production. Beyond rock, he explores electronic music under his DJ alias Fireye, and under his own name, he delivers unique \"classical\" reimaginings of modern songs on piano.",
        imageUrl: "/assets/artists/Patrick Amunson.jpeg",
        links: [
          { label: "Website", url: "https://www.amunsonaudio.com/patrick-amunson" },
          { label: "Tidal", url: "https://tidal.com/browse/credits/16117098" },
          { label: "LinkedIn", url: "https://www.linkedin.com/in/patrickamunson/" }
        ]
      },
      {
        id: "d7d9451b-695f-4a33-a214-1b3839bb2083",
        name: "Hans Larson Trio",
        bio: "The Hans Larson Trio is a jazz ensemble known for their innovative compositions and improvisational style. Led by drummer Hans Larson, the group explores the boundaries of traditional jazz while maintaining a strong connection to its roots.",
        imageUrl: "/assets/artists/Hans Larson Trio.jpeg"
      }
    ];

    const fallbackTracks: Track[] = [
      // SYM1 tracks
      {
        id: "7b3037e3-6d71-46f8-8a6f-90a02fd0669b",
        title: "Right 1 4 Me",
        artist_id: "118809eb-e984-4d75-8de8-791d25de5b3a",
        artist_name: "SYM1",
        genre: "Hyperpop",
        url: "/assets/tracks/SYM1/Right 1 4 Me Master 2 [2024-03-06 195528].m4a",
        file_type: "m4a"
      },
      // Kiyan Saifi tracks
      {
        id: "d69762e0-536c-4be3-97a9-6505785d675c",
        title: "Live at Rhizome",
        artist_id: "5f767b5c-75e2-4246-9687-893be2cb3900",
        artist_name: "Kiyan Saifi",
        genre: "Experimental",
        url: "/assets/tracks/KiyanSaifi/Live at Rhizome.m4a",
        file_type: "m4a"
      },
      // Patrick Amunson tracks
      {
        id: "fc25f341-f677-4d2b-b2b0-d5f262e00056",
        title: "The Rush",
        artist_id: "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0",
        artist_name: "Patrick Amunson",
        genre: "Pop",
        url: "/assets/tracks/PatrickAmunson/Patrick Amunson - The Rush.m4a",
        file_type: "m4a"
      },
      {
        id: "8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e",
        title: "Jonny Depp Summer",
        artist_id: "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0",
        artist_name: "Patrick Amunson",
        genre: "Pop/Rock",
        url: "/assets/tracks/PatrickAmunson/Patrick Amunson - Jonny Depp Summer.m4a",
        file_type: "m4a"
      },
      {
        id: "9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f",
        title: "Like You Mean It",
        artist_id: "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0",
        artist_name: "Patrick Amunson",
        genre: "Pop/Rock",
        url: "/assets/tracks/PatrickAmunson/Patrick Amunson - Like You Mean It.m4a",
        file_type: "m4a"
      },
      {
        id: "0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a",
        title: "Peaches & Cream",
        artist_id: "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0",
        artist_name: "Patrick Amunson",
        genre: "Pop/Rock",
        url: "/assets/tracks/PatrickAmunson/Patrick Amunson - Peaches & Cream.m4a",
        file_type: "m4a"
      },
      {
        id: "1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b",
        title: "Escape the City at Night",
        artist_id: "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0",
        artist_name: "Patrick Amunson",
        genre: "Electronic",
        url: "/assets/tracks/PatrickAmunson/Fireye - Escape the City at Night.m4a",
        file_type: "m4a"
      },
      // Hans Larson Trio tracks
      {
        id: "fbddda3c-86e8-456a-80e2-5ebad1e1f0c2",
        title: "Spain",
        artist_id: "d7d9451b-695f-4a33-a214-1b3839bb2083",
        artist_name: "Hans Larson Trio",
        genre: "Jazz",
        url: "/assets/tracks/HansLarsonTrio/Spain.mp3",
        file_type: "mp3"
      },
      {
        id: "5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b",
        title: "Downtown",
        artist_id: "d7d9451b-695f-4a33-a214-1b3839bb2083",
        artist_name: "Hans Larson Trio",
        genre: "Jazz",
        url: "/assets/tracks/HansLarsonTrio/Downtown.mp3",
        file_type: "mp3"
      },
      {
        id: "6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c",
        title: "Touch Earth Touch Sky",
        artist_id: "d7d9451b-695f-4a33-a214-1b3839bb2083",
        artist_name: "Hans Larson Trio",
        genre: "Jazz Fusion",
        url: "/assets/tracks/HansLarsonTrio/Touch Earth Touch Sky.mp3",
        file_type: "mp3"
      }
    ];
    
    // Always use fallback data since the API is not working
    artistsCache = detailedArtists;
    tracksCache = fallbackTracks;
    
    console.log("Data initialization complete");
    console.log("Artists loaded:", artistsCache.length);
    console.log("Tracks loaded:", tracksCache.length);
    
    isInitialized = true;
  } catch (error) {
    console.error("Failed to initialize data:", error);
    throw error;
  }
} 