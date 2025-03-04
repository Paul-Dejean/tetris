import { GAME_WIDTH, initialPosition } from "../config/constants";
import { GameStatus, Piece, Rotation, State } from "../state/types";
import {
  addPieceToBoard,
  getFullLines,
  getLastValidPosition,
  isPlacementValid,
} from "./board";
import { createNewPiece } from "./PieceQueue";
import { calculateScore } from "./score";

export function moveDown(state: State): State {
  if (state.fullLines.length) {
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
  if (state.fullLines.length) {
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

export function rotate(state: State): State {
  if (state.fullLines.length) {
    return state;
  }

  const updatedPiece = tryMove(state.board, state.currentPiece, (piece) => ({
    ...piece,
    rotation: ((piece.rotation + 1) % 4) as Rotation,
  }));

  return {
    ...state,
    currentPiece: updatedPiece,
  };
}

export function moveRight(state: State): State {
  if (state.fullLines.length) {
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

export function hardDrop(state: State): State {
  if (state.fullLines.length) {
    return state;
  }

  const updatedPiece = tryMove(state.board, state.currentPiece, (piece) => ({
    ...piece,
    position: getLastValidPosition(state.board, piece),
  }));

  const board = state.board.map((row) => [...row]);
  addPieceToBoard(board, updatedPiece);

  const fullLines = getFullLines(board);
  if (fullLines.length) {
    return {
      ...state,
      board,
      fullLines,
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
  };
  return newState;
}

export function holdPiece(state: State): State {
  if (!state.canHold || state.fullLines.length) {
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
