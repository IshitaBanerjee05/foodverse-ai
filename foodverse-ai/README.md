# FoodVerse AI – Multimodal Food Intelligence Agent

React (Vite) frontend + FastAPI backend + SQLite storage + multimodal LLM (Gemini or Claude).

## Modules
Food recognition & nutrition · Freshness/spoilage · Restaurant hygiene (image/video) · Smart cooking assistant (text/voice/photo) · Personalised meal planner · Agent that routes any request · History (stored in SQLite)

## Run locally
### Backend
```
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows   (macOS/Linux: source .venv/bin/activate)
pip install -r requirements.txt
copy .env.example .env          # then put your API key inside .env
uvicorn main:app --reload --port 8000
```
Docs: http://localhost:8000/docs

### Frontend
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173


## UI refresh
The dashboard has been restyled with a dark food-tech workspace, compact left navigation, responsive module shortcuts, clear active-workspace sections, and mobile navigation. Existing feature components and API contracts were retained to avoid breaking the current backend integration.

## Important implementation note
The UI refresh does not by itself validate live AI accuracy or prove that external model/API credentials are configured. Follow the setup instructions above, configure backend environment variables, then test each module through the interface and `/docs`.
