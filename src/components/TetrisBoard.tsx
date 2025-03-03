import { useEffect, useRef } from "react";
import { useGame } from "../contexts/GameContext";
import { ActionType } from "../contexts/GameContext/types";
import { Tetromino, tetrominoes } from "../contexts/GameContext/tetrominoes";
import { useKeyboardControls } from "../hooks/useKeyboardControls";

const FALLING_SPEED = 1000;
export function TetrisBoard() {
  const { state, dispatch } = useGame();
  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);
  const board = state.board;
  const timeAccumulatorRef = useRef(0);
  //   console.log({ board });

  useKeyboardControls({
    onLeft: () => dispatch({ type: ActionType.MOVE_LEFT }),
    onRight: () => dispatch({ type: ActionType.MOVE_RIGHT }),
    onDown: () => dispatch({ type: ActionType.MOVE_DOWN }),
    onSpace: () => {
      console.log("space");
      dispatch({ type: ActionType.HARD_DROP });
    },
    onUp: () => dispatch({ type: ActionType.ROTATE }),
  });
  const gameLoop = (time: number) => {
    if (previousTimeRef.current) {
      const deltaTime = time - previousTimeRef.current;
      timeAccumulatorRef.current += deltaTime;

      if (timeAccumulatorRef.current >= FALLING_SPEED) {
        dispatch({ type: ActionType.TICK });
        timeAccumulatorRef.current = 0;
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="h-full">
      <div className="absolute right-2 top-2 text-white">
        Score: {state.score}
      </div>
      <div className="flex p-8 justify-center">
        <div className="border border-primary border-solid">
          {board.map((row, rowIndex) => (
            <div className="flex" key={rowIndex}>
              {row.map((cell, cellIndex) => {
                // console.log({ cell });
                const style = cell
                  ? {
                      backgroundColor: tetrominoes[cell as Tetromino].color,
                      borderWidth: "5px",
                      borderStyle: "outset",
                      borderRadius: "2px",
                      borderColor: tetrominoes[cell as Tetromino].color,
                    }
                  : {};

                return (
                  <div
                    key={cellIndex}
                    className="border w-8 h-8"
                    style={style}
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
