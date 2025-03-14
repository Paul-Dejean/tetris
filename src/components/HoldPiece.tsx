import { useGame } from "../contexts/GameContext";
import { getBlockSize } from "../utils/blockSize";
import { DisplayPiece } from "./DisplayPiece";

export function HoldPiece() {
  const { state } = useGame();

  const blockSize = getBlockSize();
  return (
    <div
      className="flex flex-col gap-2 rounded-xl border-2 border-white  items-center justify-center p-4  bg-background"
      style={{
        width: blockSize * 5,
        height: blockSize * 5,
      }}
    >
      <div className="text-white text-lg mb-auto">HOLD</div>
      {state.holdPiece && <DisplayPiece type={state.holdPiece} />}
    </div>
  );
}
