import React, { useState } from "react";

export default function FavoritesPanel({ favorites = [], onClear }) {
  const [expanded, setExpanded] = useState({});

  if (!favorites.length) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Your Favorites</h2>
        <button
          onClick={onClear}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((recipe, idx) => {
          const isExpanded = expanded[idx] || false;
          return (
            <div
              key={idx}
              className="p-4 border rounded shadow bg-white"
            >
              <h3 className="text-lg font-bold">
                {recipe.name || recipe.title || `Recipe ${idx + 1}`}
              </h3>

              {/* Ingredients */}
              <p className="text-sm text-gray-600 mt-1">
                <strong>Ingredients:</strong>{" "}
                {Array.isArray(recipe.ingredients)
                  ? recipe.ingredients.join(", ")
                  : "N/A"}
              </p>

              {/* Cook Time & Difficulty */}
              <p className="text-sm text-gray-600">
                <strong>Cook Time:</strong>{" "}
                {recipe.cookTime || recipe.cookTimeMinutes + " min" || "N/A"} |{" "}
                <strong>Difficulty:</strong>{" "}
                {recipe.difficulty || "N/A"}
              </p>

              {/* Nutrition */}
              {recipe.nutrition && (
                <p className="text-sm text-gray-600">
                  <strong>Nutrition:</strong>
                  {` ${recipe.nutrition.calories || "?"} cal, 
                     ${recipe.nutrition.protein || "?"} protein, 
                     ${recipe.nutrition.carbs || "?"} carbs, 
                     ${recipe.nutrition.fat || "?"} fat`}
                </p>
              )}

              {/* Toggle Steps */}
              <button
                onClick={() =>
                  setExpanded((prev) => ({ ...prev, [idx]: !isExpanded }))
                }
                className="mt-2 px-3 py-1 text-sm rounded bg-blue-600 text-white"
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
