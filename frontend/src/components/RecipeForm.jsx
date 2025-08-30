import { useState } from "react";

async function generateRecipe(ingredients, dietary) {
  try {
    const res = await fetch("http://localhost:5000/api/generate-recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients, dietary }),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();

    // Handle both JSON object and raw string
    if (typeof data.generated === "string") {
      return { raw: data.generated };
    } else {
      return data.generated;
    }
  } catch (err) {
    console.error("❌ Error generating recipe:", err.message);
    return null;
  }
}

export default function RecipeForm() {
  const [ingredients, setIngredients] = useState("");
  const [dietary, setDietary] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const ingredientList = ingredients.split(",").map((i) => i.trim());
    const dietaryList = dietary ? dietary.split(",").map((d) => d.trim()) : [];

    const result = await generateRecipe(ingredientList, dietaryList);
    setRecipe(result);
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Smart Recipe Generator</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow-md rounded-lg p-6"
      >
        <input
          type="text"
          placeholder="Enter ingredients (comma-separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Dietary preferences (comma-separated)"
          value={dietary}
          onChange={(e) => setDietary(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {loading ? "Generating..." : "Generate Recipe"}
        </button>
      </form>

      {recipe && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          {recipe.raw ? (
            // Raw text fallback
            <pre className="whitespace-pre-wrap">{recipe.raw}</pre>
          ) : (
            // Parsed JSON
            <>
              <h2 className="text-xl font-bold mb-2">{recipe.name}</h2>
              <p>
                <strong>Cook Time:</strong> {recipe.cookTime}
              </p>
              <p>
                <strong>Difficulty:</strong> {recipe.difficulty}
              </p>

              <h3 className="mt-4 font-semibold">Ingredients:</h3>
              <ul className="list-disc ml-6">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>

              <h3 className="mt-4 font-semibold">Steps:</h3>
              <ol className="list-decimal ml-6">
                {recipe.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>

              <h3 className="mt-4 font-semibold">Nutrition:</h3>
              <p>
                {recipe.nutrition.calories} kcal, {recipe.nutrition.protein} protein,
                {recipe.nutrition.carbs} carbs, {recipe.nutrition.fat} fat
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
