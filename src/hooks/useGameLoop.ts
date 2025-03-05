import { useRef, useCallback, useEffect } from "react";
import { Action, ActionType, GameStatus, State } from "../state/types";

interface GameLoopProps {
  state: State; // Replace with your state type
  dispatch: (action: Action) => void; // Replace with your dispatch type
  speed: number;
}

export function useGameLoop({ state, dispatch, speed }: GameLoopProps) {
  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);
  const timeAccumulatorRef = useRef(0);

  const gameLoop = useCallback(
    (time: number) => {
      // console.log({ Animation: state.currentAnimation });
      if (state.status === GameStatus.PLAYING && !state.currentAnimation) {
        // console.log("Game loop running");
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
