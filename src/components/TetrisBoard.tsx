import { useEffect } from "react";

import { useGame } from "../contexts/GameContext";
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import { ActionType, GameStatus } from "../state/types";
import { HoldPiece } from "./HoldPiece";
import { PieceQueue } from "./PieceQueue";

import { getLevel, getLevelSpeed, renderBoard } from "../engine";
import { useDropPieceAnimation } from "../hooks/useDropAnimation";
import { useFadeOutAnimation } from "../hooks/useFadeOutAnimation";
import { useGameLoop } from "../hooks/useGameLoop";
import { useTouchControls } from "../hooks/useTouchControls";
import { AudioPlayer } from "./AudioPlayer";
import { SettingsButton } from "./SettingsButton";
import { getBlockSize } from "../utils/blockSize";
import { TetrisBlock } from "./TetrisBlock";
import { Tetromino, tetrominoes } from "../config/tetrominoes";

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): T {
  let lastCall = 0;

  return function (...args: unknown[]) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      return func(...args);
    }
  } as T;
}

export function TetrisBoard() {
  const { state, dispatch } = useGame();
  const board = renderBoard(
    state.board,
    state.currentPiece,
    state.currentAnimation
  );
  useGameLoop({
    state,
    dispatch,
    speed: getLevelSpeed(getLevel(state.nbLinesCleared)),
  });

  useFadeOutAnimation({
    fullLines: state.fullLines,
    animation: state.currentAnimation,
    dispatch,
    duration: 150,
  });

  useDropPieceAnimation({
    board: state.board,
    piece: state.currentPiece,
    cellHeight: getBlockSize(),
    dispatch,
    animation: state.currentAnimation,
    duration: 150,
  });

  useKeyboardControls({
    moveLeft: () => dispatch({ type: ActionType.MOVE_LEFT }),
    moveRight: () => dispatch({ type: ActionType.MOVE_RIGHT }),
    moveDown: () => dispatch({ type: ActionType.MOVE_DOWN }),
    hardDrop: () => {
      dispatch({ type: ActionType.HARD_DROP });
    },
    rotateLeft: () => dispatch({ type: ActionType.ROTATE_LEFT }),
    rotateRight: () => dispatch({ type: ActionType.ROTATE_RIGHT }),
    holdPiece: () => dispatch({ type: ActionType.HOLD_PIECE }),
  });

  const { handleTouchStart, handleTouchMove, handleTouchEnd } =
    useTouchControls({
      onTap: () => dispatch({ type: ActionType.ROTATE_RIGHT }),
      onLeftDrag: () => dispatch({ type: ActionType.MOVE_LEFT }),
      onRightDrag: () => dispatch({ type: ActionType.MOVE_RIGHT }),
      onDownDrag: (velocity) => {
        if (velocity > 1) {
          dispatch({ type: ActionType.HARD_DROP });
        } else {
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
      <div className="h-full flex flex-col justify-center overflow-hidden bg-[url('/game-wallpaper.webp')] bg-cover bg-center">
        <div className="flex pt-8  flex-col-reverse md:flex-row justify-center items-center md:items-start gap-x-4 gap-y-4">
          <div className="self-align-start md:block hidden">
            <HoldPiece />
          </div>
          <div>
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="border-b border-l border-r border-primary border-solid bg-background"
            >
              {board.map((row, rowIndex) => (
                <div className="flex" key={rowIndex} id={`row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => {
                    if (!cell)
                      return (
                        <div
                          style={{
                            width: getBlockSize(),
                            height: getBlockSize(),
                          }}
                        />
                      );
                    const id = `cell-${rowIndex}-${cellIndex}`;
                    if (cell.startsWith("G")) {
                      const color = tetrominoes[cell[1] as Tetromino].color;
                      return <TetrisBlock id={id} color={color} isGhost />;
                    }
                    const color = tetrominoes[cell as Tetromino]?.color ?? "";

                    return <TetrisBlock id={id} key={id} color={color} />;
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-row md:flex-col items-center justify-between   px-4 gap-4">
            <div className="flex flex-row gap-4 md:flex-col items-center">
              <PieceQueue />

              <div className="text-white text-center my-2 border-2 border-white rounded-lg p-2 bg-background">
                <div>Level: {level}</div> <div>Speed: {speed}</div>
              </div>

              <div className=" text-white text-center my-2 border-2 border-white rounded-lg p-2 bg-background">
                Score: {state.score}
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="md:block hidden">
                <SettingsButton />
              </div>
              <AudioPlayer />
            </div>
          </div>
        </div>

        {state.status === GameStatus.GAME_OVER && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-y-8">
            <div className="text-white text-4xl">Game Over</div>
            <div className="text-white text-2xl">Score: {state.score}</div>
            <button
              className="border-primary border-1 rounded-lg text-white py-2 px-4 text-xl cursor-pointer"
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
