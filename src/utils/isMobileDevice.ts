export function canUseTouchControls() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
