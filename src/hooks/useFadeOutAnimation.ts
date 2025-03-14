import { useEffect, useRef } from "react";
import { Action, ActionType, GameAnimation } from "../state/types";

export function useFadeOutAnimation({
  fullLines,
  animation,
  dispatch,
  duration = 200,
}: {
  fullLines: number[];
  animation: GameAnimation | null;
  dispatch: (action: Action) => void;
  duration?: number;
}) {
  const isStarted = useRef(false);
  useEffect(() => {
    if (!isStarted.current && animation === GameAnimation.CLEAR_FULL_LINES) {
      isStarted.current = true;
      const elements = fullLines
        .map((line) => document.querySelector(`#row-${line}`))
        .filter((element) => element != null);

      fadeOut(elements as HTMLElement[], duration, () => {
        isStarted.current = false;
        dispatch({ type: ActionType.END_ANIMATION });
        dispatch({ type: ActionType.CLEAR_FULL_LINES });
      });
    }
  }, [fullLines, duration, dispatch, animation]);
}

function fadeOut(
  elements: HTMLElement[],
  duration: number,
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
