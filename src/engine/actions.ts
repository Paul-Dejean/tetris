import { GAME_WIDTH, initialPosition } from "../config/constants";
import {
  GameAnimation,
  GameStatus,
  Piece,
  Rotation,
  State,
} from "../state/types";
import {
  addPieceToBoard,
  getFullLines,
  getLastValidPosition,
  getPieceBlocksCoordinates,
  isPlacementValid,
} from "./board";
import { createNewPiece } from "./PieceQueue";
import { calculateScore } from "./score";

export function moveDown(state: State): State {
  if (state.currentAnimation || state.status !== GameStatus.PLAYING) {
    return state;
  }

  const updatedPiece = tryMove(state.board, state.currentPiece, (piece) => ({
    ...piece,
    position: { ...piece.position, y: piece.position.y + 1 },
  }));

  if (updatedPiece !== state.currentPiece) {
    return {
      ...state,
      currentPiece: updatedPiece,
    };
  }

  const board = state.board.map((row) => [...row]);
  addPieceToBoard(board, state.currentPiece);
  const fullLines = getFullLines(board);
  if (fullLines.length) {
    return {
      ...state,
      board,
      fullLines,
      currentAnimation: GameAnimation.CLEAR_FULL_LINES,
    };
  }

  const { piece: newPiece, nextPiecesQueue } = createNewPiece([
    ...state.nextPiecesQueue,
  ]);

  const isGameOver = !isPlacementValid(board, newPiece);
  const newState = {
    ...state,
    status: isGameOver ? GameStatus.GAME_OVER : GameStatus.PLAYING,
    board,
    currentPiece: newPiece,
    nextPiecesQueue,
    canHold: true,
    fullLines,
  };
  return newState;
}

export function moveLeft(state: State): State {
  if (state.currentAnimation || state.status !== GameStatus.PLAYING) {
    return state;
  }
  const updatedPiece = tryMove(state.board, state.currentPiece, (piece) => ({
    ...piece,
    position: { ...piece.position, x: piece.position.x - 1 },
  }));

  return {
    ...state,
    currentPiece: updatedPiece,
  };
}

export function rotateRight(state: State): State {
  if (state.currentAnimation || state.status !== GameStatus.PLAYING) {
    return state;
  }

  const rotatedPiece = {
    ...state.currentPiece,
    rotation: ((state.currentPiece.rotation + 1) % 4) as Rotation,
  };

  const coordinates = getPieceBlocksCoordinates(rotatedPiece);

  const minX = Math.min(...coordinates.map((c) => c.x));
  const maxX = Math.max(...coordinates.map((c) => c.x));

  if (minX < 0) {
    rotatedPiece.position.x -= minX;
  } else if (maxX >= GAME_WIDTH) {
    rotatedPiece.position.x -= maxX - GAME_WIDTH + 1;
  }

  const updatedPiece = tryMove(state.board, rotatedPiece, (piece) => piece);
  return {
    ...state,
    currentPiece: updatedPiece,
  };
}

export function rotateLeft(state: State): State {
  if (state.currentAnimation || state.status !== GameStatus.PLAYING) {
    return state;
  }

  const rotatedPiece = {
    ...state.currentPiece,
    rotation: ((state.currentPiece.rotation + 3) % 4) as Rotation,
  };

  const coordinates = getPieceBlocksCoordinates(rotatedPiece);

  const minX = Math.min(...coordinates.map((c) => c.x));
  const maxX = Math.max(...coordinates.map((c) => c.x));

  if (minX < 0) {
    rotatedPiece.position.x -= minX;
  } else if (maxX >= GAME_WIDTH) {
    rotatedPiece.position.x -= maxX - GAME_WIDTH + 1;
  }

  const updatedPiece = tryMove(state.board, rotatedPiece, (piece) => piece);
  return {
    ...state,
    currentPiece: updatedPiece,
  };
}

export function moveRight(state: State): State {
  if (state.currentAnimation || state.status !== GameStatus.PLAYING) {
    return state;
  }

  const updatedPiece = tryMove(state.board, state.currentPiece, (piece) => ({
    ...piece,
    position: { ...piece.position, x: piece.position.x + 1 },
  }));

  return {
    ...state,
    currentPiece: updatedPiece,
  };
}

export function finishHardDrop(state: State): State {
  const board = state.board.map((row) => [...row]);

  const updatedPiece = tryMove(state.board, state.currentPiece, (piece) => ({
    ...piece,
    position: getLastValidPosition(state.board, piece),
  }));
  addPieceToBoard(board, updatedPiece);

  const fullLines = getFullLines(board);
  if (fullLines.length) {
    return {
      ...state,
      board,
      fullLines,
      currentPiece: updatedPiece,
      currentAnimation: GameAnimation.CLEAR_FULL_LINES,
    };
  }

  const { piece: createPiece, nextPiecesQueue } = createNewPiece([
    ...state.nextPiecesQueue,
  ]);
  const isGameOver = !isPlacementValid(board, createPiece);
  const newState = {
    ...state,
    status: isGameOver ? GameStatus.GAME_OVER : GameStatus.PLAYING,
    board,
    currentPiece: createPiece,
    nextPiecesQueue,
    fullLines,
    canHold: true,
    currentAnimation: null,
  };
  return newState;
}

export function hardDrop(state: State): State {
  if (state.currentAnimation || state.status !== GameStatus.PLAYING) {
    return state;
  }

  return {
    ...state,
    currentAnimation: GameAnimation.DROP_PIECE,
  };
}

export function holdPiece(state: State): State {
  if (
    !state.canHold ||
    state.currentAnimation ||
    state.status !== GameStatus.PLAYING
  ) {
    return state;
  }
  const piece = state.currentPiece;
  const board = state.board.map((row) => [...row]);

  if (!state.holdPiece) {
    const { piece: newPiece, nextPiecesQueue } = createNewPiece([
      ...state.nextPiecesQueue,
    ]);
    const newState = {
      ...state,
      board,
      currentPiece: newPiece,
      holdPiece: piece.type,
      canHold: false,
      nextPiecesQueue,
    };

    return newState;
  }
  const newPiece = {
    type: state.holdPiece,
    position: initialPosition,
    rotation: 0 as Rotation,
    isGhost: false,
  };

  const newState = {
    ...state,
    board,
    currentPiece: newPiece,
    holdPiece: piece.type,
    canHold: false,
  };
  return newState;
}

export function clearFullLines(state: State): State {
  const board = state.board.map((row) => [...row]);
  let nbLinesCleared = 0;
  for (let y = 0; y < board.length; y++) {
    if (board[y].every((cell) => cell)) {
      board.splice(y, 1);
      board.unshift(Array.from({ length: GAME_WIDTH }, () => ""));
      nbLinesCleared += 1;
    }
  }

  const { piece, nextPiecesQueue } = createNewPiece([...state.nextPiecesQueue]);

  const newState = {
    ...state,
    board,
    currentPiece: piece,
    nextPiecesQueue,
    fullLines: [],
    score: state.score + calculateScore(nbLinesCleared),
    nbLinesCleared: state.nbLinesCleared + nbLinesCleared,
  };
  return newState;
}

function tryMove(
  board: string[][],
  piece: Piece,
  move: (piece: Piece) => Piece
): Piece {
  const updatedPiece = move(piece);

  if (!isPlacementValid(board, updatedPiece)) {
    return piece;
  }

  return updatedPiece;
}
