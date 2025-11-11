import { useRef, TouchEvent } from "react";

type DragDetectorOptions = {
  onTap?: () => void;
  onRightDrag?: () => void;
  onLeftDrag?: () => void;
  onDownDrag?: (velocity: number) => void;
};

const HORIZONTAL_THRESHOLD = 20;
const VERTICAL_THRESHOLD = 15;
const TAP_THRESHOLD = 10;

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

  const animationFrameRef = useRef<number | null>(null);

  const handleTouchStart = (e: TouchEvent<HTMLElement>) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

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
    if (animationFrameRef.current) return;
    animationFrameRef.current = requestAnimationFrame(() => {
      const touch = e.touches[0];
      if (!touch) return;
      const { lastX, lastY } = touchDataRef.current;
      const currentX = touch.clientX;
      const currentY = touch.clientY;

      const deltaX = currentX - lastX;
      const deltaY = currentY - lastY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > HORIZONTAL_THRESHOLD) {
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
          if (deltaY > VERTICAL_THRESHOLD) {
            onDownDrag?.(velocity);
            touchDataRef.current.startTime = now;
            touchDataRef.current.lastX = currentX;
            touchDataRef.current.lastY = currentY;
          }
        }
      }
      animationFrameRef.current = null;
    });
  };

  const handleTouchEnd = (e: TouchEvent<HTMLElement>) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    const touch = e.changedTouches[0];
    if (!touch) return;
    const diffX = touch.clientX - touchDataRef.current.startX;
    const diffY = touch.clientY - touchDataRef.current.startY;
    if (Math.abs(diffX) < TAP_THRESHOLD && Math.abs(diffY) < TAP_THRESHOLD) {
      onTap?.();
    }
  };

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
}
