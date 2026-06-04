import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, CheckCircle2, Star, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PreviewPanel from "@/components/builder/preview-panel";
import { useScoreResume } from "@workspace/api-client-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const A4_WIDTH = 816; // 8.5in × 96dpi

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

/** Measures its container and scales the A4 sheet to fill it */
function ScaledPreview({ data, hiddenSections, accentColor, fontFamily }: { data: any; hiddenSections: Set<string>; accentColor: string; fontFamily: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      const h = entries[0].contentRect.height;
      // Fit width first, then cap by height if needed
      const byW = (w - 32) / A4_WIDTH;
      const byH = (h - 32) / 1056; // 11in × 96dpi
      setScale(Math.min(1, byW, byH > 0.1 ? byH : byW));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scaledH = Math.round(1056 * scale);

  return (
    <div
      ref={wrapperRef}
      className="flex-1 overflow-auto flex flex-col items-center justify-start p-4 bg-muted/20"
    >
      {/* container sized to the scaled page so scroll works naturally */}
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

  const toggleSection = (key: string) => {
    const next = new Set(hiddenSections);
    next.has(key) ? next.delete(key) : next.add(key);
    setHiddenSections(next);
  };

  const sectionsList = [
    { key: "summary", label: "Professional Summary" },
    { key: "experience", label: "Work Experience" },
    { key: "education", label: "Education" },
    { key: "skills", label: "Skills" },
    { key: "projects", label: "Projects" },
    { key: "certifications", label: "Certifications" },
    { key: "achievements", label: "Achievements" },
    { key: "languages", label: "Languages" },
  ];

  const colors = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Teal", value: "#14b8a6" },
    { name: "Violet", value: "#8b5cf6" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Orange", value: "#f97316" },
    { name: "Slate", value: "#475569" },
  ];

  const fonts = [
    { name: "Inter (Sans)", value: "Inter, sans-serif" },
    { name: "Georgia (Serif)", value: "Georgia, serif" },
    { name: "Courier (Mono)", value: "Courier New, monospace" },
  ];

  const templates = [
    { id: "classic", name: "Classic", desc: "Finance & Law" },
    { id: "modern", name: "Modern", desc: "Tech & Startups" },
    { id: "minimal", name: "Minimal", desc: "Design & Creative" },
  ];

  const TABS = [
    { value: "preview", label: "Preview" },
    { value: "templates", label: "Templates" },
    { value: "sections", label: "Sections" },
    { value: "style", label: "Style" },
    { value: "score", label: "Score" },
    { value: "history", label: "History" },
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

      {/* ── Content (fills remaining height) ── */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">

        {/* PREVIEW — always mounted, shown/hidden via CSS so ResizeObserver stays alive */}
        <div className={`flex-1 flex flex-col min-h-0 ${activeTab === "preview" ? "flex" : "hidden"} print:flex`}>
          <ScaledPreview
            data={data}
            hiddenSections={hiddenSections}
            accentColor={accentColor}
            fontFamily={fontFamily}
          />
        </div>

        {/* TEMPLATES */}
        {activeTab === "templates" && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <h3 className="text-base font-semibold">Choose Template</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {templates.map(t => (
                <button
                  key={t.id}
                  className={`border-2 rounded-xl p-3 cursor-pointer transition-all hover:border-primary/50 text-left ${data.template === t.id ? "border-primary bg-primary/5 shadow-sm" : "border-muted bg-background"}`}
                  onClick={() => onChange({ template: t.id })}
                >
                  <div className="aspect-[1/1.3] bg-muted rounded-md mb-3 flex items-center justify-center relative overflow-hidden">
                    {t.id === "classic" && <div className="w-3/4 h-3/4 flex flex-col gap-2 opacity-50"><div className="w-full h-4 bg-slate-400 rounded-sm mb-2" /><div className="w-full h-2 bg-slate-300 rounded-sm" /><div className="w-full h-2 bg-slate-300 rounded-sm" /></div>}
                    {t.id === "modern" && <div className="w-full h-full flex flex-col opacity-50"><div className="w-full h-1/4 rounded-sm mb-2" style={{ backgroundColor: accentColor }} /><div className="flex-1 px-4"><div className="w-full h-2 bg-slate-400 rounded-sm mb-2" /><div className="w-1/2 h-2 bg-slate-300 rounded-sm" /></div></div>}
                    {t.id === "minimal" && <div className="w-3/4 h-3/4 flex flex-col gap-4 opacity-50 items-start pt-4"><div className="w-1/2 h-3 bg-slate-400 rounded-sm" /><div className="w-3/4 h-2 bg-slate-300 rounded-sm" /></div>}
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
          <div className="flex-1 overflow-y-auto p-5 space-y-8 max-w-lg">
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Accent Color</h3>
              <div className="flex flex-wrap gap-4">
                {colors.map(c => (
                  <button
                    key={c.value}
                    className={`w-11 h-11 rounded-full flex items-center justify-center shadow-sm transition-transform hover:scale-110 ${accentColor === c.value ? "ring-2 ring-offset-2 ring-foreground scale-110" : ""}`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => setAccentColor(c.value)}
                    title={c.name}
                  >
                    {accentColor === c.value && <CheckCircle2 className="w-5 h-5 text-white" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Font Family</h3>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger className="w-full sm:w-[280px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {fonts.map(f => (
                    <SelectItem key={f.value} value={f.value}>
                      <span style={{ fontFamily: f.value }}>{f.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* SCORE */}
        {activeTab === "score" && (
          <div className="flex-1 overflow-y-auto p-5 max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-xl font-bold">AI Resume Score</h2>
              <p className="text-sm text-muted-foreground">Instant AI feedback on content, formatting, and impact.</p>
              <Button onClick={() => scoreResume.mutate({ data: { resumeData: data } }, { onSuccess: setScoreData })} disabled={scoreResume.isPending} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
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
