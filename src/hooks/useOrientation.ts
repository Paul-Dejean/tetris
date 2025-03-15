import { useEffect, useState } from "react";

export enum ScreenOrientation {
  PORTRAIT = "portrait",
  LANDSCAPE = "landscape",
}
export function useOrientation() {
  const [orientation, setOrientation] = useState(
    window.matchMedia("(orientation: landscape)").matches
      ? ScreenOrientation.LANDSCAPE
      : ScreenOrientation.PORTRAIT
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: landscape)");

    const handleChange = () => {
      const newOrientation = mediaQuery.matches
        ? ScreenOrientation.LANDSCAPE
        : ScreenOrientation.PORTRAIT;
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
