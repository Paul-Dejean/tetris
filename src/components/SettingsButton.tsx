import { Settings as SettingsIcon } from "lucide-react";
import { useEffect } from "react";
import { useGame } from "../contexts/GameContext";
import { ActionType, Settings } from "../state/types";
import { initialSettings } from "../state/state";

export function SettingsButton() {
  const { state, dispatch } = useGame();
  useEffect(() => {
    const storedSettings = localStorage.getItem("keyboardSettings");
    if (storedSettings) {
      dispatch({
        type: ActionType.SAVE_SETTINGS,
        payload: { settings: JSON.parse(storedSettings) },
      });
    }
  }, [dispatch]);

  return (
    <div>
      <button
        type="button"
        className="p-2 bg-background text-white rounded-full hover:bg-gray-700"
        onClick={() => dispatch({ type: ActionType.OPEN_SETTINGS_MODAL })}
      >
        <SettingsIcon size={24} />
      </button>
      <SettingsModal
        isOpen={state.settingsModalOpen}
        onClose={() => dispatch({ type: ActionType.CLOSE_SETTINGS_MODAL })}
      />
    </div>
  );
}

function SettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { dispatch, state } = useGame();
  const settings = state.settings;

  // Load settings from localStorage

  const saveSettings = (settings: Settings) => {
    localStorage.setItem("keyboardSettings", JSON.stringify(settings));
    dispatch({ type: ActionType.SAVE_SETTINGS, payload: { settings } });
  };

  const handleKeyChange = (action: keyof Settings, event: KeyboardEvent) => {
    event.preventDefault();
    saveSettings({
      ...settings,
      [action]: event.code,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/75 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-96 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Keyboard Settings</h2>

        <div className="space-y-3">
          {Object.keys(settings).map((action) => (
            <div key={action} className="flex justify-between items-center">
              <span className="capitalize">
                {action.replace(/([A-Z])/g, " $1")}
              </span>
              <button
                className="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 "
                onClick={(e) => {
                  e.preventDefault();
                  const button = e.currentTarget;

                  document.addEventListener(
                    "keydown",
                    (event) => {
                      handleKeyChange(action as keyof Settings, event);
                      button.blur();
                    },
                    { once: true }
                  );
                }}
              >
                {settings[action as keyof Settings]}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-x-2">
          <button
            onClick={() => saveSettings(initialSettings)}
            className="px-4 py-2 bg-red-400 rounded"
          >
            Reset
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
