export function getBlockSize() {
  if (window.matchMedia("(max-width: 48rem)").matches) {
    return 26;
  }
  return 32;
}
