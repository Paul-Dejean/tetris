import { useState } from "react";
import { TetrisBoard } from "./TetrisBoard";
import { WelcomeScreen } from "./WelcomeScreen";
import { ActionType } from "../contexts/GameContext/types";
import { useGame } from "../contexts/GameContext";

export function Tetris() {
  const { dispatch } = useGame();
  const [hasClickedStart, setHasClickedStart] = useState(false);

  const onStartClick = () => {
    setHasClickedStart(true);
    dispatch({ type: ActionType.START_GAME });
  };
  if (!hasClickedStart) {
    return <WelcomeScreen onStartClick={onStartClick} />;
  }
  return <TetrisBoard />;
}
