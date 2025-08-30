// backend/routes/recipes.js
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from "multer";

dotenv.config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// --- File paths ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "data", "recipes.json");

// --- Gemini Setup ---
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("✅ Gemini client initialized");
} else {
  console.warn("⚠️ GEMINI_API_KEY not set");
}

function getGeminiModel() {
  if (!genAI) throw new Error("Gemini client not initialized. Check GEMINI_API_KEY");
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  });
}

async function geminiGenerateText(prompt, parts = null) {
  const model = getGeminiModel();
  const result = await model.generateContent(parts || prompt);
  return result.response.text();
}

// --- Expand recipe steps with Gemini ---
async function expandSteps(recipe) {
  const prompt = `
You are a JSON API that expands recipes with detailed step-by-step cooking instructions.
Respond ONLY with a JSON object.

Input Recipe:
${JSON.stringify(recipe, null, 2)}

Required Output Format:
{
  "steps": ["Step 1...", "Step 2...", "Step 3..."]
}

Make sure steps are clear, sequential, and beginner-friendly.
`;

  const raw = await geminiGenerateText(prompt);
  let cleaned = raw.trim().replace(/```json/g, "").replace(/```/g, "").trim();

  const f = cleaned.indexOf("{");
  const l = cleaned.lastIndexOf("}");
  if (f !== -1 && l !== -1) {
    cleaned = cleaned.substring(f, l + 1);
  }

  try {
    const parsed = JSON.parse(cleaned);
    if (parsed.steps && Array.isArray(parsed.steps)) {
      return parsed.steps;
    }
  } catch {
    console.warn("⚠️ Failed to parse expanded steps");
  }

  return recipe.steps || ["No steps available"];
}

// --- Utility to read recipes + expand missing steps ---
async function readRecipes() {
  const buf = await fs.readFile(dataPath, "utf-8");
  const recipes = JSON.parse(buf);

  const expanded = [];
  for (let r of recipes) {
    if (!r.steps || r.steps.length < 2) {
      try {
        const steps = await expandSteps(r);
        expanded.push({ ...r, steps });
      } catch {
        expanded.push(r);
      }
    } else {
      expanded.push(r);
    }
  }

  return expanded;
}

// =================== ROUTES ===================

// Get all recipes
router.get("/recipes", async (req, res) => {
  try {
    const recipes = await readRecipes();
    res.json(recipes);
  } catch (err) {
    console.error("❌ Error reading recipes:", err.message);
    res.status(500).json({ error: "Failed to read recipes" });
  }
});

// Get recipe by ID
router.get("/recipes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const recipes = await readRecipes();
    const found = recipes.find((r) => Number(r.id) === id);
    if (!found) return res.status(404).json({ error: "Recipe not found" });
    res.json(found);
  } catch (err) {
    console.error("❌ Error getting recipe:", err.message);
    res.status(500).json({ error: "Failed" });
  }
});

// --- Gemini Recipe Generation ---
async function handleGenerate(req, res) {
  console.log("🔥 Hit generate with body:", req.body);
  try {
    const { ingredients, dietary } = req.body;
    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: "No ingredients provided" });
    }

    const dietaryText = dietary ? `\nDietary preferences: ${dietary}` : "";

    const prompt = `
You are a JSON API that generates diverse cooking recipes.
Do not include any explanations, comments, or Markdown code blocks.
Respond ONLY with a single valid JSON array of recipe objects.

Each recipe object must follow this schema exactly:
{
  "name": "string",
  "ingredients": ["string", "string"],
  "steps": ["string", "string"],
  "cookTime": "string",
  "difficulty": "Easy | Medium | Hard",
  "nutrition": {
    "calories": "string",
    "protein": "string",
    "carbs": "string",
    "fat": "string"
  }
}

Generate exactly 3 different recipes using these inputs:
- One QUICK dish (under 20 minutes)
- One MAIN course
- One HEALTHY option (low calorie, nutrient-rich)

Ingredients to include: ${ingredients.join(", ")}${dietaryText}
`;

    const text = await geminiGenerateText(prompt);
    let cleaned = text.trim().replace(/```json/g, "").replace(/```/g, "").trim();

    const fb = cleaned.indexOf("[");
    const lb = cleaned.lastIndexOf("]");
    if (fb !== -1 && lb !== -1) {
      cleaned = cleaned.substring(fb, lb + 1);
    }

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.json({ generated: [] }); // ✅ consistent key
    }

    // Ensure names + expand steps
    const expanded = [];
    for (let r of parsed) {
      let recipe = { ...r };
      if (!recipe.name || recipe.name.toLowerCase().includes("untitled")) {
        recipe.name = `Recipe with ${ingredients[0] || "Ingredient"}`;
      }
      try {
        recipe.steps = await expandSteps(recipe);
      } catch {}
      expanded.push(recipe);
    }

    res.json({ generated: expanded }); // ✅ consistent key
  } catch (err) {
    console.error("❌ Generation error:", err.message);
    res.status(500).json({ error: err.message || "Gemini generation failed" });
  }
}

