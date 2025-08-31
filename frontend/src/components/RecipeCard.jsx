// frontend/src/components/RecipeCard.jsx
import React from 'react'

export default function RecipeCard({ recipe, servings, onToggleFav, isFav, rating, onRate }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl hover:border-blue-200 border border-gray-100 cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-extrabold text-xl sm:text-2xl text-gray-800 leading-tight">{recipe.title || recipe.name}</h3>
        <button
          onClick={onToggleFav}
          className="text-yellow-500 text-2xl hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded-full"
          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
        >
          {isFav ? "★" : "☆"}
        </button>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        <span className="font-medium">Time:</span> {recipe.cookTime || recipe.cookTimeMinutes + " min"} <span className="mx-1">•</span> <span className="font-medium">{recipe.difficulty || "N/A"}</span>
      </div>

      <div className="text-sm mb-3">
        <b>Ingredients:</b> {recipe.ingredients?.join(", ") || "N/A"}
      </div>

      <div className="text-xs text-green-700 mb-3 font-semibold">
        <b>Nutrition:</b>
        {` ${recipe.nutrition.calories || "?"} cal, ${recipe.nutrition.protein || "?"} protein, ${recipe.nutrition.carbs || "?"} carbs, ${recipe.nutrition.fat || "?"} fat`}
      </div>

      <div className="text-sm mb-3">
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
            className={`text-xl ${rating >= n ? "text-yellow-500" : "text-gray-300"} hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded-full`}
            aria-label={`rate-${n}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )
}
