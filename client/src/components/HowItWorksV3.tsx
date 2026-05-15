import { useState, useEffect, useCallback } from "react";
import { Upload, Sparkles, TrendingUp, Shield, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Variant 3 — Cinematic Full-Width Cards
 * Each slide is a full-width gradient card with a giant step number watermark.
 * Horizontal swipe-style navigation with thumbnail strip at the bottom.
 * Bold, magazine-editorial feel.
 */

const STEPS = [
  {
    num: "01",
    icon: Upload,
    gradient: "from-indigo-600 via-blue-600 to-cyan-500",
    accent: "bg-cyan-400",
    textAccent: "text-cyan-300",
    title: "Upload Your\nSpamZilla Screenshot",
    hook: "Zero manual entry. Ever.",
    body: "Drop any SpamZilla export image. Our OCR engine reads every domain, Trust Flow, Citation Flow, SZ Score, age, and topic in seconds — no spreadsheets, no copy-paste.",
    bullets: ["PNG, JPG, PDF supported", "47 domains parsed in 3s", "100% automatic extraction"],
  },
  {
    num: "02",
    icon: Sparkles,
    gradient: "from-violet-600 via-purple-600 to-pink-500",
    accent: "bg-pink-400",
    textAccent: "text-pink-300",
    title: "AI Scores Every\nDomain Instantly",
    hook: "15+ signals. One score.",
    body: "Our vision AI cross-references Trust Flow, topical relevance, backlink quality, spam history, and domain age. Every domain gets a 0–100 opportunity score with full reasoning.",
    bullets: ["Trust Flow & Citation Flow", "Topical relevance scoring", "Spam history detection"],
  },
  {
    num: "03",
    icon: TrendingUp,
    gradient: "from-emerald-600 via-teal-600 to-green-500",
    accent: "bg-green-400",
    textAccent: "text-green-300",
    title: "See Your Top 5\nRanked Opportunities",
    hook: "Know exactly what to buy.",
    body: "The AI surfaces the 5 best picks from your list with clear reasoning — confidence scores, key strengths, and red flags. No guesswork, no wasted bids.",
    bullets: ["Ranked by profit potential", "Confidence score per domain", "Clear buy/skip reasoning"],
  },
  {
    num: "04",
    icon: Shield,
    gradient: "from-orange-500 via-amber-500 to-yellow-400",
    accent: "bg-yellow-300",
    textAccent: "text-yellow-200",
    title: "Complete Due\nDiligence in Seconds",
    hook: "Buy with total confidence.",
    body: "Every recommendation ships with a Sherlock Check™ for spam history, an 8-point due diligence checklist, and one-click links to Archive.org, Ahrefs, and Google index checks.",
    bullets: ["Sherlock Check™ spam scan", "Archive.org history check", "Trademark & backlink audit"],
  },
];

export default function HowItWorksV3() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((i: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(i);
    setTimeout(() => setAnimating(false), 400);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % STEPS.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + STEPS.length) % STEPS.length), [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const step = STEPS[current];
  const Icon = step.icon;

  return (
    <div className="w-full max-w-5xl mx-auto select-none">
      {/* Main card */}
      <div
        className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${step.gradient} shadow-2xl transition-all duration-500 min-h-[420px]`}
      >
        {/* Giant watermark number */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[180px] font-black text-white/10 leading-none pointer-events-none select-none">
          {step.num}
        </div>

        <div className="relative z-10 grid md:grid-cols-2 min-h-[420px]">
          {/* Left: text */}
          <div className="flex flex-col justify-center p-10 lg:p-14">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6 bg-white/20 text-white w-fit`}>
              <Icon className="w-3.5 h-3.5" />
              Step {step.num} of 04
            </div>
            <h3 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-3 whitespace-pre-line">
              {step.title}
            </h3>
            <p className={`text-lg font-bold mb-5 ${step.textAccent}`}>{step.hook}</p>
            <p className="text-white/80 leading-relaxed text-sm mb-6">{step.body}</p>
            <ul className="flex flex-col gap-2">
              {step.bullets.map(b => (
                <li key={b} className="flex items-center gap-2 text-sm text-white/90">
                  <div className={`w-1.5 h-1.5 rounded-full ${step.accent} shrink-0`} />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: nav area */}
          <div className="flex flex-col items-center justify-center gap-6 p-10">
            <div className="flex items-center gap-4">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex flex-col gap-2">
                {STEPS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 text-left ${
                      i === current ? "bg-white/25 text-white" : "text-white/50 hover:text-white/70"
                    }`}
                  >
                    <span className={`text-xs font-black ${i === current ? "text-white" : "text-white/40"}`}>{s.num}</span>
                    <span className="text-sm font-semibold truncate max-w-[120px]">{s.title.split("\n")[0]}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={next}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            key={current}
            className="h-full bg-white rounded-full"
            style={{ animation: "progress-fill 6s linear forwards" }}
          />
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-3 mt-4 justify-center">
        {STEPS.map((s, i) => {
          const SIcon = s.icon;
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`flex-1 max-w-[110px] rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all duration-200 border-2 ${
                i === current
                  ? `bg-gradient-to-br ${s.gradient} border-transparent text-white shadow-lg scale-105`
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <SIcon className="w-4 h-4" />
              <span className="text-xs font-bold">{s.num}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
