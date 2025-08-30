import React, { useState } from "react";

export default function FilterPanel({ onFilter = () => {} }) {
  const [difficulty, setDifficulty] = useState("");
  const [maxTime, setMaxTime] = useState("");

  const apply = () => {
    onFilter({ difficulty, maxTime });
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-2">Filter Recipes</h3>
      <label className="block text-sm mb-1">Difficulty</label>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="w-full border rounded px-2 py-1 mb-2"
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
        className="w-full border rounded px-2 py-1 mb-2"
      />

      <button
        onClick={apply}
        className="px-4 py-1 bg-black text-white rounded"
      >
        Apply
      </button>
    </div>
  );
}
