import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import recipesRouter from "./routes/recipes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ALLOWED_ORIGIN || "https://smart-recipe-generator-mauve.vercel.app/";

// --- CORS setup ---
app.use(
  cors({
    origin: ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// --- JSON body parser ---
app.use(express.json({ limit: "5mb" }));

// --- Cloudinary config ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

// --- Root check ---
app.get("/", (req, res) => res.send({ status: "ok" }));

// --- Image upload route ---
app.post("/api/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("❌ Cloudinary upload error:", err.message);
    res.status(500).json({ error: err.message || "Upload failed" });
  }
});

// --- Recipes + Gemini routes ---
app.use("/api", recipesRouter);

// --- Start server ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend running on http://0.0.0.0:${PORT}`);
  console.log(`🌐 Allowed origin: ${ORIGIN}`);
});
