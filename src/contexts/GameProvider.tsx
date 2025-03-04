import { useReducer } from "react";
import { GameContext } from "./GameContext.ts";

import { reducer } from "../state/reducer.ts";
import { init } from "../state/state.ts";

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, init());

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
