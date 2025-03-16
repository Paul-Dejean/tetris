import { useEffect } from "react";
import { useGame } from "../contexts/GameContext";
import { ActionType } from "../state/types";

export function useAutoPauseResume() {
  const { dispatch } = useGame();
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        dispatch({ type: ActionType.PAUSE_GAME });
      } else {
        dispatch({ type: ActionType.RESUME_GAME });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch]);
}
