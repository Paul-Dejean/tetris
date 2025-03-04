import { useState } from "react";
import { TetrisBoard } from "./TetrisBoard";
import { WelcomeScreen } from "./WelcomeScreen";

export function Tetris() {
  const [hasClickedStart, setHasClickedStart] = useState(false);

  const onStartClick = () => {
    setHasClickedStart(true);
  };
  if (!hasClickedStart) {
    return <WelcomeScreen onStartClick={onStartClick} />;
  }
  return <TetrisBoard />;
}
