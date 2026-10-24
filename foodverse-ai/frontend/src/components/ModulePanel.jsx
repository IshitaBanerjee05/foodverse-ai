import { useState } from "react";
import { postForm } from "../api";
import FilePicker from "./FilePicker";
import { ResultView } from "./Results";

// Generic "upload -> analyse -> show result" panel used by Food / Freshness / Hygiene.
export default function ModulePanel({ title, desc, endpoint, label }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function run() {
    if (!file) return setError("Please choose a file first.");
    setLoading(true); setError(""); setResult(null);
    try { setResult(await postForm(endpoint, {}, file)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <section>
      <h2>{title}</h2>
      <p className="muted">{desc}</p>
      <FilePicker file={file} setFile={setFile} label={label} />
      <button onClick={run} disabled={loading}>{loading ? "Analysing…" : "Analyse"}</button>
      {error && <div className="error">{error}</div>}
      {result && <ResultView data={result} />}
    </section>
  );
}
