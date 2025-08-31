import React from "react";

export default function PreferencesPanel({
  preferences = {},
  setPreferences = () => {},
  servings = 1,
  setServings = () => {}
}) {
  return (
    <div className="p-6 border-2 border-gray-200 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:border-orange-300 focus-within:border-orange-400 focus-within:shadow-2xl">
      <h3 className="font-extrabold text-xl mb-4 text-gray-800 flex items-center">
        <span className="mr-2">⚙️</span>
        Preferences
      </h3>
      <label className="block text-sm font-semibold mb-2 text-gray-700">Diet</label>
      <select
        value={preferences.diet || ""}
        onChange={(e) => setPreferences({ ...preferences, diet: e.target.value })}
        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all duration-200 text-gray-700"
      >
        <option value="">Any Diet</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="keto">Keto</option>
        <option value="gluten-free">Gluten Free</option>
      </select>

      <label className="block text-sm font-semibold mb-2 text-gray-700">Servings</label>
      <input
        type="number"
        min="1"
        value={servings}
        onChange={(e) => setServings(Number(e.target.value))}
        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all duration-200 text-gray-700"
        placeholder="Number of servings"
      />
    </div>
  );
}
