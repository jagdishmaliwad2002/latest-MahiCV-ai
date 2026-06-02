import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Wand2, Loader2, Sparkles } from "lucide-react";
import { useGenerateSummary, useImproveBullet, useSuggestSkills } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function EditorForm({ data, onChange }: { data: any, onChange: (d: any) => void }) {
  const { toast } = useToast();
  
  // Mutations
  const generateSummary = useGenerateSummary();
  const improveBullet = useImproveBullet();
  const suggestSkills = useSuggestSkills();

  const [suggestedSkillsList, setSuggestedSkillsList] = useState<string[]>([]);

  const handleContactChange = (field: string, value: string) => {
    onChange({ contact: { ...data.contact, [field]: value } });
  };

  const addWork = () => {
    const id = Date.now().toString();
    onChange({
      workExperience: [...data.workExperience, { id, company: "", title: "", startDate: "", endDate: "", current: false, location: "", bullets: [""] }]
    });
  };

  const updateWork = (id: string, updates: any) => {
    onChange({
      workExperience: data.workExperience.map((w: any) => w.id === id ? { ...w, ...updates } : w)
    });
  };

  const removeWork = (id: string) => {
    onChange({ workExperience: data.workExperience.filter((w: any) => w.id !== id) });
  };

  const addEducation = () => {
    const id = Date.now().toString();
    onChange({
      education: [...data.education, { id, institution: "", degree: "", field: "", startDate: "", endDate: "", current: false, gpa: "" }]
    });
  };

  const updateEducation = (id: string, updates: any) => {
    onChange({
      education: data.education.map((e: any) => e.id === id ? { ...e, ...updates } : e)
    });
  };

  const removeEducation = (id: string) => {
    onChange({ education: data.education.filter((e: any) => e.id !== id) });
  };

  const addProject = () => {
    const id = Date.now().toString();
    onChange({
      projects: [...(data.projects || []), { id, name: "", description: "", url: "", technologies: [], bullets: [""] }]
    });
  };

  const updateProject = (id: string, updates: any) => {
    onChange({
      projects: data.projects.map((p: any) => p.id === id ? { ...p, ...updates } : p)
    });
  };

  const removeProject = (id: string) => {
    onChange({ projects: data.projects.filter((p: any) => p.id !== id) });
  };

  const handleGenerateSummary = () => {
    if (!data.fullName || !data.jobTitle) {
      toast({ title: "Name and Job Title required", description: "Please fill these out first.", variant: "destructive" });
      return;
    }
    generateSummary.mutate({
      data: { fullName: data.fullName, jobTitle: data.jobTitle, workExperience: data.workExperience, skills: data.skills }
    }, {
      onSuccess: (res) => {
        onChange({ summary: res.text });
        toast({ title: "Summary generated!" });
      }
    });
  };

  const handleImproveBullet = (workId: string, bulletIdx: number, bulletText: string, company: string) => {
    if (!bulletText) return;
    improveBullet.mutate({
      data: { bullet: bulletText, jobTitle: data.jobTitle || "", company }
    }, {
      onSuccess: (res) => {
        const work = data.workExperience.find((w: any) => w.id === workId);
        const newBullets = [...work.bullets];
        newBullets[bulletIdx] = res.text;
        updateWork(workId, { bullets: newBullets });
        toast({ title: "Bullet improved!" });
      }
    });
  };

  const handleSuggestSkills = () => {
    if (!data.jobTitle) {
      toast({ title: "Job Title required", variant: "destructive" });
      return;
    }
    suggestSkills.mutate({
      data: { jobTitle: data.jobTitle, existingSkills: data.skills }
    }, {
      onSuccess: (res) => {
        setSuggestedSkillsList(res.skills);
      }
    });
  };

  return (
    <Accordion type="multiple" defaultValue={["personal", "summary", "work"]} className="w-full space-y-4">
      
      {/* PERSONAL INFO */}
      <AccordionItem value="personal" className="bg-background rounded-lg border px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline">Personal Information</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2 pb-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={data.fullName || ""} onChange={e => onChange({ fullName: e.target.value })} placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <Label>Job Title</Label>
            <Input value={data.jobTitle || ""} onChange={e => onChange({ jobTitle: e.target.value })} placeholder="Senior Software Engineer" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={data.contact?.email || ""} onChange={e => handleContactChange("email", e.target.value)} placeholder="jane@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={data.contact?.phone || ""} onChange={e => handleContactChange("phone", e.target.value)} placeholder="+1 234 567 890" />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={data.contact?.location || ""} onChange={e => handleContactChange("location", e.target.value)} placeholder="San Francisco, CA" />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn</Label>
              <Input value={data.contact?.linkedin || ""} onChange={e => handleContactChange("linkedin", e.target.value)} placeholder="linkedin.com/in/jane" />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* SUMMARY */}
      <AccordionItem value="summary" className="bg-background rounded-lg border px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline">Professional Summary</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2 pb-4">
          <div className="flex justify-end">
            <Button variant="secondary" size="sm" onClick={handleGenerateSummary} disabled={generateSummary.isPending} data-testid="button-ai-summary">
              {generateSummary.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
              Generate with AI
            </Button>
          </div>
          <Textarea 
            value={data.summary || ""} 
            onChange={e => onChange({ summary: e.target.value })} 
            placeholder="A brief overview of your professional background..."
            className="min-h-[120px]"
          />
        </AccordionContent>
      </AccordionItem>

      {/* WORK EXPERIENCE */}
      <AccordionItem value="work" className="bg-background rounded-lg border px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline">Work Experience</AccordionTrigger>
        <AccordionContent className="space-y-6 pt-2 pb-4">
          {data.workExperience?.map((work: any, idx: number) => (
            <div key={work.id} className="relative border p-4 rounded-md space-y-4 bg-muted/10">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeWork(work.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={work.company} onChange={e => updateWork(work.id, { company: e.target.value })} placeholder="Acme Corp" />
                </div>
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input value={work.title} onChange={e => updateWork(work.id, { title: e.target.value })} placeholder="Software Engineer" />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input value={work.startDate} onChange={e => updateWork(work.id, { startDate: e.target.value })} placeholder="Jan 2020" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input value={work.endDate || ""} onChange={e => updateWork(work.id, { endDate: e.target.value })} placeholder="Present" disabled={work.current} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Responsibilities (Bullets)</Label>
                {work.bullets?.map((bullet: string, bIdx: number) => (
                  <div key={bIdx} className="flex gap-2 items-start">
                    <Textarea 
                      value={bullet}
                      onChange={e => {
                        const newBullets = [...work.bullets];
                        newBullets[bIdx] = e.target.value;
                        updateWork(work.id, { bullets: newBullets });
                      }}
                      className="min-h-[60px]"
                    />
                    <div className="flex flex-col gap-1">
                      <Button variant="outline" size="icon" onClick={() => handleImproveBullet(work.id, bIdx, bullet, work.company)} title="Improve with AI" disabled={improveBullet.isPending}>
                        {improveBullet.isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4 text-primary" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        const newBullets = work.bullets.filter((_: any, i: number) => i !== bIdx);
                        updateWork(work.id, { bullets: newBullets });
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={() => updateWork(work.id, { bullets: [...(work.bullets || []), ""] })}>
                  <Plus className="w-4 h-4 mr-2" /> Add Bullet
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full" onClick={addWork}>
            <Plus className="w-4 h-4 mr-2" /> Add Experience
          </Button>
        </AccordionContent>
      </AccordionItem>

      {/* EDUCATION */}
      <AccordionItem value="education" className="bg-background rounded-lg border px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline">Education</AccordionTrigger>
        <AccordionContent className="space-y-6 pt-2 pb-4">
          {data.education?.map((edu: any) => (
            <div key={edu.id} className="relative border p-4 rounded-md space-y-4 bg-muted/10">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeEducation(edu.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Institution</Label>
                  <Input value={edu.institution} onChange={e => updateEducation(edu.id, { institution: e.target.value })} placeholder="University of Tech" />
                </div>
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input value={edu.degree} onChange={e => updateEducation(edu.id, { degree: e.target.value })} placeholder="B.S." />
                </div>
                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <Input value={edu.field || ""} onChange={e => updateEducation(edu.id, { field: e.target.value })} placeholder="Computer Science" />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input value={edu.startDate} onChange={e => updateEducation(edu.id, { startDate: e.target.value })} placeholder="2016" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input value={edu.endDate || ""} onChange={e => updateEducation(edu.id, { endDate: e.target.value })} placeholder="2020" />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full" onClick={addEducation}>
            <Plus className="w-4 h-4 mr-2" /> Add Education
          </Button>
        </AccordionContent>
      </AccordionItem>

      {/* SKILLS */}
      <AccordionItem value="skills" className="bg-background rounded-lg border px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline">Skills</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2 pb-4">
          <div className="flex justify-end">
            <Button variant="secondary" size="sm" onClick={handleSuggestSkills} disabled={suggestSkills.isPending}>
              {suggestSkills.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Wand2 className="w-4 h-4 mr-2" />}
              AI Suggest Skills
            </Button>
          </div>
          {suggestedSkillsList.length > 0 && (
            <div className="bg-primary/5 p-4 rounded-md border border-primary/20 space-y-2">
              <Label className="text-primary font-semibold">Suggested Skills</Label>
              <div className="flex flex-wrap gap-2">
                {suggestedSkillsList.map(skill => (
                  <Button 
                    key={skill} 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs bg-background"
                    onClick={() => {
                      if (!data.skills.includes(skill)) {
                        onChange({ skills: [...data.skills, skill] });
                      }
                      setSuggestedSkillsList(suggestedSkillsList.filter(s => s !== skill));
                    }}
                  >
                    <Plus className="w-3 h-3 mr-1" /> {skill}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <Textarea 
            value={(data.skills || []).join(", ")}
            onChange={e => onChange({ skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
            placeholder="React, TypeScript, Node.js..."
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground">Comma separated list of skills.</p>
        </AccordionContent>
      </AccordionItem>

      {/* PROJECTS */}
      <AccordionItem value="projects" className="bg-background rounded-lg border px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline">Projects</AccordionTrigger>
        <AccordionContent className="space-y-6 pt-2 pb-4">
          {data.projects?.map((proj: any) => (
            <div key={proj.id} className="relative border p-4 rounded-md space-y-4 bg-muted/10">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeProject(proj.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input value={proj.name} onChange={e => updateProject(proj.id, { name: e.target.value })} placeholder="Awesome App" />
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input value={proj.url || ""} onChange={e => updateProject(proj.id, { url: e.target.value })} placeholder="https://..." />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Description</Label>
                  <Textarea value={proj.description || ""} onChange={e => updateProject(proj.id, { description: e.target.value })} placeholder="A short description" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Technologies (Comma separated)</Label>
                  <Input 
                    value={(proj.technologies || []).join(", ")} 
                    onChange={e => updateProject(proj.id, { technologies: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} 
                    placeholder="React, Node.js" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Details (Bullets)</Label>
                {proj.bullets?.map((bullet: string, bIdx: number) => (
                  <div key={bIdx} className="flex gap-2 items-start">
                    <Textarea 
                      value={bullet}
                      onChange={e => {
                        const newBullets = [...proj.bullets];
                        newBullets[bIdx] = e.target.value;
                        updateProject(proj.id, { bullets: newBullets });
                      }}
                      className="min-h-[60px]"
                    />
                    <Button variant="ghost" size="icon" onClick={() => {
                      const newBullets = proj.bullets.filter((_: any, i: number) => i !== bIdx);
                      updateProject(proj.id, { bullets: newBullets });
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={() => updateProject(proj.id, { bullets: [...(proj.bullets || []), ""] })}>
                  <Plus className="w-4 h-4 mr-2" /> Add Bullet
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full" onClick={addProject}>
            <Plus className="w-4 h-4 mr-2" /> Add Project
          </Button>
        </AccordionContent>
      </AccordionItem>

    </Accordion>
  );
}
