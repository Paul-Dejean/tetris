import { Tetromino, tetrominoes } from "../config/tetrominoes";
import { TetrisBlock } from "./TetrisBlock";

function trimShape(shape: string[][]) {
  // 1. Remove rows that are completely empty.
  const nonEmptyRows = shape.filter((row) => row.some((cell) => cell !== ""));

  // If there are no non-empty rows, return an empty array.
  if (nonEmptyRows.length === 0) return [];

  // 2. Determine which columns have at least one non-empty cell.
  const numCols = nonEmptyRows[0].length;
  const nonEmptyCols: number[] = [];

  for (let col = 0; col < numCols; col++) {
    // Check if any row in this column is non-empty.
    const hasValue = nonEmptyRows.some((row) => row[col] !== "");
    if (hasValue) {
      nonEmptyCols.push(col);
    }
  }

  // 3. Build a new array that only includes the non-empty columns.
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
