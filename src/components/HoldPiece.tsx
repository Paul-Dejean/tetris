import { useGame } from "../contexts/GameContext";
import { DisplayPiece } from "./DisplayPiece";

export function HoldPiece() {
  const { state } = useGame();

  return (
    <div className="flex flex-col gap-2 rounded-xl border-2 border-white  items-center justify-center p-4 w-36 h-36">
      {state.holdPiece && <DisplayPiece type={state.holdPiece} />}
    </div>
  );
}
