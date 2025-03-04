import { useReducer } from "react";
import { GameContext } from "./GameContext";
import {
  State,
  ActionType,
  GameStatus,
  Action,
  Piece,
  Rotation,
} from "./types";
import { Tetromino, tetrominoes } from "./tetrominoes";

export const GAME_WIDTH = 10;
export const GAME_HEIGHT = 20;
const initialPosition = {
  x: GAME_WIDTH / 2 - 1,
  y: 0,
};

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createNextPiecesQueue() {
  return shuffle(Object.keys(tetrominoes) as Tetromino[]);
}

function createNewPiece(state: State): {
  piece: Piece;
  nextPiecesQueue: Tetromino[];
} {
  const nextPiecesQueue = [...state.nextPiecesQueue];
  const type = nextPiecesQueue.shift() as Tetromino;
  if (nextPiecesQueue.length == 0) {
    nextPiecesQueue.push(...createNextPiecesQueue());
  }
  return {
    piece: {
      type,
      position: initialPosition,
      rotation: 0,
      isGhost: false,
    },
    nextPiecesQueue,
  };
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionType.RESTART_GAME:
      return init();
    case ActionType.PAUSE_GAME:
      return pauseGame(state);

    case ActionType.RESUME_GAME:
      return resumeGame(state);

    case ActionType.MOVE_DOWN:
    case ActionType.TICK:
      return moveDown(state);

    case ActionType.MOVE_LEFT:
      return moveLeft(state);

    case ActionType.MOVE_RIGHT:
      return moveRight(state);

    case ActionType.ROTATE:
      return rotate(state);

    case ActionType.HARD_DROP:
      return hardDrop(state);

    case ActionType.HOLD_PIECE:
      return holdPiece(state);

    case ActionType.CLEAR_FULL_LINES:
      return clearFullLines(state);

    default:
      return state;
  }
}

function pauseGame(state: State): State {
  if (state.status !== GameStatus.PLAYING) {
    return state;
  }
  return {
    ...state,
    status: GameStatus.PAUSED,
  };
}

function resumeGame(state: State): State {
  if (state.status !== GameStatus.PAUSED) {
    return state;
  }
  return {
    ...state,
    status: GameStatus.PLAYING,
  };
}

