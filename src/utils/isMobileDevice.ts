export function canUseTouchControls() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function isMobileDevice() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUserAgent =
    /android|iphone|ipad|ipod|blackberry|windows phone|opera mini|iemobile/.test(
      userAgent
    );
  return canUseTouchControls() && isMobileUserAgent;
}
