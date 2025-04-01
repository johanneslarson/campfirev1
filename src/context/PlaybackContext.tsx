import React, { createContext, useState, useCallback } from 'react';
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
});

// Provider component
export const PlaybackProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Play a track
  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);
  
  // Pause playback
  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  // Resume playback
  const resume = useCallback(() => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  }, [currentTrack]);
  
  // Play next track (simplified implementation)
  const playNext = useCallback(() => {
    // This is a simplified implementation
    // In a real app, you'd have a queue or playlist to determine the next track
    console.log("Play next track");
    // For now we just pause if there's a current track
    if (currentTrack) {
      setIsPlaying(false);
      // Here you would set the next track
    }
  }, [currentTrack]);
  
  // Play previous track (simplified implementation)
  const playPrev = useCallback(() => {
    // This is a simplified implementation
    console.log("Play previous track");
    // For now we just pause if there's a current track
    if (currentTrack) {
      setIsPlaying(false);
      // Here you would set the previous track
    }
  }, [currentTrack]);
  
  // Create the context value object
  const contextValue = {
    currentTrack,
    isPlaying,
    playTrack,
    pause,
    resume,
    playNext,
    playPrev,
  };
  
  return (
    <PlaybackContext.Provider value={contextValue}>
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