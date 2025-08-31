// frontend/src/components/RecipeCard.jsx
import React from 'react'

// Skeleton loader component
const RecipeCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-6 w-6 bg-gray-200 rounded"></div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="mt-auto flex gap-1 pt-2">
      {[1,2,3,4,5].map((n) => (
        <div key={n} className="h-6 w-6 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
)

export default function RecipeCard({ recipe, servings, onToggleFav, isFav, rating, onRate, loading = false }) {
  if (loading) {
    return <RecipeCardSkeleton />
  }

  const handleFavoriteClick = () => {
    onToggleFav();
    // Add heart beat animation
    const button = document.querySelector(`[data-recipe="${recipe.name}"]`);
    if (button) {
      button.classList.add('animate-heart-beat');
      setTimeout(() => button.classList.remove('animate-heart-beat'), 1300);
    }
  };

  const handleRatingClick = (starRating) => {
    onRate(starRating);
    // Add star twinkle animation
    const stars = document.querySelectorAll(`[data-rating="${recipe.name}"]`);
    stars.forEach((star, index) => {
      if (index < starRating) {
        star.classList.add('animate-star-twinkle');
        setTimeout(() => star.classList.remove('animate-star-twinkle'), 800);
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl hover:border-blue-200 border border-gray-100 cursor-pointer animate-bounce-in">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-extrabold text-xl sm:text-2xl text-gray-800 leading-tight">{recipe.title || recipe.name}</h3>
        <button
          data-recipe={recipe.name}
          onClick={handleFavoriteClick}
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
            data-rating={`${recipe.name}-${n}`}
            onClick={() => handleRatingClick(n)}
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
