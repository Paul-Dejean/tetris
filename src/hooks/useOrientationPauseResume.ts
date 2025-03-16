import { useEffect } from "react";
import { useGame } from "../contexts/GameContext";
import { ActionType, GameStatus } from "../state/types";
import { isMobileDevice } from "../utils/isMobileDevice";
import { useOrientation, ScreenOrientation } from "./useOrientation";

export function useOrientationPauseResume() {
  const orientation = useOrientation();
  const { state, dispatch } = useGame();

  useEffect(() => {
    if (
      state.status === GameStatus.PLAYING &&
      orientation === ScreenOrientation.LANDSCAPE &&
      isMobileDevice()
    ) {
      dispatch({ type: ActionType.PAUSE_GAME });
    } else if (
      state.status === GameStatus.PAUSED &&
      orientation === ScreenOrientation.PORTRAIT &&
      isMobileDevice()
    ) {
      dispatch({ type: ActionType.RESUME_GAME });
    }
  }, [orientation, dispatch, state.status]);
}
