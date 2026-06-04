import { Link } from "wouter";
import { useCreateResume } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  FileText, Sparkles, TrendingUp, Clock, Shield, Layers, Smartphone, History,
  Globe, Code2, UserCheck, Star, ArrowRight, CheckCircle2, RotateCcw,
  Download, ChevronRight, Zap, BarChart3, LayoutTemplate, Award
} from "lucide-react";

export default function Landing() {
  const createResume = useCreateResume();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleStartFree = () => {
    createResume.mutate(
      { data: { title: "My Resume", template: "modern" } },
      {
        onSuccess: (resume) => setLocation(`/builder/${resume.id}`),
        onError: () => toast({ title: "Error", description: "Failed to create resume", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#080810]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-white">
              MahiCV-<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">AI</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#templates" className="hover:text-white transition-colors">Templates</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
          <button
            onClick={handleStartFree}
            className="px-4 py-1.5 rounded-full text-sm font-medium border border-violet-500/50 text-white hover:bg-violet-500/10 transition-all"
          >
            Start Free →
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-[#080810] to-[#080810] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-800/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Powered by Groq LLaMA 3.3-70B · Free Forever
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Build Resumes That<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Get You Hired
            </span>
          </h1>

          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10">
            MahiCV-AI is the smartest free CV builder on the planet. AI writes your summary, 7 premium templates, live preview, and a flawless PDF — all in your browser, completely free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-12">
            <button
              onClick={handleStartFree}
              disabled={createResume.isPending}
              className="rgb-btn px-8 py-3.5 font-semibold text-white text-sm disabled:opacity-60 flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Sparkles className="w-4 h-4" />
              Make My CV Free →
            </button>

            <Link href="/dashboard">
              <button className="px-8 py-3.5 rounded-xl font-semibold text-white/70 text-sm border border-white/15 bg-white/5 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
                ▶ Edit My CV
              </button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {["bg-violet-500","bg-blue-500","bg-emerald-500","bg-rose-500","bg-amber-500"].map((c, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-[#080810] flex items-center justify-center text-xs font-bold`}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="text-sm text-white/50">
              <span className="text-white font-semibold">50,000+</span> professionals trust MahiCV-AI
              <span className="ml-2 text-yellow-400">★★★★★</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── App Preview mockup ── */}
      <section className="max-w-5xl mx-auto px-6 -mt-8 mb-24">
        <div className="rounded-2xl border border-white/10 bg-[#0f0f1a] overflow-hidden shadow-2xl shadow-violet-900/20">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0a0a14]">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-xs text-white/30 ml-2">resumeai.app/builder</span>
          </div>
          <div className="flex h-56 md:h-72">
            <div className="w-36 border-r border-white/5 bg-[#090912] p-4 text-xs text-white/40 space-y-3">
              {["Personal","Experience","Education","Skills","Projects"].map((s, i) => (
                <div key={s} className={`flex items-center gap-2 px-2 py-1 rounded ${i === 1 ? "bg-violet-500/20 text-violet-300" : ""}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50" />{s}
                </div>
              ))}
            </div>
            <div className="flex-1 p-6 flex gap-4">
              <div className="flex-1 space-y-3">
                <div className="h-8 rounded bg-white/5 w-3/4" />
                <div className="h-8 rounded bg-white/5 w-1/2" />
                <div className="h-8 rounded bg-violet-500/20 w-full mt-4" />
                <div className="h-8 rounded bg-violet-500/20 w-2/3" />
                <div className="mt-4 flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-violet-500/30 text-violet-300 text-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Summary
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 text-white/30 text-xs">Score</div>
                </div>
              </div>
              <div className="w-36 md:w-48 rounded-lg bg-white border border-white/20 p-3 shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded bg-blue-200" />
                  <div className="space-y-1">
                    <div className="h-2 w-20 rounded bg-gray-800" />
                    <div className="h-1.5 w-14 rounded bg-gray-300" />
                  </div>
                </div>
                {["EXPERIENCE","EDUCATION","SKILLS"].map(s => (
                  <div key={s} className="mb-2">
                    <div className="text-[6px] text-blue-600 font-bold mb-1">{s}</div>
                    <div className="space-y-0.5">
                      <div className="h-1 w-full rounded bg-gray-200" />
                      <div className="h-1 w-3/4 rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-5xl mx-auto px-6 mb-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FileText, value: "50,000+", label: "Resumes Created", color: "text-blue-400", bg: "bg-blue-500/10" },
            { icon: TrendingUp, value: "12,000+", label: "Jobs Landed", color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { icon: LayoutTemplate, value: "7", label: "Premium Templates", color: "text-violet-400", bg: "bg-violet-500/10" },
            { icon: Award, value: "100%", label: "Free Forever", color: "text-amber-400", bg: "bg-amber-500/10" },
          ].map(({ icon: Icon, value, label, color, bg }) => (
            <div key={label} className="rounded-2xl border border-white/5 bg-[#0f0f1a] p-6 text-center">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mx-auto mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
              <div className="text-xs text-white/40">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-5xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 mb-6">
            <Sparkles className="w-3 h-3" /> Everything You Need
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Powerful Features,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Zero Compromises
            </span>
          </h2>
          <p className="text-white/40 max-w-lg mx-auto">
            12 features crafted to help you land your dream job — all completely free, no signup required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Sparkles, color: "text-blue-400", bg: "bg-blue-500/10",
              title: "AI Summary Generator",
              desc: "Groq LLaMA 3.3-70B crafts a compelling, role-specific summary tailored to your career in under 5 seconds.",
            },
            {
              icon: BarChart3, color: "text-amber-400", bg: "bg-amber-500/10",
              title: "AI Resume Score",
              desc: "Instant 0–100 strength score with specific tips: what to add, what to improve, what's missing.",
            },
            {
              icon: LayoutTemplate, color: "text-violet-400", bg: "bg-violet-500/10",
              title: "7 Premium Templates",
              desc: "Modern, Classic, Minimal, Creative, Executive, Slate & Emerald — all ATS-friendly and pixel-perfect.",
            },
            {
              icon: Zap, color: "text-cyan-400", bg: "bg-cyan-500/10",
              title: "Real-Time Preview",
              desc: "Split-screen live preview — every keystroke reflects instantly. WYSIWYG: exactly what you see is exported.",
            },
            {
              icon: Download, color: "text-emerald-400", bg: "bg-emerald-500/10",
              title: "Perfect PDF Export",
              desc: "Crisp A4 PDF via html2pdf.js. No text cropping across pages, sharp fonts, exact A4 dimensions.",
            },
            {
              icon: Shield, color: "text-rose-400", bg: "bg-rose-500/10",
              title: "100% Private",
              desc: "All data stays in your browser only. Nothing is sent to any server. No account. No tracking. Ever.",
            },
            {
              icon: Layers, color: "text-orange-400", bg: "bg-orange-500/10",
              title: "Drag & Drop Sections",
              desc: "Reorder any section instantly with smooth drag-and-drop. Toggle visibility with one click.",
            },
            {
              icon: Smartphone, color: "text-sky-400", bg: "bg-sky-500/10",
              title: "Mobile-First Design",
              desc: "Fully responsive on all devices. Upload your passport photo from your phone gallery and edit anywhere.",
            },
            {
              icon: History, color: "text-indigo-400", bg: "bg-indigo-500/10",
              title: "Version History",
              desc: "Auto-saves every 2.5 seconds, keeps 30 snapshots. Restore any previous version with one click.",
            },
            {
              icon: Globe, color: "text-teal-400", bg: "bg-teal-500/10",
              title: "Multi-Language Support",
              desc: "Add Languages section with fluency levels. Build CVs for global markets in any language.",
            },
            {
              icon: Code2, color: "text-pink-400", bg: "bg-pink-500/10",
              title: "Custom Sections",
              desc: "Add unlimited custom sections — Publications, Volunteer Work, Awards — anything you need.",
            },
            {
              icon: UserCheck, color: "text-lime-400", bg: "bg-lime-500/10",
              title: "No Login Required",
              desc: "Jump straight in. No signup, no email, no password. Start building your CV in 10 seconds flat.",
            },
          ].map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="rounded-2xl border border-white/5 bg-[#0f0f1a] p-6 hover:border-white/10 transition-colors group">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Templates ── */}
      <section id="templates" className="max-w-5xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 mb-6">
            <LayoutTemplate className="w-3 h-3" /> 7 Premium Templates
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Choose Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Perfect Look
            </span>
          </h2>
          <p className="text-white/40 max-w-lg mx-auto">
            Every template is ATS-optimised, print-ready, and crafted by professional designers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Modern", sub: "Tech & Startups", tag: "Most Popular", tagColor: "bg-violet-500/20 text-violet-300", gradient: "from-blue-600 to-blue-800", template: "modern" },
            { name: "Classic", sub: "Finance & Law", tag: "ATS #1", tagColor: "bg-blue-500/20 text-blue-300", gradient: "from-slate-600 to-slate-800", template: "classic" },
            { name: "Minimal", sub: "Design & Creative", tag: "Clean", tagColor: "bg-white/10 text-white/60", gradient: "from-gray-600 to-gray-800", template: "minimal" },
            { name: "Creative", sub: "Marketing & UX", tag: "Unique", tagColor: "bg-fuchsia-500/20 text-fuchsia-300", gradient: "from-purple-600 to-fuchsia-800", template: "classic" },
            { name: "Executive", sub: "C-Suite & Management", tag: "Premium", tagColor: "bg-amber-500/20 text-amber-300", gradient: "from-blue-700 to-cyan-800", template: "modern" },
            { name: "Slate", sub: "Engineering & Data", tag: "Dark Mode", tagColor: "bg-white/10 text-white/60", gradient: "from-slate-700 to-blue-900", template: "minimal" },
            { name: "Emerald", sub: "Product & Consulting", tag: "Vibrant", tagColor: "bg-emerald-500/20 text-emerald-300", gradient: "from-emerald-600 to-teal-800", template: "modern" },
          ].map(({ name, sub, tag, tagColor, gradient, template }) => (
            <Link key={name} href={`/templates`}>
              <div className="rounded-xl border border-white/5 bg-[#0f0f1a] overflow-hidden cursor-pointer hover:border-white/20 hover:scale-[1.02] transition-all group">
                <div className={`h-36 bg-gradient-to-br ${gradient} p-3 relative`}>
                  <span className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full ${tagColor} font-medium`}>{tag}</span>
                  <div className="mt-6 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-white/20" />
                      <div className="flex-1 space-y-1">
                        <div className="h-1.5 bg-white/30 rounded w-3/4" />
                        <div className="h-1 bg-white/20 rounded w-1/2" />
                      </div>
                    </div>
                    {[1,2,3].map(i => <div key={i} className={`h-1 bg-white/${20 - i*4} rounded w-full`} />)}
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-semibold text-white text-sm">{name}</div>
                  <div className="text-[11px] text-white/40">{sub}</div>
                </div>
              </div>
            </Link>
          ))}

          <button onClick={handleStartFree} className="rounded-xl border border-dashed border-white/10 bg-[#0f0f1a] overflow-hidden hover:border-white/20 hover:scale-[1.02] transition-all flex flex-col items-center justify-center gap-3 h-[calc(100%)] min-h-[180px]">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-white text-sm">Explore All</div>
              <div className="text-[11px] text-white/40">In the builder</div>
            </div>
          </button>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 mb-6">
            <CheckCircle2 className="w-3 h-3" /> Simple 3-Step Process
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            From Zero to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Hired in Minutes
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-violet-500/30 via-fuchsia-500/30 to-violet-500/30" />
          {[
            { step: "01", icon: FileText, title: "Enter Your Details", desc: "Fill your personal info, experience, education, skills. AI writes your professional summary in seconds.", color: "bg-violet-500" },
            { step: "02", icon: LayoutTemplate, title: "Pick Template & Style", desc: "Choose from 7 premium templates. Set accent color, font size, reorder sections by drag and drop.", color: "bg-fuchsia-500" },
            { step: "03", icon: Download, title: "Download Free PDF", desc: "Click Export PDF and get a crisp, A4-perfect, ATS-friendly resume ready to send to employers.", color: "bg-pink-500" },
          ].map(({ step, icon: Icon, title, desc, color }) => (
            <div key={step} className="rounded-2xl border border-white/5 bg-[#0f0f1a] p-8 text-center relative">
              <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${color} flex items-center justify-center text-xs font-bold`}>
                {step}
              </div>
              <div className={`w-16 h-16 rounded-2xl ${color}/10 border border-white/5 flex items-center justify-center mx-auto mb-6 mt-4`}>
                <Icon className={`w-8 h-8 text-white/60`} />
              </div>
              <h3 className="font-bold text-white text-lg mb-3">{title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="max-w-5xl mx-auto px-6 mb-32">
        <div className="rounded-2xl border border-white/5 bg-[#0f0f1a] p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 mb-6">
              <UserCheck className="w-3 h-3" /> About MahiCV-AI
            </div>
            <h2 className="text-4xl font-extrabold mb-2">
              Built by a Developer
            </h2>
            <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              For Every Professional
            </h2>
            <p className="text-white/40 leading-relaxed mb-4">
              MahiCV-AI was born from a simple frustration — great CV builders were either expensive, ugly, or required accounts. I built this to give every professional, fresh graduate, and career-changer a world-class resume tool that costs absolutely nothing.
            </p>
            <p className="text-white/40 leading-relaxed mb-8">
              Powered by the latest Groq LLaMA 3.3 AI, 7 hand-crafted templates, and privacy-first local storage — no data ever leaves your browser.
            </p>
            <div className="flex flex-wrap gap-2">
              {["React 19","Groq AI","TypeScript 5.9","Tailwind CSS 4","Express 5","Vite 7"].map(t => (
                <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50">{t}</span>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="rounded-2xl border border-white/10 bg-[#0a0a14] p-8 text-center w-72">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4 relative">
                JM
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#0a0a14] border border-white/10 flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-violet-400" />
                </div>
              </div>
              <div className="font-bold text-white text-lg mb-1">Jagdish Maliwad</div>
              <div className="text-violet-400 text-sm font-medium mb-1">Developer</div>
              <div className="text-white/30 text-xs mb-4">Full-Stack Developer · AI Enthusiast · MahiCV-AI</div>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                <span className="text-white/30 text-xs ml-2 self-center">Trusted by 50K+</span>
              </div>
              <div className="flex gap-2 justify-center">
                {["GitHub","LinkedIn","Twitter"].map(s => (
                  <span key={s} className="px-3 py-1 rounded-full border border-white/10 text-xs text-white/40">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-4xl mx-auto px-6 mb-24">
        <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-[#0f0f1a] to-[#120d1e] p-16 text-center">
          <div className="text-5xl mb-6">🚀</div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Your Dream Job<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Starts Here — Free
            </span>
          </h2>
          <p className="text-white/40 mb-10">
            No signup. No credit card. No limits. Just an incredible CV<br />in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-8">
            <button
              onClick={handleStartFree}
              disabled={createResume.isPending}
              className="rgb-btn px-8 py-3.5 font-semibold text-white text-sm disabled:opacity-60 flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Sparkles className="w-4 h-4" />
              Build My Free CV Now →
            </button>

            <Link href="/dashboard">
              <button className="px-8 py-3.5 rounded-xl font-semibold text-white/70 text-sm border border-white/15 bg-white/5 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Edit Existing CV
              </button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-white/30">
            {["No signup required","100% Free forever","Your data stays private","Instant PDF download"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm text-white/80">MahiCV-AI</span>
          </div>
          <p className="text-xs text-white/30">
            © 2026 MahiCV-AI · Built by <span className="text-white/50 font-medium">Jagdish Maliwad</span> · All rights reserved
          </p>
          <div className="flex gap-6 text-xs text-white/30">
            <Link href="/dashboard" className="hover:text-white/60 transition-colors">Builder</Link>
            <a href="#features" className="hover:text-white/60 transition-colors">Features</a>
            <a href="#about" className="hover:text-white/60 transition-colors">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
