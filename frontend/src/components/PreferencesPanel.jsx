import React from "react";

export default function PreferencesPanel({
  preferences = {},
  setPreferences = () => {},
  servings = 1,
  setServings = () => {}
}) {
  return (
    <div className="p-5 border rounded-2xl bg-gray-50 shadow-lg flex flex-col gap-2">
      <h3 className="font-bold mb-2 text-lg text-gray-800">Preferences</h3>
      <label className="block text-sm mb-1">Diet</label>
      <select
        value={preferences.diet || ""}
        onChange={(e) => setPreferences({ ...preferences, diet: e.target.value })}
        className="w-full border rounded px-2 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
        className="w-full border rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}
