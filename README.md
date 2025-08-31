# 🍳 Smart Recipe Generator

A full-stack AI-powered recipe generator that helps you discover delicious recipes using ingredients you have at home. Type in your ingredients and let AI suggest personalized recipes!

![Smart Recipe Generator](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![AI](https://img.shields.io/badge/AI-Gemini-orange) ![Deployment](https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render-purple)

## ✨ Features

### 🤖 AI-Powered Recipe Generation
- **Gemini AI Integration** - Generate custom recipes based on your ingredients
- **Smart Filtering** - Filter by difficulty, dietary preferences, and cooking time

### 🎨 Modern UI/UX
- **Dark/Light Mode** - Toggle between themes
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Beautiful transitions and interactions
- **Tailwind CSS** - Modern, clean design

### 📱 User Experience
- **Favorites System** - Save your favorite recipes
- **Rating System** - Rate recipes and get personalized suggestions
- **Local Storage** - Persistent favorites and ratings
- **Quick Ingredients** - One-click ingredient addition

### 🍽️ Recipe Database
- **21 Sample Recipes** - Pre-loaded local recipe database
- **Detailed Nutrition** - Calories, protein, carbs, and fat information
- **Step-by-Step Instructions** - Clear cooking directions
- **Dietary Tags** - Vegetarian, vegan, keto, gluten-free options

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Gemini AI** - Google's generative AI for recipe creation
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Gemini API key

### Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env

# Add your API keys to .env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
ALLOWED_ORIGIN=http://localhost:5173

# Start the backend server
npm start
```

### Frontend Setup
```bash
cd frontend
npm install

# Create environment file
echo "VITE_API_BASE=http://localhost:5000" > .env

# Start the development server
npm run dev
```

## 🌐 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard:
   - `GEMINI_API_KEY`
   - `ALLOWED_ORIGIN` (your frontend URL)
3. Deploy with build command: `npm install`
4. Start command: `npm start`

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variable:
   - `VITE_API_BASE` (your backend URL)
3. Deploy automatically on push to main branch

## 🔧 API Endpoints

### Recipe Management
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get recipe by ID
- `POST /api/filter` - Filter recipes by criteria

### AI Features
- `POST /api/generate-recipes` - Generate recipes with AI
- `POST /api/detect-ingredient` - Detect ingredient from image
- `POST /api/expand-steps` - Get detailed cooking steps


## 📁 Project Structure

```
smart-recipe-generator/
├── backend/
│   ├── data/
│   │   └── recipes.json          # Sample recipe database
│   ├── routes/
│   │   └── recipes.js            # API routes
│   ├── uploads/                  # Temporary file uploads
│   ├── index.js                  # Main server file
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── IngredientInput.jsx
│   │   │   ├── RecipeCard.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   └── ...
│   │   ├── App.jsx               # Main app component
│   │   ├── api.js                # API client functions
│   │   ├── main.jsx              # App entry point
│   │   └── styles.css            # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
└── README.md
```

## 🎯 Usage

1. **Add Ingredients**: Type ingredients or use quick-add buttons
3. **Set Preferences**: Choose dietary restrictions and cooking time
4. **Generate Recipes**: Click "Generate Recipes" for AI suggestions
5. **Filter Results**: Use filters to find specific types of recipes
6. **Save Favorites**: Star recipes you love
7. **Rate Recipes**: Rate recipes to get better recommendations

## 🔑 Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
PORT=5000
ALLOWED_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE=http://localhost:5000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for recipe generation
- **Tailwind CSS** for beautiful styling
- **React** and **Vite** for the frontend framework

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub.

---

**Made with ❤️ and AI** - Transform your ingredients into delicious meals!
