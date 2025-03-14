import { useCallback, useEffect } from "react";
import { useGame } from "../contexts/GameContext";
import { Settings } from "../state/types";

type KeyCallbacks = {
  [key in keyof Settings]: () => void; // Allow any key mapping dynamically
};
export function useKeyboardControls(callbacks: KeyCallbacks) {
  const { state } = useGame();
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();
      const action = Object.keys(state.settings).find(
        (action) => state.settings[action as keyof Settings] === event.code
      ) as keyof Settings | undefined;
      if (action && callbacks[action]) {
        callbacks[action]();
      }
    },
    [callbacks, state.settings]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [state.settings, handleKeyDown]);
}
