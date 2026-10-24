const BASE = (import.meta.env.VITE_API_URL || "") + "/api";

async function req(path, opts) {
  const r = await fetch(BASE + path, opts);
  if (!r.ok) {
    let msg = "Request failed (" + r.status + ")";
    try { msg = (await r.json()).detail || msg; } catch {}
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return r.json();
}

export function postForm(path, fields = {}, file = null) {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v ?? ""));
  if (file) fd.append("file", file);
  return req(path, { method: "POST", body: fd });
}

export const postJson = (path, body) =>
  req(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export const getHistory = () => req("/history");
export const clearHistory = () => req("/history", { method: "DELETE" });
