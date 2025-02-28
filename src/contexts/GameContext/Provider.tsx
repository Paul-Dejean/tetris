import { useReducer } from "react";
import { GameContext, initialState } from "./GameContext";
import { State, Action, ActionType, GameStatus } from "./types";

function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionType.START_GAME:
      return { ...state, status: GameStatus.PLAYING };
    default:
      return state;
  }
}
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
