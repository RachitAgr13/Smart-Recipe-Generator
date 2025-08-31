import React, { useState, useEffect } from "react";

export default function FilterPanel({ onFilter = () => {}, preferences = {} }) {
  const [difficulty, setDifficulty] = useState("");
  const [maxTime, setMaxTime] = useState("");

  const apply = () => {
    onFilter({ difficulty, maxTime });
  };

  // Auto-apply filters when preferences change
  useEffect(() => {
    if (preferences.diet || difficulty || maxTime) {
      apply();
    }
  }, [preferences.diet, difficulty, maxTime]);

  return (
    <div className="p-6 border-2 border-gray-200 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-300 focus-within:border-purple-400 focus-within:shadow-2xl">
      <h3 className="font-extrabold text-xl mb-4 text-gray-800 flex items-center">
        <span className="mr-2">🔍</span>
        Filter Recipes
      </h3>
      {preferences.diet && (
        <div className="mb-4 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm text-blue-700 font-medium">
            📋 Diet: {preferences.diet}
          </span>
        </div>
      )}
      <label className="block text-sm font-semibold mb-2 text-gray-700">Difficulty</label>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-200 text-gray-700"
      >
        <option value="">Any Difficulty</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <label className="block text-sm font-semibold mb-2 text-gray-700">Max Time (minutes)</label>
      <input
        type="number"
        min="0"
        value={maxTime}
        onChange={(e) => setMaxTime(e.target.value)}
        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-200 text-gray-700"
        placeholder="Enter max time"
      />

      <div className="flex gap-2">
        <button
          onClick={apply}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-bold shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          Apply Filters
        </button>
        <button
          onClick={() => {
            setDifficulty("");
            setMaxTime("");
            onFilter({});
          }}
          className="px-4 py-3 bg-gray-500 text-white rounded-lg font-bold shadow-lg hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          title="Clear all filters"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
