import { useGame } from "../contexts/GameContext";
import { GameStatus } from "../contexts/GameContext/types";
import { TetrisBoard } from "./TetrisBoard";
import { WelcomeScreen } from "./WelcomeScreen";

export function Tetris() {
  const { state } = useGame();

  if (state.status === GameStatus.INITIAL) {
    return <WelcomeScreen />;
  } else if (state.status === GameStatus.GAME_OVER) {
    return <div className="text-white text-xl">Game Over</div>;
  }
  return <TetrisBoard />;
}
