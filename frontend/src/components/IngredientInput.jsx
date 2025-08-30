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
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h3 className="font-semibold mb-2">Enter Ingredients</h3>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. tomato, onion, garlic"
        className="w-full px-2 py-1 border rounded"
      />
      <button
        type="submit"
        className="mt-2 px-4 py-1 bg-black text-white rounded"
      >
        Add
      </button>
    </form>
  );
}
