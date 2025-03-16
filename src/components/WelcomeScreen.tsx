import { Button } from "./Button";

export function WelcomeScreen({ onStartClick }: { onStartClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center  h-full gap-y-16 bg-[url('/welcome-wallpaper.webp')] bg-cover bg-center">
      <div className="container flex flex-col items-center gap-y-8">
        <div className="flex flex-col items-center p-8 bg-background gap-y-8 rounded-xl">
          <h1 className="text-4xl font-bold text-primary">Welcome to tetris</h1>
          <div className="flex justify-between">
            <Button onClick={onStartClick}>Play</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
