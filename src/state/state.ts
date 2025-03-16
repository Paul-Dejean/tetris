import { GAME_HEIGHT, GAME_WIDTH, INITIAL_POSITION } from "../config/constants";
import { createNextPiecesQueue } from "../engine";
import { Tetromino } from "../config/tetrominoes";
import { State, GameStatus } from "./types";

export const initialSettings = {
  moveDown: "ArrowDown",
  moveLeft: "ArrowLeft",
  moveRight: "ArrowRight",
  rotateRight: "ArrowUp",
  rotateLeft: "KeyC",
  hardDrop: "Space",
  holdPiece: "ShiftLeft",
};

export function init(): State {
  const nextPiecesQueue = createNextPiecesQueue();
  const currentPieceType = nextPiecesQueue.shift() as Tetromino;
  return {
    status: GameStatus.PLAYING,
    board: Array.from({ length: GAME_HEIGHT }, () =>
      Array.from({ length: GAME_WIDTH }, () => "")
    ),
    currentPiece: {
      type: currentPieceType,
      position: INITIAL_POSITION,
      rotation: 0,
      isGhost: false,
    },
    fullLines: [],
    score: 0,
    nextPiecesQueue,
    holdPiece: null,
    canHold: true,
    nbLinesCleared: 0,
    currentAnimation: null,
    settingsModalOpen: false,
    settings: initialSettings,
    lockDelayCounter: 0,
    lockDelayResets: 0,
  };
}
