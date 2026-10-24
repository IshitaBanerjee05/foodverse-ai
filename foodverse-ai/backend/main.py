from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import db, llm, media, prompts

app = FastAPI(title="FoodVerse AI", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your frontend URL after deployment
    allow_methods=["*"],
    allow_headers=["*"],
)
db.init()
MAX_BYTES = 25 * 1024 * 1024


# ---------- helpers ----------
async def load_media(file: UploadFile):
    data = await file.read()
    if not data:
        raise HTTPException(400, "Empty file")
    if len(data) > MAX_BYTES:
        raise HTTPException(413, "File too large (max 25 MB)")
    try:
        return media.to_images(data, file.content_type or "")
    except Exception as e:
        raise HTTPException(400, f"Could not read file: {e}")


def title_of(r: dict, module: str) -> str:
    for k in ("item", "summary", "answer"):
        if r.get(k):
            return str(r[k])
    if r.get("items"):
        return ", ".join(i.get("name", "") for i in r["items"][:3])
    return module


def run(module: str, prompt: str, images=None, save: bool = True) -> dict:
    try:
        result = llm.ask(prompt, images, system=prompts.SYSTEM)
    except KeyError as e:
        raise HTTPException(500, f"Missing API key in backend/.env ({e})")
    except Exception as e:
        raise HTTPException(502, f"AI provider error: {e}")
    result["module"] = module
    if save:
        result["id"] = db.save(module, title_of(result, module), result)
    return result


# ---------- vision modules ----------
@app.get("/api/health")
def health():
    return {"status": "ok", "provider": llm.PROVIDER}


@app.post("/api/food")
async def food(file: UploadFile = File(...)):
    return run("food", prompts.FOOD, await load_media(file))


@app.post("/api/freshness")
async def freshness(file: UploadFile = File(...)):
    return run("freshness", prompts.FRESHNESS, await load_media(file))


@app.post("/api/hygiene")
async def hygiene(file: UploadFile = File(...)):
    return run("hygiene", prompts.HYGIENE, await load_media(file))


# ---------- cooking assistant ----------
@app.post("/api/cooking")
async def cooking(
    ingredients: str = Form(""),
    question: str = Form(""),
    file: Optional[UploadFile] = File(None),
):
    images = await load_media(file) if file else []
    if not (ingredients.strip() or question.strip() or images):
        raise HTTPException(400, "Provide ingredients, a question, or a photo")
    prompt = (f"{prompts.COOKING}\n\nIngredients typed by user: {ingredients or 'none'}"
              f"\nUser question: {question or 'none'}")
    return run("cooking", prompt, images)


# ---------- personalised meal planner ----------
class Profile(BaseModel):
    age: int = Field(ge=10, le=100)
    gender: str = "other"
    weight_kg: float = Field(gt=20, lt=300)
    height_cm: float = Field(gt=100, lt=250)
    activity: str = "light"          # sedentary | light | moderate | active
    goal: str = "maintain"           # lose | maintain | gain
    diet: str = "any"                # vegetarian, vegan, eggetarian, any ...
    allergies: str = ""
    cuisine: str = "Indian"
    days: int = Field(default=3, ge=1, le=7)


def calorie_target(p: Profile) -> int:
    """Mifflin-St Jeor BMR x activity factor, adjusted for goal."""
    sex = {"male": 5, "female": -161}.get(p.gender.lower(), -78)
    bmr = 10 * p.weight_kg + 6.25 * p.height_cm - 5 * p.age + sex
    factor = {"sedentary": 1.2, "light": 1.375, "moderate": 1.55, "active": 1.725}.get(p.activity, 1.375)
    adj = {"lose": -500, "gain": 300}.get(p.goal, 0)
    return max(1200, round(bmr * factor + adj))


@app.post("/api/meal-plan")
def meal_plan(p: Profile):
    target = calorie_target(p)
    prompt = (
        f"Create a {p.days}-day meal plan.\n"
        f"Daily calorie target: {target} kcal (computed with Mifflin-St Jeor; stay within +/-5%).\n"
        f"Goal: {p.goal}. Diet: {p.diet}. Allergies (STRICTLY avoid): {p.allergies or 'none'}. "
        f"Preferred cuisine: {p.cuisine}. Use affordable, easy-to-find ingredients. "
        f"Include 4 meals per day.\n\n{prompts.MEAL_SCHEMA}"
    )
    result = run("meal_plan", prompt, save=False)
    result["daily_calorie_target"] = target
    result["id"] = db.save("meal_plan", f"{p.days}-day {p.goal} plan ({target} kcal)", result)
    return result


# ---------- the "agent": routes any request to the right module ----------
@app.post("/api/agent")
async def agent(message: str = Form(""), file: Optional[UploadFile] = File(None)):
    images = await load_media(file) if file else []
    if not (message.strip() or images):
        raise HTTPException(400, "Send a message and/or a file")
    try:
        route = llm.ask(
            f"{prompts.ROUTER}\n\nUser message: {message or '(none)'}\nAttachment provided: {bool(images)}",
            images[:1], system=prompts.SYSTEM,
        )
    except Exception as e:
        raise HTTPException(502, f"AI provider error: {e}")
    intent = route.get("intent", "general")
    needs_image = {"food": prompts.FOOD, "freshness": prompts.FRESHNESS, "hygiene": prompts.HYGIENE}
    if intent in needs_image and images:
        res = run(intent, needs_image[intent] + f"\n\nUser note: {message}", images)
    elif intent == "cooking":
        res = run("cooking", f"{prompts.COOKING}\n\nUser question: {message}", images)
    else:
        res = run("chat", f"{prompts.CHAT}\n\nQuestion: {message}", images)
    res["routed_to"] = intent
    res["route_reason"] = route.get("reason", "")
    return res


# ---------- history ----------
@app.get("/api/history")
def get_history():
    return db.history()


@app.delete("/api/history")
def clear_history():
    db.clear()
    return {"ok": True}
