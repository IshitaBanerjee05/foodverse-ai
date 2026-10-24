import { useState } from "react";
import { postJson } from "../api";
import { ResultView } from "./Results";

const init = { age: 21, gender: "male", weight_kg: 65, height_cm: 172, activity: "light",
               goal: "maintain", diet: "vegetarian", allergies: "", cuisine: "Indian", days: 3 };

export default function MealPlanner() {
  const [f, setF] = useState(init);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function run(e) {
    e.preventDefault();
    setLoading(true); setError(""); setResult(null);
    try {
      setResult(await postJson("/meal-plan", {
        ...f, age: +f.age, weight_kg: +f.weight_kg, height_cm: +f.height_cm, days: +f.days,
      }));
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  const sel = (k, opts) => (
    <select value={f[k]} onChange={set(k)}>{opts.map((o) => <option key={o}>{o}</option>)}</select>
  );

  return (
    <section>
      <h2>Personalised Meal Planner</h2>
      <p className="muted">Calorie target is computed from your body stats (Mifflin-St Jeor), then the AI builds the plan.</p>
      <form onSubmit={run} className="grid">
        <label>Age<input type="number" value={f.age} onChange={set("age")} /></label>
        <label>Gender{sel("gender", ["male", "female", "other"])}</label>
        <label>Weight (kg)<input type="number" value={f.weight_kg} onChange={set("weight_kg")} /></label>
        <label>Height (cm)<input type="number" value={f.height_cm} onChange={set("height_cm")} /></label>
        <label>Activity{sel("activity", ["sedentary", "light", "moderate", "active"])}</label>
        <label>Goal{sel("goal", ["lose", "maintain", "gain"])}</label>
        <label>Diet{sel("diet", ["any", "vegetarian", "eggetarian", "vegan", "jain"])}</label>
        <label>Cuisine<input value={f.cuisine} onChange={set("cuisine")} /></label>
        <label>Allergies<input placeholder="e.g. peanuts" value={f.allergies} onChange={set("allergies")} /></label>
        <label>Days (1–7)<input type="number" min="1" max="7" value={f.days} onChange={set("days")} /></label>
        <button disabled={loading}>{loading ? "Planning…" : "Generate plan"}</button>
      </form>
      {error && <div className="error">{error}</div>}
      {result && <ResultView data={result} />}
    </section>
  );
}
