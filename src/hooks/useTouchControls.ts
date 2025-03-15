import { useRef, TouchEvent } from "react";

type DragDetectorOptions = {
  onTap?: () => void;
  onRightDrag?: () => void;
  onLeftDrag?: () => void;
  onDownDrag?: (velocity: number) => void;
};

const MOVE_THRESHOLD = 15;

export function useTouchControls({
  onTap,
  onRightDrag,
  onLeftDrag,
  onDownDrag,
}: DragDetectorOptions) {
  const touchDataRef = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    startTime: 0,
  });

  const handleTouchStart = (e: TouchEvent<HTMLElement>) => {
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    const now = Date.now();

    touchDataRef.current = {
      startX: x,
      startY: y,
      lastX: x,
      lastY: y,
      startTime: now,
    };
  };

  const handleTouchMove = (e: TouchEvent<HTMLElement>) => {
    const touch = e.touches[0];
    const { lastX, lastY } = touchDataRef.current;
    const currentX = touch.clientX;
    const currentY = touch.clientY;

    const deltaX = currentX - lastX;
    const deltaY = currentY - lastY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > MOVE_THRESHOLD) {
        if (deltaX < 0) {
          onLeftDrag?.();
        } else {
          onRightDrag?.();
        }
        touchDataRef.current.lastX = currentX;
        touchDataRef.current.lastY = currentY;
      }
    } else {
      const now = Date.now();
      const deltaTime = now - touchDataRef.current.startTime;
      if (deltaTime > 0) {
        const velocity = Math.abs(deltaY) / deltaTime;
        if (deltaY > MOVE_THRESHOLD) {
          onDownDrag?.(velocity);
          touchDataRef.current.startTime = now;
          touchDataRef.current.lastX = currentX;
          touchDataRef.current.lastY = currentY;
        }
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLElement>) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const diffX = touch.pageX - touchDataRef.current.startX;
    const diffY = touch.pageY - touchDataRef.current.startY;
    if (Math.abs(diffX) < MOVE_THRESHOLD && Math.abs(diffY) < MOVE_THRESHOLD) {
      onTap?.();
    }
  };

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
}
