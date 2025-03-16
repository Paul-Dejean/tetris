import { Tetromino, tetrominoes } from "../config/tetrominoes";
import { TetrisBlock } from "./TetrisBlock";

function trimShape(shape: string[][]) {
  const nonEmptyRows = shape.filter((row) => row.some((cell) => cell !== ""));

  if (nonEmptyRows.length === 0) return [];

  const numCols = nonEmptyRows[0].length;
  const nonEmptyCols: number[] = [];

  for (let col = 0; col < numCols; col++) {
    const hasValue = nonEmptyRows.some((row) => row[col] !== "");
    if (hasValue) {
      nonEmptyCols.push(col);
    }
  }

  const trimmedShape = nonEmptyRows.map((row) =>
    nonEmptyCols.map((colIndex) => row[colIndex])
  );

  return trimmedShape;
}

export function DisplayPiece({ type }: { type: Tetromino }) {
  const piece = tetrominoes[type];
  const shape = trimShape(piece.shapes[0]);
  const numCols = shape[0].length;

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${numCols},1fr)` }}
    >
      {shape.map((row) => {
        return row.map((cell) => {
          if (!cell) return <div />;
          return <TetrisBlock color={piece.color} />;
        });
      })}
    </div>
  );
}
