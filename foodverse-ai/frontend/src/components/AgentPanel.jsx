import { useState } from "react";
import { postForm } from "../api";
import FilePicker from "./FilePicker";
import VoiceButton from "./VoiceButton";
import { ResultView } from "./Results";

export default function AgentPanel() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function run() {
    setLoading(true); setError(""); setResult(null);
    try { setResult(await postForm("/agent", { message }, file)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <section>
      <h2>Ask the Agent</h2>
      <p className="muted">One box for everything — attach an image/video and/or ask in text or voice. The agent decides which module to use.</p>
      <textarea rows={3} placeholder='e.g. "Is this chicken still safe to eat?" or "What can I cook with eggs and spinach?"'
                value={message} onChange={(e) => setMessage(e.target.value)} />
      <div className="row"><VoiceButton onText={(t) => setMessage((p) => (p ? p + " " : "") + t)} /></div>
      <FilePicker file={file} setFile={setFile} label="Attach photo / video (optional)" />
      <button onClick={run} disabled={loading}>{loading ? "Thinking…" : "Ask"}</button>
      {error && <div className="error">{error}</div>}
      {result && (
        <>
          {result.routed_to && <p className="muted">Routed to: <b>{result.routed_to}</b> — {result.route_reason}</p>}
          <ResultView data={result} />
        </>
      )}
    </section>
  );
}
