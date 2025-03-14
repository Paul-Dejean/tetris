import { useRef, TouchEvent } from "react";

const tapThreshold = 10;

type DragDetectorOptions = {
  onTap?: () => void;
  onVerticalDrag?: (diff: number) => void;
  onHorizontalDrag?: (diff: number) => void;
};

export function useTouchControls({
  onTap,
  onVerticalDrag,
  onHorizontalDrag,
}: DragDetectorOptions) {
  const startX = useRef(0);
  const startY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e: TouchEvent<HTMLElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    startX.current = touch.pageX;
    startY.current = touch.pageY;
    isDragging.current = false;
  };

  const handleTouchMove = (e: TouchEvent<HTMLElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const diffX = touch.pageX - startX.current;
    const diffY = touch.pageY - startY.current;

    if (
      !isDragging.current &&
      (Math.abs(diffX) > tapThreshold || Math.abs(diffY) > tapThreshold)
    ) {
      isDragging.current = true;
    }

    if (isDragging.current) {
      if (Math.abs(diffX) > Math.abs(diffY)) {
        onHorizontalDrag?.(diffX);
      } else {
        onVerticalDrag?.(diffY);
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLElement>) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const diffX = touch.pageX - startX.current;
    const diffY = touch.pageY - startY.current;

    if (
      !isDragging.current &&
      Math.abs(diffX) < tapThreshold &&
      Math.abs(diffY) < tapThreshold
    ) {
      onTap?.();
    }
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
