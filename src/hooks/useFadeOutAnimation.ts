import { useEffect, useRef } from "react";
import { GameAnimation } from "../state/types";

export function useFadeOutAnimation({
  fullLines,
  animation,
  onAnimationComplete,
  duration = 500,
}: {
  fullLines: number[];
  animation: GameAnimation | null;
  onAnimationComplete: () => void;
  duration?: number;
}) {
  const isStarted = useRef(false);
  useEffect(() => {
    console.log("trigger", isStarted.current, animation);
    if (!isStarted.current && animation === GameAnimation.CLEAR_FULL_LINES) {
      isStarted.current = true;
      const elements = fullLines
        .map((line) => document.querySelector(`#row-${line}`))
        .filter((element) => element != null);

      fadeOut(elements as HTMLElement[], duration, () => {
        isStarted.current = false;
        onAnimationComplete();
      });
    }
  }, [fullLines, duration, onAnimationComplete, animation]);
}

function fadeOut(
  elements: HTMLElement[],
  duration = 300,
  callback?: () => void
) {
  let start: number | null = null;
  const step = (timestamp: number) => {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const opacity = Math.max(1 - progress / duration, 0);
    elements.forEach((element) => (element.style.opacity = opacity.toString()));

    if (progress < duration) {
      requestAnimationFrame(step);
    } else {
      if (callback) callback();
      setTimeout(() => {
        elements.forEach((element) => (element.style.opacity = "1"));
      }, 0);
    }
  };
  requestAnimationFrame(step);
}
