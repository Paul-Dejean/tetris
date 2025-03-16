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
        className="p-2 text-white rounded-full cursor-pointer bg-background hover:bg-gray-700"
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
      className="fixed inset-0 flex items-center justify-center bg-black/75"
      onClick={onClose}
    >
      <div
        className="p-6 bg-white rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-bold">Keyboard Settings</h2>

        <div className="space-y-3">
          {Object.keys(settings).map((action) => (
            <div key={action} className="flex items-center justify-between">
              <span className="capitalize">
                {action.replace(/([A-Z])/g, " $1")}
              </span>
              <button
                className="px-4 py-2 bg-gray-100 border rounded cursor-pointer hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 "
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

        <div className="flex justify-end mt-4 gap-x-2">
          {JSON.stringify(settings) !== JSON.stringify(initialSettings) && (
            <button
              onClick={() => saveSettings(initialSettings)}
              className="px-4 py-2 bg-red-400 rounded cursor-pointer"
            >
              Reset
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
