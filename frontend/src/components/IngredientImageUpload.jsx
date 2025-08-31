// frontend/src/components/IngredientImageUpload.jsx
import React, { useState } from 'react'
import { detectIngredient } from '../api'

export default function IngredientImageUpload({ onDetected }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [detectedIngredient, setDetectedIngredient] = useState('')

  const handleChange = (e) => {
    setFile(e.target.files[0])
    setError('')
    setDetectedIngredient('') // Reset detected ingredient when new file selected
  }

  const handleDetect = async () => {
  if (!file) {
    setError('Please select an image first.')
    return
  }
  setLoading(true)
  setError('')
  try {
    console.log("📤 Uploading image:", file.name, file.size, "bytes")
    const formData = new FormData()
    formData.append('image', file)

    const res = await detectIngredient(formData)
    console.log("🔥 Backend detect result:", res)

    if (res && res.ingredient) {
      console.log("✅ Ingredient detected:", res.ingredient)
      console.log("🍽️ Recipes found:", res.recipes?.length || 0)
      setDetectedIngredient(res.ingredient)
      onDetected(res.ingredient, res.recipes || [])
    } else {
      setError('No ingredient detected. Try a clearer image of a single ingredient.')
    }
  } catch (err) {
    console.error("❌ Image detection error:", err)
    setError(`Detection failed: ${err.message}`)
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="mb-6 p-6 border-2 border-gray-200 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300 focus-within:border-blue-400 focus-within:shadow-2xl">
      <h3 className="font-extrabold text-xl mb-4 text-gray-800 flex items-center">
        <span className="mr-2">📷</span>
        Upload Ingredient Image
      </h3>
      <div className="mb-4">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleChange} 
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <button
        onClick={handleDetect}
        disabled={loading}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold shadow-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {loading ? '🔍 Detecting...' : '🔍 Detect Ingredient'}
      </button>
      {error && <div className="text-red-600 text-sm mt-3 p-3 bg-red-50 rounded-lg border border-red-200">{error}</div>}
      {detectedIngredient && (
        <div className="text-green-600 text-sm mt-3 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center">
          <span className="mr-2">🎯</span>
          <span className="font-semibold">Detected ingredient: {detectedIngredient}</span>
        </div>
      )}
    </div>
  )
}
