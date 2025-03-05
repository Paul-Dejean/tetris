import { GAME_HEIGHT, GAME_WIDTH } from "../config/constants";
import { tetrominoes } from "../config/tetrominoes";
import { Piece } from "../state/types";

export function isPlacementValid(board: string[][], piece: Piece) {
  const block = tetrominoes[piece.type].shapes[piece.rotation];
  for (let y = 0; y < block.length; y++) {
    for (let x = 0; x < block[y].length; x++) {
      if (block[y][x]) {
        if (
          x + piece.position.x < 0 ||
          x + piece.position.x >= GAME_WIDTH ||
          y + piece.position.y >= GAME_HEIGHT
        ) {
          return false;
        }
        if (
          board[y + piece.position.y][x + piece.position.x] &&
          !board[y + piece.position.y][x + piece.position.x].startsWith("G")
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

export function createGhostPiece(board: string[][], piece: Piece): Piece {
  const lastValidPosition = getLastValidPosition(board, piece);
  const ghostPiece = {
    ...piece,
    position: lastValidPosition,
    isGhost: true,
  };
  return ghostPiece;
}

export function getLastValidPosition(board: string[][], piece: Piece) {
  const newPosition = { ...piece.position };
  if (!isPlacementValid(board, { ...piece, position: newPosition })) {
    return piece.position;
  }
  while (isPlacementValid(board, { ...piece, position: newPosition })) {
    newPosition.y += 1;
  }
  newPosition.y = Math.max(0, newPosition.y - 1);
  return newPosition;
}

export function renderBoard(board: string[][], currentPiece: Piece) {
  const renderedBoard = board.map((row) => [...row]);
  const piece = currentPiece;
  const ghostPiece = createGhostPiece(renderedBoard, piece);
  addPieceToBoard(renderedBoard, ghostPiece);
  addPieceToBoard(renderedBoard, piece);
  return renderedBoard;
}

export function getFullLines(board: string[][]) {
  const fullLines = [];
  for (let y = 0; y < board.length; y++) {
    if (board[y].every((cell) => cell)) {
      fullLines.push(y);
    }
  }
  return fullLines;
}

export function addPieceToBoard(board: string[][], piece: Piece) {
  const block = tetrominoes[piece.type].shapes[piece.rotation];
  const type = piece.isGhost ? `G${piece.type}` : piece.type;
  for (let y = 0; y < block.length; y++) {
    for (let x = 0; x < block[y].length; x++) {
      if (block[y][x]) {
        board[y + piece.position.y][x + piece.position.x] = type;
      }
    }
  }
}
