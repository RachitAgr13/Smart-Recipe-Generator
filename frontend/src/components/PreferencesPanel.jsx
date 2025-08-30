import React from "react";

export default function PreferencesPanel({
  preferences = {},
  setPreferences = () => {},
  servings = 1,
  setServings = () => {}
}) {
  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-2">Preferences</h3>
      <label className="block text-sm mb-1">Diet</label>
      <select
        value={preferences.diet || ""}
        onChange={(e) => setPreferences({ ...preferences, diet: e.target.value })}
        className="w-full border rounded px-2 py-1 mb-2"
      >
        <option value="">Any</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="keto">Keto</option>
        <option value="gluten-free">Gluten Free</option>
      </select>

      <label className="block text-sm mb-1">Servings</label>
      <input
        type="number"
        min="1"
        value={servings}
        onChange={(e) => setServings(Number(e.target.value))}
        className="w-full border rounded px-2 py-1"
      />
    </div>
  );
}
