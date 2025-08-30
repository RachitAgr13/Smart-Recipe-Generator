// frontend/src/components/RecipeCard.jsx
import React from 'react'

export default function RecipeCard({ recipe, servings, onToggleFav, isFav, rating, onRate }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{recipe.title || recipe.name}</h3>
        <button
          onClick={onToggleFav}
          className="text-yellow-500 text-xl"
          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
        >
          {isFav ? "★" : "☆"}
        </button>
      </div>

      <div className="text-sm text-gray-600 mb-2">
        Time: {recipe.cookTime || recipe.cookTimeMinutes + " min"} • {recipe.difficulty || "N/A"}
      </div>

      <div className="text-sm mb-2">
        <b>Ingredients:</b> {recipe.ingredients?.join(", ") || "N/A"}
      </div>

      <div className="text-sm mb-2">
        <b>Steps:</b>
        <ol className="list-decimal ml-5">
          {recipe.steps?.map((s, i) => (
            <li key={i}>{s}</li>
          )) || <li>No steps available</li>}
        </ol>
      </div>

      {/* Rating Stars */}
      <div className="mt-auto flex gap-1">
        {[1,2,3,4,5].map((n) => (
          <button
            key={n}
            onClick={() => onRate(n)}
            className={`text-xl ${rating >= n ? "text-yellow-500" : "text-gray-400"}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )
}
