import { useReducer } from "react";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  GameContext,
  initialState,
} from "./GameContext";
import { State, ActionType, GameStatus, Action, Piece } from "./types";
import { Tetromino, tetrominoes } from "./tetrominoes";

const initialPosition = {
  x: GAME_WIDTH / 2 - 1,
  y: 0,
};

function createNewPiece(): Piece {
  const keys = Object.keys(tetrominoes);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return {
    type: randomKey as Tetromino,
    position: initialPosition,
    rotation: 0,
  };
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionType.START_GAME:
      return {
        ...state,
        status: GameStatus.PLAYING,
        currentPiece: createNewPiece(),
      };

    case ActionType.TICK:
      console.log("tick");
      return moveDown(state);
    default:
      return state;
  }
}

function paintPiece(board: string[][], piece: Piece) {
  const block = tetrominoes[piece.type];
  for (let y = 0; y < block.length; y++) {
    for (let x = 0; x < block[y].length; x++) {
      if (block[y][x]) {
        board[y + piece.position.y][x + piece.position.x] = piece.type;
      }
    }
  }
  return board;
}

function unpaintPiece(board: string[][], piece: Piece) {
  const block = tetrominoes[piece.type];
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
  console.log({ board, piece, newPosition });
  const block = tetrominoes[piece.type];
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
  const piece = state.currentPiece;
  if (!piece) {
    return state;
  }
  const board = state.board.map((row) => [...row]);
  const newBoard = paintPiece(board, piece);

  const newState = {
    ...state,
    board: newBoard,
    currentPiece: createNewPiece(),
  };
  return newState;
}

function moveDown(state: State): State {
  const piece = state.currentPiece;
  if (!piece) {
    return state;
  }

  const board = state.board.map((row) => [...row]);

  const newBoard = unpaintPiece(board, piece);
  const newPosition = { ...piece.position, y: piece.position.y + 1 };

  const shouldMove = canPlace(board, piece, newPosition);
  console.log({ shouldMove });
  if (shouldMove) {
    const result = paintPiece(newBoard, { ...piece, position: newPosition });
    return {
      ...state,
      board: result,
      currentPiece: { ...piece, position: newPosition },
    };
  }

  return applyPieceToBoard(state);
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
