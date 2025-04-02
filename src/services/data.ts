// src/services/data.ts

// Define interfaces for data types
export interface Artist {
  id: string;
  name: string;
  bio?: string;
  image_url?: string; // Optional profile image URL
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
          "fbddda3c-86e8-456a-80e2-5ebad1e1f0c2", // Spain by Hans Larson Trio
          "7b3037e3-6d71-46f8-8a6f-90a02fd0669b", // Right 1 4 Me by SYM1
          "d69762e0-536c-4be3-97a9-6505785d675c", // Live at Rhizome by Kiyan Saifi
          "fc25f341-f677-4d2b-b2b0-d5f262e00056"  // The Rush by Patrick Amunson
        ];
        
        const featuredTracks = tracks.filter(track => 
          featuredTrackIds.includes(track.id)
        );
        
        console.log("Featured tracks:", featuredTracks);
        
        if (featuredTracks.length === 0) {
          console.warn("No featured tracks found, check IDs");
        }
        
        resolve(featuredTracks);
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
export function getTracksByArtistSync(artistId: string): Track[] {
  return getAllTracksSync().filter(track => track.artist_id === artistId);
}

// Get tracks by artist ID (async version)
export function getTracksByArtist(artistId: string): Promise<Track[]> {
  return new Promise((resolve, reject) => {
    getAllTracks()
      .then(tracks => {
        const artistTracks = tracks.filter(track => track.artist_id === artistId);
        console.log(`Tracks for artist ${artistId}:`, artistTracks);
        resolve(artistTracks);
      })
      .catch(err => {
        console.error(`Error getting tracks for artist ${artistId}:`, err);
        reject(err);
      });
  });
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
  
  // Create breakdown with customized values - exclude Hans Larson Trio
  const breakdown: [string, number][] = [];
  
  for (const artist of artists) {
    // Skip Hans Larson Trio due to conflict of interest
    if (artist.id === "d7d9451b-695f-4a33-a214-1b3839bb2083") {
      continue; // Skip this artist
    }
    
    let amount: number;
    
    if (artist.id === "118809eb-e984-4d75-8de8-791d25de5b3a") {
      // SYM1 gets the most
      amount = 3.50;
    } else if (artist.id === "5f767b5c-75e2-4246-9687-893be2cb3900") {
      // Kiyan Saifi gets a medium amount
      amount = 2.50;
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
    
    // Reset caches to ensure fresh data
    artistsCache = [];
    tracksCache = [];
    
    console.log("Starting data initialization");
    
    // Create detailed fallback data for artists with complete bios and images
    const detailedArtists: Record<string, DetailedArtist> = {
      "d7d9451b-695f-4a33-a214-1b3839bb2083": {
        id: "d7d9451b-695f-4a33-a214-1b3839bb2083",
        name: "Hans Larson Trio",
        bio: "The Hans Larson Trio is a jazz ensemble known for their innovative compositions and improvisational style. Led by drummer Hans Larson, the group explores the boundaries of traditional jazz while maintaining a strong connection to its roots.",
        imageUrl: "/assets/artists/Hans Larson Trio.jpeg",
      },
      "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0": {
        id: "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0",
        name: "Patrick Amunson",
        bio: "Patrick Jae Amunson is a versatile musician and producer with a diverse background in rock, electronic, and classical-inspired music. As the drummer, songwriter, and producer for several successful indie bands, Patrick has developed a unique style that combines soulful melodies with rhythmic innovation.",
        imageUrl: "/assets/artists/Patrick Amunson.jpeg",
        links: [
          { label: "Website", url: "https://www.amunsonaudio.com/patrick-amunson" },
          { label: "Tidal", url: "https://tidal.com/browse/credits/16117098" },
          { label: "LinkedIn", url: "https://www.linkedin.com/in/patrickamunson/" }
        ]
      },
      "118809eb-e984-4d75-8de8-791d25de5b3a": {
        id: "118809eb-e984-4d75-8de8-791d25de5b3a",
        name: "SYM1",
        bio: "Unsubscribed from reality as we know it, SYM1, (pronounced sim-ONE or si-MOAN) is a vocalist, producer, and performer using eurodance and alternative electronic music to explore themes of digital consciousness, virtual reality, and the intersection of human emotion with artificial intelligence.",
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
      "5f767b5c-75e2-4246-9687-893be2cb3900": {
        id: "5f767b5c-75e2-4246-9687-893be2cb3900",
        name: "Kiyan Saifi",
        bio: "Kiyan Saifi is an experimental guitarist who currently performs with DC-based bands: Red Sunflower, Opposite Tiger, Fateful Encounter, Sense Memory, and in a duo with his brother.",
        imageUrl: "/assets/artists/KiyanSaifi.jpg",
        links: [
          { label: "Instagram", url: "https://www.instagram.com/kiyankiyankiyankiyan/" }
        ]
      },
    };
    
    // Add a timeout to the fetch requests
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Request timed out')), 10000) // Increased timeout
    );
    
    // Try to fetch both artists and tracks in parallel
    try {
      const [apiArtists, apiTracks] = await Promise.race([
        Promise.all([getAllArtists(), getAllTracks()]),
        timeoutPromise
      ]);
      
      console.log("Successfully fetched data:", { 
        artistCount: apiArtists.length, 
        trackCount: apiTracks.length,
        artistIds: apiArtists.map(a => a.id),
        trackArtistIds: apiTracks.map(t => t.artist_id)
      });
      
      // Merge API artists with detailed artists to preserve images and full bios
      if (apiArtists.length > 0) {
        const mergedArtists: Artist[] = [];
        
        for (const apiArtist of apiArtists) {
          // Find matching detailed artist
          const detailedArtist = detailedArtists[apiArtist.id];
          
          if (detailedArtist) {
            // Merge API data with detailed data
            mergedArtists.push({
              ...apiArtist,
              bio: detailedArtist.bio, // Use detailed bio
              image_url: detailedArtist.imageUrl, // Use image from detailed data
              links: detailedArtist.links // Use links from detailed data
            });
          } else {
            mergedArtists.push(apiArtist);
          }
        }
        
        // Update cache with merged data
        artistsCache = mergedArtists;
        console.log("Merged artists with detailed data:", artistsCache);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    
    // If we have no data after fetching, use fallback data
    if (artistsCache.length === 0) {
      console.log("No artists fetched from API, using fallback artists");
      
      // Use our detailed artists as fallback
      artistsCache = Object.values(detailedArtists);
    }
    
    // Set fallback tracks
    tracksCache = [
      // Hans Larson Trio tracks
      {
        id: "5007a4ec-1e61-44cf-9917-724e67962764",
        title: "Spain",
        artist_id: "d7d9451b-695f-4a33-a214-1b3839bb2083",
        artist_name: "Hans Larson Trio",
        genre: "Jazz",
        url: "http://localhost:8080/api/assets/tracks/HansLarsonTrio/Spain.mp3",
        file_type: "mp3"
      },
      {
        id: "fbddda3c-86e8-456a-80e2-5ebad1e1f0c2",
        title: "Downtown",
        artist_id: "d7d9451b-695f-4a33-a214-1b3839bb2083",
        artist_name: "Hans Larson Trio",
        genre: "Jazz",
        url: "http://localhost:8080/api/assets/tracks/HansLarsonTrio/Downtown.mp3",
        file_type: "mp3"
      },
      {
        id: "a1059165-51e4-4985-82bf-3e95d8c30191",
        title: "Touch Earth Touch Sky",
        artist_id: "d7d9451b-695f-4a33-a214-1b3839bb2083",
        artist_name: "Hans Larson Trio",
        genre: "Jazz Fusion",
        url: "http://localhost:8080/api/assets/tracks/HansLarsonTrio/Touch Earth Touch Sky.mp3",
        file_type: "mp3"
      },
      
      // Patrick Amunson tracks
      {
        id: "fc25f341-f677-4d2b-b2b0-d5f262e00056",
        title: "The Rush",
        artist_id: "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0",
        artist_name: "Patrick Amunson",
        genre: "Electronic",
        url: "http://localhost:8080/api/assets/tracks/PatrickAmunson/Patrick Amunson - The Rush.m4a",
        file_type: "m4a"
      },
      {
        id: "0e28f42f-2451-4475-82eb-46d1dc86ee34",
        title: "Jonny Depp Summer",
        artist_id: "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0",
        artist_name: "Patrick Amunson",
        genre: "Pop/Rock",
        url: "http://localhost:8080/api/assets/tracks/PatrickAmunson/Patrick Amunson - Jonny Depp Summer.m4a",
        file_type: "m4a"
      },
      {
        id: "b900f5b8-205b-4df3-9259-9e7f509ebc0a",
        title: "Like You Mean It",
        artist_id: "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0",
        artist_name: "Patrick Amunson",
        genre: "Pop/Rock",
        url: "http://localhost:8080/api/assets/tracks/PatrickAmunson/Patrick Amunson - Like You Mean It.m4a",
        file_type: "m4a"
      },
      {
        id: "5ee45bc3-a95a-4c5f-91b5-e19493a41021",
        title: "Peaches & Cream",
        artist_id: "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0",
        artist_name: "Patrick Amunson",
        genre: "Pop/Rock",
        url: "http://localhost:8080/api/assets/tracks/PatrickAmunson/Patrick Amunson - Peaches & Cream.m4a",
        file_type: "m4a"
      },
      {
        id: "3a848147-2b39-4694-a3b1-77bfff1fc4ef",
        title: "Escape the City at Night",
        artist_id: "24c9597b-3c04-4134-b7ef-ccd62dc5b4a0",
        artist_name: "Fireye",
        genre: "Electronic",
        url: "http://localhost:8080/api/assets/tracks/PatrickAmunson/Fireye - Escape the City at Night.m4a",
        file_type: "m4a"
      },
      
      // SYM1 tracks
      {
        id: "7b3037e3-6d71-46f8-8a6f-90a02fd0669b",
        title: "Right 1 4 Me",
        artist_id: "118809eb-e984-4d75-8de8-791d25de5b3a",
        artist_name: "SYM1",
        genre: "Hyperpop",
        url: "http://localhost:8080/api/assets/tracks/SYM1/Right 1 4 Me Master 2 [2024-03-06 195528].m4a",
        file_type: "m4a"
      },
      
      // Kiyan Saifi tracks
      {
        id: "d69762e0-536c-4be3-97a9-6505785d675c",
        title: "Live at Rhizome",
        artist_id: "5f767b5c-75e2-4246-9687-893be2cb3900",
        artist_name: "Kiyan Saifi",
        genre: "Experimental",
        url: "http://localhost:8080/api/assets/tracks/KiyanSaifi/Live at Rhizome.m4a",
        file_type: "m4a"
      }
    ];
  } finally {
    // Mark initialization as complete
    isInitialized = true;
  }
} 