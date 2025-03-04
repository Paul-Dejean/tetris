import { createContext } from "react";
import { Action } from "./types";
import { init } from "./Provider";

export const GameContext = createContext({
  state: init(),
  dispatch: (action: Action) => {
    console.log(action);
  },
});
