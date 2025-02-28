import { useGame } from "../contexts/GameContext";
import { ActionType } from "../contexts/GameContext/types";
import { Button } from "./Button";

export function WelcomeScreen() {
  const { dispatch } = useGame();

  const onPlayButtonClick = () => {
    dispatch({ type: ActionType.START_GAME });
  };
  return (
    <div className="flex flex-col items-center justify-center  h-full gap-y-16">
      <div className="container flex flex-col items-center gap-y-8">
        <h1 className="text-4xl font-bold text-primary">Welcome to tetris</h1>
        <div className="flex justify-between gap-x-8">
          <Button onClick={onPlayButtonClick}>Play</Button>
          <Button>Help</Button>
        </div>
      </div>
    </div>
  );
}
