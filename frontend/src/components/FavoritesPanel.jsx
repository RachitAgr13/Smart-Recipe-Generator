import React, { useState } from "react";

export default function FavoritesPanel({ favorites = [], onClear }) {
  const [expanded, setExpanded] = useState({});

  if (!favorites.length) return null;

  return (
    <div className="bg-gray-50 p-6 rounded-2xl shadow-lg mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Your Favorites</h2>
        <button
          onClick={onClear}
          className="px-4 py-1 bg-red-600 text-white text-sm rounded-lg shadow hover:bg-red-700 transition"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((recipe, idx) => {
          const isExpanded = expanded[idx] || false;
          return (
            <div
              key={idx}
              className="p-5 border rounded-xl shadow bg-white hover:shadow-xl transition cursor-pointer"
            >
              <h3 className="text-lg font-bold text-gray-700 mb-1">
                {recipe.name || recipe.title || `Recipe ${idx + 1}`}
              </h3>

              {/* Ingredients */}
              <p className="text-sm text-gray-600 mt-1 mb-1">
                <strong>Ingredients:</strong> {Array.isArray(recipe.ingredients) ? recipe.ingredients.join(", ") : "N/A"}
              </p>

              {/* Cook Time & Difficulty */}
              <p className="text-sm text-gray-600 mb-1">
                <strong>Cook Time:</strong> {recipe.cookTime || recipe.cookTimeMinutes + " min" || "N/A"} | <strong>Difficulty:</strong> {recipe.difficulty || "N/A"}
              </p>

              {/* Nutrition */}
              {recipe.nutrition && (
                <p className="text-xs text-green-700 font-semibold mb-1">
                  <strong>Nutrition:</strong>
                  {` ${recipe.nutrition.calories || "?"} cal, ${recipe.nutrition.protein || "?"} protein, ${recipe.nutrition.carbs || "?"} carbs, ${recipe.nutrition.fat || "?"} fat`}
                </p>
              )}

              {/* Toggle Steps */}
              <button
                onClick={() => setExpanded((prev) => ({ ...prev, [idx]: !isExpanded }))}
                className="mt-2 px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {isExpanded ? "Hide Steps" : "Show Steps"}
              </button>

              {/* Steps */}
              {isExpanded && recipe.steps && (
                <ol className="mt-2 list-decimal list-inside text-sm text-gray-700 space-y-1">
                  {recipe.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
