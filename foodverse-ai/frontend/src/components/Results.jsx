const Bar = ({ value, max = 100, good = true }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const hue = good ? pct * 1.2 : (100 - pct) * 1.2;
  return (
    <div className="bar"><div style={{ width: pct + "%", background: `hsl(${hue},65%,45%)` }} /></div>
  );
};
const List = ({ items }) => (items?.length ? <ul>{items.map((x, i) => <li key={i}>{x}</li>)}</ul> : null);

function Food({ d }) {
  if (d.is_food === false) return <div className="card">{d.summary || "No food detected."}</div>;
  const t = d.total || {};
  return (
    <div className="card">
      <h3>{t.calories} kcal total · Health score {d.health_score}/10</h3>
      <Bar value={d.health_score} max={10} />
      <p>{d.summary}</p>
      <table>
        <thead><tr><th>Item</th><th>Portion</th><th>kcal</th><th>P</th><th>C</th><th>F</th><th>Fibre</th></tr></thead>
        <tbody>
          {(d.items || []).map((i, k) => (
            <tr key={k}><td>{i.name}</td><td>{i.portion}</td><td>{i.calories}</td>
              <td>{i.protein_g}g</td><td>{i.carbs_g}g</td><td>{i.fat_g}g</td><td>{i.fiber_g}g</td></tr>
          ))}
          <tr className="total"><td colSpan={2}>Total</td><td>{t.calories}</td>
            <td>{t.protein_g}g</td><td>{t.carbs_g}g</td><td>{t.fat_g}g</td><td>{t.fiber_g}g</td></tr>
        </tbody>
      </table>
      <h4>Tips</h4><List items={d.tips} />
      <small className="muted">AI estimates — not a substitute for professional dietary advice.</small>
    </div>
  );
}

function Freshness({ d }) {
  if (d.is_food === false) return <div className="card">No food detected in the image.</div>;
  return (
    <div className="card">
      <h3>{d.item}: <span className={"status " + String(d.status).replace(/\s/g, "")}>{d.status}</span></h3>
      <p>Freshness {d.freshness_score}/100 · confidence {Math.round((d.confidence || 0) * 100)}%</p>
      <Bar value={d.freshness_score} />
      <p>{d.summary}</p>
      {d.spoilage_signs?.length > 0 && <><h4>Spoilage signs</h4><List items={d.spoilage_signs} /></>}
      <p><b>Shelf life:</b> {d.estimated_shelf_life}</p>
      <h4>Storage tips</h4><List items={d.storage_tips} />
      <small className="muted">{d.disclaimer}</small>
    </div>
  );
}

function Hygiene({ d }) {
  if (d.is_food_scene === false) return <div className="card">This doesn't look like a food-service scene.</div>;
  return (
    <div className="card">
      <h3>Hygiene score {d.overall_score}/100 · Risk: <span className={"status " + d.risk_level}>{d.risk_level}</span></h3>
      <Bar value={d.overall_score} />
      <p>{d.summary}</p>
      <h4>Violations</h4>
      {(d.violations || []).length === 0 && <p>None observed 🎉</p>}
      {(d.violations || []).map((v, i) => (
        <div key={i} className="viol">
          <b>{v.issue}</b> <span className={"tag sev-" + v.severity}>{v.severity}</span>
          <div className="muted">Seen: {v.evidence}</div>
          <div>Fix: {v.fix}</div>
        </div>
      ))}
      <h4>Good practices</h4><List items={d.good_practices} />
      <h4>Recommendations</h4><List items={d.recommendations} />
    </div>
  );
}

function Cooking({ d }) {
  return (
    <div>
      {d.answer && <div className="card">{d.answer}</div>}
      {d.detected_ingredients?.length > 0 && <p className="muted">Detected: {d.detected_ingredients.join(", ")}</p>}
      {(d.recipes || []).map((r, i) => (
        <div key={i} className="card">
          <h3>{r.name}</h3>
          <p className="muted">{r.time_minutes} min · {r.difficulty}</p>
          <p><b>Uses:</b> {(r.ingredients_used || []).join(", ")}</p>
          {r.missing_ingredients?.length > 0 && <p><b>Missing:</b> {r.missing_ingredients.join(", ")}</p>}
          <ol>{(r.steps || []).map((s, k) => <li key={k}>{s}</li>)}</ol>
          {r.tip && <p>💡 {r.tip}</p>}
        </div>
      ))}
      {d.substitutions?.length > 0 && (
        <div className="card"><h4>Substitutions</h4>
          <List items={d.substitutions.map((s) => `${s.missing} → ${s.use_instead}`)} /></div>
      )}
    </div>
  );
}

function MealPlan({ d }) {
  const m = d.macro_targets || {};
  return (
    <div>
      <div className="card">
        <h3>Target: {d.daily_calorie_target} kcal/day</h3>
        <p>Protein {m.protein_g}g · Carbs {m.carbs_g}g · Fat {m.fat_g}g</p>
        <p>{d.notes}</p>
      </div>
      {(d.days || []).map((day, i) => (
        <div key={i} className="card">
          <h3>{day.day} <span className="muted">({day.total_calories} kcal)</span></h3>
          <table><tbody>
            {(day.meals || []).map((x, k) => (
              <tr key={k}><td><b>{x.type}</b></td><td>{x.name}<div className="muted">{x.description}</div></td><td>{x.calories} kcal</td></tr>
            ))}
          </tbody></table>
        </div>
      ))}
      {d.shopping_list?.length > 0 && <div className="card"><h4>Shopping list</h4><List items={d.shopping_list} /></div>}
    </div>
  );
}

export function ResultView({ data }) {
  switch (data.module) {
    case "food": return <Food d={data} />;
    case "freshness": return <Freshness d={data} />;
    case "hygiene": return <Hygiene d={data} />;
    case "cooking": return <Cooking d={data} />;
    case "meal_plan": return <MealPlan d={data} />;
    case "chat": return <div className="card">{data.answer}</div>;
    default: return <pre className="card">{JSON.stringify(data, null, 2)}</pre>;
  }
}
