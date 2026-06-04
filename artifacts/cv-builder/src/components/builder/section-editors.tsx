import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Wand2, Loader2, Sparkles, X } from "lucide-react";
import { useGenerateSummary, useImproveBullet, useSuggestSkills } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function SectionEditors({ activeSection, data, onChange }: { activeSection: string, data: any, onChange: (d: any) => void }) {
  const { toast } = useToast();
  
  const generateSummary = useGenerateSummary();
  const improveBullet = useImproveBullet();
  const suggestSkills = useSuggestSkills();

  const [suggestedSkillsList, setSuggestedSkillsList] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [techInput, setTechInput] = useState("");

  const updateArray = (field: string, id: string, updates: any) => {
    onChange({
      [field]: data[field].map((item: any) => item.id === id ? { ...item, ...updates } : item)
    });
  };

  const removeArrayItem = (field: string, id: string) => {
    onChange({ [field]: data[field].filter((item: any) => item.id !== id) });
  };

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 5);

  const handleGenerateSummary = () => {
    if (!data.fullName || !data.jobTitle) {
      toast({ title: "Name and Job Title required", variant: "destructive" });
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

  const handleImproveBullet = (field: string, itemId: string, bulletIdx: number, bulletText: string, company: string = "") => {
    if (!bulletText) return;
    improveBullet.mutate({
      data: { bullet: bulletText, jobTitle: data.jobTitle || "", company }
    }, {
      onSuccess: (res) => {
        const item = data[field].find((w: any) => w.id === itemId);
        const newBullets = [...item.bullets];
        newBullets[bulletIdx] = res.text;
        updateArray(field, itemId, { bullets: newBullets });
        toast({ title: "Bullet improved!" });
      }
    });
  };

  if (activeSection === "personal") {
    return (
      <div className="space-y-6">
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
            <Input value={data.contact?.email || ""} onChange={e => onChange({ contact: { ...data.contact, email: e.target.value }})} placeholder="jane@example.com" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={data.contact?.phone || ""} onChange={e => onChange({ contact: { ...data.contact, phone: e.target.value }})} placeholder="+1 234 567 890" />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={data.contact?.location || ""} onChange={e => onChange({ contact: { ...data.contact, location: e.target.value }})} placeholder="San Francisco, CA" />
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input value={data.contact?.website || ""} onChange={e => onChange({ contact: { ...data.contact, website: e.target.value }})} placeholder="janedoe.com" />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn</Label>
            <Input value={data.contact?.linkedin || ""} onChange={e => onChange({ contact: { ...data.contact, linkedin: e.target.value }})} placeholder="linkedin.com/in/jane" />
          </div>
          <div className="space-y-2">
            <Label>GitHub</Label>
            <Input value={data.contact?.github || ""} onChange={e => onChange({ contact: { ...data.contact, github: e.target.value }})} placeholder="github.com/jane" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Photo URL</Label>
          <Input value={data.photoUrl || ""} onChange={e => onChange({ photoUrl: e.target.value })} placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <Label>Professional Summary</Label>
            <Button variant="ghost" size="sm" onClick={handleGenerateSummary} disabled={generateSummary.isPending} className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700">
              {generateSummary.isPending ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
              AI Generate
            </Button>
          </div>
          <Textarea 
            value={data.summary || ""} 
            onChange={e => onChange({ summary: e.target.value })} 
            placeholder="A brief overview of your professional background..."
            className="min-h-[150px]"
          />
        </div>
      </div>
    );
  }

  if (activeSection === "experience") {
    return (
      <div className="space-y-6">
        {data.workExperience?.map((work: any) => (
          <div key={work.id} className="relative border p-4 rounded-xl space-y-4 bg-card shadow-sm">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeArrayItem("workExperience", work.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Company</Label>
                <Input value={work.company} onChange={e => updateArray("workExperience", work.id, { company: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Job Title</Label>
                <Input value={work.title} onChange={e => updateArray("workExperience", work.id, { title: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Location</Label>
                <Input value={work.location || ""} onChange={e => updateArray("workExperience", work.id, { location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input value={work.startDate} onChange={e => updateArray("workExperience", work.id, { startDate: e.target.value })} placeholder="MMM YYYY" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input value={work.endDate || ""} onChange={e => updateArray("workExperience", work.id, { endDate: e.target.value })} placeholder="MMM YYYY" disabled={work.current} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id={`current-${work.id}`} checked={work.current} onCheckedChange={(c) => updateArray("workExperience", work.id, { current: !!c })} />
              <Label htmlFor={`current-${work.id}`} className="font-normal cursor-pointer">Currently working here</Label>
            </div>
            <div className="space-y-3 pt-2">
              <Label>Responsibilities & Achievements</Label>
              {work.bullets?.map((bullet: string, bIdx: number) => (
                <div key={bIdx} className="flex gap-2 items-start">
                  <Textarea 
                    value={bullet}
                    onChange={e => {
                      const newBullets = [...work.bullets];
                      newBullets[bIdx] = e.target.value;
                      updateArray("workExperience", work.id, { bullets: newBullets });
                    }}
                    className="min-h-[60px]"
                  />
                  <div className="flex flex-col gap-1 shrink-0">
                    <Button variant="outline" size="icon" onClick={() => handleImproveBullet("workExperience", work.id, bIdx, bullet, work.company)} title="Improve with AI" disabled={improveBullet.isPending} className="h-8 w-8 text-blue-600">
                      {improveBullet.isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : <Wand2 className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => {
                      const newBullets = work.bullets.filter((_: any, i: number) => i !== bIdx);
                      updateArray("workExperience", work.id, { bullets: newBullets });
                    }} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() => updateArray("workExperience", work.id, { bullets: [...(work.bullets || []), ""] })}>
                <Plus className="w-4 h-4 mr-2" /> Add Bullet
              </Button>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full border-dashed" onClick={() => onChange({ workExperience: [...data.workExperience, { id: generateId(), company: "", title: "", startDate: "", endDate: "", current: false, location: "", bullets: [""] }] })}>
          <Plus className="w-4 h-4 mr-2" /> Add Experience
        </Button>
      </div>
    );
  }

  if (activeSection === "education") {
    return (
      <div className="space-y-6">
        {data.education?.map((edu: any) => (
          <div key={edu.id} className="relative border p-4 rounded-xl space-y-4 bg-card shadow-sm">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeArrayItem("education", edu.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2 col-span-2">
                <Label>Institution</Label>
                <Input value={edu.institution} onChange={e => updateArray("education", edu.id, { institution: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input value={edu.degree} onChange={e => updateArray("education", edu.id, { degree: e.target.value })} placeholder="B.S., B.A." />
              </div>
              <div className="space-y-2">
                <Label>Field of Study</Label>
                <Input value={edu.field || ""} onChange={e => updateArray("education", edu.id, { field: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input value={edu.startDate} onChange={e => updateArray("education", edu.id, { startDate: e.target.value })} placeholder="YYYY" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input value={edu.endDate || ""} onChange={e => updateArray("education", edu.id, { endDate: e.target.value })} placeholder="YYYY" disabled={edu.current} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>GPA / Grade</Label>
                <Input value={edu.gpa || ""} onChange={e => updateArray("education", edu.id, { gpa: e.target.value })} placeholder="3.8/4.0" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id={`edu-current-${edu.id}`} checked={edu.current} onCheckedChange={(c) => updateArray("education", edu.id, { current: !!c })} />
              <Label htmlFor={`edu-current-${edu.id}`} className="font-normal cursor-pointer">Currently studying here</Label>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full border-dashed" onClick={() => onChange({ education: [...data.education, { id: generateId(), institution: "", degree: "", field: "", startDate: "", endDate: "", current: false, gpa: "" }] })}>
          <Plus className="w-4 h-4 mr-2" /> Add Education
        </Button>
      </div>
    );
  }

  if (activeSection === "skills") {
    const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = skillInput.trim();
        if (val && !data.skills.includes(val)) {
          onChange({ skills: [...data.skills, val] });
        }
        setSkillInput("");
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" onClick={() => {
            if (!data.jobTitle) {
              toast({ title: "Job Title required for AI suggestions", variant: "destructive" });
              return;
            }
            suggestSkills.mutate({ data: { jobTitle: data.jobTitle, existingSkills: data.skills } }, {
              onSuccess: (res) => setSuggestedSkillsList(res.skills)
            });
          }} disabled={suggestSkills.isPending} className="text-blue-600">
            {suggestSkills.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Sparkles className="w-4 h-4 mr-2" />}
            AI Suggest Skills
          </Button>
        </div>

        {suggestedSkillsList.length > 0 && (
          <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 space-y-3">
            <Label className="text-blue-600 font-semibold flex items-center"><Sparkles className="w-4 h-4 mr-2"/> Suggested for "{data.jobTitle}"</Label>
            <div className="flex flex-wrap gap-2">
              {suggestedSkillsList.map(skill => (
                <Badge key={skill} variant="outline" className="cursor-pointer hover:bg-blue-500/20 bg-background" onClick={() => {
                  if (!data.skills.includes(skill)) onChange({ skills: [...data.skills, skill] });
                  setSuggestedSkillsList(suggestedSkillsList.filter(s => s !== skill));
                }}>
                  <Plus className="w-3 h-3 mr-1" /> {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Label>Your Skills</Label>
          <div className="p-3 bg-card border rounded-xl min-h-[100px] flex flex-wrap gap-2 items-start focus-within:ring-2 ring-ring ring-offset-2 ring-offset-background transition-all">
            {data.skills?.map((skill: string, i: number) => (
              <Badge key={i} className="pl-3 pr-1 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors" variant="secondary">
                {skill}
                <button type="button" className="ml-1 hover:bg-primary/20 rounded-full p-0.5" onClick={() => {
                  onChange({ skills: data.skills.filter((_: any, idx: number) => idx !== i) });
                }}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            <input 
              type="text"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder={data.skills?.length === 0 ? "Type a skill and press Enter or comma..." : "Add more..."}
              className="flex-1 bg-transparent outline-none min-w-[150px] text-sm py-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">Type a skill and press Enter or comma to add it.</p>
        </div>
      </div>
    );
  }

  if (activeSection === "projects") {
    return (
      <div className="space-y-6">
        {data.projects?.map((proj: any) => (
          <div key={proj.id} className="relative border p-4 rounded-xl space-y-4 bg-card shadow-sm">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeArrayItem("projects", proj.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Project Name</Label>
                <Input value={proj.name} onChange={e => updateArray("projects", proj.id, { name: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>URL</Label>
                <Input value={proj.url || ""} onChange={e => updateArray("projects", proj.id, { url: e.target.value })} placeholder="https://" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Description</Label>
                <Textarea value={proj.description || ""} onChange={e => updateArray("projects", proj.id, { description: e.target.value })} className="min-h-[60px]" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Technologies</Label>
                <Input 
                  value={(proj.technologies || []).join(", ")} 
                  onChange={e => updateArray("projects", proj.id, { technologies: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} 
                  placeholder="React, Node.js, TypeScript (comma separated)" 
                />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <Label>Details (Bullets)</Label>
              {proj.bullets?.map((bullet: string, bIdx: number) => (
                <div key={bIdx} className="flex gap-2 items-start">
                  <Textarea 
                    value={bullet}
                    onChange={e => {
                      const newBullets = [...proj.bullets];
                      newBullets[bIdx] = e.target.value;
                      updateArray("projects", proj.id, { bullets: newBullets });
                    }}
                    className="min-h-[60px]"
                  />
                  <Button variant="ghost" size="icon" onClick={() => {
                    const newBullets = proj.bullets.filter((_: any, i: number) => i !== bIdx);
                    updateArray("projects", proj.id, { bullets: newBullets });
                  }} className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() => updateArray("projects", proj.id, { bullets: [...(proj.bullets || []), ""] })}>
                <Plus className="w-4 h-4 mr-2" /> Add Detail
              </Button>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full border-dashed" onClick={() => onChange({ projects: [...(data.projects || []), { id: generateId(), name: "", description: "", url: "", technologies: [], bullets: [""] }] })}>
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>
    );
  }

  if (activeSection === "certifications") {
    return (
      <div className="space-y-6">
        {data.certifications?.map((cert: any) => (
          <div key={cert.id} className="relative border p-4 rounded-xl space-y-4 bg-card shadow-sm">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeArrayItem("certifications", cert.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2 col-span-2">
                <Label>Certification Name</Label>
                <Input value={cert.name} onChange={e => updateArray("certifications", cert.id, { name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Issuer</Label>
                <Input value={cert.issuer} onChange={e => updateArray("certifications", cert.id, { issuer: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input value={cert.date || ""} onChange={e => updateArray("certifications", cert.id, { date: e.target.value })} placeholder="MMM YYYY" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>URL</Label>
                <Input value={cert.url || ""} onChange={e => updateArray("certifications", cert.id, { url: e.target.value })} placeholder="https://" />
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full border-dashed" onClick={() => onChange({ certifications: [...(data.certifications || []), { id: generateId(), name: "", issuer: "", date: "", url: "" }] })}>
          <Plus className="w-4 h-4 mr-2" /> Add Certification
        </Button>
      </div>
    );
  }

  if (activeSection === "achievements") {
    return (
      <div className="space-y-6">
        {data.achievements?.map((ach: any) => (
          <div key={ach.id} className="relative border p-4 rounded-xl space-y-4 bg-card shadow-sm">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeArrayItem("achievements", ach.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={ach.title} onChange={e => updateArray("achievements", ach.id, { title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={ach.description || ""} onChange={e => updateArray("achievements", ach.id, { description: e.target.value })} />
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full border-dashed" onClick={() => onChange({ achievements: [...(data.achievements || []), { id: generateId(), title: "", description: "" }] })}>
          <Plus className="w-4 h-4 mr-2" /> Add Achievement
        </Button>
      </div>
    );
  }

  if (activeSection === "languages") {
    return (
      <div className="space-y-6">
        {data.languages?.map((lang: any) => (
          <div key={lang.id} className="relative border p-4 rounded-xl space-y-4 bg-card shadow-sm">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeArrayItem("languages", lang.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>Language Name</Label>
                <Input value={lang.name} onChange={e => updateArray("languages", lang.id, { name: e.target.value })} placeholder="English, Spanish, etc." />
              </div>
              <div className="space-y-2">
                <Label>Proficiency Level</Label>
                <Select value={lang.level || "Native"} onValueChange={(val) => updateArray("languages", lang.id, { level: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Native">Native</SelectItem>
                    <SelectItem value="Fluent">Fluent</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Basic">Basic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full border-dashed" onClick={() => onChange({ languages: [...(data.languages || []), { id: generateId(), name: "", level: "Native" }] })}>
          <Plus className="w-4 h-4 mr-2" /> Add Language
        </Button>
      </div>
    );
  }

  if (activeSection === "custom") {
    return (
      <div className="space-y-8">
        {data.customSections?.map((section: any) => (
          <div key={section.id} className="border-2 border-primary/20 p-5 rounded-xl space-y-6 bg-card relative">
            <Button variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7 rounded-full shadow-md" onClick={() => removeArrayItem("customSections", section.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
            
            <div className="space-y-2">
              <Label className="text-primary font-bold">Section Heading</Label>
              <Input value={section.heading} onChange={e => updateArray("customSections", section.id, { heading: e.target.value })} className="font-semibold text-lg" placeholder="E.g., Publications, Volunteering, Interests" />
            </div>

            <div className="space-y-4 pl-4 border-l-2 border-muted">
              {section.items?.map((item: any) => (
                <div key={item.id} className="relative bg-muted/30 p-4 rounded-lg space-y-4">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => {
                    const newItems = section.items.filter((i: any) => i.id !== item.id);
                    updateArray("customSections", section.id, { items: newItems });
                  }}>
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                      <Label>Title</Label>
                      <Input value={item.title} onChange={e => {
                        const newItems = section.items.map((i: any) => i.id === item.id ? { ...i, title: e.target.value } : i);
                        updateArray("customSections", section.id, { items: newItems });
                      }} />
                    </div>
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                      <Label>Subtitle</Label>
                      <Input value={item.subtitle || ""} onChange={e => {
                        const newItems = section.items.map((i: any) => i.id === item.id ? { ...i, subtitle: e.target.value } : i);
                        updateArray("customSections", section.id, { items: newItems });
                      }} />
                    </div>
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                      <Label>Date / Period</Label>
                      <Input value={item.date || ""} onChange={e => {
                        const newItems = section.items.map((i: any) => i.id === item.id ? { ...i, date: e.target.value } : i);
                        updateArray("customSections", section.id, { items: newItems });
                      }} />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Description</Label>
                      <Textarea value={item.description || ""} onChange={e => {
                        const newItems = section.items.map((i: any) => i.id === item.id ? { ...i, description: e.target.value } : i);
                        updateArray("customSections", section.id, { items: newItems });
                      }} className="min-h-[60px]" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Bullets</Label>
                    {item.bullets?.map((bullet: string, bIdx: number) => (
                      <div key={bIdx} className="flex gap-2 items-start">
                        <Input 
                          value={bullet}
                          onChange={e => {
                            const newBullets = [...item.bullets];
                            newBullets[bIdx] = e.target.value;
                            const newItems = section.items.map((i: any) => i.id === item.id ? { ...i, bullets: newBullets } : i);
                            updateArray("customSections", section.id, { items: newItems });
                          }}
                        />
                        <Button variant="ghost" size="icon" onClick={() => {
                          const newBullets = item.bullets.filter((_: any, i: number) => i !== bIdx);
                          const newItems = section.items.map((i: any) => i.id === item.id ? { ...i, bullets: newBullets } : i);
                          updateArray("customSections", section.id, { items: newItems });
                        }} className="h-10 w-10 text-muted-foreground hover:text-destructive shrink-0">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="secondary" size="sm" onClick={() => {
                      const newBullets = [...(item.bullets || []), ""];
                      const newItems = section.items.map((i: any) => i.id === item.id ? { ...i, bullets: newBullets } : i);
                      updateArray("customSections", section.id, { items: newItems });
                    }}>
                      <Plus className="w-4 h-4 mr-2" /> Add Bullet
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => {
                const newItems = [...(section.items || []), { id: generateId(), title: "", subtitle: "", date: "", description: "", bullets: [] }];
                updateArray("customSections", section.id, { items: newItems });
              }}>
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </div>
          </div>
        ))}
        <Button variant="default" className="w-full" onClick={() => onChange({ customSections: [...(data.customSections || []), { id: generateId(), heading: "Custom Section", items: [{ id: generateId(), title: "", subtitle: "", date: "", description: "", bullets: [] }] }] })}>
          <Plus className="w-4 h-4 mr-2" /> Add Custom Section
        </Button>
      </div>
    );
  }

  return <div className="p-4 text-center text-muted-foreground">Select a section to edit</div>;
}
