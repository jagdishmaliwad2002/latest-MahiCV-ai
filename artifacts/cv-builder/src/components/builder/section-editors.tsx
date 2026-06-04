import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Wand2, Loader2, Sparkles, X, Upload, Camera } from "lucide-react";
import { useGenerateSummary, useImproveBullet, useSuggestSkills } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

function PhotoUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-3">
      <Label>Profile Photo</Label>
      <div className="flex gap-4 items-start">
        {value ? (
          <div className="relative shrink-0">
            <img
              src={value}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-primary/30 shadow-sm"
            />
            <button
              onClick={() => onChange("")}
              className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-sm hover:bg-destructive/80 transition-colors"
              title="Remove photo"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20 shrink-0">
            <Camera className="w-7 h-7 text-muted-foreground/40" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${dragging ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/30"}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <Upload className="w-5 h-5 mx-auto mb-1.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground font-medium">
              Click or drag photo here
            </p>
            <p className="text-[11px] text-muted-foreground/60 mt-0.5">
              JPG, PNG, WEBP · from phone gallery or computer
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={onInputChange}
          />
          <p className="text-[11px] text-muted-foreground/50 mt-2 pl-1">
            Or paste a URL:
          </p>
          <Input
            value={value?.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="mt-1 h-8 text-xs"
          />
        </div>
      </div>
    </div>
  );
}

export default function SectionEditors({ activeSection, data, onChange }: { activeSection: string; data: any; onChange: (d: any) => void }) {
  const { toast } = useToast();

  const generateSummary = useGenerateSummary();
  const improveBullet = useImproveBullet();
  const suggestSkills = useSuggestSkills();

  const [suggestedSkillsList, setSuggestedSkillsList] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const updateArray = (field: string, id: string, updates: any) => {
    onChange({ [field]: data[field].map((item: any) => item.id === id ? { ...item, ...updates } : item) });
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
    generateSummary.mutate(
      { data: { fullName: data.fullName, jobTitle: data.jobTitle, workExperience: data.workExperience, skills: data.skills } },
      { onSuccess: (res) => { onChange({ summary: res.text }); toast({ title: "Summary generated!" }); } }
    );
  };

  const handleImproveBullet = (field: string, itemId: string, bulletIdx: number, bulletText: string, company = "") => {
    if (!bulletText) return;
    improveBullet.mutate({ data: { bullet: bulletText, jobTitle: data.jobTitle || "", company } }, {
      onSuccess: (res) => {
        const item = data[field].find((w: any) => w.id === itemId);
        const newBullets = [...item.bullets];
        newBullets[bulletIdx] = res.text;
        updateArray(field, itemId, { bullets: newBullets });
        toast({ title: "Bullet improved!" });
      },
    });
  };

  /* ─────── PERSONAL ─────── */
  if (activeSection === "personal") {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label>Full Name</Label>
            <Input value={data.fullName || ""} onChange={e => onChange({ fullName: e.target.value })} placeholder="Jane Doe" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Job Title</Label>
            <Input value={data.jobTitle || ""} onChange={e => onChange({ jobTitle: e.target.value })} placeholder="Senior Software Engineer" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={data.contact?.email || ""} onChange={e => onChange({ contact: { ...data.contact, email: e.target.value } })} placeholder="jane@example.com" type="email" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={data.contact?.phone || ""} onChange={e => onChange({ contact: { ...data.contact, phone: e.target.value } })} placeholder="+1 234 567 890" type="tel" />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={data.contact?.location || ""} onChange={e => onChange({ contact: { ...data.contact, location: e.target.value } })} placeholder="San Francisco, CA" />
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input value={data.contact?.website || ""} onChange={e => onChange({ contact: { ...data.contact, website: e.target.value } })} placeholder="janedoe.com" />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn</Label>
            <Input value={data.contact?.linkedin || ""} onChange={e => onChange({ contact: { ...data.contact, linkedin: e.target.value } })} placeholder="linkedin.com/in/jane" />
          </div>
          <div className="space-y-2">
            <Label>GitHub</Label>
            <Input value={data.contact?.github || ""} onChange={e => onChange({ contact: { ...data.contact, github: e.target.value } })} placeholder="github.com/jane" />
          </div>
        </div>

        <div className="border rounded-xl p-4 bg-muted/20">
          <PhotoUpload value={data.photoUrl || ""} onChange={(url) => onChange({ photoUrl: url })} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <Label>Professional Summary</Label>
            <Button variant="ghost" size="sm" onClick={handleGenerateSummary} disabled={generateSummary.isPending} className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700">
              {generateSummary.isPending ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
              AI Generate
            </Button>
          </div>
          <Textarea value={data.summary || ""} onChange={e => onChange({ summary: e.target.value })} placeholder="A brief overview of your professional background…" className="min-h-[140px]" />
        </div>
      </div>
    );
  }

  /* ─────── EXPERIENCE ─────── */
  if (activeSection === "experience") {
    return (
      <div className="space-y-5">
        {data.workExperience?.map((work: any) => (
          <div key={work.id} className="relative border p-4 rounded-xl space-y-4 bg-card shadow-sm">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeArrayItem("workExperience", work.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <Label>Company</Label>
                <Input value={work.company} onChange={e => updateArray("workExperience", work.id, { company: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Job Title</Label>
                <Input value={work.title} onChange={e => updateArray("workExperience", work.id, { title: e.target.value })} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Location</Label>
                <Input value={work.location || ""} onChange={e => updateArray("workExperience", work.id, { location: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input value={work.startDate} onChange={e => updateArray("workExperience", work.id, { startDate: e.target.value })} placeholder="MMM YYYY" />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input value={work.endDate || ""} onChange={e => updateArray("workExperience", work.id, { endDate: e.target.value })} placeholder="MMM YYYY" disabled={work.current} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id={`current-${work.id}`} checked={work.current} onCheckedChange={(c) => updateArray("workExperience", work.id, { current: !!c })} />
              <Label htmlFor={`current-${work.id}`} className="font-normal cursor-pointer">Currently working here</Label>
            </div>
            <div className="space-y-3 pt-1">
              <Label>Responsibilities & Achievements</Label>
              {work.bullets?.map((bullet: string, bIdx: number) => (
                <div key={bIdx} className="flex gap-2 items-start">
                  <Textarea value={bullet} onChange={e => { const nb = [...work.bullets]; nb[bIdx] = e.target.value; updateArray("workExperience", work.id, { bullets: nb }); }} className="min-h-[60px]" />
                  <div className="flex flex-col gap-1 shrink-0">
                    <Button variant="outline" size="icon" onClick={() => handleImproveBullet("workExperience", work.id, bIdx, bullet, work.company)} disabled={improveBullet.isPending} className="h-8 w-8 text-blue-600" title="AI Improve">
                      {improveBullet.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { const nb = work.bullets.filter((_: any, i: number) => i !== bIdx); updateArray("workExperience", work.id, { bullets: nb }); }} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() => updateArray("workExperience", work.id, { bullets: [...(work.bullets || []), ""] })}>
                <Plus className="w-4 h-4 mr-1" /> Add Bullet
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

  /* ─────── EDUCATION ─────── */
  if (activeSection === "education") {
    return (
      <div className="space-y-5">
        {data.education?.map((edu: any) => (
          <div key={edu.id} className="relative border p-4 rounded-xl space-y-4 bg-card shadow-sm">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeArrayItem("education", edu.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Institution</Label>
                <Input value={edu.institution} onChange={e => updateArray("education", edu.id, { institution: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Degree</Label>
                <Input value={edu.degree} onChange={e => updateArray("education", edu.id, { degree: e.target.value })} placeholder="B.S." />
              </div>
              <div className="space-y-1.5">
                <Label>Field of Study</Label>
                <Input value={edu.field || ""} onChange={e => updateArray("education", edu.id, { field: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input value={edu.startDate} onChange={e => updateArray("education", edu.id, { startDate: e.target.value })} placeholder="YYYY" />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input value={edu.endDate || ""} onChange={e => updateArray("education", edu.id, { endDate: e.target.value })} placeholder="YYYY" disabled={edu.current} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
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

  /* ─────── SKILLS ─────── */
  if (activeSection === "skills") {
    const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const val = skillInput.trim();
        if (val && !data.skills.includes(val)) onChange({ skills: [...data.skills, val] });
        setSkillInput("");
      }
    };
    return (
      <div className="space-y-5">
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" onClick={() => {
            if (!data.jobTitle) { toast({ title: "Job Title required", variant: "destructive" }); return; }
            suggestSkills.mutate({ data: { jobTitle: data.jobTitle, existingSkills: data.skills } }, { onSuccess: (res) => setSuggestedSkillsList(res.skills) });
          }} disabled={suggestSkills.isPending} className="text-blue-600">
            {suggestSkills.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            AI Suggest Skills
          </Button>
        </div>
        {suggestedSkillsList.length > 0 && (
          <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 space-y-3">
            <Label className="text-blue-600 font-semibold flex items-center"><Sparkles className="w-4 h-4 mr-2" /> Suggested for "{data.jobTitle}"</Label>
            <div className="flex flex-wrap gap-2">
              {suggestedSkillsList.map(skill => (
                <Badge key={skill} variant="outline" className="cursor-pointer hover:bg-blue-500/20 bg-background" onClick={() => { if (!data.skills.includes(skill)) onChange({ skills: [...data.skills, skill] }); setSuggestedSkillsList(suggestedSkillsList.filter(s => s !== skill)); }}>
                  <Plus className="w-3 h-3 mr-1" />{skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label>Your Skills</Label>
          <div className="p-3 bg-card border rounded-xl min-h-[90px] flex flex-wrap gap-2 items-start focus-within:ring-2 ring-ring ring-offset-2 ring-offset-background transition-all">
            {data.skills?.map((skill: string, i: number) => (
              <Badge key={i} className="pl-3 pr-1 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20" variant="secondary">
                {skill}
                <button type="button" className="ml-1 hover:bg-primary/20 rounded-full p-0.5" onClick={() => onChange({ skills: data.skills.filter((_: any, idx: number) => idx !== i) })}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={handleSkillKeyDown} placeholder={data.skills?.length === 0 ? "Type a skill and press Enter…" : "Add more…"} className="flex-1 bg-transparent outline-none min-w-[140px] text-sm py-1" />
          </div>
          <p className="text-xs text-muted-foreground">Type a skill and press Enter or comma to add it.</p>
        </div>
      </div>
    );
  }

  /* ─────── PROJECTS ─────── */
  if (activeSection === "projects") {
    return (
      <div className="space-y-5">
        {data.projects?.map((proj: any) => (
          <div key={proj.id} className="relative border p-4 rounded-xl space-y-4 bg-card shadow-sm">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeArrayItem("projects", proj.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <Label>Project Name</Label>
                <Input value={proj.name} onChange={e => updateArray("projects", proj.id, { name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>URL</Label>
                <Input value={proj.url || ""} onChange={e => updateArray("projects", proj.id, { url: e.target.value })} placeholder="https://" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Textarea value={proj.description || ""} onChange={e => updateArray("projects", proj.id, { description: e.target.value })} className="min-h-[60px]" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Technologies</Label>
                <Input value={(proj.technologies || []).join(", ")} onChange={e => updateArray("projects", proj.id, { technologies: e.target.value.split(",").map((t: string) => t.trim()).filter(Boolean) })} placeholder="React, Node.js (comma separated)" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Details (Bullets)</Label>
              {proj.bullets?.map((bullet: string, bIdx: number) => (
                <div key={bIdx} className="flex gap-2 items-start">
                  <Textarea value={bullet} onChange={e => { const nb = [...proj.bullets]; nb[bIdx] = e.target.value; updateArray("projects", proj.id, { bullets: nb }); }} className="min-h-[55px]" />
                  <Button variant="ghost" size="icon" onClick={() => { const nb = proj.bullets.filter((_: any, i: number) => i !== bIdx); updateArray("projects", proj.id, { bullets: nb }); }} className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() => updateArray("projects", proj.id, { bullets: [...(proj.bullets || []), ""] })}>
                <Plus className="w-4 h-4 mr-1" /> Add Detail
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

  /* ─────── CERTIFICATIONS ─────── */
  if (activeSection === "certifications") {
    return (
      <div className="space-y-5">
        {data.certifications?.map((cert: any) => (
          <div key={cert.id} className="relative border p-4 rounded-xl space-y-3 bg-card shadow-sm">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeArrayItem("certifications", cert.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Certification Name</Label>
                <Input value={cert.name} onChange={e => updateArray("certifications", cert.id, { name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Issuer</Label>
                <Input value={cert.issuer} onChange={e => updateArray("certifications", cert.id, { issuer: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input value={cert.date || ""} onChange={e => updateArray("certifications", cert.id, { date: e.target.value })} placeholder="MMM YYYY" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
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

  /* ─────── ACHIEVEMENTS ─────── */
  if (activeSection === "achievements") {
    return (
      <div className="space-y-5">
        {data.achievements?.map((ach: any) => (
          <div key={ach.id} className="relative border p-4 rounded-xl space-y-3 bg-card shadow-sm">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeArrayItem("achievements", ach.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={ach.title} onChange={e => updateArray("achievements", ach.id, { title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
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

  /* ─────── LANGUAGES ─────── */
  if (activeSection === "languages") {
    const levels = ["Native", "Fluent", "Advanced", "Intermediate", "Basic"];
    return (
      <div className="space-y-5">
        {data.languages?.map((lang: any) => (
          <div key={lang.id} className="relative border p-4 rounded-xl space-y-3 bg-card shadow-sm">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeArrayItem("languages", lang.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <Label>Language</Label>
                <Input value={lang.name} onChange={e => updateArray("languages", lang.id, { name: e.target.value })} placeholder="English" />
              </div>
              <div className="space-y-1.5">
                <Label>Proficiency</Label>
                <Select value={lang.level || "Fluent"} onValueChange={val => updateArray("languages", lang.id, { level: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full border-dashed" onClick={() => onChange({ languages: [...(data.languages || []), { id: generateId(), name: "", level: "Fluent" }] })}>
          <Plus className="w-4 h-4 mr-2" /> Add Language
        </Button>
      </div>
    );
  }

  /* ─────── CUSTOM ─────── */
  if (activeSection === "custom") {
    return (
      <div className="space-y-5">
        {data.customSections?.map((section: any) => (
          <div key={section.id} className="border rounded-xl overflow-hidden bg-card shadow-sm">
            <div className="flex items-center justify-between p-3 bg-muted/40 border-b">
              <Input value={section.heading} onChange={e => onChange({ customSections: data.customSections.map((s: any) => s.id === section.id ? { ...s, heading: e.target.value } : s) })} placeholder="Section Heading" className="font-semibold h-8 border-0 bg-transparent p-0 focus-visible:ring-0 text-base" />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={() => onChange({ customSections: data.customSections.filter((s: any) => s.id !== section.id) })}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              {section.items?.map((item: any) => (
                <div key={item.id} className="border rounded-lg p-3 space-y-2 bg-background">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-2">
                      <Input value={item.title} onChange={e => { const updated = section.items.map((i: any) => i.id === item.id ? { ...i, title: e.target.value } : i); onChange({ customSections: data.customSections.map((s: any) => s.id === section.id ? { ...s, items: updated } : s) }); }} placeholder="Title" className="h-8" />
                      <Input value={item.subtitle || ""} onChange={e => { const updated = section.items.map((i: any) => i.id === item.id ? { ...i, subtitle: e.target.value } : i); onChange({ customSections: data.customSections.map((s: any) => s.id === section.id ? { ...s, items: updated } : s) }); }} placeholder="Subtitle / Organization" className="h-8" />
                      <Input value={item.date || ""} onChange={e => { const updated = section.items.map((i: any) => i.id === item.id ? { ...i, date: e.target.value } : i); onChange({ customSections: data.customSections.map((s: any) => s.id === section.id ? { ...s, items: updated } : s) }); }} placeholder="Date" className="h-8" />
                      <Textarea value={item.description || ""} onChange={e => { const updated = section.items.map((i: any) => i.id === item.id ? { ...i, description: e.target.value } : i); onChange({ customSections: data.customSections.map((s: any) => s.id === section.id ? { ...s, items: updated } : s) }); }} placeholder="Description" className="min-h-[55px]" />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={() => { const updated = section.items.filter((i: any) => i.id !== item.id); onChange({ customSections: data.customSections.map((s: any) => s.id === section.id ? { ...s, items: updated } : s) }); }}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="secondary" size="sm" className="w-full" onClick={() => { const newItem = { id: generateId(), title: "", subtitle: "", date: "", description: "", bullets: [] }; onChange({ customSections: data.customSections.map((s: any) => s.id === section.id ? { ...s, items: [...(s.items || []), newItem] } : s) }); }}>
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full border-dashed" onClick={() => onChange({ customSections: [...(data.customSections || []), { id: generateId(), heading: "New Section", items: [] }] })}>
          <Plus className="w-4 h-4 mr-2" /> Add Custom Section
        </Button>
      </div>
    );
  }

  return null;
}
