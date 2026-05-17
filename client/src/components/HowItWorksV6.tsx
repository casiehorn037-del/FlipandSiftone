import { useState, useEffect, useCallback } from "react";
import { Upload, Sparkles, TrendingUp, Shield, CheckCircle2, BarChart3, Star, AlertTriangle } from "lucide-react";

/**
 * Variant 6 — Minimal List + Live App Preview
 * Left: clean numbered list — click any step to activate it.
 * Right: a live mock of the actual FlipandSift app UI for that step.
 * Very product-forward, shows the real interface.
 */

// ── Mock UI previews ──────────────────────────────────────────────────────────

function MockUpload({ active }: { active: boolean }) {
  const [state, setState] = useState<"idle" | "hover" | "done">("idle");
  useEffect(() => {
    if (!active) return;
    const t1 = setTimeout(() => setState("hover"), 700);
    const t2 = setTimeout(() => setState("done"), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); setState("idle"); };
  }, [active]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <span className="text-xs font-bold text-gray-500">New Analysis</span>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className={`w-full max-w-xs border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 transition-all duration-500 ${
          state === "done" ? "border-green-400 bg-green-50" : state === "hover" ? "border-indigo-400 bg-indigo-50 scale-105" : "border-gray-300 bg-gray-50"
        }`}>
          {state === "done" ? (
            <>
              <CheckCircle2 className="w-10 h-10 text-green-500" />
              <p className="text-sm font-bold text-green-700">spamzilla_export.png</p>
              <p className="text-xs text-green-600">Ready to analyze</p>
            </>
          ) : (
            <>
              <Upload className={`w-10 h-10 transition-colors ${state === "hover" ? "text-indigo-500" : "text-gray-400"}`} />
              <p className={`text-sm font-semibold ${state === "hover" ? "text-indigo-600" : "text-gray-500"}`}>
                {state === "hover" ? "Drop it!" : "Upload SpamZilla screenshot"}
              </p>
              <p className="text-xs text-gray-400">PNG · JPG · PDF</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MockAnalysis({ active }: { active: boolean }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    if (!active) return;
    setPct(0);
    const t = setInterval(() => setPct(p => { if (p >= 100) { clearInterval(t); return 100; } return p + 3; }), 50);
    return () => { clearInterval(t); setPct(0); };
  }, [active]);

  const bars = [
    { label: "Trust Flow", val: 34, color: "bg-indigo-500" },
    { label: "Citation Flow", val: 41, color: "bg-purple-500" },
    { label: "Topical Rel.", val: 88, color: "bg-emerald-500" },
    { label: "Spam Score", val: 12, color: "bg-red-400" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-spin" />
        <span className="text-xs font-bold text-gray-500">Analyzing… {pct}%</span>
      </div>
      <div className="flex-1 p-4 flex flex-col justify-center gap-3">
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-100" style={{ width: `${pct}%` }} />
        </div>
        {bars.map(b => (
          <div key={b.label} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-24 shrink-0">{b.label}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${b.color} rounded-full transition-all duration-700`} style={{ width: pct > 20 ? `${b.val}%` : "0%" }} />
            </div>
            <span className="text-xs font-bold text-gray-700 w-6 text-right">{pct > 20 ? b.val : "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockResults({ active }: { active: boolean }) {
  const [shown, setShown] = useState(0);
  const domains = [
    { rank: 1, name: "techreviews.net", score: 91, badge: "🔥 Top Pick", color: "text-emerald-600" },
    { rank: 2, name: "gadgetguide.org", score: 84, badge: "✅ Strong", color: "text-blue-600" },
    { rank: 3, name: "digitaltools.co", score: 77, badge: "👍 Good", color: "text-indigo-600" },
  ];
  useEffect(() => {
    if (!active) return;
    setShown(0);
    const t = setInterval(() => setShown(v => { if (v >= domains.length) { clearInterval(t); return v; } return v + 1; }), 500);
    return () => { clearInterval(t); setShown(0); };
  }, [active]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
        <span className="text-xs font-bold text-gray-500">Top 5 Opportunities</span>
      </div>
      <div className="flex-1 p-4 flex flex-col justify-center gap-2">
        {domains.slice(0, shown).map(d => (
          <div key={d.name} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xs">#{d.rank}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{d.name}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-sm font-black ${d.color}`}>{d.score}</span>
              <span className="text-xs">{d.badge}</span>
            </div>
          </div>
        ))}
        {shown < domains.length && <div className="text-xs text-gray-400 animate-pulse pl-1">Ranking more…</div>}
      </div>
    </div>
  );
}

function MockChecklist({ active }: { active: boolean }) {
  const items = [
    { label: "Archive.org history", ok: true },
    { label: "No spam links", ok: true },
    { label: "Google indexed", ok: true },
    { label: "Trademark clear", warn: true },
  ];
  const [done, setDone] = useState(0);
  useEffect(() => {
    if (!active) return;
    setDone(0);
    const t = setInterval(() => setDone(v => { if (v >= 3) { clearInterval(t); return v; } return v + 1; }), 500);
    return () => { clearInterval(t); setDone(0); };
  }, [active]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <Shield className="w-3.5 h-3.5 text-orange-500" />
        <span className="text-xs font-bold text-gray-500">Due Diligence · techreviews.net</span>
      </div>
      <div className="flex-1 p-4 flex flex-col justify-center gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-gray-600">Sherlock Check™ — PASSED</span>
        </div>
        {items.map((item, i) => (
          <div key={item.label} className="flex items-center gap-3">
            {item.warn ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : i < done ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0 animate-pulse" />
            )}
            <span className={`text-xs ${item.warn ? "text-amber-600 font-semibold" : i < done ? "text-gray-600" : "text-gray-400"}`}>
              {item.label}
            </span>
            {item.warn && <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">Review</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step data ─────────────────────────────────────────────────────────────────

const STEPS = [
  { num: "01", icon: Upload,     color: "indigo", title: "Upload Screenshot",    sub: "Drop your SpamZilla export — OCR does the rest",    preview: MockUpload },
  { num: "02", icon: Sparkles,   color: "purple", title: "AI Scores Domains",    sub: "15+ SEO signals analyzed per domain in seconds",    preview: MockAnalysis },
  { num: "03", icon: TrendingUp, color: "emerald",title: "See Top 5 Picks",      sub: "Ranked by profit potential with clear reasoning",   preview: MockResults },
  { num: "04", icon: Shield,     color: "orange", title: "Verify & Buy",         sub: "8-point checklist + Sherlock Check™ spam scan",     preview: MockChecklist },
];

const C: Record<string, { text: string; bg: string; light: string; border: string }> = {
  indigo:  { text: "text-indigo-600",  bg: "bg-indigo-600",  light: "bg-indigo-50",  border: "border-indigo-200" },
  purple:  { text: "text-purple-600",  bg: "bg-purple-600",  light: "bg-purple-50",  border: "border-purple-200" },
  emerald: { text: "text-emerald-600", bg: "bg-emerald-600", light: "bg-emerald-50", border: "border-emerald-200" },
  orange:  { text: "text-orange-600",  bg: "bg-orange-500",  light: "bg-orange-50",  border: "border-orange-200" },
};

export default function HowItWorksV6() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % STEPS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const step = STEPS[current];
  const c = C[step.color];
  const Preview = step.preview;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid md:grid-cols-[300px_1fr] gap-6 items-start">
        {/* Left: numbered list */}
        <div className="flex flex-col gap-2">
          {STEPS.map((s, i) => {
            const sc = C[s.color];
            const SIcon = s.icon;
            const isActive = i === current;
            return (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`flex items-start gap-4 p-4 rounded-2xl text-left transition-all duration-300 border-2 ${
                  isActive ? `${sc.light} ${sc.border} shadow-md` : "border-transparent hover:bg-gray-50"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isActive ? `${sc.bg} text-white shadow-lg` : "bg-gray-100 text-gray-400"
                }`}>
                  <SIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black ${isActive ? sc.text : "text-gray-400"}`}>{s.num}</span>
                    <span className={`text-sm font-bold ${isActive ? "text-gray-900" : "text-gray-500"}`}>{s.title}</span>
                  </div>
                  {isActive && <p className={`text-xs mt-1 ${sc.text}`}>{s.sub}</p>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: app preview */}
        <div className={`rounded-2xl border-2 ${c.border} bg-white shadow-2xl overflow-hidden`}>
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="flex-1 mx-3 bg-white rounded-md px-3 py-1 text-xs text-gray-400 border border-gray-200">
              app.flipandsift.com
            </div>
          </div>
          <div className="h-72" key={current}>
            <Preview active={true} />
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-5">
        {STEPS.map((s, i) => {
          const sc = C[s.color];
          return (
            <button key={i} onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? `w-8 ${sc.bg}` : "w-2 bg-gray-300"}`}
            />
          );
        })}
      </div>
    </div>
  );
}
