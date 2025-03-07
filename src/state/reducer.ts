import {
  pauseGame,
  resumeGame,
  moveDown,
  moveLeft,
  moveRight,
  rotate,
  hardDrop,
} from "../engine";
import { holdPiece, clearFullLines, finishHardDrop } from "../engine/actions";
import { init } from "./state";
import { Action, ActionType, State } from "./types";

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionType.RESTART_GAME:
      return init();

    case ActionType.PAUSE_GAME:
      return pauseGame(state);

    case ActionType.RESUME_GAME:
      return resumeGame(state);

    case ActionType.MOVE_DOWN:
    case ActionType.TICK:
      return moveDown(state);

    case ActionType.MOVE_LEFT:
      return moveLeft(state);

    case ActionType.MOVE_RIGHT:
      return moveRight(state);

    case ActionType.ROTATE:
      return rotate(state);

    case ActionType.HARD_DROP:
      return hardDrop(state);

    case ActionType.HOLD_PIECE:
      return holdPiece(state);

    case ActionType.CLEAR_FULL_LINES:
      return clearFullLines(state);

    case ActionType.START_ANIMATION:
      return { ...state, currentAnimation: action.payload.animation };

    case ActionType.END_ANIMATION:
      return { ...state, currentAnimation: null };

    case ActionType.END_HARD_DROP:
      return finishHardDrop(state);

    default: {
      const exhaustiveCheck: never = action;
      throw new Error(`Unhandled action: ${exhaustiveCheck}`);
    }
  }
}
