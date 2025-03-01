import { useEffect, useRef } from "react";
import { useGame } from "../contexts/GameContext";
import { ActionType } from "../contexts/GameContext/types";
import {
  Tetromino,
  tetrominoColors,
} from "../contexts/GameContext/tetrominoes";

const FALLING_SPEED = 300;
export function TetrisBoard() {
  const { state, dispatch } = useGame();
  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);
  const board = state.board;
  const timeAccumulatorRef = useRef(0);
  console.log({ board });
  const gameLoop = (time: number) => {
    if (previousTimeRef.current) {
      // Calculate time difference between frames
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
      <div className="flex p-8 justify-center">
        <div className="border border-primary border-solid">
          {board.map((row, rowIndex) => (
            <div className="flex" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className="border w-8 h-8"
                  style={{
                    backgroundColor: cell && tetrominoColors[cell as Tetromino],
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
