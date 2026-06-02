import { useListResumes, useDeleteResume, getListResumesQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Plus, FileText, Trash2, Edit2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { data: resumes, isLoading } = useListResumes();
  const deleteResume = useDeleteResume();
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-md">
            <FileText className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">ResumeAI</h1>
        </div>
        <Link href="/templates" data-testid="button-create-new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Resume
          </Button>
        </Link>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Your Resumes</h2>
          <p className="text-muted-foreground mt-1">Manage and edit your professional resumes.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
          </div>
        ) : !resumes?.length ? (
          <div className="text-center py-24 bg-background rounded-xl border border-dashed">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No resumes yet</h3>
            <p className="text-muted-foreground mt-1 mb-6">Create your first resume to get started.</p>
            <Link href="/templates" data-testid="button-create-first">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Resume
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map(resume => (
              <Card key={resume.id} className="flex flex-col overflow-hidden transition-all hover:shadow-md border-muted">
                <CardHeader className="bg-muted/50 border-b pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{resume.title}</span>
                    <span className="text-xs font-normal px-2 py-1 bg-background rounded-full border text-muted-foreground capitalize">
                      {resume.template}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-6 flex-1">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Updated {format(new Date(resume.updatedAt), "MMM d, yyyy")}
                  </div>
                  <div className="text-sm font-medium">
                    {resume.fullName || "Untitled"} • {resume.jobTitle || "No role specified"}
                  </div>
                </CardContent>
                <CardFooter className="gap-2 bg-muted/20 border-t pt-4">
                  <Link href={`/builder/${resume.id}`} className="flex-1" data-testid={`button-edit-${resume.id}`}>
                    <Button variant="default" className="w-full">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(resume.id)}
                    data-testid={`button-delete-${resume.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
