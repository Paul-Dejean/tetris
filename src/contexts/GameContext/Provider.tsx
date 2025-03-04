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

    default:
      return state;
  }
}

function holdPiece(state: State): State {
  if (!state.canHold) {
    return state;
  }
  const piece = state.currentPiece;
  const board = state.board.map((row) => [...row]);
  unpaintPiece(board, piece);
  eraseGhostPiece(board);

  if (!state.holdPiece) {
    const { piece: newPiece, nextPiecesQueue } = createNewPiece(state);
    const newGhostPiece = createGhostPiece(board, newPiece);
    paintPiece(board, newGhostPiece);
    paintPiece(board, newPiece);
    return {
      ...state,
      board,
      currentPiece: newPiece,
      holdPiece: piece.type,
      canHold: false,
      nextPiecesQueue,
    };
  }
  const newPiece = {
    type: state.holdPiece,
    position: initialPosition,
    rotation: 0 as Rotation,
    isGhost: false,
  };
  const newGhostPiece = createGhostPiece(board, newPiece);
  paintPiece(board, newGhostPiece);
  paintPiece(board, newPiece);
  return {
    ...state,
    board,
    currentPiece: newPiece,
    holdPiece: piece.type,
    canHold: false,
  };
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

function canPlace(
  board: string[][],
  piece: Piece,
  newPosition: { x: number; y: number }
) {
  //   console.log({ board, piece, newPosition });
  const block = tetrominoes[piece.type].shapes[piece.rotation];
  for (let y = 0; y < block.length; y++) {
    for (let x = 0; x < block[y].length; x++) {
      if (block[y][x]) {
        if (
          x + newPosition.x < 0 ||
          x + newPosition.x >= GAME_WIDTH ||
          y + newPosition.y >= GAME_HEIGHT
        ) {
          return false;
        }
        if (
          board[y + newPosition.y][x + newPosition.x] &&
          !board[y + newPosition.y][x + newPosition.x].startsWith("G")
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

function createGhostPiece(board: string[][], piece: Piece): Piece {
  unpaintPiece(board, piece);
  const ghostPiece = {
    ...piece,
    position: { ...piece.position },
    isGhost: true,
  };
  while (
    canPlace(board, ghostPiece, {
      x: ghostPiece.position.x,
      y: ghostPiece.position.y,
    })
  ) {
    ghostPiece.position.y += 1;
  }
  ghostPiece.position.y -= 1;
  paintPiece(board, piece);
  return ghostPiece;
}

function applyPieceToBoard(state: State): State {
  const piece = state.currentPiece;
  const board = state.board.map((row) => [...row]);
  paintPiece(board, piece);
  const nbLinesCleared = clearFullLines(board);
  const score = calculateScore(nbLinesCleared);

  const { piece: newPiece, nextPiecesQueue } = createNewPiece(state);

  if (!canPlace(board, newPiece, newPiece.position)) {
    console.log();
    return {
      ...state,
      status: GameStatus.GAME_OVER,
    };
  }

  paintPiece(board, newPiece);
  const newState = {
    ...state,
    board,
    currentPiece: newPiece,
    score: state.score + score,
    nextPiecesQueue,
    canHold: true,
  };

  return newState;
}

function moveDown(state: State): State {
  const piece = state.currentPiece;

  const board = state.board.map((row) => [...row]);

  unpaintPiece(board, piece);
  eraseGhostPiece(board);
  const newPosition = { ...piece.position, y: piece.position.y + 1 };

  const shouldMove = canPlace(board, piece, newPosition);

  if (shouldMove) {
    const newGhostPiece = createGhostPiece(board, {
      ...piece,
      position: newPosition,
    });
    paintPiece(board, newGhostPiece);
    paintPiece(board, { ...piece, position: newPosition });

    return {
      ...state,
      board,
      currentPiece: { ...piece, position: newPosition },
    };
  }

  return applyPieceToBoard(state);
}

function moveLeft(state: State): State {
  const piece = state.currentPiece;

  const board = state.board.map((row) => [...row]);

  unpaintPiece(board, piece);
  eraseGhostPiece(board);
  const newPosition = { ...piece.position, x: piece.position.x - 1 };

  const shouldMove = canPlace(board, piece, newPosition);

  if (!shouldMove) {
    return state;
  }
  const newGhostPiece = createGhostPiece(board, {
    ...piece,
    position: newPosition,
  });
  paintPiece(board, newGhostPiece);
  paintPiece(board, { ...piece, position: newPosition });
  return {
    ...state,
    board,
    currentPiece: { ...piece, position: newPosition },
  };
}

function rotate(state: State): State {
  const piece = state.currentPiece;

  const board = state.board.map((row) => [...row]);

  unpaintPiece(board, piece);
  eraseGhostPiece(board);
  const newRotation = ((piece.rotation + 1) % 4) as Rotation;
  const newPiece = { ...piece, rotation: newRotation };
  const shouldRotate = canPlace(board, newPiece, piece.position);
  if (!shouldRotate) {
    return state;
  }

  const newGhostPiece = createGhostPiece(board, newPiece);
  paintPiece(board, newGhostPiece);
  paintPiece(board, newPiece);
  return {
    ...state,
    board,
    currentPiece: newPiece,
  };
}

function moveRight(state: State): State {
  // console.log("right");
  const piece = state.currentPiece;

  const board = state.board.map((row) => [...row]);

  unpaintPiece(board, piece);
  eraseGhostPiece(board);
  const newPosition = { ...piece.position, x: piece.position.x + 1 };

  const shouldMove = canPlace(board, piece, newPosition);

  if (!shouldMove) {
    return state;
  }
  const newGhostPiece = createGhostPiece(board, {
    ...piece,
    position: newPosition,
  });
  paintPiece(board, newGhostPiece);

  paintPiece(board, { ...piece, position: newPosition });

  return {
    ...state,
    board,
    currentPiece: { ...piece, position: newPosition },
  };
}

function hardDrop(state: State): State {
  const piece = state.currentPiece;

  const board = state.board.map((row) => [...row]);

  unpaintPiece(board, piece);
  eraseGhostPiece(board);

  const newPiece = {
    position: { ...piece.position },
    rotation: piece.rotation,
    type: piece.type,
    isGhost: false,
  };
  while (
    canPlace(board, newPiece, {
      x: newPiece.position.x,
      y: newPiece.position.y + 1,
    })
  ) {
    newPiece.position.y += 1;
  }
  paintPiece(board, newPiece);

  const nbLinesCleared = clearFullLines(board);
  const score = calculateScore(nbLinesCleared);

  const { piece: createPiece, nextPiecesQueue } = createNewPiece(state);
  // console.log({ bag });
  if (!canPlace(board, createPiece, createPiece.position)) {
    return {
      ...state,
      status: GameStatus.GAME_OVER,
      nextPiecesQueue,
    };
  }

  paintPiece(board, createPiece);

  return {
    ...state,
    board,
    currentPiece: createPiece,
    score: state.score + score,
    nextPiecesQueue,
    canHold: true,
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

function eraseGhostPiece(board: string[][]) {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x].startsWith("G")) {
        board[y][x] = "";
      }
    }
  }
}

function clearFullLines(board: string[][]) {
  let nbLinesCleared = 0;
  for (let y = 0; y < board.length; y++) {
    if (board[y].every((cell) => cell)) {
      board.splice(y, 1);
      board.unshift(Array.from({ length: GAME_WIDTH }, () => ""));
      nbLinesCleared += 1;
    }
  }

  return nbLinesCleared;
}

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
      position: initialPosition,
      rotation: 0,
      isGhost: false,
    },
    score: 0,
    nextPiecesQueue,
    holdPiece: null,
    canHold: true,
  };
}

function paintPiece(board: string[][], piece: Piece) {
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

function unpaintPiece(board: string[][], piece: Piece) {
  const block = tetrominoes[piece.type].shapes[piece.rotation];
  for (let y = 0; y < block.length; y++) {
    for (let x = 0; x < block[y].length; x++) {
      if (block[y][x]) {
        board[y + piece.position.y][x + piece.position.x] = "";
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
