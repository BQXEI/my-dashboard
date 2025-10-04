import { useState } from "react";

export default function SettingsDialog({ open, onClose, settings, setSettings }) {
  const [local, setLocal] = useState(settings);
  if (!open) return null;

  function apply() {
    setSettings(local);
    onClose();
  }

  return (
    <div className="modal">
      <div className="modal__content">
        <h3>Settings</h3>
        <div className="col gap">
          <label>
            Theme:
            <select
              value={local.theme}
              onChange={(e) => setLocal({ ...local, theme: e.target.value })}
            >
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </label>
          <label>
            Temperature Unit:
            <select
              value={local.tempUnit}
              onChange={(e) => setLocal({ ...local, tempUnit: e.target.value })}
            >
              <option>°C</option>
              <option>°F</option>
            </select>
          </label>
          <button className="btn" onClick={apply}>Save</button>
        </div>
      </div>
    </div>
  );
}
