import { useCallback, useEffect, useRef, useState } from "react";
import { useGame } from "../contexts/GameContext";
import { ActionType, GameStatus } from "../contexts/GameContext/types";
import { Tetromino, tetrominoes } from "../contexts/GameContext/tetrominoes";
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import tetrisTheme from "../assets/tetris-theme.mp3";
import { PieceQueue } from "./PieceQueue";
import { HoldPiece } from "./HoldPiece";
import { getLevel, getLevelSpeed } from "../contexts/GameContext/Provider";

function createCellStyle(cell: string) {
  if (!cell) return {};

  if (cell.startsWith("G")) {
    const color = tetrominoes[cell[1] as Tetromino].color;

    return {
      backgroundColor: color,
      borderWidth: "5px",
      borderStyle: "outset",
      borderRadius: "2px",
      borderColor: color,
      opacity: 0.3,
    };
  }
  return {
    backgroundColor: tetrominoes[cell as Tetromino].color,
    borderWidth: "5px",
    borderStyle: "outset",
    borderRadius: "2px",
    borderColor: tetrominoes[cell as Tetromino].color,
  };
}

function fadeOut(element: HTMLElement, duration = 300, callback?: () => void) {
  let start: number | null = null;
  console.log({ element });
  const step = (timestamp: number) => {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const opacity = Math.max(1 - progress / duration, 0);
    element.style.opacity = opacity.toString();
    if (progress < duration) {
      requestAnimationFrame(step);
    } else {
      element.style.opacity = "1";

      if (callback) callback();
    }
  };
  requestAnimationFrame(step);
}

export function TetrisBoard() {
  const { state, dispatch } = useGame();
  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);
  const board = state.board;
  const timeAccumulatorRef = useRef(0);
  const [isClearingLines, setIsClearingLines] = useState(false);

  useKeyboardControls({
    onLeft: () => dispatch({ type: ActionType.MOVE_LEFT }),
    onRight: () => dispatch({ type: ActionType.MOVE_RIGHT }),
    onDown: () => dispatch({ type: ActionType.MOVE_DOWN }),
    onSpace: () => {
      dispatch({ type: ActionType.HARD_DROP });
    },
    onUp: () => dispatch({ type: ActionType.ROTATE }),
    onShift: () => dispatch({ type: ActionType.HOLD_PIECE }),
  });

  const level = getLevel(state.nbLinesCleared);
  const speed = getLevelSpeed(level);

  const gameLoop = useCallback(
    (time: number) => {
      if (state.status === GameStatus.PLAYING && previousTimeRef.current) {
        const deltaTime = time - previousTimeRef.current;
        timeAccumulatorRef.current += deltaTime;

        if (timeAccumulatorRef.current >= speed && !state.fullLines.length) {
          dispatch({ type: ActionType.TICK });
          timeAccumulatorRef.current = 0;
        }

        if (state.fullLines.length && !isClearingLines) {
          console.log("Clearing lines", isClearingLines);

          setIsClearingLines(true);

          const lineElements = state.fullLines.map((line) => {
            return document.querySelector(`#row-${line}`);
          });
          console.log({ lineElements });

          let nb = 0;
          lineElements.forEach((lineElement) => {
            if (lineElement) {
              fadeOut(lineElement as HTMLElement, 500, () => {
                nb += 1;
                if (nb === state.fullLines.length) {
                  dispatch({ type: ActionType.CLEAR_FULL_LINES });
                  setIsClearingLines(false);
                  timeAccumulatorRef.current = 0;
                }
              });
            }
          });
        }
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(gameLoop);
    },
    [dispatch, state.fullLines, state.status, isClearingLines, speed]
  );

  useEffect(() => {
    // previousTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop]);

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

  return (
    <>
      <audio src={tetrisTheme} autoPlay loop></audio>
      <div className="h-full">
        <div className="absolute right-2 top-2 text-white">
          Score: {state.score}
        </div>

        <div className="flex p-8 justify-center gap-x-4">
          <div className="self-align-start">
            <HoldPiece />
          </div>
          <div>
            <div className="border-b border-l border-r border-primary border-solid">
              {board.map((row, rowIndex) => (
                <div className="flex" key={rowIndex} id={`row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => {
                    // console.log({ cell });
                    const style = createCellStyle(cell);

                    return (
                      <div
                        key={cellIndex}
                        className=" w-8 h-8"
                        style={style}
                      ></div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="text-white text-center">
              Level: {level} Speed: {speed}
            </div>
          </div>
          <div className="self-align-start">
            <PieceQueue />
          </div>
        </div>
        {state.status === GameStatus.GAME_OVER && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-y-8">
            <div className="text-white text-4xl">Game Over</div>
            <div className="text-white text-2xl">Score: {state.score}</div>
            <button
              className="border-primary border-1 rounded-lg text-white py-2 px-4 text-xl"
              onClick={() => dispatch({ type: ActionType.RESTART_GAME })}
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
