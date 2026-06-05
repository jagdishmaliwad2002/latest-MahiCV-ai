import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, CheckCircle2, Star, Loader2, RotateCcw, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PreviewPanel from "@/components/builder/preview-panel";
import { useScoreResume } from "@workspace/api-client-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const A4_WIDTH = 816;

interface RightPanelProps {
  activeTab: string;
  setActiveTab: (t: string) => void;
  data: any;
  onChange: (d: any) => void;
  hiddenSections: Set<string>;
  setHiddenSections: (s: Set<string>) => void;
  accentColor: string;
  setAccentColor: (c: string) => void;
  fontFamily: string;
  setFontFamily: (f: string) => void;
  history: any[];
  restoreHistory: (d: any) => void;
  handlePrint: () => void;
}

function ScaledPreview({ data, hiddenSections, accentColor, fontFamily }: { data: any; hiddenSections: Set<string>; accentColor: string; fontFamily: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      const h = entries[0].contentRect.height;
      const byW = (w - 32) / A4_WIDTH;
      const byH = (h - 32) / 1056;
      setScale(Math.min(1, byW, byH > 0.1 ? byH : byW));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scaledH = Math.round(1056 * scale);

  return (
    <div ref={wrapperRef} className="flex-1 overflow-auto flex flex-col items-center justify-start p-4 bg-muted/20">
      <div style={{ width: A4_WIDTH * scale, height: scaledH, flexShrink: 0, position: "relative" }}>
        <div style={{ transformOrigin: "top left", transform: `scale(${scale})`, width: A4_WIDTH, position: "absolute", top: 0, left: 0 }}>
          <PreviewPanel data={data} hiddenSections={hiddenSections} accentColor={accentColor} fontFamily={fontFamily} />
        </div>
      </div>
    </div>
  );
}

export default function RightPanel({
  activeTab, setActiveTab, data, onChange,
  hiddenSections, setHiddenSections,
  accentColor, setAccentColor,
  fontFamily, setFontFamily,
  history, restoreHistory, handlePrint,
}: RightPanelProps) {
  const scoreResume = useScoreResume();
  const [scoreData, setScoreData] = useState<any>(null);
  const [customColor, setCustomColor] = useState(accentColor);

  const toggleSection = (key: string) => {
    const next = new Set(hiddenSections);
    next.has(key) ? next.delete(key) : next.add(key);
    setHiddenSections(next);
  };

  const sectionsList = [
    { key: "summary",        label: "Professional Summary" },
    { key: "experience",     label: "Work Experience" },
    { key: "education",      label: "Education" },
    { key: "skills",         label: "Skills" },
    { key: "projects",       label: "Projects" },
    { key: "certifications", label: "Certifications" },
    { key: "achievements",   label: "Achievements" },
    { key: "languages",      label: "Languages" },
  ];

  /* ── Color palette — 18 presets ── */
  const colors = [
    { name: "Indigo",      value: "#3b82f6" },
    { name: "Teal",        value: "#14b8a6" },
    { name: "Violet",      value: "#8b5cf6" },
    { name: "Rose",        value: "#f43f5e" },
    { name: "Orange",      value: "#f97316" },
    { name: "Slate",       value: "#475569" },
    { name: "Emerald",     value: "#10b981" },
    { name: "Amber",       value: "#f59e0b" },
    { name: "Cyan",        value: "#06b6d4" },
    { name: "Fuchsia",     value: "#d946ef" },
    { name: "Red",         value: "#ef4444" },
    { name: "Sky",         value: "#0ea5e9" },
    { name: "Lime",        value: "#84cc16" },
    { name: "Pink",        value: "#ec4899" },
    { name: "Warm Gray",   value: "#78716c" },
    { name: "Navy",        value: "#1e3a8a" },
    { name: "Forest",      value: "#15803d" },
    { name: "Black",       value: "#111111" },
  ];

  const fonts = [
    { name: "Inter (Sans)",       value: "Inter, sans-serif" },
    { name: "Georgia (Serif)",    value: "Georgia, serif" },
    { name: "Courier (Mono)",     value: "Courier New, monospace" },
    { name: "Times New Roman",    value: "'Times New Roman', serif" },
    { name: "Arial",              value: "Arial, sans-serif" },
    { name: "Garamond",           value: "Garamond, serif" },
  ];

  const templates = [
    { id: "classic",   name: "Classic",   desc: "Finance & Law" },
    { id: "modern",    name: "Modern",    desc: "Tech & Startups" },
    { id: "minimal",   name: "Minimal",   desc: "Design & Creative" },
    { id: "executive", name: "Executive", desc: "DevOps & Enterprise" },
  ];

  const TABS = [
    { value: "preview",   label: "Preview" },
    { value: "templates", label: "Templates" },
    { value: "sections",  label: "Sections" },
    { value: "style",     label: "Style" },
    { value: "score",     label: "Score" },
    { value: "history",   label: "History" },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* ── Tab bar ── */}
      <div className="border-b shrink-0 bg-background/60 backdrop-blur z-10 no-print">
        <div className="flex items-center h-14 px-2 gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
            <TabsList className="h-10 bg-transparent p-0 gap-0.5 flex flex-nowrap overflow-x-auto scrollbar-none">
              {TABS.map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-3 h-8 text-xs font-medium whitespace-nowrap shrink-0"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <button
            onClick={handlePrint}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span> PDF
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">

        {/* PREVIEW */}
        <div className={`flex-1 flex flex-col min-h-0 ${activeTab === "preview" ? "flex" : "hidden"}`}>
          <ScaledPreview data={data} hiddenSections={hiddenSections} accentColor={accentColor} fontFamily={fontFamily} />
        </div>

        {/* TEMPLATES */}
        {activeTab === "templates" && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <h3 className="text-base font-semibold">Choose Template</h3>
            <div className="grid grid-cols-2 gap-4">
              {templates.map(t => (
                <button
                  key={t.id}
                  className={`border-2 rounded-xl p-3 cursor-pointer transition-all hover:border-primary/50 text-left ${data.template === t.id ? "border-primary bg-primary/5 shadow-sm" : "border-muted bg-background"}`}
                  onClick={() => onChange({ template: t.id })}
                >
                  <div className="aspect-[1/1.3] bg-muted rounded-md mb-3 flex items-center justify-center relative overflow-hidden">
                    {/* Classic thumbnail */}
                    {t.id === "classic" && (
                      <div className="w-3/4 h-3/4 flex flex-col gap-2 opacity-60">
                        <div className="text-center">
                          <div className="w-1/2 h-3 bg-slate-500 rounded mx-auto mb-1" style={{ backgroundColor: accentColor }} />
                          <div className="w-full h-px bg-slate-300 mb-2" style={{ backgroundColor: accentColor }} />
                        </div>
                        <div className="w-full h-2 bg-slate-300 rounded" />
                        <div className="w-4/5 h-2 bg-slate-300 rounded" />
                      </div>
                    )}
                    {/* Modern thumbnail */}
                    {t.id === "modern" && (
                      <div className="w-full h-full flex flex-col opacity-70">
                        <div className="w-full h-1/4 mb-2" style={{ backgroundColor: accentColor }} />
                        <div className="flex-1 px-4 space-y-1.5">
                          <div className="w-full h-2 bg-slate-300 rounded" />
                          <div className="w-1/2 h-2 bg-slate-300 rounded" />
                        </div>
                      </div>
                    )}
                    {/* Minimal thumbnail */}
                    {t.id === "minimal" && (
                      <div className="w-3/4 h-3/4 flex flex-col gap-3 opacity-60 pt-2">
                        <div className="w-1/2 h-2.5 rounded" style={{ backgroundColor: accentColor }} />
                        <div className="w-full h-1.5 bg-slate-300 rounded" />
                        <div className="w-4/5 h-1.5 bg-slate-300 rounded" />
                      </div>
                    )}
                    {/* Executive thumbnail */}
                    {t.id === "executive" && (
                      <div className="w-full h-full flex flex-col px-3 pt-3 gap-2 opacity-70">
                        <div className="flex justify-between items-start">
                          <div className="w-2/5 h-3 bg-slate-700 rounded" />
                          <div className="w-1/3 space-y-1">
                            <div className="h-1.5 bg-slate-300 rounded" />
                            <div className="h-1.5 bg-slate-300 rounded" />
                          </div>
                        </div>
                        <div className="w-full h-0.5 rounded" style={{ backgroundColor: accentColor }} />
                        <div className="space-y-1">
                          <div className="w-1/3 h-1.5 bg-slate-500 rounded" />
                          <div className="w-full h-1.5 bg-slate-200 rounded" />
                          <div className="w-4/5 h-1.5 bg-slate-200 rounded" />
                        </div>
                      </div>
                    )}
                    {data.template === t.id && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SECTIONS */}
        {activeTab === "sections" && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div>
              <h3 className="text-base font-semibold">Section Visibility</h3>
              <p className="text-sm text-muted-foreground mt-1">Toggle sections to show or hide them in the preview and PDF.</p>
            </div>
            <div className="bg-background border rounded-xl divide-y">
              {sectionsList.map(sec => (
                <div key={sec.key} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <Label htmlFor={`hide-${sec.key}`} className="cursor-pointer flex-1 text-sm">{sec.label}</Label>
                  <Switch id={`hide-${sec.key}`} checked={!hiddenSections.has(sec.key)} onCheckedChange={() => toggleSection(sec.key)} />
                </div>
              ))}
              {data.customSections?.map((cSec: any) => (
                <div key={cSec.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <Label htmlFor={`hide-cs-${cSec.id}`} className="cursor-pointer flex-1 text-sm">{cSec.heading || "Custom Section"}</Label>
                  <Switch id={`hide-cs-${cSec.id}`} checked={!hiddenSections.has(`custom-${cSec.id}`)} onCheckedChange={() => toggleSection(`custom-${cSec.id}`)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STYLE */}
        {activeTab === "style" && (
          <div className="flex-1 overflow-y-auto p-5 space-y-8">

            {/* Color palette */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Palette className="w-4 h-4 text-muted-foreground" />
                Accent Color
              </h3>

              {/* Preset swatches */}
              <div className="flex flex-wrap gap-2.5">
                {colors.map(c => (
                  <button
                    key={c.value}
                    className={`w-9 h-9 rounded-full shadow-sm transition-all hover:scale-110 focus:outline-none ${accentColor === c.value ? "ring-2 ring-offset-2 ring-foreground scale-110" : ""}`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => { setAccentColor(c.value); setCustomColor(c.value); }}
                    title={c.name}
                  >
                    {accentColor === c.value && (
                      <CheckCircle2 className="w-4 h-4 text-white mx-auto" />
                    )}
                  </button>
                ))}
              </div>

              {/* Custom color picker */}
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border">
                <div className="relative shrink-0">
                  <input
                    type="color"
                    value={customColor}
                    onChange={e => { setCustomColor(e.target.value); setAccentColor(e.target.value); }}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0.5 bg-transparent"
                    title="Custom color"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground mb-1 block">Custom Hex Color</Label>
                  <input
                    type="text"
                    value={customColor}
                    onChange={e => {
                      const val = e.target.value;
                      setCustomColor(val);
                      if (/^#[0-9A-Fa-f]{6}$/.test(val)) setAccentColor(val);
                    }}
                    placeholder="#3b82f6"
                    className="w-full h-8 px-2 text-sm font-mono border rounded-md bg-background focus:outline-none focus:ring-2 ring-primary"
                    maxLength={7}
                  />
                </div>
                <div
                  className="w-10 h-10 rounded-lg border shadow-inner shrink-0"
                  style={{ backgroundColor: accentColor }}
                  title="Current color preview"
                />
              </div>
            </div>

            {/* Font family */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Font Family</h3>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger className="w-full sm:w-[300px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {fonts.map(f => (
                    <SelectItem key={f.value} value={f.value}>
                      <span style={{ fontFamily: f.value }}>{f.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Live color preview banner */}
            <div className="rounded-xl overflow-hidden border shadow-sm">
              <div className="h-10 w-full" style={{ backgroundColor: accentColor }} />
              <div className="p-3 bg-background text-center">
                <span className="text-sm font-semibold" style={{ color: accentColor }}>Preview · {accentColor}</span>
                <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily }}>This color and font will apply to your CV</p>
              </div>
            </div>
          </div>
        )}

        {/* SCORE */}
        {activeTab === "score" && (
          <div className="flex-1 overflow-y-auto p-5 max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-xl font-bold">AI Resume Score</h2>
              <p className="text-sm text-muted-foreground">Instant AI feedback on content, formatting, and impact.</p>
              <Button
                onClick={() => scoreResume.mutate({ data: { resumeData: data } }, { onSuccess: setScoreData })}
                disabled={scoreResume.isPending}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0"
              >
                {scoreResume.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Star className="w-4 h-4 mr-2" />}
                {scoreData ? "Re-Score" : "Score My Resume"}
              </Button>
            </div>
            {scoreData && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5">
                <div className="bg-card border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle className="text-muted stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
                      <circle
                        className={`${scoreData.overallScore >= 80 ? "text-green-500" : scoreData.overallScore >= 60 ? "text-yellow-500" : "text-red-500"} stroke-current`}
                        strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent"
                        strokeDasharray={`${(scoreData.overallScore / 100) * 251.2} 251.2`}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-black">{scoreData.overallScore}</span>
                      <span className="text-xs text-muted-foreground">/ 100</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold mb-1">Grade: {scoreData.letterGrade}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{scoreData.summaryText}</p>
                  </div>
                </div>
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {scoreData.categories?.map((cat: any, i: number) => (
                    <AccordionItem key={i} value={`cat-${i}`} className="bg-card border rounded-xl px-4 py-1">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex flex-col w-full gap-1.5 pr-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold text-left">{cat.name}</span>
                            <span className="font-medium ml-2">{cat.score}/{cat.maxScore}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${(cat.score / cat.maxScore) * 100}%` }} />
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 text-muted-foreground">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {cat.tips?.map((tip: string, j: number) => <li key={j}>{tip}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
        )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <div className="flex-1 overflow-y-auto p-5 max-w-lg mx-auto space-y-4">
            <h3 className="text-base font-semibold">Save History</h3>
            {history.length === 0 ? (
              <div className="text-center p-10 border rounded-xl border-dashed">
                <p className="text-sm text-muted-foreground">No snapshots yet — changes auto-save after 1.5s.</p>
              </div>
            ) : history.map((snap, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-card border rounded-xl shadow-sm">
                <div>
                  <p className="font-medium text-sm">Autosave #{history.length - idx}</p>
                  <p className="text-xs text-muted-foreground">{new Date(snap.timestamp).toLocaleString()}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => restoreHistory(snap.data)}>
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />Restore
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
