import { useListResumes, useDeleteResume, useCreateResume, getListResumesQueryKey } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Plus, FileText, Trash2, Edit2, Calendar, ArrowLeft, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { data: resumes, isLoading } = useListResumes();
  const deleteResume = useDeleteResume();
  const createResume = useCreateResume();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      deleteResume.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListResumesQueryKey() });
          toast({ title: "Resume deleted" });
        }
      });
    }
  };

  const handleCreate = () => {
    createResume.mutate(
      { data: { title: "My Resume", template: "modern" } },
      {
        onSuccess: (resume) => setLocation(`/builder/${resume.id}`),
        onError: () => toast({ title: "Error", description: "Failed to create resume", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <header className="border-b border-white/5 bg-[#080810]/80 backdrop-blur-md px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <span className="text-white/10">|</span>
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span>Resume<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">AI</span></span>
          </div>
        </div>
        <button
          onClick={handleCreate}
          disabled={createResume.isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all disabled:opacity-50"
          data-testid="button-create-new"
        >
          <Plus className="w-4 h-4" />
          New Resume
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Your Resumes</h2>
          <p className="text-white/40 mt-1">Manage and edit your professional resumes.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-2xl bg-white/5" />)}
          </div>
        ) : !resumes?.length ? (
          <div className="text-center py-32 rounded-2xl border border-dashed border-white/10 bg-[#0f0f1a]">
            <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white">No resumes yet</h3>
            <p className="text-white/40 mt-1 mb-8">Create your first resume to get started.</p>
            <button
              onClick={handleCreate}
              disabled={createResume.isPending}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all mx-auto disabled:opacity-50"
              data-testid="button-create-first"
            >
              <Sparkles className="w-4 h-4" />
              Build My Free CV
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map(resume => (
              <div key={resume.id} className="rounded-2xl border border-white/5 bg-[#0f0f1a] overflow-hidden hover:border-white/10 transition-all group flex flex-col">
                <div className="bg-gradient-to-br from-violet-900/30 to-fuchsia-900/10 border-b border-white/5 p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-white truncate mr-2">{resume.title}</h3>
                    <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 capitalize">
                      {resume.template}
                    </span>
                  </div>
                  <div className="text-sm text-white/50 mt-1">{resume.fullName || "Untitled"} · {resume.jobTitle || "No role"}</div>
                </div>
                <div className="p-5 flex-1">
                  <div className="flex items-center text-xs text-white/30">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    Updated {format(new Date(resume.updatedAt), "MMM d, yyyy")}
                  </div>
                </div>
                <div className="flex gap-2 p-4 border-t border-white/5 bg-[#0a0a14]">
                  <Link href={`/builder/${resume.id}`} className="flex-1" data-testid={`button-edit-${resume.id}`}>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 hover:bg-violet-500/20 hover:text-violet-300 border border-white/5 hover:border-violet-500/30 transition-all">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </Link>
                  <button
                    className="px-3 py-2 rounded-xl border border-white/5 bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all"
                    onClick={() => handleDelete(resume.id)}
                    data-testid={`button-delete-${resume.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={handleCreate}
              disabled={createResume.isPending}
              className="rounded-2xl border border-dashed border-white/10 bg-[#0f0f1a] hover:border-violet-500/30 hover:bg-violet-500/5 transition-all flex flex-col items-center justify-center gap-3 min-h-[200px] disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-white/30" />
              </div>
              <span className="text-sm text-white/30">New Resume</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
