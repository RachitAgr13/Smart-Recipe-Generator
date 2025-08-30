# Smart Recipe Generator (Full Version)

This is the full project package: React + Vite + Tailwind frontend and Node + Express backend.
It includes Cloudinary-based image upload, Gemini integration stubs (via @google/genai),
and a local JSON database with 21 sample recipes.

## Quick start

### Backend
```bash
cd backend
cp .env.example .env  # fill in keys for CLOUDINARY and GEMINI
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Set VITE_API_BASE in frontend `.env` if backend runs on a different host (default http://localhost:5000).

## Notes
- Gemini integration requires a valid GEMINI_API_KEY and the `@google/genai` package.
- Cloudinary upload requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
- Ratings and favorites are stored client-side in localStorage.
