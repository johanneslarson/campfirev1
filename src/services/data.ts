// src/services/data.ts

// Define interfaces for data types
export interface Artist {
  id: string;
  name: string;
  bio: string;
  image_url?: string; // Optional profile image URL
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

// API URL
const API_URL = "http://localhost:8080/api";

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
    tracksCache = tracks;
    return tracks;
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
export function getFeaturedTracks(): Track[] {
  const tracks = getAllTracksSync();
  if (tracks.length === 0) return [];

  // Get one track from each artist in the specific order: SYM1, Patrick Amunson, Hans Larson Trio
  const featuredTracks: Track[] = [];
  
  // Find a SYM1 track first
  const sym1Track = tracks.find(track => track.artist_id === "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f");
  if (sym1Track) {
    // Rename the track to "Right 1 4 Me"
    featuredTracks.push({
      ...sym1Track,
      title: "Right 1 4 Me"
    });
  }
  
  // Find a Patrick Amunson track (not "Escape the City at Night" which was problematic)
  const patrickTrack = tracks.find(track => 
    track.artist_id === "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e" && 
    track.title !== "Escape the City at Night"
  );
  if (patrickTrack) {
    featuredTracks.push(patrickTrack);
  }
  
  // Find a Hans Larson Trio track
  const hansTrack = tracks.find(track => track.artist_id === "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d");
  if (hansTrack) {
    featuredTracks.push(hansTrack);
  }
  
  return featuredTracks;
}

// Synchronous version for initial render
export function getFeaturedTracksSync(): Track[] {
  const allTracks = getAllTracksSync();
  
  if (allTracks.length === 0) {
    return [];
  }
  
  if (allTracks.length <= 3) {
    return allTracks;
  }
  
  // Pick the first 3 tracks instead of random for sync version
  return allTracks.slice(0, 3);
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
  // Get artists
  const artists = getAllArtistsSync();
  
  // Create breakdown with customized values
  const breakdown: [string, number][] = [];
  
  for (const artist of artists) {
    let amount: number;
    
    if (artist.id === "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d") {
      // Hans Larson Trio gets the least
      amount = 0.75;
    } else if (artist.id === "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f") {
      // SYM1 gets the most
      amount = 3.50;
    } else {
      // Patrick Amunson gets a medium amount
      amount = 2.25;
    }
    
    breakdown.push([artist.name, amount]);
  }
  
  // Calculate total from breakdown
  const totalAmount = breakdown.reduce((sum, [_, amount]) => sum + amount, 0);
  
  return {
    totalMinutes: Math.round(totalAmount * 60), // Rough estimate: $1 = 60 minutes
    totalAmount,
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
    
    // Add a timeout to the fetch requests
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Request timed out')), 5000)
    );
    
    // Try to fetch both artists and tracks in parallel
    await Promise.race([
      Promise.all([getAllArtists(), getAllTracks()]),
      timeoutPromise
    ]);
    
    // If we have no data after fetching, use fallback data
    if (artistsCache.length === 0) {
      console.log("No artists fetched from API, using fallback artists");
      
      // Fallback artists
      artistsCache = [
        {
          id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
          name: "Hans Larson Trio",
          bio: "A dynamic jazz trio exploring new musical horizons with innovative compositions and improvisation.",
          image_url: "/assets/artists/HansLarsonTrio.jpg"
        },
        {
          id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
          name: "Patrick Amunson",
          bio: "Patrick Jae Amunson is a versatile musician and producer with a diverse background in rock, electronic, and classical-inspired music. As the drummer, lead vocalist, and producer for Counter Culture—known for tracks like Fuck Politics—and a key member of the alt-rock band Eleven11, Patrick has honed his craft in both live performance and studio production.\n\nBeyond rock, he explores electronic music under his DJ alias Fireye, producing high-energy EDM and experimental beats. Simultaneously, under his own name, he delivers unique \"classical\" reimaginings of modern songs on piano. In addition to his personal projects, Patrick has produced and published numerous artists, all of which can be found at Amunson Audio. His ability to bridge multiple genres and push creative boundaries makes him a dynamic force in the music industry.",
          image_url: "/assets/artists/Patrick Amunson.jpeg"
        },
        {
          id: "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
          name: "SYM1",
          bio: "Unsubscribed from reality as we know it, SYM1, (pronounced sim-ONE or si-MOAN) is a vocalist, producer, and performer using eurodance and alternative aesthetics to inspire a renaissance of early 2000s rave culture. Additionally, she is a independent label owner and strong advocate for arts and musicians rights.",
          image_url: "/assets/artists/SYM1.png"
        }
      ];
    }
    
    if (tracksCache.length === 0) {
      console.log("No tracks fetched from API, using fallback tracks");
      
      // Fallback tracks
      tracksCache = [
        // Hans Larson Trio tracks
        {
          id: "4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a",
          title: "Spain",
          artist_id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
          artist_name: "Hans Larson Trio",
          genre: "Jazz",
          url: "/assets/tracks/HansLarsonTrio/Spain.mp3",
          file_type: "mp3"
        },
        {
          id: "5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b",
          title: "Downtown",
          artist_id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
          artist_name: "Hans Larson Trio",
          genre: "Jazz",
          url: "/assets/tracks/HansLarsonTrio/Downtown.mp3",
          file_type: "mp3"
        },
        {
          id: "6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c",
          title: "Touch Earth Touch Sky",
          artist_id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
          artist_name: "Hans Larson Trio",
          genre: "Jazz Fusion",
          url: "/assets/tracks/HansLarsonTrio/Touch Earth Touch Sky.mp3",
          file_type: "mp3"
        },
        
        // Patrick Amunson tracks
        {
          id: "7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d",
          title: "The Rush",
          artist_id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
          artist_name: "Patrick Amunson",
          genre: "Electronic",
          url: "/assets/tracks/PatrickAmunson/Patrick Amunson - The Rush.m4a",
          file_type: "m4a"
        },
        {
          id: "8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e",
          title: "Jonny Depp Summer",
          artist_id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
          artist_name: "Patrick Amunson",
          genre: "Pop/Rock",
          url: "/assets/tracks/PatrickAmunson/Patrick Amunson - Jonny Depp Summer.m4a",
          file_type: "m4a"
        },
        {
          id: "9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f",
          title: "Like You Mean It",
          artist_id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
          artist_name: "Patrick Amunson",
          genre: "Pop/Rock",
          url: "/assets/tracks/PatrickAmunson/Patrick Amunson - Like You Mean It.m4a",
          file_type: "m4a"
        },
        {
          id: "0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a",
          title: "Peaches & Cream",
          artist_id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
          artist_name: "Patrick Amunson",
          genre: "Pop/Rock",
          url: "/assets/tracks/PatrickAmunson/Patrick Amunson - Peaches & Cream.m4a",
          file_type: "m4a"
        },
        {
          id: "1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b",
          title: "Escape the City at Night",
          artist_id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
          artist_name: "Patrick Amunson",
          genre: "Electronic",
          url: "/assets/tracks/PatrickAmunson/Fireye - Escape the City at Night.m4a",
          file_type: "m4a"
        },
        
        // SYM1 tracks
        {
          id: "2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c",
          title: "Right 1 4 Me",
          artist_id: "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
          artist_name: "SYM1",
          genre: "Hyperpop",
          url: "/assets/tracks/SYM1/Right 1 4 Me Master 2 [2024-03-06 195528].m4a",
          file_type: "m4a"
        }
      ];
    }
  } catch (error) {
    console.warn("Failed to fetch data from backend, using fallback data:", error);
    
    // Clear existing caches to prevent duplicates
    artistsCache = [];
    tracksCache = [];
    
    // Fallback artists
    artistsCache = [
      {
        id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        name: "Hans Larson Trio",
        bio: "A dynamic jazz trio exploring new musical horizons with innovative compositions and improvisation.",
        image_url: "/assets/artists/HansLarsonTrio.jpg"
      },
      {
        id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
        name: "Patrick Amunson",
        bio: "Patrick Jae Amunson is a versatile musician and producer with a diverse background in rock, electronic, and classical-inspired music. As the drummer, lead vocalist, and producer for Counter Culture—known for tracks like Fuck Politics—and a key member of the alt-rock band Eleven11, Patrick has honed his craft in both live performance and studio production.\n\nBeyond rock, he explores electronic music under his DJ alias Fireye, producing high-energy EDM and experimental beats. Simultaneously, under his own name, he delivers unique \"classical\" reimaginings of modern songs on piano. In addition to his personal projects, Patrick has produced and published numerous artists, all of which can be found at Amunson Audio. His ability to bridge multiple genres and push creative boundaries makes him a dynamic force in the music industry.",
        image_url: "/assets/artists/Patrick Amunson.jpeg"
      },
      {
        id: "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
        name: "SYM1",
        bio: "Unsubscribed from reality as we know it, SYM1, (pronounced sim-ONE or si-MOAN) is a vocalist, producer, and performer using eurodance and alternative aesthetics to inspire a renaissance of early 2000s rave culture. Additionally, she is a independent label owner and strong advocate for arts and musicians rights.",
        image_url: "/assets/artists/SYM1.png"
      }
    ];
    
    // Fallback tracks - same content as above
    tracksCache = [
      // Hans Larson Trio tracks
      {
        id: "4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a",
        title: "Spain",
        artist_id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        artist_name: "Hans Larson Trio",
        genre: "Jazz",
        url: "/assets/tracks/HansLarsonTrio/Spain.mp3",
        file_type: "mp3"
      },
      {
        id: "5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b",
        title: "Downtown",
        artist_id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        artist_name: "Hans Larson Trio",
        genre: "Jazz",
        url: "/assets/tracks/HansLarsonTrio/Downtown.mp3",
        file_type: "mp3"
      },
      {
        id: "6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c",
        title: "Touch Earth Touch Sky",
        artist_id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        artist_name: "Hans Larson Trio",
        genre: "Jazz Fusion",
        url: "/assets/tracks/HansLarsonTrio/Touch Earth Touch Sky.mp3",
        file_type: "mp3"
      },
      
      // Patrick Amunson tracks
      {
        id: "7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d",
        title: "The Rush",
        artist_id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
        artist_name: "Patrick Amunson",
        genre: "Electronic",
        url: "/assets/tracks/PatrickAmunson/Patrick Amunson - The Rush.m4a",
        file_type: "m4a"
      },
      {
        id: "8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e",
        title: "Jonny Depp Summer",
        artist_id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
        artist_name: "Patrick Amunson",
        genre: "Pop/Rock",
        url: "/assets/tracks/PatrickAmunson/Patrick Amunson - Jonny Depp Summer.m4a",
        file_type: "m4a"
      },
      {
        id: "9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f",
        title: "Like You Mean It",
        artist_id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
        artist_name: "Patrick Amunson",
        genre: "Pop/Rock",
        url: "/assets/tracks/PatrickAmunson/Patrick Amunson - Like You Mean It.m4a",
        file_type: "m4a"
      },
      {
        id: "0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a",
        title: "Peaches & Cream",
        artist_id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
        artist_name: "Patrick Amunson",
        genre: "Pop/Rock",
        url: "/assets/tracks/PatrickAmunson/Patrick Amunson - Peaches & Cream.m4a",
        file_type: "m4a"
      },
      {
        id: "1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b",
        title: "Escape the City at Night",
        artist_id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
        artist_name: "Patrick Amunson",
        genre: "Electronic",
        url: "/assets/tracks/PatrickAmunson/Fireye - Escape the City at Night.m4a",
        file_type: "m4a"
      },
      
      // SYM1 tracks
      {
        id: "2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c",
        title: "Right 1 4 Me",
        artist_id: "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
        artist_name: "SYM1",
        genre: "Hyperpop",
        url: "/assets/tracks/SYM1/Right 1 4 Me Master 2 [2024-03-06 195528].m4a",
        file_type: "m4a"
      }
    ];
  } finally {
    // Mark initialization as complete
    isInitialized = true;
  }
} 