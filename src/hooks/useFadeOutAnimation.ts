import { useEffect } from "react";

export function useFadeOutAnimation(
  fullLines: number[],
  onAnimationStart: () => void,
  onAnimationComplete: () => void,
  duration = 500
) {
  useEffect(() => {
    if (fullLines.length) {
      onAnimationStart();
      let completed = 0;
      fullLines.forEach((line) => {
        const element = document.querySelector(`#row-${line}`);
        if (element) {
          fadeOut(element as HTMLElement, duration, () => {
            completed++;
            if (completed === fullLines.length) {
              onAnimationComplete();
            }
          });
        }
      });
    }
  }, [fullLines, duration, onAnimationComplete, onAnimationStart]);
}

function fadeOut(element: HTMLElement, duration = 300, callback?: () => void) {
  let start: number | null = null;
  const step = (timestamp: number) => {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const opacity = Math.max(1 - progress / duration, 0);
    element.style.opacity = opacity.toString();
    if (progress < duration) {
      requestAnimationFrame(step);
    } else {
      if (callback) callback();
      setTimeout(() => (element.style.opacity = "1"), 0);
    }
  };
  requestAnimationFrame(step);
}
