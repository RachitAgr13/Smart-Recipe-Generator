// frontend/src/components/RecipeCard.jsx
import React from 'react'

export default function RecipeCard({ recipe, servings, onToggleFav, isFav, rating, onRate }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col transition-transform duration-200 hover:scale-[1.025] hover:shadow-2xl border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-xl text-gray-800">{recipe.title || recipe.name}</h3>
        <button
          onClick={onToggleFav}
          className="text-yellow-500 text-2xl hover:scale-110 transition-transform"
          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
        >
          {isFav ? "★" : "☆"}
        </button>
      </div>

      <div className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Time:</span> {recipe.cookTime || recipe.cookTimeMinutes + " min"} <span className="mx-1">•</span> <span className="font-medium">{recipe.difficulty || "N/A"}</span>
      </div>

      <div className="text-sm mb-2">
        <b>Ingredients:</b> {recipe.ingredients?.join(", ") || "N/A"}
      </div>

      <div className="text-xs text-green-700 mb-2 font-semibold">
        <b>Nutrition:</b>
        {` ${recipe.nutrition.calories || "?"} cal, ${recipe.nutrition.protein || "?"} protein, ${recipe.nutrition.carbs || "?"} carbs, ${recipe.nutrition.fat || "?"} fat`}
      </div>

      <div className="text-sm mb-2">
        <b>Steps:</b>
        <ol className="list-decimal ml-5 space-y-1">
          {recipe.steps?.map((s, i) => (
            <li key={i}>{s}</li>
          )) || <li>No steps available</li>}
        </ol>
      </div>

      {/* Rating Stars */}
      <div className="mt-auto flex gap-1 pt-2">
        {[1,2,3,4,5].map((n) => (
          <button
            key={n}
            onClick={() => onRate(n)}
            className={`text-xl ${rating >= n ? "text-yellow-500" : "text-gray-300"} hover:scale-110 transition-transform`}
            aria-label={`rate-${n}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )
}
