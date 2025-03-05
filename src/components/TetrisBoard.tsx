import { useCallback, useEffect } from "react";

import { Tetromino, tetrominoes } from "../config/tetrominoes";
import { useGame } from "../contexts/GameContext";
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import { ActionType, GameStatus } from "../state/types";
import { HoldPiece } from "./HoldPiece";
import { PieceQueue } from "./PieceQueue";

import { getLevel, getLevelSpeed, renderBoard } from "../engine";
import { useFadeOutAnimation } from "../hooks/useFadeOutAnimation";
import { useGameLoop } from "../hooks/useGameLoop";
import { useTouchControls } from "../hooks/useTouchControls";
import { AudioPlayer } from "./AudioPlayer";

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

export function TetrisBoard() {
  const { state, dispatch } = useGame();
  const board = renderBoard(state.board, state.currentPiece);
  useGameLoop({
    state,
    dispatch,
    speed: getLevelSpeed(getLevel(state.nbLinesCleared)),
  });

  const onAnimationEnd = useCallback(() => {
    dispatch({ type: ActionType.END_ANIMATION });
    dispatch({ type: ActionType.CLEAR_FULL_LINES });
  }, [dispatch]);
  useFadeOutAnimation({
    fullLines: state.fullLines,
    animation: state.currentAnimation,
    onAnimationComplete: onAnimationEnd,
  });

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

  const { handleTouchStart, handleTouchMove, handleTouchEnd } =
    useTouchControls({
      onTap: () => dispatch({ type: ActionType.ROTATE }),
      onHorizontalDrag: (diff) => {
        if (diff > 10) {
          dispatch({ type: ActionType.MOVE_RIGHT });
        } else if (diff < -10) {
          dispatch({ type: ActionType.MOVE_LEFT });
        }
      },
      onVerticalDrag: (diff) => {
        if (diff > 10) {
          dispatch({ type: ActionType.MOVE_DOWN });
        }
      },
    });

  const level = getLevel(state.nbLinesCleared);
  const speed = getLevelSpeed(level);

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
      <AudioPlayer />
      <div className="h-full overflow-hidden">
        <div className="absolute right-2 top-2 text-white">
          Score: {state.score}
        </div>

        <div className="flex p-8 justify-center gap-x-4">
          <div className="self-align-start">
            <HoldPiece />
          </div>
          <div>
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="border-b border-l border-r border-primary border-solid"
            >
              {board.map((row, rowIndex) => (
                <div className="flex" key={rowIndex} id={`row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => {
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
