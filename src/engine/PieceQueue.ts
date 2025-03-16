import { INITIAL_POSITION } from "../config/constants";
import { tetrominoes, Tetromino } from "../config/tetrominoes";
import { Piece } from "../state/types";

export function createNextPiecesQueue() {
  return shuffle(Object.keys(tetrominoes) as Tetromino[]);
}

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function createNewPiece(nextPiecesQueue: Tetromino[]): {
  piece: Piece;
  nextPiecesQueue: Tetromino[];
} {
  const type = nextPiecesQueue.shift() as Tetromino;
  if (nextPiecesQueue.length == 0) {
    nextPiecesQueue.push(...createNextPiecesQueue());
  }
  return {
    piece: {
      type,
      position: INITIAL_POSITION,
      rotation: 0,
      isGhost: false,
    },
    nextPiecesQueue,
  };
}
