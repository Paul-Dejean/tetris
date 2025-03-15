export function canUseTouchControls() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function isMobileDevice() {
  return canUseTouchControls() && window.innerWidth < 768;
}
