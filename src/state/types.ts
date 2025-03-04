import { Tetromino } from "../config/tetrominoes";

export type State = {
  status: GameStatus;
  board: string[][];
  currentPiece: Piece;
  score: number;
  nextPiecesQueue: Tetromino[];
  holdPiece: null | Tetromino;
  canHold: boolean;
  fullLines: number[];
  nbLinesCleared: number;
};

export enum GameStatus {
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  GAME_OVER = "GAME_OVER",
}

export type Piece = {
  type: Tetromino;
  position: { x: number; y: number };
  rotation: Rotation;
  isGhost: boolean;
};

export type Rotation = 0 | 1 | 2 | 3;

export type Action =
  | { type: ActionType.RESTART_GAME }
  | { type: ActionType.PAUSE_GAME }
  | { type: ActionType.RESUME_GAME }
  | { type: ActionType.TICK }
  | { type: ActionType.MOVE_DOWN }
  | { type: ActionType.MOVE_LEFT }
  | { type: ActionType.MOVE_RIGHT }
  | { type: ActionType.HARD_DROP }
  | { type: ActionType.ROTATE }
  | { type: ActionType.HOLD_PIECE }
  | { type: ActionType.CLEAR_FULL_LINES };

export enum ActionType {
  CLEAR_FULL_LINES = "CLEAR_FULL_LINES",
  PAUSE_GAME = "PAUSE_GAME",
  RESUME_GAME = "RESUME_GAME",
  RESTART_GAME = "RESTART_GAME",
  TICK = "TICK",
  MOVE_DOWN = "MOVE_DOWN",
  MOVE_LEFT = "MOVE_LEFT",
  MOVE_RIGHT = "MOVE_RIGHT",
  HARD_DROP = "HARD_DROP",
  ROTATE = "ROTATE",
  HOLD_PIECE = "HOLD_PIECE",
}
