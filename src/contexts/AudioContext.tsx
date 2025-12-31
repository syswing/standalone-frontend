
import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  isMusicPlaying: boolean;
  setIsMusicPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  currentTrack: Track | null;
  setCurrentTrack: React.Dispatch<React.SetStateAction<Track | null>>;
  playlist: Track[];
  setPlaylist: React.Dispatch<React.SetStateAction<Track[]>>;
  currentTrackIndex: number;
  setCurrentTrackIndex: React.Dispatch<React.SetStateAction<number>>;
}

interface Track {
  id: number;
  title: string;
  artist?: string;
  album?: string;
  duration: number;
  cover?: string;
  url: string;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // 监听音频播放状态变化
  useEffect(() => {
    console.log('audioRef')
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsMusicPlaying(true);
    const handlePause = () => setIsMusicPlaying(false);
    const handleEnded = () => setIsMusicPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // 当播放列表或当前索引变化时，更新当前曲目
  useEffect(() => {
    console.log('8')
    if (playlist.length > 0 && currentTrackIndex >= 0 && currentTrackIndex < playlist.length) {
      setCurrentTrack(playlist[currentTrackIndex]);
    }
  }, [playlist, currentTrackIndex]);

  return (
    <AudioContext.Provider 
      value={{ 
        audioRef, 
        isMusicPlaying, 
        setIsMusicPlaying,
        currentTrack,
        setCurrentTrack,
        playlist,
        setPlaylist,
        currentTrackIndex,
        setCurrentTrackIndex,
      }}
    >
      {children}
      {/* 全局音频元素 */}
      <audio 
        ref={audioRef}
        style={{ display: 'none' }}
      />
    </AudioContext.Provider>
  );
};
