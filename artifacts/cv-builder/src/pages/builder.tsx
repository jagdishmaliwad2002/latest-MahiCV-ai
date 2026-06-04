import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "wouter";
import { useGetResume, useUpdateResume, getGetResumeQueryKey } from "@workspace/api-client-react";
import { Loader2, Eye, Pencil, Download, Menu, X, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

import Sidebar from "@/components/builder/sidebar";
import SectionEditors from "@/components/builder/section-editors";
import RightPanel from "@/components/builder/right-panel";
import PreviewPanel from "@/components/builder/preview-panel";

const NAV_ITEMS = [
  { id: "personal", label: "Personal" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "achievements", label: "Achievements" },
  { id: "languages", label: "Languages" },
  { id: "custom", label: "Custom" },
];

export default function Builder() {
  const { id } = useParams();
  const resumeId = Number(id);
  const { data: resume, isLoading } = useGetResume(resumeId, { query: { enabled: !!resumeId, queryKey: getGetResumeQueryKey(resumeId) } });
  const updateResume = useUpdateResume();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [localData, setLocalData] = useState<any>(null);
  const initializedForId = useRef<number | null>(null);

  const [activeSection, setActiveSection] = useState("personal");
  const [rightTab, setRightTab] = useState("preview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mobile: "edit" | "preview" | "menu"
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [mobileSectionOpen, setMobileSectionOpen] = useState(false);

  // Theme & Style
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");

  // Sections visibility
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());

  // History
  const [history, setHistory] = useState<{ timestamp: number; data: any }[]>([]);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [savedText, setSavedText] = useState("Not saved yet");

  useEffect(() => {
    if (resumeId) {
      const stored = localStorage.getItem(`hidden_sections_${resumeId}`);
      if (stored) {
        try { setHiddenSections(new Set(JSON.parse(stored))); } catch {}
      }
      const historyStored = localStorage.getItem(`history_${resumeId}`);
      if (historyStored) {
        try { setHistory(JSON.parse(historyStored)); } catch {}
      }
    }
  }, [resumeId]);

  const saveHiddenSections = (newHidden: Set<string>) => {
    setHiddenSections(newHidden);
    localStorage.setItem(`hidden_sections_${resumeId}`, JSON.stringify(Array.from(newHidden)));
  };

  useEffect(() => {
    if (resume && initializedForId.current !== resumeId) {
      initializedForId.current = resumeId;
      setLocalData({
        title: resume.title || "Untitled Resume",
        template: resume.template || "classic",
        fullName: resume.fullName || "",
        jobTitle: resume.jobTitle || "",
        summary: resume.summary || "",
        photoUrl: resume.photoUrl || "",
        contact: resume.contact || { email: "", phone: "", location: "", linkedin: "", website: "", github: "" },
        workExperience: resume.workExperience || [],
        education: resume.education || [],
        skills: resume.skills || [],
        projects: resume.projects || [],
        certifications: resume.certifications || [],
        achievements: resume.achievements || [],
        languages: resume.languages || [],
        customSections: resume.customSections || [],
      });
    }
  }, [resume, resumeId]);

  const saveTimer = useRef<any>(null);

  const handleUpdate = useCallback((newData: any) => {
    setLocalData((prev: any) => {
      const updated = { ...prev, ...newData };
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        updateResume.mutate({ id: resumeId, data: updated }, {
          onSuccess: (serverData) => {
            queryClient.setQueryData(getGetResumeQueryKey(resumeId), (old: any) => old ? { ...old, ...serverData } : old);
            setSavedAt(Date.now());
            setHistory(prevHistory => {
              const newHistory = [{ timestamp: Date.now(), data: updated }, ...prevHistory].slice(0, 10);
              localStorage.setItem(`history_${resumeId}`, JSON.stringify(newHistory));
              return newHistory;
            });
          },
        });
      }, 1500);
      return updated;
    });
  }, [resumeId, updateResume, queryClient]);

  useEffect(() => {
    if (!savedAt) return;
    const update = () => {
      const diff = Math.floor((Date.now() - savedAt) / 1000);
      if (diff < 60) setSavedText(`Saved ${diff}s ago`);
      else if (diff < 3600) setSavedText(`Saved ${Math.floor(diff / 60)}m ago`);
      else setSavedText(`Saved ${Math.floor(diff / 3600)}h ago`);
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, [savedAt]);

  const handlePrint = () => window.print();

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const resetCV = () => {
    if (confirm("Reset all fields? History snapshots remain available.")) {
      handleUpdate({
        fullName: "", jobTitle: "", summary: "", photoUrl: "",
        contact: { email: "", phone: "", location: "", linkedin: "", website: "", github: "" },
        workExperience: [], education: [], skills: [], projects: [],
        certifications: [], achievements: [], languages: [], customSections: [],
      });
      toast({ title: "Resume reset" });
    }
  };

  const restoreHistory = (snapshotData: any) => {
    if (confirm("Restore this snapshot?")) {
      handleUpdate(snapshotData);
      toast({ title: "Snapshot restored" });
    }
  };

  if (isLoading || !localData) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const saveStatus = (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      {updateResume.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
      {updateResume.isPending ? "Saving…" : savedText}
    </span>
  );

  return (
    <>
      {/* ─── DESKTOP layout (md+) ─── */}
      <div className="hidden md:flex h-screen w-full overflow-hidden bg-background">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          resetCV={resetCV}
        />

        <div className={`flex flex-col border-r bg-muted/10 no-print transition-all duration-300 shrink-0 ${sidebarCollapsed ? "w-[480px]" : "w-[390px] xl:w-[430px]"}`}>
          <header className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-background/50 backdrop-blur">
            <h2 className="font-semibold capitalize text-lg">{activeSection}</h2>
            {saveStatus}
          </header>
          <div className="flex-1 overflow-y-auto p-4">
            <SectionEditors activeSection={activeSection} data={localData} onChange={handleUpdate} />
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 bg-muted/30 relative">
          <RightPanel
            activeTab={rightTab}
            setActiveTab={setRightTab}
            data={localData}
            onChange={handleUpdate}
            hiddenSections={hiddenSections}
            setHiddenSections={saveHiddenSections}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            history={history}
            restoreHistory={restoreHistory}
            handlePrint={handlePrint}
          />
        </div>
      </div>

      {/* ─── MOBILE layout (< md) ─── */}
      <div className="flex md:hidden flex-col h-screen w-full overflow-hidden bg-background">

        {/* Mobile top bar */}
        <header className="h-13 border-b flex items-center justify-between px-3 shrink-0 bg-background/80 backdrop-blur z-20 no-print">
          <div className="flex items-center gap-2">
            <Link href="/">
              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </Link>
            {mobileView === "edit" ? (
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-sm font-medium"
                onClick={() => setMobileSectionOpen(v => !v)}
              >
                <span className="capitalize">{activeSection}</span>
                <Menu className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-sm font-semibold">Preview</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {saveStatus}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        </header>

        {/* Mobile section picker overlay */}
        {mobileSectionOpen && (
          <div className="absolute inset-0 z-30 bg-black/40 no-print" onClick={() => setMobileSectionOpen(false)}>
            <div className="absolute top-13 left-0 right-0 bg-background border-b shadow-xl p-3" onClick={e => e.stopPropagation()}>
              <div className="flex flex-wrap gap-2">
                {NAV_ITEMS.map(item => (
                  <button
                    key={item.id}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeSection === item.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    onClick={() => { setActiveSection(item.id); setMobileSectionOpen(false); setMobileView("edit"); }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile main content */}
        <div className="flex-1 overflow-y-auto">
          {mobileView === "edit" ? (
            <div className="p-4 pb-24">
              <SectionEditors activeSection={activeSection} data={localData} onChange={handleUpdate} />
            </div>
          ) : (
            <div className="p-3 pb-24 preview-scale-wrapper">
              <div className="preview-scale-inner">
                <PreviewPanel data={localData} hiddenSections={hiddenSections} accentColor={accentColor} fontFamily={fontFamily} />
              </div>
            </div>
          )}
        </div>

        {/* Mobile bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur no-print">
          <div className="flex">
            <button
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${mobileView === "edit" ? "text-primary border-t-2 border-primary" : "text-muted-foreground"}`}
              onClick={() => setMobileView("edit")}
            >
              <Pencil className="w-5 h-5" />
              Edit
            </button>
            <button
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${mobileView === "preview" ? "text-primary border-t-2 border-primary" : "text-muted-foreground"}`}
              onClick={() => setMobileView("preview")}
            >
              <Eye className="w-5 h-5" />
              Preview
            </button>
            <button
              className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium text-muted-foreground"
              onClick={toggleDarkMode}
            >
              <span className="text-lg leading-none">{darkMode ? "☀️" : "🌙"}</span>
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </div>

      {/* Print target */}
      <div className="hidden print:block">
        <PreviewPanel data={localData} hiddenSections={hiddenSections} accentColor={accentColor} fontFamily={fontFamily} />
      </div>
    </>
  );
}
