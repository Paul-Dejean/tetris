import { useEffect } from "react";

import { Tetromino, tetrominoes } from "../config/tetrominoes";
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
    cellHeight: 32,
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
      onHorizontalDrag: (diff) => {
        if (diff > 25) {
          dispatch({ type: ActionType.MOVE_RIGHT });
        } else if (diff < -25) {
          dispatch({ type: ActionType.MOVE_LEFT });
        }
      },
      onVerticalDrag: (diff) => {
        if (diff > 25) {
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
        <div className="flex pt-8 justify-center gap-x-4">
          <div className="self-align-start">
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
                    const style = createCellStyle(cell);

                    return (
                      <div
                        id={`cell-${rowIndex}-${cellIndex}`}
                        key={cellIndex}
                        className=" w-8 h-8"
                        style={style}
                      ></div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <PieceQueue />

            <div className="text-white text-center my-2 border-2 border-white rounded-lg p-2 bg-background">
              <div>Level: {level}</div> <div>Speed: {speed}</div>
            </div>

            <div className=" text-white text-center my-2 border-2 border-white rounded-lg p-2 bg-background">
              Score: {state.score}
            </div>
            <div className="flex flex-col gap-y-2">
              <SettingsButton />
              <AudioPlayer />
            </div>
          </div>
        </div>

        {state.status === GameStatus.GAME_OVER && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-y-8">
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
