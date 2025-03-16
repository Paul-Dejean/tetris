import { useGame } from "../contexts/GameContext";
import { ActionType } from "../state/types";

export function GameOverScreen() {
  const { state, dispatch } = useGame();
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-y-8 bg-black/70">
      <div className="text-4xl text-white">Game Over</div>
      <div className="text-2xl text-white">Score: {state.score}</div>
      <button
        className="px-4 py-2 text-xl text-white rounded-lg cursor-pointer border-primary border-1"
        onClick={() => dispatch({ type: ActionType.RESTART_GAME })}
      >
        Restart
      </button>
    </div>
  );
}
