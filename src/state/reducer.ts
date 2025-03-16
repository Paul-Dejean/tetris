import {
  pauseGame,
  resumeGame,
  moveDown,
  moveLeft,
  moveRight,
  hardDrop,
  openSettings,
  closeSettings,
  holdPiece,
  clearFullLines,
  endHardDrop,
  rotateLeft,
  rotateRight,
  tick,
  startGameAnimation,
  endGameAnimation,
} from "../engine";
import { updateLockDelay } from "../engine/actions";

import { saveSettings } from "../engine/settings";
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
      return moveDown(state);

    case ActionType.TICK:
      return tick(state);

    case ActionType.MOVE_LEFT:
      return moveLeft(state);

    case ActionType.MOVE_RIGHT:
      return moveRight(state);

    case ActionType.ROTATE_RIGHT:
      return rotateRight(state);

    case ActionType.ROTATE_LEFT:
      return rotateLeft(state);

    case ActionType.HARD_DROP:
      return hardDrop(state);

    case ActionType.HOLD_PIECE:
      return holdPiece(state);

    case ActionType.CLEAR_FULL_LINES:
      return clearFullLines(state);

    case ActionType.START_ANIMATION:
      return startGameAnimation(state, action.payload.animation);

    case ActionType.END_ANIMATION:
      return endGameAnimation(state);

    case ActionType.END_HARD_DROP:
      return endHardDrop(state);

    case ActionType.OPEN_SETTINGS_MODAL:
      return openSettings(state);

    case ActionType.CLOSE_SETTINGS_MODAL:
      return closeSettings(state);

    case ActionType.SAVE_SETTINGS:
      return saveSettings(state, action.payload.settings);

    case ActionType.UPDATE_LOCK_DELAY:
      return updateLockDelay(state);

    default: {
      const exhaustiveCheck: never = action;
      throw new Error(`Unhandled action: ${exhaustiveCheck}`);
    }
  }
}
