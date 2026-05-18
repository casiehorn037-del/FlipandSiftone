import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, Shield, CheckCircle2, ArrowRight, Loader2,
  Upload, Clock, TrendingUp, Target, Zap, Search, BarChart3,
  Globe, Award, Users, ChevronDown, ChevronUp, Play, Star,
  Lock, AlertTriangle, XCircle, Brain, Eye, Rocket
} from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { motion, useInView } from "framer-motion";

// ─── Animation Components ───────────────────────────────────────────────────
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, end]);
  
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── FAQ Item Component ───────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div 
      className="border rounded-xl overflow-hidden cursor-pointer bg-white"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />}
      </div>
      {open && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-6 py-4 text-gray-600 text-sm leading-relaxed border-t bg-gray-50"
        >
          {a}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Testimonial Card ───────────────────────────────────────────────────────
function TestimonialCard({ quote, author, role, initials, color }: { 
  quote: string; author: string; role: string; initials: string; color: string 
}) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="shadow-xl h-full">
        <CardContent className="pt-6 flex flex-col h-full">
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            ))}
          </div>
          <p className="text-gray-700 text-lg mb-6 italic flex-grow">
            "{quote}"
          </p>
          <div className="flex items-center gap-4 mt-auto">
            <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center font-bold text-xl`}>
              {initials}
            </div>
            <div>
              <p className="font-bold text-gray-900">{author}</p>
              <p className="text-gray-500">{role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Feature Card ───────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description }: { 
  icon: React.ElementType; title: string; description: string 
}) {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="h-full border-2 border-transparent hover:border-indigo-200 transition-colors">
        <CardContent className="pt-6">
          <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
            <Icon className="w-7 h-7 text-indigo-600" />
          </div>
          <h3 className="font-bold text-xl mb-2 text-gray-900">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Step Card ──────────────────────────────────────────────────────────────
function StepCard({ number, icon: Icon, title, description }: {
  number: number; icon: React.ElementType; title: string; description: string
}) {
  return (
    <motion.div 
      className="flex flex-col md:flex-row gap-6 items-start bg-white p-6 rounded-2xl shadow-md"
      whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-bold mb-2 text-gray-900 flex items-center gap-2">
          <Icon className="w-6 h-6 text-indigo-600" />
          {title}
        </h3>
        <p className="text-gray-600 text-lg">{description}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Home() {
  const { loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="relative px-6 py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <FadeIn>
            <Badge className="mb-6 px-4 py-2 text-sm bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-semibold">
              🚀 Find Hidden Authority Domains First
            </Badge>
          </FadeIn>
          
          {/* 3-PART HEADLINE STRUCTURE */}
          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              {/* PART 1: Pattern Interrupt */}
              <span className="block text-red-400 mb-2">You're Missing the Best Domains.</span>
              {/* PART 2: Mechanism Reveal */}
              <span className="block text-3xl md:text-4xl lg:text-5xl text-indigo-300 mb-4">
                Our AI analyzes SpamZilla screenshots and ranks the top 5 opportunities in 60 seconds.
              </span>
              {/* PART 3: Outcome + Identity Shift */}
              <span className="block text-2xl md:text-3xl text-gray-300">
                So you can flip profitable domains before your competition even opens their inbox.
              </span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Upload any <strong className="text-white">SpamZilla screenshot</strong>. Our AI analyzes <strong className="text-white">15+ SEO metrics</strong>, 
              ranks the <strong className="text-white">top 5 opportunities</strong>, and gives you a <strong className="text-white">due diligence checklist</strong>.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="text-lg px-10 py-6 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20" asChild>
                  <a href={getLoginUrl()}>
                    Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-2 border-gray-600 text-white hover:bg-gray-800" onClick={() => setShowVideo(true)}>
                  <Play className="mr-2 w-5 h-5" /> Watch Demo
                </Button>
              </motion.div>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> No credit card required</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> 3 free analyses</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Cancel anytime</span>
            </div>
          </FadeIn>

          {/* Hero Dashboard Preview */}
          <FadeIn delay={0.5}>
            <motion.div 
              className="mt-16 relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="bg-gray-800 p-2 rounded-2xl shadow-2xl border border-gray-700">
                <div className="bg-gray-900 rounded-xl overflow-hidden">
                  <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 text-center text-gray-400 text-sm">FlipandSift Dashboard</div>
                  </div>
                  <div className="p-8 grid grid-cols-3 gap-4">
                    <div className="col-span-2 bg-gray-800 rounded-lg p-4">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-3" />
                      <div className="h-3 bg-gray-700 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-gray-700 rounded w-2/3" />
                    </div>
                    <div className="bg-indigo-900/50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-indigo-400">87</div>
                      <div className="text-sm text-gray-400">Domain Score</div>
                    </div>
                    <div className="bg-green-900/50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-green-400">$2.4K</div>
                      <div className="text-sm text-gray-400">Est. Value</div>
                    </div>
                    <div className="bg-purple-900/50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-purple-400">42</div>
                      <div className="text-sm text-gray-400">TF Score</div>
                    </div>
                    <div className="bg-orange-900/50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-orange-400">38</div>
                      <div className="text-sm text-gray-400">CF Score</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* ─── STATS BAR ──────────────────────────────────────────────────────── */}
      <section className="bg-indigo-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <FadeIn>
            <div className="text-4xl font-bold text-indigo-300"><CountUp end={10000} suffix="+" /></div>
            <div className="text-indigo-200 mt-1">Domains Analyzed</div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="text-4xl font-bold text-indigo-300">$<CountUp end={2400000} suffix="+" /></div>
            <div className="text-indigo-200 mt-1">Domain Sales Tracked</div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="text-4xl font-bold text-indigo-300"><CountUp end={500} suffix="+" /></div>
            <div className="text-indigo-200 mt-1">Active Flippers</div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="text-4xl font-bold text-indigo-300">4.9/5</div>
            <div className="text-indigo-200 mt-1">User Rating</div>
          </FadeIn>
        </div>
      </section>

      {/* ─── PROBLEM SECTION ────────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
              The Brutal Truth About Domain Flipping
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xl text-gray-600 text-center mb-12">
              You're losing money every day you do this manually
            </p>
          </FadeIn>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={0.2}>
              <Card className="border-l-4 border-l-red-500 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <Clock className="w-12 h-12 text-red-500 mb-4" />
                  <h3 className="font-bold text-xl mb-2 text-gray-900">3+ Hours Wasted Daily</h3>
                  <p className="text-gray-600">
                    Manually checking metrics for 100+ domains takes <strong>3+ hours every morning</strong>. 
                    By the time you finish, the best domains are already sold.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <Card className="border-l-4 border-l-red-500 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                  <h3 className="font-bold text-xl mb-2 text-gray-900">Hidden Spam Traps</h3>
                  <p className="text-gray-600">
                    You buy domains that <strong>look clean but have hidden casino/porn spam</strong>. 
                    Archive.org reveals the truth — but who has time to check every domain?
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
            
            <FadeIn delay={0.4}>
              <Card className="border-l-4 border-l-red-500 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <XCircle className="w-12 h-12 text-red-500 mb-4" />
                  <h3 className="font-bold text-xl mb-2 text-gray-900">Missed $10K+ Deals</h3>
                  <p className="text-gray-600">
                    Without a systematic approach, you pass on profitable domains 
                    and waste money on <strong>spammy ones that never sell</strong>.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── SOLUTION SECTION ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
              From Screenshot to Profit in 4 Steps
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xl text-gray-600 text-center mb-12">
              What used to take 3 hours now takes 60 seconds
            </p>
          </FadeIn>
          
          <div className="space-y-6">
            <FadeIn delay={0.2}>
              <StepCard 
                number={1}
                icon={Upload}
                title="Upload Your SpamZilla Screenshot"
                description="Drag and drop any SpamZilla screenshot. Our OCR extracts all domain names and metrics automatically. No manual data entry."
              />
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <StepCard 
                number={2}
                icon={Brain}
                title="AI Analyzes 15+ Metrics"
                description="Trust Flow, Citation Flow, topical relevance, backlink quality, domain age, and more. Each domain scored 1-100 with detailed breakdown."
              />
            </FadeIn>
            
            <FadeIn delay={0.4}>
              <StepCard 
                number={3}
                icon={TrendingUp}
                title="Get Top 5 Ranked Domains"
                description="See the 5 best opportunities with AI-generated explanations. Understand WHY each domain is worth buying — or avoiding."
              />
            </FadeIn>
            
            <FadeIn delay={0.5}>
              <StepCard 
                number={4}
                icon={Shield}
                title="Complete Due Diligence Checklist"
                description="8-point verification: Archive.org history, backlink audit, Google index, anchor text analysis, trademark search. Buy with confidence."
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ───────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
              Everything You Need to Dominate Domain Flipping
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              No fluff. Just the tools that separate pros from amateurs.
            </p>
          </FadeIn>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FadeIn delay={0.2}>
              <FeatureCard 
                icon={Sparkles}
                title="AI Domain Analysis"
                description="Upload a SpamZilla screenshot and get the top 5 domains ranked by profit potential. AI evaluates 15+ metrics including TF, CF, and topical relevance."
              />
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <FeatureCard 
                icon={Eye}
                title="Sherlock Check™"
                description="Cross-reference domain names against historical topics. Instantly spot spam history, hacked sites, and repurposing red flags before you spend a cent."
              />
            </FadeIn>
            
            <FadeIn delay={0.4}>
              <FeatureCard 
                icon={CheckCircle2}
                title="Due Diligence Checklist"
                description="Every recommendation comes with an 8-point verification checklist: Archive.org, Ahrefs audit, Google index, anchor text, and trademark search."
              />
            </FadeIn>
            
            <FadeIn delay={0.5}>
              <FeatureCard 
                icon={Globe}
                title="Availability Checker"
                description="Real-time domain availability from GoDaddy, Namecheap, and Hostinger. Compare prices and buy from the cheapest registrar."
              />
            </FadeIn>
            
            <FadeIn delay={0.6}>
              <FeatureCard 
                icon={BarChart3}
                title="Bulk Domain Check"
                description="Upload 25-50 domains at once from ChatGPT or your research. Check availability in seconds and save the winners to your watchlist."
              />
            </FadeIn>
            
            <FadeIn delay={0.7}>
              <FeatureCard 
                icon={Zap}
                title="Watchlist & Tracking"
                description="Save promising domains to your watchlist. Track purchase price, sale price, and profit. Build your portfolio and see your flipping history."
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ───────────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-indigo-50">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              What Domain Flippers Say
            </h2>
          </FadeIn>
          
          <div className="grid md:grid-cols-2 gap-8">
            <FadeIn delay={0.2}>
              <TestimonialCard 
                quote="I used to spend 4 hours every morning analyzing SpamZilla. Now I upload a screenshot, get my top 5 in 60 seconds, and I'm done in 20 minutes. I've already flipped 3 domains this month for $4,200 profit."
                author="Mike Richardson"
                role="Domain Flipper • 10-15 flips/month"
                initials="MR"
                color="bg-indigo-100 text-indigo-600"
              />
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <TestimonialCard 
                quote="The Sherlock Check saved me from buying a domain with hidden casino spam. That one feature alone paid for a year of subscription. The AI analysis is scary accurate."
                author="Sarah Kim"
                role="Domain Investor • Since 2019"
                initials="SK"
                color="bg-purple-100 text-purple-600"
              />
            </FadeIn>
          </div>
          
          <FadeIn delay={0.4}>
            <div className="flex flex-wrap justify-center gap-8 mt-12 text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>500+ Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span>Trusted in 30+ Countries</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── PRICING SECTION ────────────────────────────────────────────────── */}
      <section id="pricing" className="px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
              Simple Pricing for Serious Flippers
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              One profitable domain flip pays for a year of FlipandSift.
            </p>
          </FadeIn>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <FadeIn delay={0.2}>
              <Card className="border-2 border-gray-200 h-full">
                <CardContent className="pt-8 pb-8 flex flex-col h-full">
                  <h3 className="text-lg font-semibold text-gray-500 mb-2">Free Trial</h3>
                  <div className="text-5xl font-bold mb-4 text-gray-900">$0</div>
                  <p className="text-gray-600 mb-6">
                    Try before you buy. No credit card required.
                  </p>
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>3 domain analyses (lifetime)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>Basic AI scoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>See top 5 ranked domains</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-400">
                      <XCircle className="w-5 h-5" />
                      <span>No Sherlock Check</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-400">
                      <XCircle className="w-5 h-5" />
                      <span>No watchlist</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full py-6 text-lg" asChild>
                    <a href={getLoginUrl()}>Get Started Free</a>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
            
            {/* Pro */}
            <FadeIn delay={0.3}>
              <Card className="border-2 border-indigo-600 relative shadow-2xl shadow-indigo-100 h-full">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 text-sm font-bold">
                    MOST POPULAR
                  </Badge>
                </div>
                <CardContent className="pt-8 pb-8 flex flex-col h-full">
                  <h3 className="text-lg font-semibold text-indigo-600 mb-2">Pro</h3>
                  <div className="text-5xl font-bold mb-4 text-gray-900">$97<span className="text-xl text-gray-500">/mo</span></div>
                  <p className="text-gray-600 mb-6">
                    For serious domain flippers who want an edge.
                  </p>
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="font-semibold">Unlimited domain analyses</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="font-semibold">Sherlock Check™ included</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="font-semibold">Due diligence checklists</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="font-semibold">Full watchlist</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>Bulk domain checker (50 domains)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>Export results (PDF/CSV)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  <Button className="w-full py-6 text-lg bg-indigo-600 hover:bg-indigo-700" asChild>
                    <a href={getLoginUrl()}>Start Free Trial</a>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
          
          <p className="text-center text-gray-500 mt-8">
            30-day money-back guarantee. No questions asked.
          </p>
        </div>
      </section>

      {/* ─── FAQ SECTION ────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Frequently Asked Questions
            </h2>
          </FadeIn>
          
          <div className="space-y-4">
            <FadeIn delay={0.1}>
              <FaqItem 
                q="How is FlipandSift different from just using SpamZilla?"
                a="SpamZilla shows you raw data. FlipandSift analyzes that data with AI, ranks opportunities, and gives you a due diligence checklist. We turn 3 hours of manual work into 60 seconds. Think of us as the intelligence layer on top of SpamZilla."
              />
            </FadeIn>
            <FadeIn delay={0.15}>
              <FaqItem 
                q="Do I need a SpamZilla account to use FlipandSift?"
                a="Yes. FlipandSift analyzes screenshots from SpamZilla (or similar marketplaces like ODYS, SerpNames, etc.). We don't replace SpamZilla - we make it 10x faster to use by doing the analysis for you."
              />
            </FadeIn>
            <FadeIn delay={0.2}>
              <FaqItem 
                q="How accurate is the AI analysis?"
                a="The AI evaluates 15+ metrics including Trust Flow, Citation Flow, topical relevance, backlink quality, and domain age. It's designed to flag domains that look good on paper but have hidden issues. However, always do your own due diligence - no tool can guarantee success."
              />
            </FadeIn>
            <FadeIn delay={0.25}>
              <FaqItem 
                q="Can I check domains in bulk?"
                a="Yes! Pro users can upload 25-50 domains at once (from ChatGPT, research, etc.) and check availability across GoDaddy, Namecheap, and Hostinger in seconds. Perfect for vetting domain ideas quickly."
              />
            </FadeIn>
            <FadeIn delay={0.3}>
              <FaqItem 
                q="What is the Sherlock Check™?"
                a="Sherlock Check cross-references domain names against their historical topics using Archive.org. It spots inconsistencies - like a domain that was about 'casino' but now shows 'health' - which indicates potential spam history or hacked sites."
              />
            </FadeIn>
            <FadeIn delay={0.35}>
              <FaqItem 
                q="Can I cancel my subscription anytime?"
                a="Yes. You can cancel anytime and keep access until the end of your billing period. We also offer a 30-day money-back guarantee - if FlipandSift doesn't save you time and help you find better domains, we'll refund your payment."
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Stop Wasting Hours on Manual Domain Analysis
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join 500+ domain flippers who find profitable opportunities in 60 seconds, not 3 hours.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="text-xl px-12 py-8 bg-white text-indigo-600 hover:bg-gray-100 shadow-2xl" asChild>
                <a href={getLoginUrl()}>
                  Start Your Free Trial <ArrowRight className="ml-3 w-6 h-6" />
                </a>
              </Button>
            </motion.div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-sm opacity-75 mt-6">
              3 free analyses • No credit card required • 30-day money-back guarantee
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="px-6 py-12 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-bold text-2xl text-white mb-4">FlipandSift</div>
              <p className="text-sm">
                AI-powered domain intelligence for domain flippers. 
                Find profitable expired domains before your competition.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Domain Flipping Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            © 2026 FlipandSift. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
