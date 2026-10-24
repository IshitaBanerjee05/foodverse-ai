# 🍃 FoodVerse AI — Multimodal Food Intelligence Agent

**An AI-powered platform for food recognition, nutrition insights, freshness assessment, kitchen hygiene observations, and personalized meal planning.**

FoodVerse AI combines computer vision and multimodal AI to help users understand food, explore cooking possibilities, and make more informed food-related decisions through a unified, interactive dashboard.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [API Endpoints](#-api-endpoints)
- [Limitations](#-limitations)
- [Future Enhancements](#-future-enhancements)
- [Disclaimer](#-disclaimer)

---

## 🌱 Overview

FoodVerse AI is a multimodal food intelligence platform designed to bring multiple food-related AI capabilities into one application.

Instead of relying on separate tools for food analysis, cooking assistance, and meal planning, users can access these capabilities through a unified dashboard.

The application uses a React frontend, a FastAPI backend, SQLite for storing analysis history, and a configurable AI provider for processing supported text and image inputs.

### 🎯 Project Objectives

- Provide AI-assisted food recognition and nutritional insights.
- Assess visible indicators that may be associated with food freshness or spoilage.
- Identify observable kitchen and restaurant hygiene concerns from visual inputs.
- Generate cooking suggestions and recipes based on user requirements.
- Create personalized meal plans based on user preferences.
- Provide a unified AI agent for food-related queries.
- Maintain a history of previous analyses.

---

## ✨ Key Features

### 1. 🍎 Food Recognition & Nutrition
Analyze food images and obtain AI-generated descriptions and estimated nutritional information.

### 2. 🥗 Freshness Assessment
Examine visible characteristics of food and identify potential indicators of reduced freshness or spoilage.

### 3. 🧼 Kitchen & Restaurant Hygiene Monitor
Analyze supported image or video inputs for visible hygiene concerns and environmental observations.

### 4. 👨‍🍳 Smart Kitchen Assistant
Get cooking guidance, recipe suggestions, and food preparation ideas through text and supported media inputs.

### 5. 📅 Personalized Meal Planner
Generate meal plans based on the preferences and requirements provided by the user.

### 6. 🤖 Multimodal AI Agent
Interact with a unified AI agent that routes food-related requests to the appropriate functionality.

### 7. 📚 Analysis History
Store and revisit previous analyses using SQLite-backed history.

### 8. 🎨 Modern Dashboard
Explore the application's modules through a responsive interface featuring dark styling, green accents, organized navigation, and dedicated workspaces.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Python, FastAPI |
| AI Integration | Google Gemini API; optional Anthropic integration |
| Image Processing | Pillow, OpenCV |
| Data Storage | SQLite |
| API Communication | REST API, JSON, multipart form data |
| Development Tools | Git, GitHub, VS Code |

---

## 🏗️ System Architecture

FoodVerse AI follows a frontend-backend architecture.

```text
                 ┌─────────────────────────┐
                 │         User            │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │    React + Vite UI      │
                 │                         │
                 │  Dashboard and Modules  │
                 └────────────┬────────────┘
                              │
                       HTTP / REST API
                              │
                              ▼
                 ┌─────────────────────────┐
                 │     FastAPI Backend     │
                 │                         │
                 │  Request Processing     │
                 │  Image Handling         │
                 │  AI Provider Integration│
                 └────────┬────────┬───────┘
                          │        │
                 ┌────────▼───┐  ┌─▼────────────────┐
                 │ Gemini /   │  │  SQLite Database │
                 │ AI Provider│  │                  │
                 └────────────┘  │ Analysis History │
                                 └──────────────────┘
```

### How It Works

1. The user selects a module and submits a query or supported media input.
2. The React frontend sends a request to the FastAPI backend.
3. The backend processes the request and communicates with the configured AI provider when required.
4. The generated result is returned to the frontend.
5. Supported analysis records are stored in SQLite for history and retrieval.

---

## 📂 Project Structure

```text
foodverse-ai/
│
├── backend/
│   ├── main.py
│   ├── llm.py
│   ├── prompts.py
│   ├── media.py
│   ├── db.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

Follow these instructions to run FoodVerse AI locally.

### Prerequisites

Install the following:

- Python 3.10 or later
- Node.js 18 or later
- npm
- Git
- A Gemini API key for AI-powered functionality

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/foodverse-ai.git
cd foodverse-ai
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Configure the Backend

Open a terminal in the project directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.venv\Scripts\Activate.ps1
```

If you use Command Prompt instead:

```bat
.venv\Scripts\activate
```

Install the required packages:

```bash
pip install -r requirements.txt
```

Create your local environment file by copying the example:

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS/Linux:**

```bash
cp .env.example .env
```

Configure the environment variables as described below.

Start the backend:

```bash
uvicorn main:app --reload --port 8000
```

The backend should now be available at:

- API base: `http://localhost:8000`
- Interactive API documentation: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

### 3. Configure the Frontend

Open a second terminal in the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite. The default is:

`http://localhost:5173`

The frontend communicates with the backend through the configured API base URL.

---

## 🔐 Environment Configuration

### Backend Configuration

The backend uses a `.env` file for AI provider settings.

Example:

```env
PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.8-flash

ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=your_supported_anthropic_model
```

Obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/).

**Important:** Use a model currently available to your API account. Model availability can change, so update `GEMINI_MODEL` if necessary.

If using Anthropic instead, configure its API key and a supported model according to the backend implementation.

### Frontend Configuration

The frontend supports an optional API base URL through a Vite environment variable.

For local development, the default configuration uses the relative `/api` path.

For a separately deployed backend, create `frontend/.env` containing:

```env
VITE_API_URL=https://your-backend-url
```

Replace the example with your actual backend URL. Do not add `/api` to the end unless the frontend configuration is changed to expect it.

Restart the Vite server after changing environment variables.

### Security Notes

- Never commit `.env` files or API keys to GitHub.
- Keep API keys in backend environment variables.
- Do not expose private credentials through frontend environment variables.
- Configure CORS to allow only the required frontend origins in production.
- Avoid uploading sensitive personal information or private images.

---

## 🔌 API Endpoints

The FastAPI backend exposes the following main endpoints.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend health |
| POST | `/api/food` | Food recognition and nutrition analysis |
| POST | `/api/freshness` | Assess visible freshness indicators |
| POST | `/api/hygiene` | Analyze visible hygiene indicators |
| POST | `/api/cooking` | Cooking assistance |
| POST | `/api/meal-plan` | Generate a personalized meal plan |
| POST | `/api/agent` | Handle general food-related AI requests |
| GET | `/api/history` | Retrieve saved analysis history |
| DELETE | `/api/history` | Clear saved analysis history |

Interactive API documentation is available at:

`http://localhost:8000/docs`

---

## ⚠️ Limitations

- Nutritional values are estimates and may vary with ingredients, preparation methods, and portion sizes.
- Image-based freshness assessment cannot reliably detect all forms of spoilage.
- Visual analysis cannot confirm the presence or absence of pathogens, toxins, or other invisible food-safety hazards.
- Hygiene observations are limited to visible evidence and cannot certify compliance with food-safety regulations.
- AI-generated outputs may contain inaccuracies and should be independently verified when necessary.
- AI functionality depends on the configured provider, network availability, model access, and applicable usage limits.

---

## 🔮 Future Enhancements

Potential improvements include:

- Integration with verified nutritional databases.
- More structured nutritional reports and portion-size estimation.
- Improved food image classification using specialized computer vision models.
- Real-time video analysis for supported hygiene-monitoring scenarios.
- User profiles and persistent dietary preferences.
- Allergen-aware recipe recommendations.
- Integration with grocery lists and food inventory tracking.
- Automated testing, monitoring, and production deployment improvements.

---

## 📌 Disclaimer

FoodVerse AI is an educational capstone project intended to demonstrate AI-assisted food analysis and personalized food-related assistance.

It is not a substitute for professional medical advice, laboratory testing, or certified food-safety inspection. AI-generated results should not be used as the sole basis for deciding whether food is safe to consume.

---

## 👩‍💻 Project Information

**Project:** FoodVerse AI — Multimodal Food Intelligence Agent  
**Category:** Artificial Intelligence / Full-Stack Development  
**Backend:** FastAPI  
**Frontend:** React + Vite  
**Database:** SQLite  
**AI Integration:** Gemini API

Developed as a capstone project.
