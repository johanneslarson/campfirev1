import { useContext, useEffect, useRef, useState } from "react";
import { PlaybackContext } from "../context/PlaybackContext";
import { getAllTracks } from "../services/data";
import { FaIcons } from "../utils/icons";

function Player() {
  const { currentTrack, isPlaying, playTrack, pause, resume, playNext, playPrev } = useContext(PlaybackContext);
  const audioRef = useRef<HTMLAudioElement>(null);
  const allTracks = getAllTracks();
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Effect to load and play the track when currentTrack changes
  useEffect(() => {
    if (!audioRef.current) return;
    if (currentTrack) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          // In case autoplay is disallowed by browser, catch the error.
          console.warn("Audio play prevented:", err);
        });
      }
    }
  }, [currentTrack, isPlaying]);

  // Effect to play/pause audio when isPlaying state changes
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {/* handle play issue */});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Effect to handle track ending
  useEffect(() => {
    if (!audioRef.current) return;
    
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
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleTrackEnd);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('durationchange', handleDurationChange);
      }
    };
  }, [playNext]);

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
    <div className="fixed bottom-0 left-0 right-0 bg-dark-lighter border-t border-dark-light py-4 px-4 z-10">
      {/* Audio element (hidden) */}
      <audio ref={audioRef} />

      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Track Info */}
        <div className="w-1/4 min-w-0 hidden sm:block">
          {currentTrack ? (
            <div className="flex items-center">
              <div className="ml-2 min-w-0">
                <p className="text-accent truncate font-medium">{currentTrack.title}</p>
                <p className="text-gray-300 text-sm truncate">{currentTrack.artistName}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-300 text-sm">Not playing</p>
          )}
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center space-x-6 mb-2">
            <button 
              onClick={playPrev} 
              disabled={!currentTrack} 
              className="text-accent hover:text-primary transition-colors disabled:opacity-50"
              aria-label="Previous track"
            >
              <FaIcons.FaStepBackward size={18} />
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
              className="text-accent hover:text-primary transition-colors disabled:opacity-50"
              aria-label="Next track"
            >
              <FaIcons.FaStepForward size={18} />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full flex items-center space-x-2 text-xs text-gray-300">
            <span className="w-10 text-right">{formatTime(progress)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={progress}
              onChange={handleProgressChange}
              className="flex-grow h-2 appearance-none bg-gray-600 rounded-full focus:outline-none hover:bg-gray-500"
              style={{
                background: `linear-gradient(to right, #ed5a24 ${(progress / (duration || 1)) * 100}%, #535353 0)`
              }}
              disabled={!currentTrack}
            />
            <span className="w-10">{formatTime(duration)}</span>
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
            className="w-24 h-2 appearance-none bg-gray-600 rounded-full focus:outline-none hover:bg-gray-500"
            style={{
              background: `linear-gradient(to right, #ed5a24 ${(isMuted ? 0 : volume) * 100}%, #535353 0)`
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Player; 