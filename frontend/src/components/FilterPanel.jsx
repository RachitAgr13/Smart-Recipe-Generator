import React, { useState } from "react";

export default function FilterPanel({ onFilter = () => {} }) {
  const [difficulty, setDifficulty] = useState("");
  const [maxTime, setMaxTime] = useState("");

  const apply = () => {
    onFilter({ difficulty, maxTime });
  };

  return (
    <div className="p-5 border rounded-2xl bg-gray-50 shadow-lg flex flex-col gap-2">
      <h3 className="font-extrabold mb-2 text-lg text-gray-800">Filter Recipes</h3>
      <label className="block text-sm mb-1">Difficulty</label>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="w-full border rounded px-2 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
      >
        <option value="">Any</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <label className="block text-sm mb-1">Max Time (minutes)</label>
      <input
        type="number"
        min="0"
        value={maxTime}
        onChange={(e) => setMaxTime(e.target.value)}
        className="w-full border rounded px-2 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
      />

      <button
        onClick={apply}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Apply
      </button>
    </div>
  );
}
