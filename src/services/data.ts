// src/services/data.ts

// Define interfaces for data types
export interface Artist {
  id: number;
  name: string;
  bio: string;
}

export interface Track {
  id: number;
  title: string;
  artistId: number;
  artistName: string;
  genre: string;
  url: string;
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

// Mock data arrays
const artists: Artist[] = [
  { id: 1, name: "Tester Artist", bio: "An indie folk band bringing campfire vibes to the stage." },
  { id: 2, name: "Bluesy Bob", bio: "A blues artist known for soulful guitar solos." },
  { id: 3, name: "Classical Collective", bio: "A group of musicians making classical music accessible." },
  { id: 4, name: "Hans Larson Trio", bio: "A dynamic jazz trio exploring new musical horizons with innovative compositions and improvisation." }
];

const tracks: Track[] = [
  { id: 1, title: "Embers in the Dark",  artistId: 1, artistName: "Tester Artist",  genre: "Folk",      url: "/assets/sample.mp3" },
  { id: 2, title: "Midnight Blues",     artistId: 2, artistName: "Bluesy Bob",         genre: "Blues",    url: "/assets/sample.mp3" },
  { id: 3, title: "Sunrise Serenade",   artistId: 1, artistName: "Tester Artist",  genre: "Folk",      url: "/assets/sample.mp3" },
  { id: 4, title: "Symphony of Lights", artistId: 3, artistName: "Classical Collective", genre: "Classical", url: "/assets/sample.mp3" },
  { id: 5, title: "Electric Night",     artistId: 2, artistName: "Bluesy Bob",         genre: "Rock",     url: "/assets/sample.mp3" },
  { id: 6, title: "Downtown",           artistId: 4, artistName: "Hans Larson Trio",    genre: "Jazz",     url: "/assets/tracks/Downtown.mp3" },
  { id: 7, title: "Spain",              artistId: 4, artistName: "Hans Larson Trio",    genre: "Jazz",     url: "/assets/tracks/Spain.mp3" },
  { id: 8, title: "Touch Earth Touch Sky", artistId: 4, artistName: "Hans Larson Trio", genre: "Jazz Fusion", url: "/assets/tracks/Touch Earth Touch Sky.mp3" }
];

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

// Service functions to retrieve data
export function getAllTracks(): Track[] {
  return tracks;
}

export function getFeaturedTracks(): Track[] {
  // Let's make one of the Hans Larson Trio tracks featured, along with two others
  return [tracks[5], tracks[1], tracks[2]];
}

export function getArtistById(id: number): Artist | undefined {
  return artists.find(a => a.id === id);
}

export function getTracksByArtist(artistId: number): Track[] {
  return tracks.filter(t => t.artistId === artistId);
}

export function getPlatformStats(): { label: string, value: number }[] {
  return [
    { label: "Artists", value: artists.length },
    { label: "Tracks", value: tracks.length }
  ];
}

export function getCommunityStories(): CommunityStory[] {
  return communityStories;
}

export function getUserRoyaltyReport(): RoyaltyReport {
  // A mock report of how the user's listening is allocated
  return {
    totalMinutes: 250,
    totalAmount: 4.30,
    breakdown: [
      ["Tester Artist", 2.50],
      ["Bluesy Bob", 1.80],
      ["Hans Larson Trio", 3.20]
    ]
  };
}

export function getUserProfile(): UserProfile {
  return initialUser;
} 