import { createContext } from "react";
import { Action, GameStatus } from "./types";

export const initialState = {
  status: GameStatus.INITIAL,
  board: Array.from({ length: 20 }, () => Array.from({ length: 10 }, () => "")),
};

export const GameContext = createContext({
  state: initialState,
  dispatch: (action: Action) => {
    console.log(action);
  },
});
