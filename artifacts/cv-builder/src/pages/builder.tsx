import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "wouter";
import { useGetResume, useUpdateResume, getGetResumeQueryKey } from "@workspace/api-client-react";
import { ArrowLeft, Download, Save, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import EditorForm from "@/components/builder/editor-form";
import PreviewPanel from "@/components/builder/preview-panel";

export default function Builder() {
  const { id } = useParams();
  const resumeId = Number(id);
  const { data: resume, isLoading } = useGetResume(resumeId, { query: { enabled: !!resumeId, queryKey: getGetResumeQueryKey(resumeId) } });
  const updateResume = useUpdateResume();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [localData, setLocalData] = useState<any>(null);
  const initializedForId = useRef<number | null>(null);

  useEffect(() => {
    if (resume && initializedForId.current !== resumeId) {
      initializedForId.current = resumeId;
      setLocalData({
        title: resume.title,
        template: resume.template,
        fullName: resume.fullName || "",
        jobTitle: resume.jobTitle || "",
        summary: resume.summary || "",
        contact: resume.contact || { email: "", phone: "", location: "", linkedin: "", website: "" },
        workExperience: resume.workExperience || [],
        education: resume.education || [],
        skills: resume.skills || [],
        projects: resume.projects || []
      });
    }
  }, [resume, resumeId]);

  const saveTimer = useRef<any>(null);

  const handleUpdate = useCallback((newData: any) => {
    setLocalData((prev: any) => ({ ...prev, ...newData }));
    
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      updateResume.mutate({ id: resumeId, data: newData }, {
        onSuccess: (updated) => {
          queryClient.setQueryData(getGetResumeQueryKey(resumeId), (old: any) => old ? { ...old, ...updated } : old);
        }
      });
    }, 1500);
  }, [resumeId, updateResume, queryClient]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !localData) {
    return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      <header className="h-16 border-b flex items-center justify-between px-4 shrink-0 no-print">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <input 
            type="text" 
            value={localData.title}
            onChange={(e) => handleUpdate({ title: e.target.value })}
            className="text-lg font-bold bg-transparent border-none outline-none focus:ring-2 ring-primary/20 rounded px-2 py-1 w-64"
          />
          {updateResume.isPending && <span className="text-xs text-muted-foreground flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1"/> Saving...</span>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} data-testid="button-download-pdf">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        <div className="w-[450px] shrink-0 border-r overflow-y-auto no-print bg-muted/10 p-4">
          <EditorForm data={localData} onChange={handleUpdate} />
        </div>
        <div className="flex-1 bg-muted overflow-y-auto print:bg-white print:overflow-visible relative">
          <div className="min-h-full p-8 flex justify-center print:p-0">
            <PreviewPanel data={localData} />
          </div>
        </div>
      </main>
    </div>
  );
}
