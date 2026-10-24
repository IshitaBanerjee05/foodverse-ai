import { useState } from "react";
import ModulePanel from "./components/ModulePanel";
import CookingPanel from "./components/CookingPanel";
import MealPlanner from "./components/MealPlanner";
import AgentPanel from "./components/AgentPanel";
import History from "./components/History";

const TABS = [
  ["agent", "✦", "AI Agent", "Ask anything"],
  ["food", "◉", "Food & Nutrition", "Food insights"],
  ["fresh", "❋", "Freshness", "Freshness check"],
  ["hygiene", "▤", "Hygiene Monitor", "Kitchen safety"],
  ["cook", "♨", "Smart Kitchen", "Recipe assistant"],
  ["plan", "▦", "Meal Planner", "Personalized plans"],
  ["history", "◷", "History", "Recent analyses"],
];
const descriptions = {
  agent: ["Your personal food intelligence workspace", "Bring your food questions, photos and ideas together in one place."],
  food: ["Food recognition & nutrition", "Understand what's on your plate with image-based food analysis and nutrition estimates."],
  fresh: ["Freshness & spoilage insights", "Explore visible signs of freshness and get practical storage guidance."],
  hygiene: ["Restaurant hygiene monitor", "Review kitchen images or short clips for visible hygiene concerns."],
  cook: ["Smart kitchen assistant", "Turn ingredients you already have into something delicious."],
  plan: ["Personalized meal planner", "Build a practical meal plan around your goals, preferences and dietary needs."],
  history: ["Your activity history", "Revisit previous analyses and recommendations."],
};
export default function App() {
  const [tab, setTab] = useState("agent");
  const [mobileNav, setMobileNav] = useState(false);
  const active = TABS.find(([id]) => id === tab);
  const copy = descriptions[tab];
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark">fv</div><div><strong>foodverse<span>.ai</span></strong><small>FOOD INTELLIGENCE</small></div><button className="mobile-close" onClick={() => setMobileNav(false)} aria-label="Close menu">×</button></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">{TABS.map(([id, icon, label, hint]) => <button key={id} className={`nav-item ${tab === id ? "active" : ""}`} onClick={() => { setTab(id); setMobileNav(false); }}><span className="nav-icon">{icon}</span><span className="nav-copy"><b>{label}</b><small>{hint}</small></span>{tab === id && <span className="nav-active-dot" />}</button>)}</nav>
      <div className="sidebar-bottom"><div className="status-card"><span className="status-light" /><div><b>AI workspace</b><small>Ready when you are</small></div></div><div className="profile-row"><div className="avatar">F</div><div><b>FoodVerse AI</b><small>Personal workspace</small></div><span className="profile-dots">•••</span></div></div>
    </aside>
    <div className="main-shell">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open menu">☰</button><div className="breadcrumb"><span>Workspace</span><i>/</i><b>{active?.[2]}</b></div><div className="topbar-right"><span className="live-pill"><span /> SYSTEM READY</span><div className="top-avatar">F</div></div></header>
      <main className="page-content">
        <section className="welcome-banner"><div className="welcome-copy"><div className="eyebrow"><span className="sparkle">✦</span> MULTIMODAL FOOD INTELLIGENCE</div><h1>{copy[0]}</h1><p>{copy[1]}</p><div className="welcome-tags"><span>✧ Vision powered</span><span>⌁ Context aware</span><span>♡ Made for you</span></div></div><div className="banner-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="food-orb">🥑</div><span className="float-chip chip-one">✦ Smart insights</span><span className="float-chip chip-two">◉ Image analysis</span></div></section>
        <div className="section-heading"><div><span className="section-kicker">YOUR TOOLKIT</span><h2>Explore FoodVerse</h2></div><span className="module-count">07 MODULES</span></div>
        <div className="quick-modules">{TABS.slice(0, 6).map(([id, icon, label], i) => <button key={id} className={`quick-module ${tab === id ? "selected" : ""}`} onClick={() => setTab(id)}><span className={`quick-icon qi-${i}`}>{icon}</span><span><b>{label}</b><small>{["Ask the AI about food","Analyze meals & macros","Check visible food quality","Review kitchen hygiene","Create ingredient-led recipes","Plan meals around your goals"][i]}</small></span><span className="quick-arrow">↗</span></button>)}</div>
        <div className="active-heading"><div><span className="section-kicker">ACTIVE WORKSPACE</span><h2>{active?.[2]}</h2></div><span className="secure-note">✦ AI-assisted insights</span></div>
        <div className="workspace-panel">
          {tab === "agent" && <AgentPanel />}
          {tab === "food" && <ModulePanel key="food" title="Food Recognition & Nutrition Analysis" desc="Upload a photo of a meal to identify likely food items, estimate portions and explore nutritional information." endpoint="/food" label="Upload a food photo" />}
          {tab === "fresh" && <ModulePanel key="fresh" title="Food Freshness & Spoilage Detection" desc="Review visible signs on produce and other foods, with practical guidance on storage and what to check next." endpoint="/freshness" label="Upload a food photo" />}
          {tab === "hygiene" && <ModulePanel key="hygiene" title="Restaurant Hygiene & Safety Monitoring" desc="Upload a kitchen photo or short video clip. The system reviews visible indicators and highlights potential concerns." endpoint="/hygiene" label="Upload kitchen photo / video" />}
          {tab === "cook" && <CookingPanel />}
          {tab === "plan" && <MealPlanner />}
          {tab === "history" && <History />}
        </div>
        <footer className="page-footer"><span>✦ FoodVerse AI</span><span>AI-generated insights may be inaccurate. Verify food safety and nutrition decisions independently.</span></footer>
      </main>
    </div>
    {mobileNav && <button className="nav-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
  </div>;
}
