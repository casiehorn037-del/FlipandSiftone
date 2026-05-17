import { useState, useEffect, useCallback } from "react";
import { Upload, Sparkles, TrendingUp, Shield, ArrowRight } from "lucide-react";

/**
 * Variant 4 — Horizontal Card Carousel with Metric Stats
 * 4 cards laid out horizontally; the active card expands with full detail.
 * Inactive cards show icon + title only. Clean white background, bold stats.
 */

const STEPS = [
  {
    icon: Upload,
    color: "indigo",
    title: "Upload",
    headline: "Drop Your Screenshot",
    body: "Upload any SpamZilla export. Our OCR reads every domain, Trust Flow, Citation Flow, SZ Score, age, and topic automatically.",
    stats: [
      { value: "47", label: "Domains parsed" },
      { value: "3s", label: "Parse time" },
      { value: "100%", label: "Automatic" },
    ],
  },
  {
    icon: Sparkles,
    color: "purple",
    title: "Analyze",
    headline: "AI Scores Every Domain",
    body: "15+ SEO signals analyzed per domain. Trust Flow, topical relevance, backlink quality, spam history, and domain age — all in one score.",
    stats: [
      { value: "15+", label: "Metrics checked" },
      { value: "0–100", label: "Opportunity score" },
      { value: "<60s", label: "Analysis time" },
    ],
  },
  {
    icon: TrendingUp,
    color: "emerald",
    title: "Rank",
    headline: "See Top 5 Picks",
    body: "The AI surfaces the 5 best opportunities from your list with clear reasoning — confidence scores, strengths, and red flags.",
    stats: [
      { value: "Top 5", label: "Ranked domains" },
      { value: "91/100", label: "Best score seen" },
      { value: "Clear", label: "Buy reasoning" },
    ],
  },
  {
    icon: Shield,
    color: "orange",
    title: "Verify",
    headline: "Complete Due Diligence",
    body: "Every pick ships with a Sherlock Check™, an 8-point checklist, and one-click links to Archive.org, Ahrefs, and Google index.",
    stats: [
      { value: "8", label: "Checklist items" },
      { value: "Sherlock™", label: "Spam scan" },
      { value: "1-click", label: "Verification links" },
    ],
  },
];

const C: Record<string, { bg: string; light: string; text: string; border: string; stat: string }> = {
  indigo:  { bg: "bg-indigo-600",  light: "bg-indigo-50",  text: "text-indigo-600",  border: "border-indigo-200", stat: "text-indigo-700" },
  purple:  { bg: "bg-purple-600",  light: "bg-purple-50",  text: "text-purple-600",  border: "border-purple-200", stat: "text-purple-700" },
  emerald: { bg: "bg-emerald-600", light: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", stat: "text-emerald-700" },
  orange:  { bg: "bg-orange-500",  light: "bg-orange-50",  text: "text-orange-600",  border: "border-orange-200", stat: "text-orange-700" },
};

export default function HowItWorksV4() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % STEPS.length), []);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex gap-3 items-stretch min-h-[360px]">
        {STEPS.map((step, i) => {
          const c = C[step.color];
          const Icon = step.icon;
          const isActive = i === current;

          return (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-2xl border-2 transition-all duration-500 text-left overflow-hidden flex flex-col ${
                isActive
                  ? `flex-[3] ${c.border} bg-white shadow-2xl`
                  : "flex-1 border-gray-100 bg-gray-50 hover:bg-gray-100 hover:border-gray-200"
              }`}
            >
              {/* Header */}
              <div className={`flex items-center gap-3 p-5 ${isActive ? "" : "flex-col"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? c.bg : "bg-gray-200"}`}>
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                </div>
                {isActive ? (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step {i + 1}</p>
                    <p className={`text-lg font-extrabold ${c.text}`}>{step.headline}</p>
                  </div>
                ) : (
                  <p className="text-xs font-bold text-gray-500 text-center">{step.title}</p>
                )}
              </div>

              {/* Expanded content */}
              {isActive && (
                <div className="flex flex-col flex-1 px-5 pb-5 gap-4">
                  <p className="text-gray-600 text-sm leading-relaxed">{step.body}</p>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mt-auto">
                    {step.stats.map(stat => (
                      <div key={stat.label} className={`rounded-xl p-3 ${c.light} ${c.border} border`}>
                        <p className={`text-xl font-black ${c.stat}`}>{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Next button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className={`flex items-center gap-2 text-sm font-bold ${c.text} hover:opacity-70 transition-opacity mt-1`}
                  >
                    {i < STEPS.length - 1 ? `Next: ${STEPS[i + 1].title}` : "Get Started Free"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step number for inactive */}
              {!isActive && (
                <div className="mt-auto p-4 flex justify-center">
                  <span className="text-2xl font-black text-gray-200">{String(i + 1).padStart(2, "0")}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-5">
        {STEPS.map((_, i) => {
          const c = C[STEPS[i].color];
          return (
            <button key={i} onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? `w-8 ${c.bg}` : "w-2 bg-gray-300"}`}
            />
          );
        })}
      </div>
    </div>
  );
}
