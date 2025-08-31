// frontend/src/components/IngredientImageUpload.jsx
import React, { useState } from 'react'
import { detectIngredient } from '../api'

export default function IngredientImageUpload({ onDetected }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFile(e.target.files[0])
    setError('')
  }

  const handleDetect = async () => {
  if (!file) {
    setError('Please select an image first.')
    return
  }
  setLoading(true)
  setError('')
  try {
    const formData = new FormData()
    formData.append('image', file)

    const res = await detectIngredient(formData)
    console.log("🔥 Backend detect result:", res)   // 👈 add this line

    if (res && res.ingredient) {
      onDetected(res.ingredient, res.recipes || [])
    } else {
      setError('No ingredient detected.')
    }
  } catch (err) {
    setError(err.message || 'Detection failed.')
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="mb-6 p-5 border rounded-2xl bg-gray-50 shadow-lg flex flex-col gap-2">
      <h3 className="font-extrabold mb-2 text-lg text-gray-800">Upload Ingredient Image</h3>
      <input type="file" accept="image/*" onChange={handleChange} className="mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition" />
      <button
        onClick={handleDetect}
        disabled={loading}
        className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 font-bold shadow transition focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {loading ? 'Detecting...' : 'Detect Ingredient'}
      </button>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </div>
  )
}
