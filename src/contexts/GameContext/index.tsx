import React from "react";
import { GameContext } from "./GameContext";

export function useGame() {
  return React.useContext(GameContext);
}
