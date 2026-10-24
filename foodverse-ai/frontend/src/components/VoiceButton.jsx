import { useState } from "react";

// Audio input via the browser's Web Speech API (works in Chrome/Edge).
export default function VoiceButton({ onText }) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const [on, setOn] = useState(false);
  if (!SR) return null;
  const start = () => {
    const r = new SR();
    r.lang = "en-IN";
    r.onresult = (e) => onText(e.results[0][0].transcript);
    r.onend = () => setOn(false);
    r.onerror = () => setOn(false);
    r.start();
    setOn(true);
  };
  return (
    <button type="button" className="ghost" onClick={start}>
      {on ? "🎙 Listening…" : "🎙 Speak"}
    </button>
  );
}
