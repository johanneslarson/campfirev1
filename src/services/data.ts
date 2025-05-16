// src/services/data.ts

// Import static data
import tracksData from '../tracks.json';
import artistsData from '../artists.json';
import communitiesData from '../communities.json';

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

// Local cache for data
let artistsCache: Artist[] = [];
let tracksCache: Track[] = [];
let isInitialized = false;

// Community stories (static data)
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

// Export the initialization state
export function getIsInitialized(): boolean {
  return isInitialized;
}

// Helper to get the correct image extension and folder name for each artist
function getArtistImageExtension(name: string): string {
  const extensionMap: { [key: string]: string } = {
    'SYM1': '.png',
    'Hans Larson Trio': '.jpeg',
    'Patrick Amunson': '.jpeg',
    'Sadie Habas': '.jpg',
    'MadFrances': '.jpg',
    'Kiyan Saifi': '.jpg'
  };
  return extensionMap[name] || '.jpg';  // Default to .jpg if not specified
}

// Helper to get the correct folder name for an artist (handling case sensitivity)
function getArtistFolderName(name: string): string {
  const folderMap: { [key: string]: string } = {
    'MadFrances': 'madfrances'
  };
  return folderMap[name] || name.replace(/ /g, '');
}

// Helper to encode each segment of a relative asset path so that it works on case-sensitive, URL-encoded file systems (e.g. Vercel static hosting).
//    We leave `http(s)://` URLs untouched.
function encodeAssetPath(path: string): string {
  if (!path) return path;
  // Do not touch absolute URLs
  if (path.startsWith('http')) return path;

  // Split on '/' so we preserve the directory structure, then URI-encode each segment (other than the initial empty string for leading '/')
  return path
    .split('/')
    .map((segment, idx) => (idx === 0 ? segment : encodeURIComponent(segment)))
    .join('/');
}

// Helper to ensure track URLs are correct
function normalizeTrackUrl(track: Track): Track {
  // Keep absolute URLs as-is
  if (track.url.startsWith('http')) {
    return track;
  }
  
  // Remove any /api prefix and ensure the path starts with /assets
  let cleanUrl = track.url.replace('/api/', '/');
  if (!cleanUrl.startsWith('/assets')) {
    cleanUrl = `/assets${cleanUrl}`;
  }
  
  return {
    ...track,
    url: encodeAssetPath(cleanUrl)
  };
}

// Get all tracks
export async function getAllTracks(): Promise<Track[]> {
  if (tracksCache.length > 0) {
    return tracksCache;
  }
  
  const tracks: Track[] = tracksData;
  const normalizedTracks = tracks.map(normalizeTrackUrl);
  tracksCache = normalizedTracks;
  return normalizedTracks;
}

// Synchronous version that uses cache or returns empty array
export function getAllTracksSync(): Track[] {
  return tracksCache;
}

// Get featured tracks (a curated selection)
export function getFeaturedTracks(): Promise<Track[]> {
  return new Promise((resolve) => {
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

        const ordered: Track[] = [];
        desiredOrder.forEach(title => {
          const match = tracks.find(t => t.title.toLowerCase() === title.toLowerCase());
          if (match) {
            if (title.toLowerCase() === "escape the city at night") {
              ordered.push({ ...match, artist_name: "Patrick Amunson" });
            } else {
              ordered.push(match);
            }
          }
        });

        resolve(ordered);
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

// Get all artists
export async function getAllArtists(): Promise<Artist[]> {
  if (artistsCache.length > 0) {
    return artistsCache;
  }
  
  // Transform raw JSON (snake_case keys) to the Artist interface expected by the app
  artistsCache = (artistsData as any[]).map((a: any) => {
    const folderName = getArtistFolderName(a.name);
    const rawImagePath = a.image_url || `/assets/artists/${folderName}${getArtistImageExtension(a.name)}`;
    return {
      id: a.id,
      name: a.name,
      bio: a.bio,
      imageUrl: encodeAssetPath(rawImagePath),
      links: a.instagram ? [{ label: "Instagram", url: `https://www.instagram.com/${a.instagram}` }] : []
    };
  });
  return artistsCache;
}

export function getAllArtistsSync(): Artist[] {
  return artistsCache;
}

export async function getArtistById(id: string): Promise<Artist | undefined> {
  const artists = await getAllArtists();
  return artists.find(artist => artist.id === id);
}

export function getArtistByIdSync(id: string): Artist | undefined {
  return getAllArtistsSync().find(artist => artist.id === id);
}

export async function getTracksByArtist(artistId: string): Promise<Track[]> {
  const tracks = await getAllTracks();
  return tracks.filter(track => track.artist_id === artistId);
}

export function getTracksByArtistSync(artistId: string): Track[] {
  return getAllTracksSync().filter(track => track.artist_id === artistId);
}

export function getPlatformStats(): { label: string, value: number }[] {
  return [
    { label: "Artists", value: artistsCache.length },
    { label: "Tracks", value: tracksCache.length }
  ];
}

export function getCommunityStories(): CommunityStory[] {
  return communityStories;
}

export function getUserRoyaltyReport(): RoyaltyReport {
  // Static example data
  return {
    totalMinutes: 397, // 6 hours and 37 minutes
    totalAmount: 12.00,
    breakdown: [
      ["SYM1", 3.45],
      ["Patrick Amunson", 2.60],
      ["Kiyan Saifi", 2.15],
      ["MadFrances", 2.00],
      ["Sadie Habas", 1.30],
      ["Hans Larson Trio", 0.50]
    ]
  };
}

export function getUserProfile(): UserProfile {
  return initialUser;
}

export async function initializeData(): Promise<void> {
  try {
    await Promise.all([
      getAllTracks(),
      getAllArtists()
    ]);
    isInitialized = true;
  } catch (error) {
    console.error("Failed to initialize data:", error);
    throw error;
  }
}

export interface Community {
  name: string;
  artists: { id: string; name: string }[];
}

// Communities accessor
export function getAllCommunities(): Community[] {
  // communitiesData already in desired shape
  return communitiesData as unknown as Community[];
} 