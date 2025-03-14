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

  const audioRef = useRef(new Audio(themes[currentIndex]));

  const toggleAudio = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
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
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, handleEnded]);

  return (
    <div className="flex items-center">
      <button
        onClick={() => toggleAudio()}
        type="button"
        className="p-2 bg-background text-white rounded-full hover:bg-gray-700"
      >
        {audioRef.current.paused ? (
          <HeadphoneOff size={24} />
        ) : (
          <Headphones size={24} />
        )}
      </button>
    </div>
  );
}
