// src/services/data.ts

// Import API_URL and BACKEND_HOST from config
import { API_URL, BACKEND_HOST } from "../config";

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

// Log that we're using the API URL for debugging (defined in config)
console.log(`Using API URL: ${API_URL}`);

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

// NEW: Helper to ensure every track URL includes the backend host **once**
function normalizeTrackUrl(track: Track): Track {
  // Already an absolute URL – keep as-is
  if (track.url.startsWith("http")) {
    return track;
  }
  // Otherwise prepend the backend host (but NOT an extra /api prefix)
  return {
    ...track,
    url: `${BACKEND_HOST}${track.url.startsWith('/') ? '' : '/'}${track.url}`
  };
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
    
    // Normalize URLs to use the full localhost prefix (avoid double /api)
    const normalizedTracks = tracks.map(normalizeTrackUrl);
    
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
    getAllTracks()
      .then((tracks) => {
        const desiredOrder = [
          "Live at Rhizome",
          "Right 1 4 Me",
          "Too Greedy",
          "Tell me",
          "Touch Earth Touch Sky",
          "Escape the City at Night"
        ];

        // Build ordered list by matching titles (case-insensitive)
        const ordered: Track[] = [];
        desiredOrder.forEach(title => {
          const match = tracks.find(t => t.title.toLowerCase() === title.toLowerCase());
          if (match) {
            // Special case: ensure artist is Patrick Amunson for Escape the City at Night
            if (title.toLowerCase() === "escape the city at night") {
              ordered.push({ ...match, artist_name: "Patrick Amunson" });
            } else {
              ordered.push(match);
            }
          }
        });

        console.log("Featured tracks (ordered):", ordered.map(t => `${t.title} – ${t.artist_name}`));
        resolve(ordered);
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
  if (allTracks.length === 0) return [];

  const desiredOrder = [
    "Live at Rhizome",
    "Right 1 4 Me",
    "Too Greedy",
    "Tell me",
    "Touch Earth Touch Sky",
    "Escape the City at Night"
  ];

  const ordered: Track[] = [];
  desiredOrder.forEach(title => {
    const match = allTracks.find(t => t.title.toLowerCase() === title.toLowerCase());
    if (match) {
      if (title.toLowerCase() === "escape the city at night") {
        ordered.push({ ...match, artist_name: "Patrick Amunson" });
      } else {
        ordered.push(match);
      }
    }
  });

  return ordered;
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
  // Get all artists to calculate royalty distribution
  const artists = getAllArtistsSync();
  
  // Monthly subscription amount updated to $12.00
  const monthlyAmount = 12.00;
  
  // Total listening time in minutes
  const adjustedTotalListeningTime = 63.0;
  
  // Define percentage distribution for each artist
  const artistPercentages: Record<string, number> = {
    "SYM1": 0.25,          // 25%
    "Patrick Amunson": 0.20, // 20% 
    "Hans Larson Trio": 0.15, // 15%
    "Kiyan Saifi": 0.15,   // 15% 
    "MadFrances": 0.15,    // 15%
    "Sadie Habas": 0.10    // 10%
  };
  
  // Calculate artist listening time based on distribution
  const artistListeningTime: Record<string, number> = {};
  
  // Calculate artist payouts based on their share
  const breakdown: [string, number][] = [];
  
  artists.forEach(artist => {
    const percentage = artistPercentages[artist.name] || 0;
    const listeningTime = adjustedTotalListeningTime * percentage;
    artistListeningTime[artist.name] = listeningTime;
    
    // Artist's payout is their percentage of the monthly amount
    const amount = monthlyAmount * percentage;
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
    
    try {
      // First try to fetch artists from the API
      console.log(`Fetching artists from backend API at ${API_URL}/artists...`);
      const artistsResponse = await fetch(`${API_URL}/artists`, {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      console.log(`Artists API response status: ${artistsResponse.status}`);
      
      if (artistsResponse.ok) {
        const apiArtists = await artistsResponse.json();
        console.log(`Fetched ${apiArtists.length} artists from API:`, apiArtists);
        
        // Transform API artists to match frontend interface
        artistsCache = apiArtists.map((artist: any) => {
          console.log(`Processing artist: ${artist.name}, bio: ${artist.bio?.substring(0, 20)}...`);
          return {
            id: artist.id,
            name: artist.name,
            bio: artist.bio,
            imageUrl: artist.image_url || `/assets/artists/${artist.name.replace(/ /g, '')}.jpg`,
            links: artist.instagram ? [
              { label: "Instagram", url: `https://www.instagram.com/${artist.instagram}` }
            ] : []
          };
        });
        
        console.log(`Transformed ${artistsCache.length} artists for frontend`);
        
        // Also fetch tracks from API
        console.log("Fetching tracks from backend API...");
        const tracksResponse = await fetch(`${API_URL}/tracks`, {
          signal: AbortSignal.timeout(5000)
        });
        
        if (tracksResponse.ok) {
          const apiTracks: Track[] = await tracksResponse.json();
          tracksCache = apiTracks.map(normalizeTrackUrl);
          console.log(`Fetched ${tracksCache.length} tracks from API (normalized)`);
        } else {
          throw new Error(`Failed to fetch tracks: ${tracksResponse.status}`);
        }
      } else {
        throw new Error(`Failed to fetch artists: ${artistsResponse.status}`);
      }
    } catch (apiError) {
      // If API fetch fails, fall back to static data
      console.warn("API fetch failed, using fallback data:", apiError);
      
      // Fallback data (only used if API is not available)
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
        // Hans Larson Trio tracks
        {
          id: "fbddda3c-86e8-456a-80e2-5ebad1e1f0c2",
          title: "Spain",
          artist_id: "d7d9451b-695f-4a33-a214-1b3839bb2083",
          artist_name: "Hans Larson Trio",
          genre: "Jazz",
          url: "/assets/tracks/HansLarsonTrio/Spain.mp3",
          file_type: "mp3"
        }
        // More tracks would be here if needed
      ];
      
      // If API fails, revert to fallback data without detailed artist information
      // Frontend will still display available data from elsewhere
      tracksCache = fallbackTracks;
      
      // Ensure fallback URLs are normalized as well
      tracksCache = tracksCache.map(normalizeTrackUrl);
      
      // If we already have artists in the cache, keep them
      if (artistsCache.length === 0) {
        // Empty cache means API failed completely, use minimal fallback
        artistsCache = [
          {
            id: "118809eb-e984-4d75-8de8-791d25de5b3a",
            name: "SYM1",
            imageUrl: "/assets/artists/SYM1.png"
          },
          {
            id: "5f767b5c-75e2-4246-9687-893be2cb3900",
            name: "Kiyan Saifi",
            imageUrl: "/assets/artists/KiyanSaifi.jpg"
          },
          {
            id: "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0",
            name: "Patrick Amunson",
            imageUrl: "/assets/artists/Patrick Amunson.jpeg"
          },
          {
            id: "d7d9451b-695f-4a33-a214-1b3839bb2083",
            name: "Hans Larson Trio",
            imageUrl: "/assets/artists/Hans Larson Trio.jpeg"
          }
        ];
      }
    }
    
    console.log("Data initialization complete");
    console.log("Artists loaded:", artistsCache.length);
    console.log("Tracks loaded:", tracksCache.length);
    
    isInitialized = true;
  } catch (error) {
    console.error("Failed to initialize data:", error);
    throw error;
  }
} 