import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Upload, Sparkles, TrendingUp, Shield, CheckCircle2, Terminal } from "lucide-react";

/**
 * Variant 1 — Dark Terminal / Hacker Aesthetic
 * Full-width dark card with a terminal-style animated preview on the right.
 * Step pills are monospace numbered tabs at the top.
 */

const STEPS = [
  {
    num: "01",
    label: "Upload",
    icon: Upload,
    title: "Upload Your SpamZilla Screenshot",
    body: "Drag & drop any SpamZilla export. Our OCR reads every domain, Trust Flow, Citation Flow, SZ Score, age, and topic — no manual entry needed.",
    terminal: [
      "$ flipandsift analyze --input spamzilla.png",
      "> OCR engine initializing...",
      "> Detected 47 domains in screenshot",
      "> Extracting metrics: TF, CF, SZ, age...",
      "> ✓ 47/47 domains parsed successfully",
      "> Queuing AI analysis pipeline...",
    ],
  },
  {
    num: "02",
    label: "Analyze",
    icon: Sparkles,
    title: "AI Scores Every Domain",
    body: "Our model cross-references 15+ SEO signals: Trust Flow, topical relevance, backlink quality, spam history, and domain age. Each domain gets a 0–100 score.",
    terminal: [
      "$ Running AI analysis pipeline...",
      "> Loading vision model v3.2...",
      "> techreviews.net    → score: 91 ✓",
      "> gadgetguide.org    → score: 84 ✓",
      "> digitaltools.co    → score: 77 ✓",
      "> spammy-links.net   → score: 12 ✗ SKIP",
      "> Ranked 5 top opportunities",
    ],
  },
  {
    num: "03",
    label: "Rank",
    icon: TrendingUp,
    title: "See Your Top 5 Opportunities",
    body: "The AI surfaces the 5 best picks from your list with clear reasoning — why each domain is worth buying, and what red flags to watch for.",
    terminal: [
      "$ flipandsift results --top 5",
      "",
      "  #1  techreviews.net    91/100 🔥",
      "      TF:34  CF:41  Age:8yr",
      "  #2  gadgetguide.org    84/100 ✅",
      "      TF:28  CF:35  Age:5yr",
      "  #3  digitaltools.co    77/100 👍",
      "      TF:22  CF:29  Age:3yr",
    ],
  },
  {
    num: "04",
    label: "Verify",
    icon: Shield,
    title: "Complete Due Diligence",
    body: "Every recommendation ships with a Sherlock Check™ for spam history, an 8-point due diligence checklist, and one-click links to Archive.org, Ahrefs, and Google.",
    terminal: [
      "$ flipandsift verify techreviews.net",
      "> Sherlock Check™ running...",
      "> ✓ No casino/pharma spam found",
      "> ✓ Archive.org history: clean",
      "> ✓ Google index: 142 pages",
      "> ✓ Trademark: no conflicts",
      "> ✓ Backlink anchors: natural",
      "> VERDICT: SAFE TO BUY ✅",
    ],
  },
];

function TerminalPreview({ lines }: { lines: string[] }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    const t = setInterval(() => setVisible(v => {
      if (v >= lines.length) { clearInterval(t); return v; }
      return v + 1;
    }), 350);
    return () => clearInterval(t);
  }, [lines]);

  return (
    <div className="font-mono text-xs leading-relaxed">
      {lines.slice(0, visible).map((line, i) => (
        <div key={i} className={`${line.startsWith(">") ? "text-green-400" : line.startsWith("$") ? "text-yellow-300" : line.includes("✗") ? "text-red-400" : "text-gray-300"}`}>
          {line || "\u00A0"}
        </div>
      ))}
      {visible < lines.length && (
        <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-0.5" />
      )}
    </div>
  );
}

export default function HowItWorksV1() {
  const [current, setCurrent] = useState(0);
  const [key, setKey] = useState(0);

  const goTo = useCallback((i: number) => { setCurrent(i); setKey(k => k + 1); }, []);
  const next = useCallback(() => goTo((current + 1) % STEPS.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + STEPS.length) % STEPS.length), [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const step = STEPS[current];
  const Icon = step.icon;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-gray-900 rounded-xl p-1 w-fit mx-auto">
        {STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`px-5 py-2 rounded-lg font-mono text-sm font-bold transition-all duration-200 ${
              i === current ? "bg-green-500 text-gray-900" : "text-gray-400 hover:text-white"
            }`}
          >
            {s.num}_{s.label.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Main card */}
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700 bg-gray-900">
        <div className="grid md:grid-cols-2 min-h-[400px]">
          {/* Left: content */}
          <div className="flex flex-col justify-center p-8 border-r border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                <Icon className="w-5 h-5 text-green-400" />
              </div>
              <span className="font-mono text-green-400 text-sm font-bold">STEP {step.num}</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-4 leading-tight">{step.title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">{step.body}</p>
          </div>

          {/* Right: terminal */}
          <div className="flex flex-col bg-gray-950 p-0">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-3 font-mono text-xs text-gray-500">flipandsift — bash</span>
            </div>
            <div className="flex-1 p-5 overflow-hidden" key={key}>
              <TerminalPreview lines={step.terminal} />
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between px-8 py-4 bg-gray-800 border-t border-gray-700">
          <button onClick={prev} className="flex items-center gap-2 text-gray-400 hover:text-white font-mono text-sm transition-colors">
            <ChevronLeft className="w-4 h-4" /> prev
          </button>
          <div className="flex gap-2">
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-green-400 w-6" : "bg-gray-600"}`}
              />
            ))}
          </div>
          <button onClick={next} className="flex items-center gap-2 text-gray-400 hover:text-white font-mono text-sm transition-colors">
            next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
