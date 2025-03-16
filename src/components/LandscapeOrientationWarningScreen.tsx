export function LandscapeOrientationWarningScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 gap-y-8">
      <div className="text-4xl text-white">
        Please rotate your device to portrait mode
      </div>
    </div>
  );
}
