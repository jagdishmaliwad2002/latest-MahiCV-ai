import { cn } from "@/lib/utils";

export default function PreviewPanel({ data, hiddenSections, accentColor, fontFamily }: { data: any, hiddenSections: Set<string>, accentColor: string, fontFamily: string }) {
  const template = data.template || "classic";

  const renderProps = { data, hiddenSections, accentColor, fontFamily };

  return (
    <div style={{ fontFamily }}>
      {template === "classic" && <ClassicTemplate {...renderProps} />}
      {template === "modern" && <ModernTemplate {...renderProps} />}
      {template === "minimal" && <MinimalTemplate {...renderProps} />}
    </div>
  );
}

// ==========================================
// SHARED UTILS
// ==========================================

function SectionRenderer({ title, isHidden, children }: { title: string, isHidden: boolean, children: React.ReactNode }) {
  if (isHidden) return null;
  return <>{children}</>;
}

// ==========================================
// CLASSIC TEMPLATE
// ==========================================
function ClassicTemplate({ data, hiddenSections, accentColor }: any) {
  return (
    <div className="w-[8.5in] min-h-[11in] bg-white text-black p-[0.75in] shadow-xl print-content">
      <div className="text-center border-b-2 pb-4 mb-6" style={{ borderColor: accentColor }}>
        {data.photoUrl && <img src={data.photoUrl} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2" style={{ borderColor: accentColor }} />}
        <h1 className="text-4xl font-bold mb-2 uppercase tracking-wide" style={{ color: accentColor }}>{data.fullName || "Your Name"}</h1>
        {data.jobTitle && <div className="text-xl text-gray-700 italic mb-2">{data.jobTitle}</div>}
        <div className="text-sm flex flex-wrap justify-center gap-x-2 text-gray-600 font-sans">
          {data.contact?.email && <span>{data.contact.email}</span>}
          {data.contact?.email && data.contact?.phone && <span>•</span>}
          {data.contact?.phone && <span>{data.contact.phone}</span>}
          {data.contact?.phone && data.contact?.location && <span>•</span>}
          {data.contact?.location && <span>{data.contact.location}</span>}
          {data.contact?.linkedin && <span>• {data.contact.linkedin}</span>}
          {data.contact?.website && <span>• {data.contact.website}</span>}
          {data.contact?.github && <span>• {data.contact.github}</span>}
        </div>
      </div>

      <SectionRenderer title="Summary" isHidden={hiddenSections.has("summary") || !data.summary}>
        <div className="mb-6">
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </div>
      </SectionRenderer>

      <SectionRenderer title="Experience" isHidden={hiddenSections.has("experience") || !data.workExperience?.length}>
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider border-b mb-4 pb-1" style={{ borderColor: accentColor }}>Experience</h2>
          <div className="space-y-4">
            {data.workExperience?.map((work: any) => (
              <div key={work.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="font-bold text-md">{work.title}</div>
                  <div className="text-sm text-gray-600">{work.startDate} – {work.current ? "Present" : work.endDate}</div>
                </div>
                <div className="italic text-gray-700 mb-2">{work.company} {work.location && `, ${work.location}`}</div>
                {work.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-sm space-y-1">
                    {work.bullets.map((b: string, i: number) => b && <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </SectionRenderer>

      <SectionRenderer title="Projects" isHidden={hiddenSections.has("projects") || !data.projects?.length}>
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider border-b mb-4 pb-1" style={{ borderColor: accentColor }}>Projects</h2>
          <div className="space-y-4">
            {data.projects?.map((proj: any) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="font-bold text-md">{proj.name}</div>
                  {proj.url && <div className="text-sm" style={{ color: accentColor }}>{proj.url}</div>}
                </div>
                {proj.description && <div className="italic text-gray-700 mb-1 text-sm">{proj.description}</div>}
                {proj.technologies?.length > 0 && <div className="text-sm text-gray-600 mb-2">Technologies: {proj.technologies.join(", ")}</div>}
                {proj.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-sm space-y-1">
                    {proj.bullets.map((b: string, i: number) => b && <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </SectionRenderer>

      <SectionRenderer title="Education" isHidden={hiddenSections.has("education") || !data.education?.length}>
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider border-b mb-4 pb-1" style={{ borderColor: accentColor }}>Education</h2>
          <div className="space-y-3">
            {data.education?.map((edu: any) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div className="font-bold">{edu.institution}</div>
                  <div className="text-sm text-gray-600">{edu.startDate} – {edu.current ? "Present" : edu.endDate}</div>
                </div>
                <div>{edu.degree} {edu.field && `in ${edu.field}`} {edu.gpa && ` (GPA: ${edu.gpa})`}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionRenderer>

      <SectionRenderer title="Skills" isHidden={hiddenSections.has("skills") || !data.skills?.length}>
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider border-b mb-4 pb-1" style={{ borderColor: accentColor }}>Skills</h2>
          <div className="text-sm leading-relaxed">
            {data.skills?.join(" • ")}
          </div>
        </div>
      </SectionRenderer>

      {/* NEW SECTIONS */}
      <SectionRenderer title="Certifications" isHidden={hiddenSections.has("certifications") || !data.certifications?.length}>
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider border-b mb-4 pb-1" style={{ borderColor: accentColor }}>Certifications</h2>
          <div className="space-y-2">
            {data.certifications?.map((cert: any) => (
              <div key={cert.id} className="flex justify-between text-sm">
                <div><span className="font-bold">{cert.name}</span>, {cert.issuer} {cert.url && <span className="text-xs" style={{ color: accentColor }}>({cert.url})</span>}</div>
                <div className="text-gray-600">{cert.date}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionRenderer>

      <SectionRenderer title="Achievements" isHidden={hiddenSections.has("achievements") || !data.achievements?.length}>
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider border-b mb-4 pb-1" style={{ borderColor: accentColor }}>Achievements</h2>
          <ul className="list-disc list-outside ml-4 text-sm space-y-1">
            {data.achievements?.map((ach: any) => (
              <li key={ach.id}><span className="font-bold">{ach.title}</span>{ach.description && `: ${ach.description}`}</li>
            ))}
          </ul>
        </div>
      </SectionRenderer>

      <SectionRenderer title="Languages" isHidden={hiddenSections.has("languages") || !data.languages?.length}>
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider border-b mb-4 pb-1" style={{ borderColor: accentColor }}>Languages</h2>
          <div className="text-sm">
            {data.languages?.map((lang: any) => `${lang.name} (${lang.level})`).join(" • ")}
          </div>
        </div>
      </SectionRenderer>

      {/* CUSTOM SECTIONS */}
      {data.customSections?.map((section: any) => (
        <SectionRenderer key={section.id} title={section.heading} isHidden={hiddenSections.has(`custom-${section.id}`)}>
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b mb-4 pb-1" style={{ borderColor: accentColor }}>{section.heading}</h2>
            <div className="space-y-4">
              {section.items?.map((item: any) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="font-bold text-md">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.date}</div>
                  </div>
                  {item.subtitle && <div className="italic text-gray-700 mb-1">{item.subtitle}</div>}
                  {item.description && <div className="text-sm text-gray-700 mb-2">{item.description}</div>}
                  {item.bullets?.length > 0 && (
                    <ul className="list-disc list-outside ml-4 text-sm space-y-1">
                      {item.bullets.map((b: string, i: number) => b && <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </SectionRenderer>
      ))}

    </div>
  );
}

// ==========================================
// MODERN TEMPLATE
// ==========================================
function ModernTemplate({ data, hiddenSections, accentColor }: any) {
  return (
    <div className="w-[8.5in] min-h-[11in] bg-white text-slate-800 shadow-xl print-content flex flex-col">
      <div className="text-white p-[0.75in] pb-10" style={{ backgroundColor: accentColor }}>
        <div className="flex items-center gap-6">
          {data.photoUrl && <img src={data.photoUrl} alt="Profile" className="w-28 h-28 rounded-xl object-cover shadow-lg border-2 border-white/20" />}
          <div>
            <h1 className="text-5xl font-black mb-2 tracking-tight text-white">{data.fullName || "Your Name"}</h1>
            <div className="text-2xl font-medium mb-4 text-white/90">{data.jobTitle}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm mt-6 text-white/80">
          {data.contact?.email && <div>{data.contact.email}</div>}
          {data.contact?.phone && <div>{data.contact.phone}</div>}
          {data.contact?.location && <div>{data.contact.location}</div>}
          {data.contact?.linkedin && <div>{data.contact.linkedin}</div>}
          {data.contact?.website && <div>{data.contact.website}</div>}
        </div>
      </div>

      <div className="flex-1 p-[0.75in] pt-10">
        <SectionRenderer title="Summary" isHidden={hiddenSections.has("summary") || !data.summary}>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-0.5 inline-block" style={{ backgroundColor: accentColor }}></span> Profile
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">{data.summary}</p>
          </div>
        </SectionRenderer>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <SectionRenderer title="Experience" isHidden={hiddenSections.has("experience") || !data.workExperience?.length}>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 inline-block" style={{ backgroundColor: accentColor }}></span> Experience
                </h2>
                <div className="space-y-6">
                  {data.workExperience?.map((work: any) => (
                    <div key={work.id}>
                      <div className="font-bold text-slate-900">{work.title}</div>
                      <div className="text-sm font-medium mb-1" style={{ color: accentColor }}>{work.company}</div>
                      <div className="text-xs text-slate-500 mb-2">{work.startDate} – {work.current ? "Present" : work.endDate}</div>
                      {work.bullets?.length > 0 && (
                        <ul className="list-disc list-outside ml-4 text-sm text-slate-600 space-y-1">
                          {work.bullets.map((b: string, i: number) => b && <li key={i}>{b}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </SectionRenderer>
            
            <SectionRenderer title="Projects" isHidden={hiddenSections.has("projects") || !data.projects?.length}>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 inline-block" style={{ backgroundColor: accentColor }}></span> Projects
                </h2>
                <div className="space-y-6">
                  {data.projects?.map((proj: any) => (
                    <div key={proj.id}>
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-slate-900">{proj.name}</div>
                        {proj.url && <div className="text-xs" style={{ color: accentColor }}>{proj.url}</div>}
                      </div>
                      {proj.description && <div className="text-sm text-slate-600 my-1">{proj.description}</div>}
                      {proj.technologies?.length > 0 && <div className="text-xs text-slate-500 mb-2 font-mono">{proj.technologies.join(" / ")}</div>}
                      {proj.bullets?.length > 0 && (
                        <ul className="list-disc list-outside ml-4 text-sm text-slate-600 space-y-1">
                          {proj.bullets.map((b: string, i: number) => b && <li key={i}>{b}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </SectionRenderer>

            {/* Custom Sections Left Column */}
            {data.customSections?.map((section: any) => (
              <SectionRenderer key={section.id} title={section.heading} isHidden={hiddenSections.has(`custom-${section.id}`)}>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-0.5 inline-block" style={{ backgroundColor: accentColor }}></span> {section.heading}
                  </h2>
                  <div className="space-y-5">
                    {section.items?.map((item: any) => (
                      <div key={item.id}>
                        <div className="font-bold text-slate-900">{item.title}</div>
                        {item.subtitle && <div className="text-sm font-medium mb-1" style={{ color: accentColor }}>{item.subtitle}</div>}
                        <div className="text-xs text-slate-500 mb-2">{item.date}</div>
                        {item.description && <div className="text-sm text-slate-600 mb-2">{item.description}</div>}
                        {item.bullets?.length > 0 && (
                          <ul className="list-disc list-outside ml-4 text-sm text-slate-600 space-y-1">
                            {item.bullets.map((b: string, i: number) => b && <li key={i}>{b}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </SectionRenderer>
            ))}
          </div>

          <div className="space-y-8">
            <SectionRenderer title="Skills" isHidden={hiddenSections.has("skills") || !data.skills?.length}>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 inline-block" style={{ backgroundColor: accentColor }}></span> Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills?.map((s: string, i: number) => (
                    <span key={i} className="text-white px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: accentColor }}>{s}</span>
                  ))}
                </div>
              </div>
            </SectionRenderer>

            <SectionRenderer title="Education" isHidden={hiddenSections.has("education") || !data.education?.length}>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 inline-block" style={{ backgroundColor: accentColor }}></span> Education
                </h2>
                <div className="space-y-4">
                  {data.education?.map((edu: any) => (
                    <div key={edu.id}>
                      <div className="font-bold text-sm text-slate-900">{edu.degree}</div>
                      <div className="text-xs text-slate-600">{edu.institution}</div>
                      <div className="text-xs mt-1" style={{ color: accentColor }}>{edu.startDate} – {edu.current ? "Present" : edu.endDate}</div>
                      {edu.gpa && <div className="text-xs text-slate-500 mt-1">GPA: {edu.gpa}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </SectionRenderer>

            <SectionRenderer title="Certifications" isHidden={hiddenSections.has("certifications") || !data.certifications?.length}>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 inline-block" style={{ backgroundColor: accentColor }}></span> Certifications
                </h2>
                <div className="space-y-3">
                  {data.certifications?.map((cert: any) => (
                    <div key={cert.id}>
                      <div className="font-bold text-sm text-slate-900">{cert.name}</div>
                      <div className="text-xs text-slate-600">{cert.issuer}</div>
                      <div className="text-xs text-slate-400 mt-1">{cert.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionRenderer>

            <SectionRenderer title="Achievements" isHidden={hiddenSections.has("achievements") || !data.achievements?.length}>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 inline-block" style={{ backgroundColor: accentColor }}></span> Achievements
                </h2>
                <div className="space-y-3">
                  {data.achievements?.map((ach: any) => (
                    <div key={ach.id}>
                      <div className="font-bold text-sm text-slate-900">{ach.title}</div>
                      {ach.description && <div className="text-xs text-slate-600 mt-1">{ach.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </SectionRenderer>

            <SectionRenderer title="Languages" isHidden={hiddenSections.has("languages") || !data.languages?.length}>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 inline-block" style={{ backgroundColor: accentColor }}></span> Languages
                </h2>
                <div className="space-y-2">
                  {data.languages?.map((lang: any) => (
                    <div key={lang.id} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionRenderer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MINIMAL TEMPLATE
// ==========================================
function MinimalTemplate({ data, hiddenSections, accentColor }: any) {
  return (
    <div className="w-[8.5in] min-h-[11in] bg-white text-gray-900 p-[1in] shadow-xl print-content">
      <header className="mb-12 flex items-center gap-8">
        {data.photoUrl && <img src={data.photoUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover grayscale" />}
        <div className="flex-1">
          <h1 className="text-3xl font-normal mb-1 tracking-wide" style={{ color: accentColor }}>{data.fullName || "Your Name"}</h1>
          <div className="text-sm text-gray-500 mb-4 tracking-widest uppercase">{data.jobTitle}</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
            {data.contact?.email && <div>{data.contact.email}</div>}
            {data.contact?.phone && <div>{data.contact.phone}</div>}
            {data.contact?.location && <div>{data.contact.location}</div>}
            {data.contact?.linkedin && <div>{data.contact.linkedin}</div>}
            {data.contact?.github && <div>{data.contact.github}</div>}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <SectionRenderer title="Summary" isHidden={hiddenSections.has("summary") || !data.summary}>
          <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-widest pt-1">
            Profile
          </div>
          <div className="col-span-9 mb-10 text-sm leading-relaxed text-gray-700">
            {data.summary}
          </div>
        </SectionRenderer>

        <SectionRenderer title="Experience" isHidden={hiddenSections.has("experience") || !data.workExperience?.length}>
          <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-widest pt-1">
            Experience
          </div>
          <div className="col-span-9 mb-10 space-y-8">
            {data.workExperience?.map((work: any) => (
              <div key={work.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="font-medium text-gray-900">{work.title} <span className="text-gray-400 font-normal">at</span> {work.company}</div>
                  <div className="text-xs text-gray-400">{work.startDate} – {work.current ? "Present" : work.endDate}</div>
                </div>
                {work.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-sm text-gray-600 space-y-1 mt-2">
                    {work.bullets.map((b: string, i: number) => b && <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </SectionRenderer>
        
        <SectionRenderer title="Projects" isHidden={hiddenSections.has("projects") || !data.projects?.length}>
          <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-widest pt-1">
            Projects
          </div>
          <div className="col-span-9 mb-10 space-y-8">
            {data.projects?.map((proj: any) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="font-medium text-gray-900">{proj.name}</div>
                  {proj.url && <div className="text-xs text-gray-400">{proj.url}</div>}
                </div>
                {proj.description && <div className="text-sm text-gray-600 mb-1">{proj.description}</div>}
                {proj.technologies?.length > 0 && <div className="text-xs text-gray-400 mb-2">{proj.technologies.join(" · ")}</div>}
                {proj.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-sm text-gray-600 space-y-1 mt-2">
                    {proj.bullets.map((b: string, i: number) => b && <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </SectionRenderer>

        <SectionRenderer title="Education" isHidden={hiddenSections.has("education") || !data.education?.length}>
          <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-widest pt-1">
            Education
          </div>
          <div className="col-span-9 mb-10 space-y-4">
            {data.education?.map((edu: any) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div className="font-medium text-gray-900">{edu.degree} {edu.field && `, ${edu.field}`}</div>
                  <div className="text-xs text-gray-400">{edu.startDate} – {edu.current ? "Present" : edu.endDate}</div>
                </div>
                <div className="text-sm text-gray-500">{edu.institution}</div>
              </div>
            ))}
          </div>
        </SectionRenderer>

        <SectionRenderer title="Skills" isHidden={hiddenSections.has("skills") || !data.skills?.length}>
          <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-widest pt-1">
            Skills
          </div>
          <div className="col-span-9 mb-10 text-sm text-gray-600 leading-relaxed">
            {data.skills?.join(", ")}
          </div>
        </SectionRenderer>

        <SectionRenderer title="Certifications" isHidden={hiddenSections.has("certifications") || !data.certifications?.length}>
          <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-widest pt-1">
            Certifications
          </div>
          <div className="col-span-9 mb-10 space-y-4">
            {data.certifications?.map((cert: any) => (
              <div key={cert.id} className="flex justify-between items-baseline text-sm">
                <div className="font-medium text-gray-900">{cert.name} <span className="text-gray-400 font-normal">from</span> {cert.issuer}</div>
                <div className="text-xs text-gray-400">{cert.date}</div>
              </div>
            ))}
          </div>
        </SectionRenderer>

        <SectionRenderer title="Achievements" isHidden={hiddenSections.has("achievements") || !data.achievements?.length}>
          <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-widest pt-1">
            Achievements
          </div>
          <div className="col-span-9 mb-10 space-y-4">
            {data.achievements?.map((ach: any) => (
              <div key={ach.id}>
                <div className="font-medium text-gray-900 text-sm">{ach.title}</div>
                {ach.description && <div className="text-sm text-gray-500">{ach.description}</div>}
              </div>
            ))}
          </div>
        </SectionRenderer>

        <SectionRenderer title="Languages" isHidden={hiddenSections.has("languages") || !data.languages?.length}>
          <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-widest pt-1">
            Languages
          </div>
          <div className="col-span-9 mb-10 text-sm text-gray-600">
            {data.languages?.map((lang: any) => `${lang.name} (${lang.level})`).join(", ")}
          </div>
        </SectionRenderer>

        {data.customSections?.map((section: any) => (
          <SectionRenderer key={section.id} title={section.heading} isHidden={hiddenSections.has(`custom-${section.id}`)}>
            <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-widest pt-1">
              {section.heading}
            </div>
            <div className="col-span-9 mb-10 space-y-8">
              {section.items?.map((item: any) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-400">{item.date}</div>
                  </div>
                  {item.subtitle && <div className="text-sm text-gray-500 mb-1">{item.subtitle}</div>}
                  {item.description && <div className="text-sm text-gray-600 mb-2">{item.description}</div>}
                  {item.bullets?.length > 0 && (
                    <ul className="list-disc list-outside ml-4 text-sm text-gray-600 space-y-1 mt-2">
                      {item.bullets.map((b: string, i: number) => b && <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </SectionRenderer>
        ))}

      </div>
    </div>
  );
}
