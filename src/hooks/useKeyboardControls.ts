import { useEffect } from "react";
const KEYBOARD_CONTROL_KEYS = {
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  UP: "ArrowUp",
  SPACE: " ",
};

type KeyCallbacks = {
  onLeft?: () => void;
  onRight?: () => void;
  onDown?: () => void;
  onUp?: () => void;
  onSpace?: () => void;
};

export function useKeyboardControls(callbacks: KeyCallbacks) {
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case KEYBOARD_CONTROL_KEYS.LEFT:
        callbacks.onLeft?.();
        break;
      case KEYBOARD_CONTROL_KEYS.RIGHT:
        callbacks.onRight?.();
        break;
      case KEYBOARD_CONTROL_KEYS.DOWN:
        callbacks.onDown?.();
        break;
      case KEYBOARD_CONTROL_KEYS.UP:
        callbacks.onUp?.();
        break;
      case KEYBOARD_CONTROL_KEYS.SPACE:
        callbacks.onSpace?.();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
