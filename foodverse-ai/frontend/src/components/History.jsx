import { useEffect, useState } from "react";
import { getHistory, clearHistory } from "../api";
import { ResultView } from "./Results";

export default function History() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(null);
  const [error, setError] = useState("");

  const load = () => getHistory().then(setRows).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  return (
    <section>
      <h2>History</h2>
      <p className="muted">Everything you analyse is stored in the backend database.</p>
      {error && <div className="error">{error}</div>}
      {rows.length > 0 && (
        <button className="ghost" onClick={async () => { await clearHistory(); setOpen(null); load(); }}>Clear all</button>
      )}
      {rows.length === 0 && !error && <p>No analyses yet.</p>}
      {rows.map((r) => (
        <div key={r.id} className="card">
          <div className="hist-head" onClick={() => setOpen(open === r.id ? null : r.id)}>
            <span className="tag">{r.module}</span>
            <span className="grow">{r.title}</span>
            <span className="muted">{r.created_at}</span>
          </div>
          {open === r.id && <ResultView data={r.result} />}
        </div>
      ))}
    </section>
  );
}
