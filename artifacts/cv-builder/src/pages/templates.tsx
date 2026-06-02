import { useCreateResume } from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import { LayoutTemplate, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const TEMPLATES = [
  {
    id: "classic",
    name: "Classic Professional",
    description: "Traditional layout with serif fonts. Perfect for formal industries.",
    color: "bg-slate-100 border-slate-300"
  },
  {
    id: "modern",
    name: "Modern Accent",
    description: "Clean sans-serif typography with a bold header color bar.",
    color: "bg-blue-50 border-blue-200"
  },
  {
    id: "minimal",
    name: "Ultra Minimal",
    description: "Whitespace-first design. Let your experience speak for itself.",
    color: "bg-white border-gray-100"
  }
];

export default function Templates() {
  const [, setLocation] = useLocation();
  const createResume = useCreateResume();
  const { toast } = useToast();

  const handleSelectTemplate = (templateId: string) => {
    createResume.mutate({
      data: {
        title: "Untitled Resume",
        template: templateId
      }
    }, {
      onSuccess: (data) => {
        toast({ title: "Resume created" });
        setLocation(`/builder/${data.id}`);
      },
      onError: () => {
        toast({ title: "Failed to create resume", variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <header className="bg-background border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" data-testid="link-back">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Choose a Template</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Start with a solid foundation</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose a professional template to get started. You can always change the design later without losing your content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEMPLATES.map(t => (
            <Card key={t.id} className="flex flex-col overflow-hidden hover:ring-2 ring-primary/50 transition-all border-muted cursor-pointer" onClick={() => handleSelectTemplate(t.id)} data-testid={`template-${t.id}`}>
              <div className={`h-48 ${t.color} border-b flex items-center justify-center p-6 relative group`}>
                <div className="w-2/3 h-full bg-white shadow-sm border border-black/5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="h-4 w-full bg-muted/40 mb-2"></div>
                  <div className="h-2 w-3/4 bg-muted/30 mb-1"></div>
                  <div className="h-2 w-1/2 bg-muted/30 mb-4"></div>
                  
                  <div className="flex gap-2">
                    <div className="w-1/3 h-12 bg-muted/20"></div>
                    <div className="w-2/3 h-24 bg-muted/20"></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center">
                  <Button variant="default" className="opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    Select Template
                  </Button>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutTemplate className="w-5 h-5 text-primary" />
                  {t.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 text-muted-foreground">
                {t.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
