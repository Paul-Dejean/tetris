import { Button } from "./Button";

export function WelcomeScreen({ onStartClick }: { onStartClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center  h-full gap-y-16">
      <div className="container flex flex-col items-center gap-y-8">
        <h1 className="text-4xl font-bold text-primary">Welcome to tetris</h1>
        <div className="flex justify-between gap-x-8">
          <Button onClick={onStartClick}>Play</Button>
          <Button>Help</Button>
        </div>
      </div>
    </div>
  );
}
