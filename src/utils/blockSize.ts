export function getBlockSize() {
  if (window.matchMedia("(max-height: 45rem)").matches) {
    return 16;
  }
  if (window.matchMedia("(max-width: 48rem)").matches) {
    return 26;
  }
  return 32;
}
