// frontend/src/App.jsx
import React, { useEffect, useMemo, useState } from 'react'
import IngredientInput from './components/IngredientInput'
import PreferencesPanel from './components/PreferencesPanel'
import FilterPanel from './components/FilterPanel'
import RecipeCard from './components/RecipeCard'
import FavoritesPanel from './components/FavoritesPanel'
import IngredientImageUpload from './components/IngredientImageUpload'
import { getAllRecipes, filterRecipes, generateRecipes } from './api'

export default function App() {
  const [ingredients, setIngredients] = useState([])
  const [preferences, setPreferences] = useState({})
  const [servings, setServings] = useState(2)
  const [localRecipes, setLocalRecipes] = useState([])
  const [filteredLocal, setFilteredLocal] = useState([])
  const [aiRecipes, setAiRecipes] = useState([])
  const [detectedRecipes, setDetectedRecipes] = useState([]) // 🔹 NEW
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem('favorites') || '[]')
  )
  const [ratings, setRatings] = useState(() =>
    JSON.parse(localStorage.getItem('ratings') || '{}')
  )

  // load recipes initially
  useEffect(() => {
    (async () => {
      try {
        const all = await getAllRecipes()
        setLocalRecipes(all)
        setFilteredLocal(all)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  // persist favorites
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  // persist ratings
  useEffect(() => {
    localStorage.setItem('ratings', JSON.stringify(ratings))
  }, [ratings])

  const onSubmitIngredients = (list) => {
    setIngredients(list)
  }

  const doFilter = async (params) => {
    try {
      const data = await filterRecipes(params)
      setFilteredLocal(data)
    } catch (e) {
      console.error(e)
    }
  }

  // === Generate Recipes with Gemini ===
  const askAI = async () => {
    if (!ingredients.length) {
      setError('Add some ingredients first.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await generateRecipes(ingredients, preferences)
      if (res.generated && res.generated.length > 0) {
        setAiRecipes(
          res.generated.map((r, i) => ({
            ...r,
            title: r.name || r.title || `Recipe ${i + 1}`,
            cookTimeMinutes:
              parseInt(String(r.cookTime).replace(/[^0-9]/g, '')) || 0
          }))
        )
      } else {
        setError('No recipes returned.')
      }
    } catch (e) {
      setError(e.message || 'Generation failed.')
    } finally {
      setLoading(false)
    }
  }

  // === Handle AI recipes from image upload ===
  const handleDetectedIngredient = (ingredient, recipes) => {
    console.log('🔥 Detected ingredient:', ingredient, recipes)
    setDetectedRecipes(
      recipes.map((r, i) => ({
        ...r,
        title: r.name || r.title || `Detected Recipe ${i + 1}`,
        cookTimeMinutes:
          parseInt(String(r.cookTime).replace(/[^0-9]/g, '')) || 0
      }))
    )
  }

  const toggleFav = (recipe) => {
  setFavorites((prev) => {
    const exists = prev.find((r) => r.name === recipe.name)
    let updated

    if (exists) {
      updated = prev.filter((r) => r.name !== recipe.name)
    } else {
      updated = [...prev, recipe]
      setToast(`✅ Saved "${recipe.name}" to favorites`)
      setTimeout(() => setToast(''), 2500)
    }

    return updated
  })
}


  const rate = (title, n) => {
    setRatings((prev) => ({ ...prev, [title]: n }))
  }

  const suggestedByRatings = useMemo(() => {
    const pairs = Object.entries(ratings).filter(([, v]) => v >= 4)
    const titles = new Set(pairs.map(([k]) => k))
    return [...localRecipes.filter((r) => titles.has(r.name)).slice(0, 5)]
  }, [ratings, localRecipes])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-4 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-200 mt-8 mb-8">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight mb-1">Smart Recipe Generator</h1>
          <p className="text-gray-500 text-lg">Enter ingredients, upload images, and let AI suggest recipes.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <IngredientInput onSubmitIngredients={onSubmitIngredients} />
          <PreferencesPanel
            preferences={preferences}
            setPreferences={setPreferences}
            servings={servings}
            setServings={setServings}
          />
          <FilterPanel onFilter={doFilter} />
        </div>

        <IngredientImageUpload onDetected={handleDetectedIngredient} />

        {ingredients.length > 0 && (
          <div className="mb-4 text-base text-gray-700">
            <b>Ingredients:</b> {ingredients.join(', ')}
          </div>
        )}

        <div className="flex gap-3 mb-8 items-center">
          <button
            onClick={askAI}
            className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition font-semibold shadow"
          >
            Generate Recipes
          </button>
          {loading && <div className="spinner" />}
          {error && <div className="text-red-600 text-base">{error}</div>}
        </div>

        {toast && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
            {toast}
          </div>
        )}

        {/* === AI Recipes (text ingredients) === */}
        {aiRecipes.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">AI Recipes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiRecipes.map((r, i) => (
                <RecipeCard
                  key={i}
                  recipe={r}
                  servings={servings}
                  onToggleFav={() => toggleFav(r.title || r.name)}
                  isFav={favorites.includes(r.title || r.name)}
                  rating={ratings[r.title || r.name] || 0}
                  onRate={(n) => rate(r.title || r.name, n)}
                />
              ))}
            </div>
          </section>
        )}

        {/* === AI Recipes (from image detection) === */}
        {detectedRecipes.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">AI Recipes from Image</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {detectedRecipes.map((r, i) => (
                <RecipeCard
                  key={i}
                  recipe={r}
                  servings={servings}
                  onToggleFav={() => toggleFav(r)}
                  isFav={favorites.some((f) => f.name === r.name)}
                  rating={ratings[r.name] || 0}
                  onRate={(n) => rate(r.name, n)}
                />
              ))}
            </div>
          </section>
        )}

        {/* === Local Recipes === */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold text-gray-800">Local Recipes</h2>
            <span className="text-sm text-gray-500">{filteredLocal.length} items</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocal.map((r) => (
              <RecipeCard
                key={r.id}
                recipe={{
                  ...r,
                  title: r.name,
                  cookTimeMinutes:
                    parseInt(String(r.cookTime).replace(/[^0-9]/g, '') ) || 0
                }}
                servings={servings}
                onToggleFav={() => toggleFav(r)}
                isFav={favorites.some((f) => f.name === r.name)}
                rating={ratings[r.name] || 0}
                onRate={(n) => rate(r.name, n)}
              />
            ))}
          </div>
        </section>

        <FavoritesPanel favorites={favorites} onClear={() => setFavorites([])} />

        {suggestedByRatings.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Suggestions (based on your ratings)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedByRatings.map((r) => (
                <div key={r.id} className="bg-white rounded-xl shadow p-4">
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-sm text-gray-600">
                    Time: {r.cookTime} • {r.difficulty}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-12 pt-6 border-t text-center text-xs text-gray-400">
          Built with <span className="font-semibold text-gray-600">React + Vite</span> • Tailwind • Node + Express • Gemini
        </footer>
      </div>
    </div>
  )
}
