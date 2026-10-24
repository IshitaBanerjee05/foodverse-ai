import { useState } from "react";
import { postForm } from "../api";
import FilePicker from "./FilePicker";
import VoiceButton from "./VoiceButton";
import { ResultView } from "./Results";

export default function CookingPanel() {
  const [ingredients, setIngredients] = useState("");
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function run() {
    setLoading(true); setError(""); setResult(null);
    try { setResult(await postForm("/cooking", { ingredients, question }, file)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <section>
      <h2>Smart Cooking Assistant</h2>
      <p className="muted">Tell me what's in your kitchen (type, speak, or snap a photo) and I'll suggest recipes.</p>
      <textarea rows={3} placeholder="e.g. paneer, capsicum, onion, rice, curd"
                value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
      <div className="row">
        <VoiceButton onText={(t) => setIngredients((p) => (p ? p + ", " : "") + t)} />
      </div>
      <input placeholder="Optional question: e.g. something high-protein under 20 minutes"
             value={question} onChange={(e) => setQuestion(e.target.value)} />
      <FilePicker file={file} setFile={setFile} label="Photo of ingredients (optional)" />
      <button onClick={run} disabled={loading}>{loading ? "Thinking…" : "Get recipes"}</button>
      {error && <div className="error">{error}</div>}
      {result && <ResultView data={result} />}
    </section>
  );
}
