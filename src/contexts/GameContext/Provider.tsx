import { useReducer } from "react";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  GameContext,
  initialState,
} from "./GameContext";
import {
  State,
  ActionType,
  GameStatus,
  Action,
  Piece,
  Rotation,
} from "./types";
import { Tetromino, tetrominoes } from "./tetrominoes";

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

function createNewPiece(state: State): { piece: Piece; bag: Tetromino[] } {
  const bag = [...state.bag];

  if (bag.length === 0) {
    bag.push(...shuffle(Object.keys(tetrominoes) as Tetromino[]));
  }

  const type = bag.pop() as Tetromino;

  return {
    piece: {
      type,
      position: initialPosition,
      rotation: 0,
    },
    bag,
  };
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionType.START_GAME:
      return startGame(state);

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

    default:
      return state;
  }
}

function startGame(state: State): State {
  // console.log("startGame");
  const { piece: newPiece, bag } = createNewPiece(state);
  const board = state.board.map((row) => [...row]);
  const newBoard = paintPieces(board, [newPiece]);
  return {
    ...state,
    board: newBoard,
    status: GameStatus.PLAYING,
    currentPiece: newPiece,
    bag,
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

function paintPieces(board: string[][], pieces: Piece[]) {
  let newBoard = board;
  for (const piece of pieces) {
    newBoard = paintPiece(newBoard, piece);
  }

  return board;
}

function paintPiece(board: string[][], piece: Piece) {
  const block = tetrominoes[piece.type].shapes[piece.rotation];
  for (let y = 0; y < block.length; y++) {
    for (let x = 0; x < block[y].length; x++) {
      if (block[y][x]) {
        board[y + piece.position.y][x + piece.position.x] = piece.type;
      }
    }
  }
  return board;
}

function unpaintPieces(board: string[][], pieces: Piece[]) {
  let newBoard = board;
  for (const piece of pieces) {
    newBoard = unpaintPiece(newBoard, piece);
  }
  //   console.log({ newBoard });
  return newBoard;
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
  return board;
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
        if (board[y + newPosition.y][x + newPosition.x]) {
          return false;
        }
      }
    }
  }
  return true;
}

function applyPieceToBoard(state: State): State {
  console.log("before", state.bag);
  const piece = state.currentPiece;
  if (!piece) {
    return state;
  }
  const board = state.board.map((row) => [...row]);
  const newBoard = paintPieces(board, [piece]);

  const { board: finalBoard, score } = clearFullLines(newBoard);

  const { piece: newPiece, bag } = createNewPiece(state);

  if (!canPlace(finalBoard, newPiece, piece.position)) {
    return {
      ...state,
      status: GameStatus.GAME_OVER,
    };
  }

  const newState = {
    ...state,
    board: paintPiece(finalBoard, newPiece),
    currentPiece: newPiece,
    score: state.score + score,
    bag,
  };

  console.log("after", newState.bag);

  return newState;
}

function moveDown(state: State): State {
  const piece = state.currentPiece;
  if (!piece) {
    return state;
  }

  const board = state.board.map((row) => [...row]);

  const newBoard = unpaintPieces(board, [piece]);
  const newPosition = { ...piece.position, y: piece.position.y + 1 };

  const shouldMove = canPlace(board, piece, newPosition);
  //   console.log({ shouldMove });

  if (shouldMove) {
    const result = paintPieces(newBoard, [{ ...piece, position: newPosition }]);

    return {
      ...state,
      board: result,
      currentPiece: { ...piece, position: newPosition },
    };
  }

  return applyPieceToBoard(state);
}

function moveLeft(state: State): State {
  const piece = state.currentPiece;
  if (!piece) {
    return state;
  }
  const board = state.board.map((row) => [...row]);

  const newBoard = unpaintPieces(board, [piece]);
  const newPosition = { ...piece.position, x: piece.position.x - 1 };

  const shouldMove = canPlace(board, piece, newPosition);
  //   console.log({ shouldMove });
  if (!shouldMove) {
    return state;
  }

  const result = paintPieces(newBoard, [{ ...piece, position: newPosition }]);
  return {
    ...state,
    board: result,
    currentPiece: { ...piece, position: newPosition },
  };
}

function rotate(state: State): State {
  const piece = state.currentPiece;
  if (!piece) {
    return state;
  }
  const board = state.board.map((row) => [...row]);

  const newBoard = unpaintPieces(board, [piece]);
  const newRotation = ((piece.rotation + 1) % 4) as Rotation;
  const newPiece = { ...piece, rotation: newRotation };
  const shouldRotate = canPlace(board, newPiece, piece.position);
  if (!shouldRotate) {
    return state;
  }

  const result = paintPieces(newBoard, [newPiece]);
  return {
    ...state,
    board: result,
    currentPiece: newPiece,
  };
}

function moveRight(state: State): State {
  // console.log("right");
  const piece = state.currentPiece;
  if (!piece) {
    return state;
  }
  const board = state.board.map((row) => [...row]);

  const newBoard = unpaintPieces(board, [piece]);
  const newPosition = { ...piece.position, x: piece.position.x + 1 };

  const shouldMove = canPlace(board, piece, newPosition);
  //   console.log({ shouldMove });
  if (!shouldMove) {
    return state;
  }

  const result = paintPieces(newBoard, [{ ...piece, position: newPosition }]);

  return {
    ...state,
    board: result,
    currentPiece: { ...piece, position: newPosition },
  };
}

function hardDrop(state: State): State {
  const piece = state.currentPiece;
  if (!piece) {
    return state;
  }
  const board = state.board.map((row) => [...row]);

  const newBoard = unpaintPieces(board, [piece]);

  const newPiece = {
    position: { ...piece.position },
    rotation: piece.rotation,
    type: piece.type,
  };
  while (
    canPlace(newBoard, newPiece, {
      x: newPiece.position.x,
      y: newPiece.position.y + 1,
    })
  ) {
    newPiece.position.y += 1;
  }
  const result = paintPieces(newBoard, [newPiece]);

  const { board: finalBoard, score } = clearFullLines(result);

  const { piece: createPiece, bag } = createNewPiece(state);
  // console.log({ bag });
  if (!canPlace(finalBoard, createPiece, createPiece.position)) {
    return {
      ...state,
      status: GameStatus.GAME_OVER,
      bag,
    };
  }

  return {
    ...state,
    board: paintPieces(finalBoard, [createPiece]),
    currentPiece: createPiece,
    score: state.score + score,
    bag,
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

function clearFullLines(board: string[][]) {
  const newBoard = board.map((row) => [...row]);

  let nbLinesCleared = 0;
  for (let y = 0; y < newBoard.length; y++) {
    if (newBoard[y].every((cell) => cell)) {
      newBoard.splice(y, 1);
      newBoard.unshift(Array.from({ length: GAME_WIDTH }, () => ""));
      nbLinesCleared += 1;
    }
  }

  const score = calculateScore(nbLinesCleared);
  return { board: newBoard, score };
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
