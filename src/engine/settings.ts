import { GameStatus, Settings, State } from "../state/types";

export function openSettings(state: State) {
  return {
    ...state,
    settingsModalOpen: true,
    status: GameStatus.PAUSED,
  };
}

export function saveSettings(state: State, settings: Settings) {
  return {
    ...state,
    settings,
  };
}

export function closeSettings(state: State) {
  return {
    ...state,
    settingsModalOpen: false,
    status: GameStatus.PLAYING,
  };
}