function canPlace(board: string[][], piece: Piece) {
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

function createGhostPiece(board: string[][], piece: Piece): Piece {
  const ghostPiece = {
    ...piece,
    position: { ...piece.position },
    isGhost: true,
  };
  while (canPlace(board, ghostPiece)) {
    ghostPiece.position.y += 1;
  }
  ghostPiece.position.y = Math.max(0, ghostPiece.position.y - 1);
  return ghostPiece;
}

function moveDown(state: State): State {
  if (state.fullLines.length) {
    return state;
  }

  const piece = state.currentPiece;
  const board = state.board.map((row) => [...row]);
  const nextPiece = {
    ...piece,
    position: { ...piece.position, y: piece.position.y + 1 },
  };

  const canMove = canPlace(board, nextPiece);

  if (canMove) {
    const newState = {
      ...state,
      board,
      currentPiece: nextPiece,
    };
    const renderedBoard = renderBoard(newState);
    return {
      ...newState,
      renderedBoard,
    };
  }

  if (!canPlace(board, piece)) {
    return {
      ...state,
      status: GameStatus.GAME_OVER,
    };
  }
  addPieceToBoard(board, piece);
  const fullLines = getFullLines(board);
  if (fullLines.length) {
    return {
      ...state,
      board,
      fullLines,
    };
  }

  const { piece: newPiece, nextPiecesQueue } = createNewPiece(state);

  const isGameOver = !canPlace(board, newPiece);

  const newState = {
    ...state,
    status: isGameOver ? GameStatus.GAME_OVER : GameStatus.PLAYING,
    board,
    currentPiece: newPiece,
    nextPiecesQueue,
    canHold: true,
    fullLines,
  };
  const renderedBoard = renderBoard(newState);

  return {
    ...newState,
    renderedBoard,
  };
}

function moveLeft(state: State): State {
  if (state.fullLines.length) {
    return state;
  }
  const piece = state.currentPiece;
  const board = state.board.map((row) => [...row]);
  const newPiece = {
    ...piece,
    position: { ...piece.position, x: piece.position.x - 1 },
  };

  if (!canPlace(board, newPiece)) {
    return state;
  }

  const newState = {
    ...state,
    board,
    currentPiece: newPiece,
  };
  const renderedBoard = renderBoard(newState);
  return {
    ...newState,
    renderedBoard,
  };
}

function rotate(state: State): State {
  if (state.fullLines.length) {
    return state;
  }
  const piece = state.currentPiece;

  const board = state.board.map((row) => [...row]);

  const newPiece = {
    ...piece,
    rotation: ((piece.rotation + 1) % 4) as Rotation,
  };

  if (!canPlace(board, newPiece)) {
    return state;
  }
  const newState = {
    ...state,
    board,
    currentPiece: newPiece,
  };
  const renderedBoard = renderBoard(newState);

  return {
    ...newState,
    renderedBoard,
  };
}

function moveRight(state: State): State {
  if (state.fullLines.length) {
    return state;
  }

  const piece = state.currentPiece;
  const board = state.board.map((row) => [...row]);
  const newPiece = {
    ...piece,
    position: { ...piece.position, x: piece.position.x + 1 },
  };

  if (!canPlace(board, newPiece)) {
    return state;
  }

  const newState = {
    ...state,
    board,
    currentPiece: newPiece,
  };
  const renderedBoard = renderBoard(newState);
  return {
    ...newState,
    renderedBoard,
  };
}

function hardDrop(state: State): State {
  if (state.fullLines.length) {
    return state;
  }
  const piece = state.currentPiece;
  const board = state.board.map((row) => [...row]);
  const newPiece = { ...createGhostPiece(board, piece), isGhost: false };
  if (!canPlace(board, newPiece)) {
    return {
      ...state,
      status: GameStatus.GAME_OVER,
    };
  }
  addPieceToBoard(board, newPiece);

  const fullLines = getFullLines(board);
  if (fullLines.length) {
    return {
      ...state,
      board,
      fullLines,
    };
  }

  const { piece: createPiece, nextPiecesQueue } = createNewPiece(state);
  const isGameOver = !canPlace(board, createPiece);
  const newState = {
    ...state,
    status: isGameOver ? GameStatus.GAME_OVER : GameStatus.PLAYING,
    board,
    currentPiece: createPiece,
    nextPiecesQueue,
    fullLines,
    canHold: true,
  };
  const renderedBoard = renderBoard(newState);
  return {
    ...newState,
    renderedBoard,
  };
}

function renderBoard(state: State) {
  const board = state.board.map((row) => [...row]);
  const piece = state.currentPiece;
  const ghostPiece = createGhostPiece(board, piece);
  addPieceToBoard(board, ghostPiece);
  addPieceToBoard(board, piece);
  return board;
}

function holdPiece(state: State): State {
  if (!state.canHold || state.fullLines.length) {
    return state;
  }
  const piece = state.currentPiece;
  const board = state.board.map((row) => [...row]);

  if (!state.holdPiece) {
    const { piece: newPiece, nextPiecesQueue } = createNewPiece(state);
    const newState = {
      ...state,
      board,
      currentPiece: newPiece,
      holdPiece: piece.type,
      canHold: false,
      nextPiecesQueue,
    };
    const renderedBoard = renderBoard(newState);
    return {
      ...newState,
      renderedBoard,
    };
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
  const renderedBoard = renderBoard(newState);
  return {
    ...newState,
    renderedBoard,
  };
}

function getFullLines(board: string[][]) {
  const fullLines = [];
  for (let y = 0; y < board.length; y++) {
    if (board[y].every((cell) => cell)) {
      fullLines.push(y);
    }
  }
  return fullLines;
}

function clearFullLines(state: State): State {
  const board = state.board.map((row) => [...row]);
  let nbLinesCleared = 0;
  for (let y = 0; y < board.length; y++) {
    if (board[y].every((cell) => cell)) {
      board.splice(y, 1);
      board.unshift(Array.from({ length: GAME_WIDTH }, () => ""));
      nbLinesCleared += 1;
    }
  }

  const { piece, nextPiecesQueue } = createNewPiece(state);

  const newState = {
    ...state,
    board,
    currentPiece: piece,
    nextPiecesQueue,
    fullLines: [],
    score: state.score + calculateScore(nbLinesCleared),
    nbLinesCleared: state.nbLinesCleared + nbLinesCleared,
  };
  const renderedBoard = renderBoard(newState);
  return {
    ...newState,
    renderedBoard,
  };
}

export function init(): State {
  const nextPiecesQueue = createNextPiecesQueue();
  const currentPieceType = nextPiecesQueue.shift() as Tetromino;
  return {
    status: GameStatus.PLAYING,
    board: Array.from({ length: GAME_HEIGHT }, () =>
      Array.from({ length: GAME_WIDTH }, () => "")
    ),
    renderedBoard: Array.from({ length: GAME_HEIGHT }, () =>
      Array.from({ length: GAME_WIDTH }, () => "")
    ),
    currentPiece: {
      type: currentPieceType,
      position: initialPosition,
      rotation: 0,
      isGhost: false,
    },
    fullLines: [],
    score: 0,
    nextPiecesQueue,
    holdPiece: null,
    canHold: true,
    nbLinesCleared: 0,
  };
}

function calculateScore(nbLinesCleared: number) {
  switch (nbLinesCleared) {
    case 1:
      return 40;
    case 2:
      return 100;
    case 3:
      return 300;
    case 4:
      return 1200;
    default:
      return 0;
  }
}

export function getLevel(nbLinesCleared: number) {
  return Math.floor(nbLinesCleared / 10);
}

export function getLevelSpeed(level: number) {
  switch (level) {
    case 0:
      return 800;
    case 1:
      return 720;
    case 2:
      return 630;
    case 3:
      return 550;
    case 4:
      return 470;
    case 5:
      return 380;
    case 6:
      return 300;
    case 7:
      return 220;
    case 8:
      return 130;
    case 9:
      return 100;
    case 10:
    case 11:
    case 12:
      return 80;
    case 13:
    case 14:
    case 15:
      return 67;
    case 16:
    case 17:
    case 18:
      return 53;
    case 19:
    case 20:
    case 21:
      return 40;
    default:
      return 30;
  }
}

function addPieceToBoard(board: string[][], piece: Piece) {
  const block = tetrominoes[piece.type].shapes[piece.rotation];
  const type = piece.isGhost ? `G${piece.type}` : piece.type;
  for (let y = 0; y < block.length; y++) {
    for (let x = 0; x < block[y].length; x++) {
      if (block[y][x]) {
        console.log([y + piece.position.y, x + piece.position.x]);
        board[y + piece.position.y][x + piece.position.x] = type;
      }
    }
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, init());

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
