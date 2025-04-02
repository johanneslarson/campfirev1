import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Track } from '../services/data';

// Define the shape of our context
interface PlaybackContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  playNext: () => void;
  playPrev: () => void;
  queue: Track[];
}

// Create context with a default value
export const PlaybackContext = createContext<PlaybackContextType>({
  currentTrack: null,
  isPlaying: false,
  playTrack: () => {},
  pause: () => {},
  resume: () => {},
  playNext: () => {},
  playPrev: () => {},
  queue: [],
});

interface PlaybackProviderProps {
  children: ReactNode;
}

// Provider component
export const PlaybackProvider: React.FC<PlaybackProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  
  // Play a track and update the queue
  const playTrack = (track: Track) => {
    console.log("PlaybackContext: Playing track", track.title);
    
    // If this is a different track than the current one
    if (!currentTrack || currentTrack.id !== track.id) {
      setCurrentTrack(track);
      setIsPlaying(true);
      
      // Update queue by adding to it if not already there
      if (!queue.some(t => t.id === track.id)) {
        setQueue(prevQueue => [...prevQueue, track]);
      }
    } else {
      // If it's the same track, just resume playback
      setIsPlaying(true);
    }
  };
  
  // Pause playback
  const pause = () => {
    console.log("PlaybackContext: Pausing");
    setIsPlaying(false);
  };
  
  // Resume playback
  const resume = () => {
    console.log("PlaybackContext: Resuming");
    if (currentTrack) {
      setIsPlaying(true);
    }
  };
  
  // Play next track in queue
  const playNext = () => {
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
    if (currentIndex < queue.length - 1) {
      const nextTrack = queue[currentIndex + 1];
      console.log("PlaybackContext: Playing next track", nextTrack.title);
      setCurrentTrack(nextTrack);
      setIsPlaying(true);
    } else {
      // Loop back to the first track
      const nextTrack = queue[0];
      console.log("PlaybackContext: Playing first track", nextTrack.title);
      setCurrentTrack(nextTrack);
      setIsPlaying(true);
    }
  };
  
  // Play previous track
  const playPrev = () => {
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      const prevTrack = queue[currentIndex - 1];
      console.log("PlaybackContext: Playing previous track", prevTrack.title);
      setCurrentTrack(prevTrack);
      setIsPlaying(true);
    } else {
      // Loop to the last track
      const prevTrack = queue[queue.length - 1];
      console.log("PlaybackContext: Playing last track", prevTrack.title);
      setCurrentTrack(prevTrack);
      setIsPlaying(true);
    }
  };
  
  return (
    <PlaybackContext.Provider value={{
      currentTrack,
      isPlaying,
      playTrack,
      pause,
      resume,
      playNext,
      playPrev,
      queue
    }}>
      {children}
    </PlaybackContext.Provider>
  );
};

export const usePlayback = () => {
  const context = React.useContext(PlaybackContext);
  if (context === undefined) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
}; 