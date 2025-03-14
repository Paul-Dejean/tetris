import { useGame } from "../contexts/GameContext";
import { DisplayPiece } from "./DisplayPiece";

export function PieceQueue() {
  const { state } = useGame();

  const nextPiece = state.nextPiecesQueue?.[0];

  return (
    <div className="flex flex-col gap-2 rounded-xl border-2 border-white  items-center justify-center p-4 w-36 h-36 bg-background">
      <div className="text-white text-lg mb-auto">NEXT</div>
      {nextPiece && <DisplayPiece type={nextPiece} />}
    </div>
  );
}
