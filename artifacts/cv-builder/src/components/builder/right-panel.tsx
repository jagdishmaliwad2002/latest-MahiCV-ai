import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, LayoutTemplate, Palette, History, Award, CheckCircle2, Star, SaveAll, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import PreviewPanel from "@/components/builder/preview-panel";
import { useScoreResume } from "@workspace/api-client-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

export default function RightPanel({ activeTab, setActiveTab, data, onChange, hiddenSections, setHiddenSections, accentColor, setAccentColor, fontFamily, setFontFamily, history, restoreHistory, handlePrint }: RightPanelProps) {
  
  const scoreResume = useScoreResume();
  const [scoreData, setScoreData] = useState<any>(null);

  const toggleSectionVisibility = (sectionKey: string) => {
    const next = new Set(hiddenSections);
    if (next.has(sectionKey)) next.delete(sectionKey);
    else next.add(sectionKey);
    setHiddenSections(next);
  };

  const handleScore = () => {
    scoreResume.mutate({ data: { resumeData: data } }, {
      onSuccess: (res) => setScoreData(res)
    });
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
    { id: "classic", name: "Classic" },
    { id: "modern", name: "Modern" },
    { id: "minimal", name: "Minimal" }
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-background/50 backdrop-blur z-10 no-print">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="h-full bg-transparent p-0 gap-4">
            <TabsTrigger value="preview" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none h-full px-2">Preview</TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none h-full px-2">Templates</TabsTrigger>
            <TabsTrigger value="sections" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none h-full px-2">Sections</TabsTrigger>
            <TabsTrigger value="style" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none h-full px-2">Style</TabsTrigger>
            <TabsTrigger value="score" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none h-full px-2">Score</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none h-full px-2">History</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={handlePrint} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="w-4 h-4 mr-2" /> Export PDF
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto print:overflow-visible">
        {/* PREVIEW TAB */}
        <div className={`min-h-full p-4 md:p-8 flex justify-center items-start print:p-0 ${activeTab === 'preview' ? 'block' : 'hidden print:block'}`}>
          <PreviewPanel data={data} hiddenSections={hiddenSections} accentColor={accentColor} fontFamily={fontFamily} />
        </div>

        {/* TEMPLATES TAB */}
        {activeTab === "templates" && (
          <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h3 className="text-lg font-semibold">Choose Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map(t => (
                <div 
                  key={t.id} 
                  className={`border-2 rounded-xl p-2 cursor-pointer transition-all hover:border-primary/50 ${data.template === t.id ? 'border-primary shadow-md bg-primary/5' : 'border-transparent bg-background shadow-sm'}`}
                  onClick={() => onChange({ template: t.id })}
                >
                  <div className="aspect-[1/1.4] bg-muted rounded-md mb-3 flex items-center justify-center relative overflow-hidden">
                    {/* Placeholder abstract representations of templates */}
                    {t.id === "classic" && <div className="w-3/4 h-3/4 flex flex-col gap-2 opacity-50"><div className="w-full h-4 bg-slate-400 mx-auto rounded-sm mb-2" /><div className="w-full h-2 bg-slate-300 rounded-sm" /><div className="w-full h-2 bg-slate-300 rounded-sm" /></div>}
                    {t.id === "modern" && <div className="w-full h-full flex flex-col opacity-50"><div className="w-full h-1/4 bg-blue-400 mb-2" /><div className="flex-1 px-4"><div className="w-full h-2 bg-slate-400 rounded-sm mb-2" /><div className="w-1/2 h-2 bg-slate-300 rounded-sm" /></div></div>}
                    {t.id === "minimal" && <div className="w-3/4 h-3/4 flex flex-col gap-4 opacity-50 items-start pt-4"><div className="w-1/2 h-3 bg-slate-400 rounded-sm" /><div className="w-3/4 h-2 bg-slate-300 rounded-sm" /></div>}
                    
                    {data.template === t.id && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <p className="text-center font-medium">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTIONS TAB */}
        {activeTab === "sections" && (
          <div className="p-6 max-w-2xl mx-auto space-y-6">
            <h3 className="text-lg font-semibold">Visibility Configuration</h3>
            <p className="text-sm text-muted-foreground mb-6">Toggle sections to show or hide them in the preview and exported PDF.</p>
            
            <div className="bg-background border rounded-xl divide-y">
              {sectionsList.map(sec => (
                <div key={sec.key} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <Label htmlFor={`hide-${sec.key}`} className="text-base cursor-pointer flex-1">{sec.label}</Label>
                  <Switch 
                    id={`hide-${sec.key}`} 
                    checked={!hiddenSections.has(sec.key)} 
                    onCheckedChange={() => toggleSectionVisibility(sec.key)} 
                  />
                </div>
              ))}
              
              {data.customSections?.map((cSec: any) => (
                <div key={cSec.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <Label htmlFor={`hide-custom-${cSec.id}`} className="text-base cursor-pointer flex-1">{cSec.heading || "Custom Section"}</Label>
                  <Switch 
                    id={`hide-custom-${cSec.id}`} 
                    checked={!hiddenSections.has(`custom-${cSec.id}`)} 
                    onCheckedChange={() => toggleSectionVisibility(`custom-${cSec.id}`)} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STYLE TAB */}
        {activeTab === "style" && (
          <div className="p-6 max-w-2xl mx-auto space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Accent Color</h3>
              <div className="flex flex-wrap gap-4">
                {colors.map(c => (
                  <button
                    key={c.value}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-transform hover:scale-110 ${accentColor === c.value ? 'ring-2 ring-offset-2 ring-foreground scale-110' : ''}`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => setAccentColor(c.value)}
                    title={c.name}
                  >
                    {accentColor === c.value && <CheckCircle2 className="w-5 h-5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Typography</h3>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
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

        {/* SCORE TAB */}
        {activeTab === "score" && (
          <div className="p-6 max-w-3xl mx-auto space-y-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
              <h2 className="text-2xl font-bold">Resume Score</h2>
              <p className="text-muted-foreground max-w-md">Get instant AI feedback on your resume content, formatting, and impact.</p>
              <Button onClick={handleScore} disabled={scoreResume.isPending} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0" size="lg">
                {scoreResume.isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <Star className="w-5 h-5 mr-2" />}
                {scoreData ? "Rescore Resume" : "Score My Resume"}
              </Button>
            </div>

            {scoreData && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-card border rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-8">
                  <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle className="text-muted stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                      <circle 
                        className={`${scoreData.overallScore >= 80 ? 'text-green-500' : scoreData.overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'} stroke-current transition-all duration-1000 ease-in-out`} 
                        strokeWidth="8" 
                        strokeLinecap="round" 
                        cx="50" cy="50" r="40" fill="transparent" 
                        strokeDasharray={`${(scoreData.overallScore / 100) * 251.2} 251.2`}
                      ></circle>
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl font-black">{scoreData.overallScore}</span>
                      <span className="text-xs text-muted-foreground">/ 100</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <h3 className="text-2xl font-bold">Grade: {scoreData.letterGrade}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{scoreData.summaryText}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Category Breakdown</h4>
                  <Accordion type="single" collapsible className="w-full space-y-3">
                    {scoreData.categories?.map((cat: any, i: number) => (
                      <AccordionItem key={i} value={`cat-${i}`} className="bg-card border rounded-xl px-4 py-1 data-[state=open]:shadow-sm">
                        <AccordionTrigger className="hover:no-underline flex flex-col items-stretch space-y-3 pb-3">
                          <div className="flex justify-between items-center w-full">
                            <span className="font-semibold">{cat.name}</span>
                            <span className="font-medium">{cat.score}/{cat.maxScore}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden flex-1 relative">
                            <div className="bg-primary h-full absolute left-0 top-0 transition-all duration-500" style={{ width: `${(cat.score / cat.maxScore) * 100}%` }} />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 text-muted-foreground space-y-2 pl-2">
                          <ul className="list-disc list-inside space-y-1">
                            {cat.tips?.map((tip: string, j: number) => (
                              <li key={j}>{tip}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div className="p-6 max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <History className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Local Save History</h3>
            </div>
            
            {history.length === 0 ? (
              <div className="text-center p-12 bg-muted/30 border rounded-xl border-dashed">
                <p className="text-muted-foreground">No history yet. Changes are auto-saved locally.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((snapshot, idx) => {
                  const date = new Date(snapshot.timestamp);
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div>
                        <p className="font-medium text-sm">Autosave</p>
                        <p className="text-xs text-muted-foreground">{date.toLocaleString()}</p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => restoreHistory(snapshot.data)}>
                        <RotateCcw className="w-4 h-4 mr-2" /> Restore
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
