import { Tetromino } from "./tetrominoes";

export type State = {
  status: GameStatus;
  board: string[][];
  currentPiece: null | Piece;
};

export enum GameStatus {
  INITIAL = "INITIAL",
  PLAYING = "PLAYING",
  GAME_OVER = "GAME_OVER",
}

export type Piece = {
  type: Tetromino;
  position: { x: number; y: number };
  rotation: Rotation;
};

export type Rotation = 0 | 1 | 2 | 3;

export type Action =
  | { type: ActionType.START_GAME }
  | { type: ActionType.TICK };
export enum ActionType {
  START_GAME = "START_GAME",
  TICK = "TICK",
}
