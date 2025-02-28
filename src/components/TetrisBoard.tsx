import { useGame } from "../contexts/GameContext";

export function TetrisBoard() {
  const { state } = useGame();
  const board = state.board;
  return (
    <div className="h-full">
      <div className="flex p-8 justify-center">
        <div className="border border-primary border-solid">
          {board.map((row, rowIndex) => (
            <div className="flex" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <div key={cellIndex} className="border w-8 h-8">
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
