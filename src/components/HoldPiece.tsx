import { useGame } from "../contexts/GameContext";
import { useBlockSize } from "../hooks/useBlockSize";
import { DisplayPiece } from "./DisplayPiece";

export function HoldPiece() {
  const { state } = useGame();

  const blockSize = useBlockSize();
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-white rounded-xl bg-background"
      style={{
        width: blockSize * 5,
        height: blockSize * 5,
      }}
    >
      <div className="mb-auto text-lg text-white">HOLD</div>
      {state.holdPiece && <DisplayPiece type={state.holdPiece} />}
    </div>
  );
}
