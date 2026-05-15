import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload, Sparkles, TrendingUp, Shield, ChevronLeft, ChevronRight,
  CheckCircle2, Play, Pause, BarChart3, AlertTriangle, Star
} from "lucide-react";

// ─── Slide Data ────────────────────────────────────────────────────────────────
const SLIDES = [
  {
    step: 1,
    icon: Upload,
    color: "indigo",
    title: "Upload Your SpamZilla Screenshot",
    subtitle: "Drag & drop or click to upload",
    description:
      "Take a screenshot from SpamZilla showing your list of expired domains. Our OCR engine reads every domain name, Trust Flow, Citation Flow, SZ Score, age, and topic — automatically.",
    tags: ["PNG", "JPG", "PDF", "Drag & Drop"],
    preview: <UploadPreview />,
  },
  {
    step: 2,
    icon: Sparkles,
    color: "purple",
    title: "AI Analyzes 15+ SEO Metrics",
    subtitle: "Powered by advanced vision AI",
    description:
      "Our AI cross-references Trust Flow, Citation Flow, topical relevance, backlink quality, domain age, and spam history. Each domain gets a 0–100 opportunity score in seconds.",
    tags: ["Trust Flow", "Citation Flow", "Topical Relevance", "Spam Check"],
    preview: <AnalysisPreview />,
  },
  {
    step: 3,
    icon: TrendingUp,
    color: "green",
    title: "See Your Top 5 Ranked Domains",
    subtitle: "Ranked by profit potential",
    description:
      "The AI surfaces the 5 best opportunities from your list with clear reasoning. Understand exactly WHY each domain is worth buying — or why to avoid it.",
    tags: ["AI Ranking", "Confidence Score", "Buy Reasoning", "Red Flags"],
    preview: <ResultsPreview />,
  },
  {
    step: 4,
    icon: Shield,
    color: "orange",
    title: "Complete Your Due Diligence",
    subtitle: "8-point verification checklist",
    description:
      "Every recommendation includes a Sherlock Check™ for spam history, an 8-point due diligence checklist, and one-click links to Archive.org, Ahrefs, and Google index checks.",
    tags: ["Sherlock Check™", "Archive.org", "Backlink Audit", "Trademark"],
    preview: <ChecklistPreview />,
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; badge: string; dot: string }> = {
  indigo: {
    bg: "bg-indigo-600",
    text: "text-indigo-600",
    border: "border-indigo-500",
    badge: "bg-indigo-100 text-indigo-700",
    dot: "bg-indigo-600",
  },
  purple: {
    bg: "bg-purple-600",
    text: "text-purple-600",
    border: "border-purple-500",
    badge: "bg-purple-100 text-purple-700",
    dot: "bg-purple-600",
  },
  green: {
    bg: "bg-emerald-600",
    text: "text-emerald-600",
    border: "border-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-600",
  },
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-500",
    border: "border-orange-400",
    badge: "bg-orange-100 text-orange-700",
    dot: "bg-orange-500",
  },
};

// ─── Mock UI Previews ──────────────────────────────────────────────────────────
function UploadPreview() {
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setDragging(true), 800);
    const t2 = setTimeout(() => setDragging(false), 1800);
    const t3 = setTimeout(() => setUploaded(true), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
      <div
        className={`w-full max-w-xs border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 transition-all duration-500 ${
          uploaded
            ? "border-green-400 bg-green-50"
            : dragging
            ? "border-indigo-500 bg-indigo-50 scale-105"
            : "border-gray-300 bg-gray-50"
        }`}
      >
        {uploaded ? (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <p className="text-sm font-semibold text-green-700">spamzilla_export.png</p>
            <p className="text-xs text-green-600">Uploaded successfully</p>
          </>
        ) : (
          <>
            <Upload className={`w-12 h-12 transition-colors ${dragging ? "text-indigo-500" : "text-gray-400"}`} />
            <p className={`text-sm font-semibold transition-colors ${dragging ? "text-indigo-600" : "text-gray-500"}`}>
              {dragging ? "Drop it here!" : "Drop your screenshot here"}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, PDF supported</p>
          </>
        )}
      </div>
      {uploaded && (
        <div className="flex items-center gap-2 text-xs text-gray-500 animate-pulse">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          Extracting domain data…
        </div>
      )}
    </div>
  );
}

function AnalysisPreview() {
  const metrics = [
    { label: "Trust Flow", value: 34, max: 100, color: "bg-indigo-500" },
    { label: "Citation Flow", value: 41, max: 100, color: "bg-purple-500" },
    { label: "Topical Relevance", value: 88, max: 100, color: "bg-emerald-500" },
    { label: "Spam Score", value: 12, max: 100, color: "bg-red-400" },
    { label: "Domain Age", value: 72, max: 100, color: "bg-amber-500" },
  ];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setProgress(p => Math.min(p + 2, 100)), 40);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center gap-3 p-4">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-purple-500 animate-spin" />
        <span className="text-xs font-semibold text-gray-600">Analyzing metrics…</span>
        <span className="ml-auto text-xs font-bold text-purple-600">{progress}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      {metrics.map((m) => (
        <div key={m.label} className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-32 shrink-0">{m.label}</span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${m.color} rounded-full transition-all duration-700`}
              style={{ width: progress > 30 ? `${(m.value / m.max) * 100}%` : "0%" }}
            />
          </div>
          <span className="text-xs font-bold text-gray-700 w-6 text-right">{progress > 30 ? m.value : "—"}</span>
        </div>
      ))}
    </div>
  );
}

