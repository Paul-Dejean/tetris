import { createContext } from "react";
import { Action } from "../state/types";
import { init } from "../state/state";
import React from "react";

export const GameContext = createContext({
  state: init(),
  dispatch: (action: Action) => {
    console.log(action);
  },
});

export function useGame() {
  return React.useContext(GameContext);
}
