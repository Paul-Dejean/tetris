import { initialState } from "./GameContext";

export enum GameStatus {
  INITIAL = "INITIAL",
  PLAYING = "PLAYING",
  GAME_OVER = "GAME_OVER",
}

export type Action = { type: ActionType.START_GAME };
export enum ActionType {
  START_GAME = "START_GAME",
}
export type State = typeof initialState;
