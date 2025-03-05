import { useState } from "react";
import tetrisTheme1 from "../assets/tetris-theme-1.mp3";
import tetrisTheme2 from "../assets/tetris-theme-2.mp3";
import tetrisTheme3 from "../assets/tetris-theme-3.mp3";

export function AudioPlayer() {
  const themes = [tetrisTheme1, tetrisTheme2, tetrisTheme3];
  const [currentIndex, setCurrentIndex] = useState(
    Math.floor(Math.random() * themes.length)
  );

  const handleEnded = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * themes.length);
    } while (themes.length > 1 && nextIndex === currentIndex);

    setCurrentIndex(nextIndex);
  };

  return (
    <audio src={themes[currentIndex]} autoPlay onEnded={handleEnded}></audio>
  );
}
