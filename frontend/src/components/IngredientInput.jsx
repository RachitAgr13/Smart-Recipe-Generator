import React, { useState } from "react";

export default function IngredientInput({ onSubmitIngredients = () => {} }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const list = text.split(",").map((s) => s.trim()).filter(Boolean);
    onSubmitIngredients(list);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 border rounded-2xl bg-gray-50 shadow-lg flex flex-col gap-2">
      <h3 className="font-bold text-lg mb-2 text-gray-800">Enter Ingredients</h3>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. tomato, onion, garlic"
        className="w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <button
        type="submit"
        className="mt-2 px-5 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
      >
        Add
      </button>
    </form>
  );
}
