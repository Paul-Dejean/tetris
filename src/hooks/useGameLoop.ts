import { useRef, useCallback, useEffect } from "react";
import { Action, ActionType, GameStatus, State } from "../state/types";

interface GameLoopProps {
  state: State;
  dispatch: (action: Action) => void;
  speed: number;
}

export function useGameLoop({ state, dispatch, speed }: GameLoopProps) {
  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);
  const timeAccumulatorRef = useRef(0);

  const gameLoop = useCallback(
    (time: number) => {
      if (state.status === GameStatus.PLAYING && !state.currentAnimation) {
        const deltaTime = time - previousTimeRef.current;
        timeAccumulatorRef.current += deltaTime;

        if (timeAccumulatorRef.current >= speed) {
          dispatch({ type: ActionType.TICK });
          timeAccumulatorRef.current = 0;
        }

        dispatch({ type: ActionType.UPDATE_LOCK_DELAY });
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(gameLoop);
    },
    [dispatch, state.status, speed, state.currentAnimation]
  );

  useEffect(() => {
    previousTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop]);
}
