const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

/**
 * Upload ingredient image and detect main ingredient + recipes
 */
export async function detectIngredient(formData) {
  const res = await fetch(`${API_BASE}/api/detect-ingredient`, {
    method: "POST",
    body: formData // 👈 must send raw FormData, no headers
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Detection failed: ${res.status} ${errText}`);
  }

  return res.json();
}


/**
 * Get all local recipes
 */
export async function getAllRecipes() {
  const res = await fetch(`${API_BASE}/api/recipes`);
  if (!res.ok) throw new Error("Failed to load recipes");
  return res.json();
}

/**
 * Filter recipes (currently just returns all)
 */
export async function filterRecipes(params) {
  return getAllRecipes();
}

/**
 * Generate recipes using Gemini API
 */
export async function generateRecipes(ingredients, dietary) {
  const res = await fetch(`${API_BASE}/api/generate-recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients, dietary }),
  });

  if (!res.ok) throw new Error("Failed to generate recipes");
  return res.json(); // { recipes: [...] }
}

export async function expandRecipeSteps(recipe) {
  const res = await fetch(`${API_BASE}/api/expand-steps`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipe }),
  });

  if (!res.ok) throw new Error("Failed to expand recipe steps");
  return res.json(); // { steps: [...] }
}