function ResultsPreview() {
  const domains = [
    { rank: 1, name: "techreviews.net", score: 91, tf: 34, cf: 41, badge: "🔥 Top Pick" },
    { rank: 2, name: "gadgetguide.org", score: 84, tf: 28, cf: 35, badge: "✅ Strong" },
    { rank: 3, name: "digitaltools.co", score: 77, tf: 22, cf: 29, badge: "👍 Good" },
  ];
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setVisible(v => Math.min(v + 1, domains.length)), 600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center gap-2 p-4">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="w-4 h-4 text-emerald-500" />
        <span className="text-xs font-semibold text-gray-600">Top 5 Opportunities Ranked</span>
      </div>
      {domains.slice(0, visible).map((d) => (
        <div
          key={d.name}
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
            #{d.rank}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{d.name}</p>
            <p className="text-xs text-gray-400">TF {d.tf} · CF {d.cf}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-bold text-emerald-600">{d.score}/100</span>
            <span className="text-xs">{d.badge}</span>
          </div>
        </div>
      ))}
      {visible < domains.length && (
        <div className="flex items-center gap-2 text-xs text-gray-400 animate-pulse pl-1">
          <Sparkles className="w-3 h-3" /> Ranking more…
        </div>
      )}
    </div>
  );
}

function ChecklistPreview() {
  const items = [
    { label: "Archive.org history clean", done: true },
    { label: "No casino/pharma spam", done: true },
    { label: "Google index check", done: true },
    { label: "Backlink anchor text audit", done: true },
    { label: "Trademark search", done: false },
    { label: "Registrar availability", done: false },
  ];
  const [checked, setChecked] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setChecked(c => Math.min(c + 1, items.filter(i => i.done).length)), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center gap-2 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-orange-500" />
        <span className="text-xs font-semibold text-gray-600">Due Diligence Checklist</span>
        <span className="ml-auto text-xs font-bold text-orange-600">{checked}/{items.filter(i => i.done).length} done</span>
      </div>
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center gap-3 py-1">
          {item.done && i < checked ? (
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
          ) : item.done ? (
            <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0 animate-pulse" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className={`text-xs ${item.done && i < checked ? "text-gray-700 line-through" : item.done ? "text-gray-500" : "text-amber-600 font-semibold"}`}>
            {item.label}
          </span>
          {!item.done && (
            <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">Pending</span>
          )}
        </div>
      ))}
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        Sherlock Check™ passed — no spam history found
      </div>
    </div>
  );
}

// ─── Main Slideshow Component ──────────────────────────────────────────────────
export default function HowItWorksDemo() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [key, setKey] = useState(0); // force preview remount on slide change

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    setKey(k => k + 1);
  }, []);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  // Auto-play
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [playing, next]);

  const slide = SLIDES[current];
  const colors = COLOR_MAP[slide.color];
  const Icon = slide.icon;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* ── Step Indicator ── */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {SLIDES.map((s, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); setPlaying(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              i === current
                ? `${colors.bg} text-white shadow-lg scale-105`
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              i === current ? "bg-white/20" : "bg-gray-300 text-gray-600"
            }`}>
              {i + 1}
            </span>
            <span className="hidden sm:inline">{["Upload", "Analyze", "Rank", "Verify"][i]}</span>
          </button>
        ))}
      </div>

      {/* ── Main Slide Card ── */}
      <div className={`rounded-3xl border-2 ${colors.border} bg-white shadow-2xl overflow-hidden`}>
        <div className="grid md:grid-cols-2 min-h-[420px]">
          {/* Left: Content */}
          <div className="flex flex-col justify-center p-8 lg:p-10">
            <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-5 shadow-lg`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Step {slide.step} of {SLIDES.length}
            </div>
            <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
              {slide.title}
            </h3>
            <p className={`text-sm font-semibold mb-4 ${colors.text}`}>{slide.subtitle}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{slide.description}</p>
            <div className="flex flex-wrap gap-2">
              {slide.tags.map(tag => (
                <span key={tag} className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Animated Preview */}
          <div className={`relative flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border-l border-gray-100 min-h-[280px]`}>
            {/* Browser chrome mockup */}
            <div className="w-full max-w-sm mx-4 my-6 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 mx-3 bg-white rounded-md px-3 py-1 text-xs text-gray-400 border border-gray-200">
                  app.flipandsift.com
                </div>
              </div>
              {/* Content area */}
              <div className="h-64 overflow-hidden" key={key}>
                {slide.preview}
              </div>
            </div>
          </div>
        </div>

        {/* ── Progress Bar ── */}
        {playing && (
          <div className="h-1 bg-gray-100">
            <div
              key={`${current}-${key}`}
              className={`h-full ${colors.bg} rounded-full`}
              style={{
                animation: "progress-fill 5s linear forwards",
              }}
            />
          </div>
        )}
      </div>

      {/* ── Navigation Controls ── */}
      <div className="flex items-center justify-between mt-6 px-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => { prev(); setPlaying(false); }}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>

        <div className="flex items-center gap-4">
          {/* Dot indicators */}
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => { goTo(i); setPlaying(false); }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === current ? `${colors.dot} scale-125` : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
          {/* Play/Pause */}
          <button
            onClick={() => setPlaying(p => !p)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {playing ? "Pause" : "Play"}
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => { next(); setPlaying(false); }}
          className="flex items-center gap-2"
        >
          Next <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* ── CSS for progress animation ── */}
      <style>{`
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
