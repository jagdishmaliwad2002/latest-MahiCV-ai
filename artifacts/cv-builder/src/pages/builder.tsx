import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "wouter";
import { useGetResume, useUpdateResume, getGetResumeQueryKey } from "@workspace/api-client-react";
import { Loader2, Eye, Pencil, Download, Menu, ChevronLeft, GripVertical } from "lucide-react";
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

const EDITOR_MIN = 240;
const EDITOR_MAX = 0.72; // fraction of viewport width
const EDITOR_DEFAULT = 420;

export default function Builder() {
  const { id } = useParams();
  const resumeId = Number(id);
  const { data: resume, isLoading } = useGetResume(resumeId, {
    query: { enabled: !!resumeId, queryKey: getGetResumeQueryKey(resumeId) },
  });
  const updateResume = useUpdateResume();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [localData, setLocalData] = useState<any>(null);
  const initializedForId = useRef<number | null>(null);

  const [activeSection, setActiveSection] = useState("personal");
  const [rightTab, setRightTab] = useState("preview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ── Resizable split ──────────────────────────────────────
  const [editorWidth, setEditorWidth] = useState(EDITOR_DEFAULT);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartW = useRef(EDITOR_DEFAULT);

  const onDividerDown = useCallback((clientX: number) => {
    dragging.current = true;
    dragStartX.current = clientX;
    dragStartW.current = editorWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [editorWidth]);

  useEffect(() => {
    const move = (clientX: number) => {
      if (!dragging.current) return;
      const delta = clientX - dragStartX.current;
      const max = window.innerWidth * EDITOR_MAX;
      setEditorWidth(Math.max(EDITOR_MIN, Math.min(max, dragStartW.current + delta)));
    };
    const up = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    const onMouseMove = (e: MouseEvent) => move(e.clientX);
    const onTouchMove = (e: TouchEvent) => move(e.touches[0].clientX);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", up);
    };
  }, []);

  // ── Mobile ────────────────────────────────────────────────
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [mobileSectionOpen, setMobileSectionOpen] = useState(false);

  // ── Theme & Style ─────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());

  // ── History ───────────────────────────────────────────────
  const [history, setHistory] = useState<{ timestamp: number; data: any }[]>([]);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [savedText, setSavedText] = useState("Not saved yet");

  useEffect(() => {
    if (resumeId) {
      const stored = localStorage.getItem(`hidden_sections_${resumeId}`);
      if (stored) { try { setHiddenSections(new Set(JSON.parse(stored))); } catch {} }
      const hs = localStorage.getItem(`history_${resumeId}`);
      if (hs) { try { setHistory(JSON.parse(hs)); } catch {} }
    }
  }, [resumeId]);

  const saveHiddenSections = (s: Set<string>) => {
    setHiddenSections(s);
    localStorage.setItem(`hidden_sections_${resumeId}`, JSON.stringify(Array.from(s)));
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
            queryClient.setQueryData(getGetResumeQueryKey(resumeId), (old: any) =>
              old ? { ...old, ...serverData } : old
            );
            setSavedAt(Date.now());
            setHistory(prev => {
              const next = [{ timestamp: Date.now(), data: updated }, ...prev].slice(0, 10);
              localStorage.setItem(`history_${resumeId}`, JSON.stringify(next));
              return next;
            });
          },
        });
      }, 1500);
      return updated;
    });
  }, [resumeId, updateResume, queryClient]);

  useEffect(() => {
    if (!savedAt) return;
    const tick = () => {
      const d = Math.floor((Date.now() - savedAt) / 1000);
      setSavedText(d < 60 ? `Saved ${d}s ago` : d < 3600 ? `Saved ${Math.floor(d / 60)}m ago` : `Saved ${Math.floor(d / 3600)}h ago`);
    };
    tick();
    const t = setInterval(tick, 10000);
    return () => clearInterval(t);
  }, [savedAt]);

  const handlePrint = () => window.print();
  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };
  const resetCV = () => {
    if (confirm("Reset all fields?")) {
      handleUpdate({
        fullName: "", jobTitle: "", summary: "", photoUrl: "",
        contact: { email: "", phone: "", location: "", linkedin: "", website: "", github: "" },
        workExperience: [], education: [], skills: [], projects: [],
        certifications: [], achievements: [], languages: [], customSections: [],
      });
      toast({ title: "Resume reset" });
    }
  };
  const restoreHistory = (d: any) => {
    if (confirm("Restore this snapshot?")) { handleUpdate(d); toast({ title: "Snapshot restored" }); }
  };

  if (isLoading || !localData) {
    return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const saveStatus = (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      {updateResume.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
      {updateResume.isPending ? "Saving…" : savedText}
    </span>
  );

  const commonPanelProps = {
    data: localData, hiddenSections, accentColor, fontFamily,
  };

  return (
    <>
      {/* ══════════ DESKTOP (md+) ══════════ */}
      <div className="hidden md:flex h-screen w-full overflow-hidden bg-background select-none">

        {/* Left nav sidebar */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          resetCV={resetCV}
        />

        {/* ── Editor panel (resizable) ── */}
        <div
          className="flex flex-col border-r bg-muted/10 no-print shrink-0 overflow-hidden"
          style={{ width: editorWidth }}
        >
          <header className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-background/60 backdrop-blur">
            <h2 className="font-semibold capitalize">{activeSection}</h2>
            {saveStatus}
          </header>
          <div className="flex-1 overflow-y-auto p-4">
            <SectionEditors activeSection={activeSection} data={localData} onChange={handleUpdate} />
          </div>
        </div>

        {/* ── Drag handle ── */}
        <div
          className="relative flex items-center justify-center w-2 shrink-0 cursor-col-resize group no-print z-10"
          style={{ touchAction: "none" }}
          onMouseDown={e => { e.preventDefault(); onDividerDown(e.clientX); }}
          onTouchStart={e => onDividerDown(e.touches[0].clientX)}
          onDoubleClick={() => setEditorWidth(EDITOR_DEFAULT)}
          title="Drag to resize · Double-click to reset"
        >
          {/* track line */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-border group-hover:bg-primary/60 transition-colors" />
          {/* grip pill */}
          <div className="relative z-10 flex flex-col items-center justify-center w-5 h-10 rounded-full bg-background border shadow-sm group-hover:bg-primary/10 group-hover:border-primary/50 transition-all">
            <GripVertical className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>

        {/* ── Preview / right panel (fills rest) ── */}
        <div className="flex-1 flex flex-col min-w-0 bg-muted/30 relative overflow-hidden">
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

      {/* ══════════ MOBILE (< md) ══════════ */}
      <div className="flex md:hidden flex-col h-screen w-full overflow-hidden bg-background">

        {/* Top bar */}
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

        {/* Section picker overlay */}
        {mobileSectionOpen && (
          <div className="absolute inset-0 z-30 bg-black/40 no-print" onClick={() => setMobileSectionOpen(false)}>
            <div className="absolute top-13 left-0 right-0 bg-background border-b shadow-xl p-3" onClick={e => e.stopPropagation()}>
              <div className="flex flex-wrap gap-2">
                {NAV_ITEMS.map(item => (
                  <button
                    key={item.id}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeSection === item.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                    onClick={() => { setActiveSection(item.id); setMobileSectionOpen(false); setMobileView("edit"); }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {mobileView === "edit" ? (
            <div className="p-4 pb-24">
              <SectionEditors activeSection={activeSection} data={localData} onChange={handleUpdate} />
            </div>
          ) : (
            <MobilePreview {...commonPanelProps} />
          )}
        </div>

        {/* Bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur no-print">
          <div className="flex">
            <button
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${mobileView === "edit" ? "text-primary border-t-2 border-primary" : "text-muted-foreground"}`}
              onClick={() => setMobileView("edit")}
            >
              <Pencil className="w-5 h-5" />Edit
            </button>
            <button
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${mobileView === "preview" ? "text-primary border-t-2 border-primary" : "text-muted-foreground"}`}
              onClick={() => setMobileView("preview")}
            >
              <Eye className="w-5 h-5" />Preview
            </button>
            <button className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium text-muted-foreground" onClick={toggleDarkMode}>
              <span className="text-lg leading-none">{darkMode ? "☀️" : "🌙"}</span>
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </div>

      {/* Print target */}
      <div className="hidden print:block">
        <PreviewPanel {...commonPanelProps} />
      </div>
    </>
  );
}

/** Mobile preview: measures its container and scales the A4 preview to fit */
function MobilePreview(props: { data: any; hiddenSections: Set<string>; accentColor: string; fontFamily: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      setScale(Math.min(1, (w - 16) / 816));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scaledHeight = Math.round(1056 * scale); // 11in * 96dpi ≈ 1056px

  return (
    <div ref={wrapperRef} className="w-full pb-24 pt-3 px-2">
      <div style={{ height: scaledHeight, overflow: "hidden" }}>
        <div style={{ transformOrigin: "top left", transform: `scale(${scale})`, width: 816 }}>
          <PreviewPanel {...props} />
        </div>
      </div>
      {scale < 1 && (
        <p className="text-center text-xs text-muted-foreground mt-2 opacity-60">
          Scroll in Preview tab or export PDF for full size
        </p>
      )}
    </div>
  );
}
