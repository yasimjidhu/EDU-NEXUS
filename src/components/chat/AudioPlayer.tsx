import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if(!audio)return;
    const time = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = time;
    setCurrentTime(time)
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-2 bg-gray-100 p-4 rounded-lg max-w-xs">
      <audio ref={audioRef} src={src} />
      <button
        onClick={togglePlayPause}
        className="flex-shrink-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <div className="flex-grow">
        <input
          type="range"
          min="0"
          max="100"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleProgressChange}
          className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          ref={progressBarRef}
        />
      </div>
      <div className="flex-shrink-0 text-xs font-medium text-gray-600 min-w-[40px]">
        {formatTime(isPlaying ? currentTime : duration)}
      </div>
    </div>
  );
};

export default AudioPlayer;