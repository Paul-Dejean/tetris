import { createContext } from "react";
import { Action, GameStatus, State } from "./types";

export const GAME_WIDTH = 10;
export const GAME_HEIGHT = 20;

export const initialState: State = {
  status: GameStatus.INITIAL,
  board: Array.from({ length: GAME_HEIGHT }, () =>
    Array.from({ length: GAME_WIDTH }, () => "")
  ),
  currentPiece: null,
  score: 0,
  bag: [],
};

export const GameContext = createContext({
  state: initialState,
  dispatch: (action: Action) => {
    console.log(action);
  },
});
