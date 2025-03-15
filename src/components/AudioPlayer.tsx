import { useCallback, useEffect, useRef, useState } from "react";
import tetrisTheme1 from "../assets/tetris-theme-1.mp3";
import tetrisTheme2 from "../assets/tetris-theme-2.mp3";
import tetrisTheme3 from "../assets/tetris-theme-3.mp3";
import { HeadphoneOff, Headphones } from "lucide-react";

const themes = [tetrisTheme1, tetrisTheme2, tetrisTheme3];

export function AudioPlayer() {
  const [currentIndex, setCurrentIndex] = useState(
    Math.floor(Math.random() * themes.length)
  );

  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(new Audio(themes[currentIndex]));

  const toggleAudio = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleEnded = useCallback(() => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * themes.length);
    } while (themes.length > 1 && nextIndex === currentIndex);

    setCurrentIndex(nextIndex);
    audioRef.current.src = themes[nextIndex];
  }, [currentIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("ended", handleEnded);

    // Listen for play and pause events to sync UI state
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    // Auto-play on mount/update
    audio.play().catch(() => {});

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [currentIndex, handleEnded]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="flex items-center">
      <button
        onClick={() => toggleAudio()}
        type="button"
        className="p-2 bg-background text-white rounded-full hover:bg-gray-700 cursor-pointer"
      >
        {isPlaying ? <Headphones size={24} /> : <HeadphoneOff size={24} />}
      </button>
    </div>
  );
}
