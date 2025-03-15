import { useEffect, useState } from "react";

export enum ScreenOrientation {
  PORTRAIT = "portrait",
  LANDSCAPE = "landscape",
}
export function useOrientation() {
  const [orientation, setOrientation] = useState(
    window.matchMedia("(orientation: portrait)").matches
      ? ScreenOrientation.PORTRAIT
      : ScreenOrientation.LANDSCAPE
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: portrait)");

    const handleChange = () => {
      const newOrientation = mediaQuery.matches
        ? ScreenOrientation.PORTRAIT
        : ScreenOrientation.LANDSCAPE;
      setOrientation(newOrientation);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return orientation;
}
