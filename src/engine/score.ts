export function getLevel(nbLinesCleared: number) {
  return Math.floor(nbLinesCleared / 10);
}

export function getLevelSpeed(level: number) {
  switch (level) {
    case 0:
      return 800;
    case 1:
      return 720;
    case 2:
      return 630;
    case 3:
      return 550;
    case 4:
      return 470;
    case 5:
      return 380;
    case 6:
      return 300;
    case 7:
      return 220;
    case 8:
      return 130;
    case 9:
      return 100;
    case 10:
    case 11:
    case 12:
      return 80;
    case 13:
    case 14:
    case 15:
      return 67;
    case 16:
    case 17:
    case 18:
      return 53;
    case 19:
    case 20:
    case 21:
      return 40;
    default:
      return 30;
  }
}

export function calculateScore(nbLinesCleared: number) {
  switch (nbLinesCleared) {
    case 1:
      return 40;
    case 2:
      return 100;
    case 3:
      return 300;
    case 4:
      return 1200;
    default:
      return 0;
  }
}
