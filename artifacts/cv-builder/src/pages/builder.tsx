import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "wouter";
import { useGetResume, useUpdateResume, getGetResumeQueryKey } from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

import Sidebar from "@/components/builder/sidebar";
import SectionEditors from "@/components/builder/section-editors";
import RightPanel from "@/components/builder/right-panel";

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
  
  // Theme & Style State
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  const [accentColor, setAccentColor] = useState("#3b82f6"); // Default blue
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  
  // Sections visibility
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());

  // History state
  const [history, setHistory] = useState<{timestamp: number, data: any}[]>([]);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [savedText, setSavedText] = useState("Not saved yet");

  // Load hidden sections from localStorage
  useEffect(() => {
    if (resumeId) {
      const stored = localStorage.getItem(`hidden_sections_${resumeId}`);
      if (stored) {
        try {
          setHiddenSections(new Set(JSON.parse(stored)));
        } catch (e) {}
      }
      
      const historyStored = localStorage.getItem(`history_${resumeId}`);
      if (historyStored) {
        try {
          setHistory(JSON.parse(historyStored));
        } catch (e) {}
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
        customSections: resume.customSections || []
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
            
            // Add to history
            setHistory(prevHistory => {
              const newHistory = [{ timestamp: Date.now(), data: updated }, ...prevHistory].slice(0, 10);
              localStorage.setItem(`history_${resumeId}`, JSON.stringify(newHistory));
              return newHistory;
            });
          }
        });
      }, 1500);

      return updated;
    });
  }, [resumeId, updateResume, queryClient]);

  // Update "Saved Xs ago" text
  useEffect(() => {
    if (!savedAt) return;
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - savedAt) / 1000);
      if (diff < 60) setSavedText(`Saved ${diff}s ago`);
      else if (diff < 3600) setSavedText(`Saved ${Math.floor(diff / 60)}m ago`);
      else setSavedText(`Saved ${Math.floor(diff / 3600)}h ago`);
    }, 10000);
    return () => clearInterval(interval);
  }, [savedAt]);

  const handlePrint = () => {
    window.print();
  };

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const resetCV = () => {
    if (confirm("Are you sure you want to reset all fields? This cannot be undone unless you restore from history.")) {
      handleUpdate({
        fullName: "",
        jobTitle: "",
        summary: "",
        photoUrl: "",
        contact: { email: "", phone: "", location: "", linkedin: "", website: "", github: "" },
        workExperience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        achievements: [],
        languages: [],
        customSections: []
      });
      toast({ title: "Resume reset successfully" });
    }
  };

  const restoreHistory = (snapshotData: any) => {
    if (confirm("Restore this snapshot? Current unsaved changes will be lost.")) {
      handleUpdate(snapshotData);
      toast({ title: "Snapshot restored" });
    }
  };

  if (isLoading || !localData) {
    return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background">
      {/* 1. Left Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        resetCV={resetCV}
      />
      
      {/* 2. Center Panel */}
      <div className={`flex flex-col border-r bg-muted/10 no-print transition-all duration-300 ${sidebarCollapsed ? 'w-[500px]' : 'w-[400px] xl:w-[450px]'}`}>
        <header className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-background/50 backdrop-blur">
          <h2 className="font-semibold capitalize text-lg">{activeSection}</h2>
          <div className="text-xs text-muted-foreground flex items-center">
            {updateResume.isPending && <Loader2 className="w-3 h-3 animate-spin mr-1"/>}
            {updateResume.isPending ? "Saving..." : savedText}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          <SectionEditors 
            activeSection={activeSection} 
            data={localData} 
            onChange={handleUpdate} 
          />
        </div>
      </div>

      {/* 3. Right Panel */}
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
  );
}
