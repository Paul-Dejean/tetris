import { useRef, useCallback, useEffect } from "react";
import { ActionType, GameStatus, State } from "../state/types";

interface GameLoopProps {
  state: State; // Replace with your state type
  dispatch: (action: { type: ActionType }) => void; // Replace with your dispatch type
  speed: number;
}

export function useGameLoop({ state, dispatch, speed }: GameLoopProps) {
  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);
  const timeAccumulatorRef = useRef(0);

  const gameLoop = useCallback(
    (time: number) => {
      if (state.status === GameStatus.PLAYING && !state.isAnimationRunning) {
        console.log("Game loop running");
        const deltaTime = time - previousTimeRef.current;
        timeAccumulatorRef.current += deltaTime;

        if (timeAccumulatorRef.current >= speed) {
          dispatch({ type: ActionType.TICK });
          timeAccumulatorRef.current = 0;
        }
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(gameLoop);
    },
    [dispatch, state.status, speed, state.isAnimationRunning]
  );

  useEffect(() => {
    previousTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop]);
}