router.post("/generate", handleGenerate);
router.post("/generate-recipes", handleGenerate);

// --- Ingredient Detection from Image ---
// --- Ingredient Detection from Image ---
router.post("/detect-ingredient", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });
    if (!genAI) return res.status(500).json({ error: "Gemini not initialized" });

    const imgBuffer = await fs.readFile(req.file.path);
    const base64 = imgBuffer.toString("base64");
    const mimeType = req.file.mimetype || "image/jpeg";

    const detectPrompt = `Identify the single main ingredient in this food photo.
Respond ONLY with a JSON object: { "ingredient": "name" }.`;

    const model = getGeminiModel();
    const detectResult = await model.generateContent([
      { text: detectPrompt },
      { inlineData: { mimeType, data: base64 } }
    ]);

    let detectRaw = detectResult.response.text().trim();
    detectRaw = detectRaw.replace(/```json/g, "").replace(/```/g, "").trim();

    let ingredientName = "Unknown";
    try {
      const parsed = JSON.parse(detectRaw);
      ingredientName = parsed.ingredient || parsed.name || "Unknown";
    } catch {
      ingredientName = detectRaw;
    }

    // === Local matches ===
    const allLocal = await readRecipes();
    const normalized = ingredientName.toLowerCase();
    const localMatches = allLocal.filter((r) =>
      r.name?.toLowerCase().includes(normalized) ||
      (Array.isArray(r.ingredients) &&
        r.ingredients.some((ing) => String(ing).toLowerCase().includes(normalized)))
    );

    // === Always generate AI recipes ===
    const genPrompt = `
Generate 3 recipes that primarily use the ingredient: "${ingredientName}".
Respond ONLY with a JSON array of recipe objects.
Each recipe object must follow this schema:
{
  "name": "string",
  "ingredients": ["string"],
  "steps": ["string"],
  "cookTime": "string",
  "difficulty": "Easy | Medium | Hard"
}`;

    const genText = await geminiGenerateText(genPrompt);
    let cleanedGen = genText.trim().replace(/```json/g, "").replace(/```/g, "").trim();

    const fb = cleanedGen.indexOf("[");
    const lb = cleanedGen.lastIndexOf("]");
    if (fb !== -1 && lb !== -1) {
      cleanedGen = cleanedGen.substring(fb, lb + 1);
    }

    let aiRecipes = [];
    try {
      aiRecipes = JSON.parse(cleanedGen);
      for (let r of aiRecipes) {
        r.steps = await expandSteps(r);
      }
    } catch {
      aiRecipes.push({
        name: `Suggested recipe for ${ingredientName}`,
        ingredients: [ingredientName],
        steps: ["No detailed steps available"],
        cookTime: "N/A",
        difficulty: "N/A"
      });
    }

    try { await fs.unlink(req.file.path); } catch {}

    // === Combine results ===
    const combined = [...localMatches, ...aiRecipes];

    // Deduplicate
    const seen = new Set();
    const unique = combined.filter((r) => {
      const key = (r.name || JSON.stringify(r)).toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    res.json({
      ingredient: ingredientName,
      recipes: unique.slice(0, 10),
      localMatchesCount: localMatches.length,
      aiGeneratedCount: aiRecipes.length
    });
  } catch (err) {
    console.error("❌ Ingredient detection error:", err.message);
    if (req.file?.path) {
      try { await fs.unlink(req.file.path); } catch {}
    }
    res.status(500).json({ error: "Ingredient detection failed", details: err.message });
  }
});
export default router;