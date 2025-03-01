const tetrominoI = [["I", "I", "I", "I"]];
const tetrominoJ = [
  ["J", "", ""],
  ["J", "J", "J"],
];
const tetrominoL = [
  ["", "", "L"],
  ["L", "L", "L"],
];
const tetrominoO = [
  ["O", "O"],
  ["O", "O"],
];
const tetrominoS = [
  ["", "S", "S"],
  ["S", "S", ""],
];
const tetrominoT = [
  ["", "T", ""],
  ["T", "T", "T"],
];
const tetrominoZ = [
  ["Z", "Z", ""],
  ["", "Z", "Z"],
];

export const tetrominoes = {
  I: tetrominoI,
  J: tetrominoJ,
  L: tetrominoL,
  O: tetrominoO,
  S: tetrominoS,
  T: tetrominoT,
  Z: tetrominoZ,
};

export const tetrominoColors = {
  I: "#75FBFD",
  O: "#FFFF54",
  T: "#EA33F7",
  J: "#0000F5",
  L: "#EF8833",
  S: "#75FB4C",
  Z: "#75FB4C",
};

export type Tetromino = keyof typeof tetrominoes;
