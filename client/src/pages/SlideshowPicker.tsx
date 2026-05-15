import HowItWorksV1 from "@/components/HowItWorksV1";
import HowItWorksV2 from "@/components/HowItWorksV2";
import HowItWorksV3 from "@/components/HowItWorksV3";
import HowItWorksV4 from "@/components/HowItWorksV4";
import HowItWorksV5 from "@/components/HowItWorksV5";
import HowItWorksV6 from "@/components/HowItWorksV6";

const VARIANTS = [
  {
    id: "V1",
    name: "Dark Terminal",
    desc: "Hacker/dev aesthetic — dark card with animated terminal output on the right. Monospace font, green-on-black CLI feel.",
    component: HowItWorksV1,
  },
  {
    id: "V2",
    name: "Vertical Timeline",
    desc: "Clean vertical stepper on the left with a content panel on the right. Professional, minimal, great for B2B.",
    component: HowItWorksV2,
  },
  {
    id: "V3",
    name: "Cinematic Cards",
    desc: "Full-width gradient cards with a giant watermark number. Bold, magazine-editorial feel with a thumbnail strip.",
    component: HowItWorksV3,
  },
  {
    id: "V4",
    name: "Expanding Cards",
    desc: "4 horizontal cards — inactive ones collapse to icon+title, active card expands with stats. Accordion-style.",
    component: HowItWorksV4,
  },
  {
    id: "V5",
    name: "Glassmorphism Dark",
    desc: "Dark indigo/purple gradient background with a frosted-glass card. Premium SaaS look, great for dark landing pages.",
    component: HowItWorksV5,
  },
  {
    id: "V6",
    name: "Minimal + App Preview",
    desc: "Clean numbered list on the left, live animated app UI mockup on the right. Most product-forward option.",
    component: HowItWorksV6,
  },
];

export default function SlideshowPicker() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold mb-4">
            🎨 Slideshow Picker
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Choose Your "How It Works" Slideshow</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            6 distinct styles — pick the one that fits your brand, then tell us the variant number (V1–V6) and we'll swap it in.
          </p>
        </div>

        {/* Variants */}
        <div className="flex flex-col gap-24">
          {VARIANTS.map((v) => {
            const Component = v.component;
            return (
              <div key={v.id} className="flex flex-col gap-6">
                {/* Label */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black text-lg">
                    {v.id}
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900">{v.name}</h2>
                    <p className="text-gray-500 text-sm">{v.desc}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold">
                      Tell us "{v.id}" to use this one
                    </span>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
                  <Component />
                </div>

                {/* Divider */}
                <div className="border-b border-gray-200" />
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-16 p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
          <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Made your choice?</h3>
          <p className="text-gray-600 mb-4">Just reply with the variant number (e.g. "Use V3") and we'll replace the current slideshow instantly.</p>
          <div className="flex justify-center gap-3 flex-wrap">
            {VARIANTS.map(v => (
              <span key={v.id} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 shadow-sm">
                {v.id} — {v.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
