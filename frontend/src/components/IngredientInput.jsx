import React, { useState, useEffect, useRef } from "react";

export default function IngredientInput({ onSubmitIngredients = () => {} }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const list = text.split(",").map((s) => s.trim()).filter(Boolean);
    onSubmitIngredients(list);
    setText("");
  };

  const quickAdd = (ingredient) => {
    setText(prev => prev ? `${prev}, ${ingredient}` : ingredient);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border-2 border-gray-200 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300 focus-within:border-blue-400 focus-within:shadow-2xl">
      <h3 className="font-extrabold text-xl mb-4 text-gray-800 flex items-center">
        <span className="mr-2">🥕</span>
        Enter Ingredients
      </h3>
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. tomato, onion, garlic"
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 text-gray-700 placeholder-gray-400"
      />
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Quick add:</p>
        <div className="flex flex-wrap gap-2">
          {['tomato', 'onion', 'garlic', 'chicken', 'rice'].map((ingredient) => (
            <button
              key={ingredient}
              type="button"
              onClick={() => quickAdd(ingredient)}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition"
            >
              {ingredient}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        Add Ingredients
      </button>
    </form>
  );
}
