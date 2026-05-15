import { useState, useEffect, useCallback } from "react";
import { Upload, Sparkles, TrendingUp, Shield, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

/**
 * Variant 5 — Glassmorphism Dark Gradient
 * Full-width dark purple/indigo gradient background.
 * Floating glass card with blurred backdrop for the active step.
 * Numbered step pills at the top. Smooth fade transitions.
 */

const STEPS = [
  {
    num: 1,
    icon: Upload,
    emoji: "📸",
    title: "Upload Your Screenshot",
    subtitle: "SpamZilla export → instant data",
    body: "Drop any SpamZilla screenshot. Our OCR engine reads every domain, Trust Flow, Citation Flow, SZ Score, age, and topic in seconds — zero manual entry.",
    highlights: ["PNG, JPG, PDF supported", "47 domains parsed in 3s", "Automatic metric extraction"],
    glow: "shadow-indigo-500/30",
    pill: "bg-indigo-500",
  },
  {
    num: 2,
    icon: Sparkles,
    emoji: "🧠",
    title: "AI Scores Every Domain",
    subtitle: "15+ signals. One clear score.",
    body: "Our vision AI cross-references Trust Flow, topical relevance, backlink quality, spam history, and domain age. Every domain gets a 0–100 score with full reasoning.",
    highlights: ["Trust Flow & Citation Flow", "Topical relevance scoring", "Spam history detection"],
    glow: "shadow-purple-500/30",
    pill: "bg-purple-500",
  },
  {
    num: 3,
    icon: TrendingUp,
    emoji: "🏆",
    title: "See Your Top 5 Picks",
    subtitle: "Ranked by profit potential",
    body: "The AI surfaces the 5 best opportunities with clear reasoning — confidence scores, key strengths, and red flags. Know exactly what to bid on.",
    highlights: ["AI-ranked opportunities", "Confidence score per domain", "Clear buy/skip reasoning"],
    glow: "shadow-emerald-500/30",
    pill: "bg-emerald-500",
  },
  {
    num: 4,
    icon: Shield,
    emoji: "🛡️",
    title: "Verify & Buy Safely",
    subtitle: "8-point due diligence checklist",
    body: "Every recommendation ships with a Sherlock Check™ for spam history, a full due diligence checklist, and one-click links to Archive.org, Ahrefs, and Google.",
    highlights: ["Sherlock Check™ spam scan", "Archive.org history check", "Trademark & backlink audit"],
    glow: "shadow-orange-500/30",
    pill: "bg-orange-500",
  },
];

export default function HowItWorksV5() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((i: number) => {
    setFading(true);
    setTimeout(() => { setCurrent(i); setFading(false); }, 250);
  }, []);

  const next = useCallback(() => goTo((current + 1) % STEPS.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + STEPS.length) % STEPS.length), [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next]);

  const step = STEPS[current];
  const Icon = step.icon;

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-8 lg:p-12 shadow-2xl">
      {/* Step pills */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              i === current
                ? `${s.pill} text-white shadow-lg scale-105`
                : "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white/80"
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
              i < current ? "bg-white/30 text-white" : i === current ? "bg-white/20 text-white" : "bg-white/10 text-white/40"
            }`}>
              {i < current ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
            </span>
            <span className="hidden sm:inline">{["Upload", "Analyze", "Rank", "Verify"][i]}</span>
          </button>
        ))}
      </div>

      {/* Glass card */}
      <div
        className={`relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 lg:p-10 shadow-2xl ${step.glow} transition-opacity duration-250 ${fading ? "opacity-0" : "opacity-100"}`}
      >
        {/* Emoji watermark */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-8xl opacity-10 pointer-events-none select-none">
          {step.emoji}
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-12 h-12 rounded-xl ${step.pill} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Step {step.num} of 4</p>
                <p className="text-white/70 text-sm font-semibold">{step.subtitle}</p>
              </div>
            </div>
            <h3 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-5">{step.title}</h3>
            <p className="text-white/60 leading-relaxed">{step.body}</p>
          </div>

          {/* Right: highlights */}
          <div className="flex flex-col gap-3">
            {step.highlights.map((h, i) => (
              <div
                key={h}
                className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 border border-white/10"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                <span className="text-white/80 text-sm font-medium">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={prev}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-semibold transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {/* Progress dots */}
        <div className="flex gap-2">
          {STEPS.map((s, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? `w-8 ${s.pill}` : "w-4 bg-white/20"}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-semibold transition-all duration-200"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
