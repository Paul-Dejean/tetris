import { State, GameStatus } from "../state/types";

export function pauseGame(state: State): State {
  if (state.status !== GameStatus.PLAYING) {
    return state;
  }
  return {
    ...state,
    status: GameStatus.PAUSED,
  };
}

export function resumeGame(state: State): State {
  if (state.status !== GameStatus.PAUSED) {
    return state;
  }
  return {
    ...state,
  };
}

export function startGameAnimation(state: State): State {
  return {
    ...state,
    isAnimationRunning: true,
  };
}

export function endGameAnimation(state: State): State {
  return {
    ...state,
    isAnimationRunning: false,
  };
}
