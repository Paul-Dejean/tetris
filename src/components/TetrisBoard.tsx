import { useGame } from "../contexts/GameContext";
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import { ActionType, GameStatus } from "../state/types";
import { HoldPiece } from "./HoldPiece";
import { PieceQueue } from "./PieceQueue";

import { Tetromino, tetrominoes } from "../config/tetrominoes";
import { getLevel, getLevelSpeed, renderBoard } from "../engine";
import { useAutoPauseResume } from "../hooks/useAutoPauseResume";
import { useDropPieceAnimation } from "../hooks/useDropAnimation";
import { useFadeOutAnimation } from "../hooks/useFadeOutAnimation";
import { useGameLoop } from "../hooks/useGameLoop";
import { ScreenOrientation, useOrientation } from "../hooks/useOrientation";
import { useTouchControls } from "../hooks/useTouchControls";

import { isMobileDevice } from "../utils/isMobileDevice";
import { AudioPlayer } from "./AudioPlayer";
import { GameOverScreen } from "./GameOverScreen";
import { LandscapeOrientationWarningScreen } from "./LandscapeOrientationWarningScreen";
import { SettingsButton } from "./SettingsButton";
import { TetrisBlock } from "./TetrisBlock";
import { useOrientationPauseResume } from "../hooks/useOrientationPauseResume";
import { useBlockSize } from "../hooks/useBlockSize";

export function TetrisBoard() {
  const { state, dispatch } = useGame();
  const blockSize = useBlockSize();
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
    dispatch,
    animation: state.currentAnimation,
    duration: 200,
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
        if (velocity > 2) {
          dispatch({ type: ActionType.HARD_DROP });
        } else {
          dispatch({ type: ActionType.MOVE_DOWN });
        }
      },
    });

  useAutoPauseResume();
  const orientation = useOrientation();
  useOrientationPauseResume();

  const level = getLevel(state.nbLinesCleared);
  const speed = getLevelSpeed(level);

  return (
    <>
      {orientation === ScreenOrientation.LANDSCAPE && isMobileDevice() && (
        <LandscapeOrientationWarningScreen />
      )}
      <div className="h-full flex flex-col justify-center overflow-hidden bg-[url('/game-wallpaper.webp')] bg-cover bg-center">
        <div className="flex flex-col-reverse items-center justify-center h-full pt-8 md:flex-row md:items-start gap-x-4 gap-y-4 md:h-auto">
          <div className="hidden self-align-start md:block">
            <HoldPiece />
          </div>
          <div
            className="flex items-start justify-center flex-grow w-full h-full md:w-auto md:flex-none md:h-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="border-b border-l border-r border-solid border-primary bg-background">
              {board.map((row, rowIndex) => (
                <div className="flex" key={rowIndex} id={`row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => {
                    if (!cell)
                      return (
                        <div
                          style={{
                            width: blockSize,
                            height: blockSize,
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
          <div className="flex flex-row items-end justify-between gap-4 px-4 mb-4 md:flex-col md:h-full">
            <div className="flex flex-row items-end gap-4 md:flex-col md:items-stretch md:h-full">
              <PieceQueue />

              <div className="p-2 text-center text-white border-2 border-white rounded-lg bg-background">
                <div>Level: {level}</div> <div>Speed: {speed}</div>
              </div>

              <div className="p-2 text-center text-white border-2 border-white rounded-lg bg-background">
                Score: {state.score}
              </div>
            </div>
            <div className="flex flex-col justify-end gap-y-2 md:self-start">
              <div className="hidden md:block">
                <SettingsButton />
              </div>
              <AudioPlayer />
            </div>
          </div>
        </div>

        {state.status === GameStatus.GAME_OVER && <GameOverScreen />}
      </div>
    </>
  );
}
