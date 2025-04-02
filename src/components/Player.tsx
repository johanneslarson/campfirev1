import { useContext, useEffect, useRef, useState } from "react";
import { PlaybackContext } from "../context/PlaybackContext";
import { getAllTracksSync } from "../services/data";
import { FaIcons } from "../utils/icons";

function Player() {
  const { currentTrack, isPlaying, playTrack, pause, resume, playNext, playPrev } = useContext(PlaybackContext);
  const audioRef = useRef<HTMLAudioElement>(null);
  const allTracks = getAllTracksSync();
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  // Effect to initialize audio element once
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setIsAudioInitialized(true);
    }
  }, []);

  // Effect to load and play the track when currentTrack changes
  useEffect(() => {
    if (!audioRef.current || !isAudioInitialized) return;
    
    if (currentTrack) {
      // Use the URL directly as it should now be a full URL with the hostname
      console.log("Setting audio source:", currentTrack.url);
      
      // Only update the source if it's different from the current one
      if (audioRef.current.src !== currentTrack.url) {
        audioRef.current.src = currentTrack.url;
      }
      
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error("Audio play prevented:", err);
            console.error("Track URL:", currentTrack.url);
          });
        }
      }
    }
  }, [currentTrack, isPlaying, isAudioInitialized]);

  // Effect to play/pause audio when isPlaying state changes
  useEffect(() => {
    if (!audioRef.current || !isAudioInitialized) return;
    
    if (isPlaying && currentTrack) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn("Could not play audio:", err);
        });
      }
    } else if (audioRef.current.paused === false) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack, isAudioInitialized]);

  // Effect to handle track ending
  useEffect(() => {
    if (!audioRef.current || !isAudioInitialized) return;
    
    const handleTrackEnd = () => playNext();
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
      }
    };
    const handleDurationChange = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };
    
    audioRef.current.addEventListener('ended', handleTrackEnd);
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('durationchange', handleDurationChange);
    
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.removeEventListener('ended', handleTrackEnd);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
      }
    };
  }, [playNext, isAudioInitialized]);

  // Format time in minutes:seconds
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle progress bar click
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = Number(e.target.value);
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-lighter border-t border-dark-light py-3 px-4 z-30">
      {/* Audio element (hidden) */}
      <audio 
        ref={audioRef} 
        onError={(e) => {
          console.error("Audio error:", e);
          if (audioRef.current) {
            console.error("Error details:", audioRef.current.error);
            console.error("Current src:", audioRef.current.src);
          }
        }}
      />

      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Track Info */}
        <div className="w-1/4 min-w-0 hidden sm:block">
          {currentTrack ? (
            <div className="flex items-center">
              <div className="ml-2 min-w-0">
                <p className="text-accent truncate font-medium">{currentTrack.title}</p>
                <p className="text-gray-300 text-sm truncate">{currentTrack.artist_name}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-300 text-sm">Not playing</p>
          )}
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center w-full sm:w-2/4">
          <div className="flex items-center justify-center space-x-5 sm:space-x-6 mb-1 sm:mb-2">
            <button 
              onClick={playPrev} 
              disabled={!currentTrack} 
              className="text-accent hover:text-primary transition-colors disabled:opacity-50 p-1"
              aria-label="Previous track"
            >
              <FaIcons.FaStepBackward size={16} />
            </button>
            
            <button
              onClick={isPlaying ? pause : () => {
                if (!currentTrack && allTracks.length > 0) {
                  playTrack(allTracks[0]);
                } else {
                  resume();
                }
              }}
              disabled={currentTrack === null && allTracks.length === 0}
              className="p-3 bg-primary hover:bg-primaryDark rounded-full text-white transition-colors disabled:opacity-50"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <FaIcons.FaPause size={16} /> : <FaIcons.FaPlay size={16} />}
            </button>
            
            <button 
              onClick={playNext} 
              disabled={!currentTrack} 
              className="text-accent hover:text-primary transition-colors disabled:opacity-50 p-1"
              aria-label="Next track"
            >
              <FaIcons.FaStepForward size={16} />
            </button>
          </div>
          
          {/* Mobile Track Info (Shown only on small screens) */}
          {currentTrack && (
            <div className="sm:hidden text-center mb-1 w-full">
              <p className="text-accent truncate font-medium text-xs">{currentTrack.title}</p>
            </div>
          )}
          
          {/* Progress Bar */}
          <div className="w-full flex items-center space-x-1 sm:space-x-2 text-xs text-gray-300">
            <span className="w-7 sm:w-10 text-right text-[10px] sm:text-xs">{formatTime(progress)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={progress}
              onChange={handleProgressChange}
              className="flex-grow h-1.5 sm:h-2 appearance-none bg-gray-600 rounded-full focus:outline-none hover:bg-primaryDark"
              style={{
                background: `linear-gradient(to right, #ed7d24 ${(progress / (duration || 1)) * 100}%, #535353 0)`
              }}
              disabled={!currentTrack}
            />
            <span className="w-7 sm:w-10 text-[10px] sm:text-xs">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="w-1/4 flex justify-end items-center space-x-3 hidden sm:flex">
          <button 
            onClick={toggleMute} 
            className="text-accent hover:text-primary transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <FaIcons.FaVolumeMute size={18} /> : <FaIcons.FaVolumeUp size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-2 appearance-none bg-gray-600 rounded-full focus:outline-none hover:bg-primaryDark"
            style={{
              background: `linear-gradient(to right, #ed7d24 ${(isMuted ? 0 : volume) * 100}%, #535353 0)`
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Player; 