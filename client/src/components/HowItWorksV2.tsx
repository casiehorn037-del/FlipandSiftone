import { useState, useEffect, useCallback } from "react";
import { Upload, Sparkles, TrendingUp, Shield, CheckCircle2, ArrowRight } from "lucide-react";

/**
 * Variant 2 — Vertical Stepper / Timeline
 * Left side: vertical timeline with step nodes.
 * Right side: animated content panel that swaps on click.
 * Auto-advances every 5s. Clean white card, accent color per step.
 */

const STEPS = [
  {
    icon: Upload,
    color: "blue",
    title: "Upload Screenshot",
    short: "Drop your SpamZilla export",
    body: "Take any SpamZilla screenshot and upload it. Our OCR engine extracts every domain name, Trust Flow, Citation Flow, SZ Score, age, and topic automatically — no spreadsheets, no copy-paste.",
    stat: "47 domains parsed in 3s",
    statIcon: "⚡",
  },
  {
    icon: Sparkles,
    color: "violet",
    title: "AI Scores Domains",
    short: "15+ SEO signals analyzed",
    body: "The AI cross-references Trust Flow, topical relevance, backlink quality, spam history, and domain age. Every domain gets a 0–100 opportunity score with full reasoning.",
    stat: "15+ metrics per domain",
    statIcon: "🧠",
  },
  {
    icon: TrendingUp,
    color: "emerald",
    title: "See Top 5 Picks",
    short: "Ranked by profit potential",
    body: "The AI surfaces the 5 best opportunities from your list. You see exactly WHY each domain is worth buying — confidence score, key strengths, and any red flags.",
    stat: "Top 5 ranked in <60s",
    statIcon: "🏆",
  },
  {
    icon: Shield,
    color: "orange",
    title: "Verify & Buy",
    short: "8-point due diligence",
    body: "Every pick ships with a Sherlock Check™ for spam history, a full due diligence checklist, and one-click links to Archive.org, Ahrefs, and Google index checks.",
    stat: "8-point safety checklist",
    statIcon: "🛡️",
  },
];

const COLORS: Record<string, { bg: string; light: string; text: string; ring: string; border: string }> = {
  blue:    { bg: "bg-blue-600",    light: "bg-blue-50",    text: "text-blue-600",    ring: "ring-blue-300",    border: "border-blue-200" },
  violet:  { bg: "bg-violet-600",  light: "bg-violet-50",  text: "text-violet-600",  ring: "ring-violet-300",  border: "border-violet-200" },
  emerald: { bg: "bg-emerald-600", light: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-300", border: "border-emerald-200" },
  orange:  { bg: "bg-orange-500",  light: "bg-orange-50",  text: "text-orange-600",  ring: "ring-orange-300",  border: "border-orange-200" },
};

export default function HowItWorksV2() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % STEPS.length), []);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const step = STEPS[current];
  const c = COLORS[step.color];
  const Icon = step.icon;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid md:grid-cols-[220px_1fr] gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

        {/* Left: Vertical timeline */}
        <div className="bg-gray-50 border-r border-gray-100 py-8 px-6 flex flex-col gap-0">
          {STEPS.map((s, i) => {
            const sc = COLORS[s.color];
            const SIcon = s.icon;
            const isActive = i === current;
            const isDone = i < current;
            return (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="flex items-start gap-3 text-left group relative pb-6 last:pb-0"
              >
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className={`absolute left-5 top-10 w-0.5 h-full -translate-x-1/2 transition-colors duration-500 ${isDone || isActive ? sc.bg : "bg-gray-200"}`} />
                )}
                {/* Node */}
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ring-4 ring-offset-2 ${
                  isActive ? `${sc.bg} text-white ${sc.ring}` : isDone ? `${sc.bg} text-white ring-transparent` : "bg-white border-2 border-gray-200 text-gray-400 ring-transparent"
                }`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <SIcon className="w-5 h-5" />}
                </div>
                {/* Label */}
                <div className="pt-1.5">
                  <p className={`text-sm font-bold transition-colors ${isActive ? sc.text : isDone ? "text-gray-700" : "text-gray-400"}`}>
                    {s.title}
                  </p>
                  <p className={`text-xs mt-0.5 transition-colors ${isActive ? "text-gray-600" : "text-gray-400"}`}>
                    {s.short}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Content panel */}
        <div className="p-8 flex flex-col justify-between min-h-[380px]">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5 ${c.light} ${c.text}`}>
              <Icon className="w-3.5 h-3.5" />
              Step {current + 1} of {STEPS.length}
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed text-base">{step.body}</p>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${c.light} ${c.border} border`}>
              <span className="text-lg">{step.statIcon}</span>
              <span className={`text-sm font-bold ${c.text}`}>{step.stat}</span>
            </div>
            <button
              onClick={next}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl ${c.bg} text-white text-sm font-bold shadow-lg hover:opacity-90 transition-opacity`}
            >
              {current < STEPS.length - 1 ? "Next Step" : "Get Started"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 mt-5">
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? `w-8 ${c.bg}` : "w-4 bg-gray-200"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
