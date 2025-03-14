import { Settings as SettingsIcon } from "lucide-react";
import { useEffect } from "react";
import { useGame } from "../contexts/GameContext";
import { ActionType, Settings } from "../state/types";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Keyboard Settings</h2>

        <div className="space-y-3">
          {Object.keys(settings).map((action) => (
            <div key={action} className="flex justify-between items-center">
              <span className="capitalize">
                {action.replace(/([A-Z])/g, " $1")}
              </span>
              <button
                className="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                onClick={(e) => {
                  e.preventDefault();
                  document.addEventListener(
                    "keydown",
                    (event) => handleKeyChange(action as keyof Settings, event),
                    { once: true }
                  );
                }}
              >
                {settings[action as keyof Settings]}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
