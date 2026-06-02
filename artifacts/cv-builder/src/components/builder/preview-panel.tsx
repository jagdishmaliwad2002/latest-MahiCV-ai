import { cn } from "@/lib/utils";

export default function PreviewPanel({ data }: { data: any }) {
  const template = data.template || "classic";

  if (template === "classic") return <ClassicTemplate data={data} />;
  if (template === "modern") return <ModernTemplate data={data} />;
  if (template === "minimal") return <MinimalTemplate data={data} />;
  
  return <ClassicTemplate data={data} />;
}

// ==========================================
// CLASSIC TEMPLATE (Serif, traditional)
// ==========================================
function ClassicTemplate({ data }: { data: any }) {
  return (
    <div className="w-[8.5in] min-h-[11in] bg-white text-black p-[0.75in] shadow-xl print-content font-serif">
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-4xl font-bold mb-2 uppercase tracking-wide">{data.fullName || "Your Name"}</h1>
        {data.jobTitle && <div className="text-xl text-gray-700 italic mb-2">{data.jobTitle}</div>}
        <div className="text-sm space-x-2 text-gray-600 font-sans">
          {data.contact?.email && <span>{data.contact.email}</span>}
          {data.contact?.email && data.contact?.phone && <span>•</span>}
          {data.contact?.phone && <span>{data.contact.phone}</span>}
          {data.contact?.phone && data.contact?.location && <span>•</span>}
          {data.contact?.location && <span>{data.contact.location}</span>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-6">
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </div>
      )}

      {data.workExperience?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-4 pb-1">Experience</h2>
          <div className="space-y-4">
            {data.workExperience.map((work: any) => (
              <div key={work.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="font-bold text-md">{work.title}</div>
                  <div className="text-sm text-gray-600 font-sans">{work.startDate} – {work.current ? "Present" : work.endDate}</div>
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
      )}

      {data.projects?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-4 pb-1">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((proj: any) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="font-bold text-md">{proj.name}</div>
                  {proj.url && <div className="text-sm text-blue-600 font-sans">{proj.url}</div>}
                </div>
                {proj.description && <div className="italic text-gray-700 mb-1 text-sm">{proj.description}</div>}
                {proj.technologies?.length > 0 && <div className="text-sm text-gray-600 font-sans mb-2">Technologies: {proj.technologies.join(", ")}</div>}
                {proj.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-sm space-y-1">
                    {proj.bullets.map((b: string, i: number) => b && <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.education?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-4 pb-1">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu: any) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div className="font-bold">{edu.institution}</div>
                  <div className="text-sm text-gray-600 font-sans">{edu.startDate} – {edu.endDate}</div>
                </div>
                <div>{edu.degree} {edu.field && `in ${edu.field}`}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.skills?.length > 0 && (
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 mb-4 pb-1">Skills</h2>
          <div className="text-sm leading-relaxed">
            {data.skills.join(" • ")}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MODERN TEMPLATE (Sans, bold accents)
// ==========================================
function ModernTemplate({ data }: { data: any }) {
  return (
    <div className="w-[8.5in] min-h-[11in] bg-white text-slate-800 shadow-xl print-content font-sans overflow-hidden relative flex flex-col">
      <div className="bg-slate-900 text-white p-[0.75in] pb-10">
        <h1 className="text-5xl font-black mb-2 tracking-tight">{data.fullName || "Your Name"}</h1>
        <div className="text-2xl text-blue-400 font-medium mb-4">{data.jobTitle}</div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-300">
          {data.contact?.email && <div>{data.contact.email}</div>}
          {data.contact?.phone && <div>{data.contact.phone}</div>}
          {data.contact?.location && <div>{data.contact.location}</div>}
        </div>
      </div>

      <div className="flex-1 p-[0.75in] pt-10">
        {data.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-blue-500 inline-block"></span> Profile
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">{data.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            {data.workExperience?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-blue-500 inline-block"></span> Experience
                </h2>
                <div className="space-y-6">
                  {data.workExperience.map((work: any) => (
                    <div key={work.id}>
                      <div className="font-bold text-slate-900">{work.title}</div>
                      <div className="text-sm text-blue-600 font-medium mb-1">{work.company}</div>
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
            )}
            
            {data.projects?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-blue-500 inline-block"></span> Projects
                </h2>
                <div className="space-y-6">
                  {data.projects.map((proj: any) => (
                    <div key={proj.id}>
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-slate-900">{proj.name}</div>
                        {proj.url && <div className="text-xs text-blue-500">{proj.url}</div>}
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
            )}
          </div>

          <div className="space-y-8">
            {data.skills?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-blue-500 inline-block"></span> Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((s: string, i: number) => (
                    <span key={i} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {data.education?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-blue-500 inline-block"></span> Education
                </h2>
                <div className="space-y-4">
                  {data.education.map((edu: any) => (
                    <div key={edu.id}>
                      <div className="font-bold text-sm text-slate-900">{edu.degree}</div>
                      <div className="text-xs text-slate-600">{edu.institution}</div>
                      <div className="text-xs text-slate-400 mt-1">{edu.startDate} – {edu.endDate}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MINIMAL TEMPLATE (Whitespace, no borders)
// ==========================================
function MinimalTemplate({ data }: { data: any }) {
  return (
    <div className="w-[8.5in] min-h-[11in] bg-white text-gray-900 p-[1in] shadow-xl print-content font-sans">
      <header className="mb-12">
        <h1 className="text-3xl font-normal mb-1">{data.fullName || "Your Name"}</h1>
        <div className="text-sm text-gray-500 mb-4">{data.jobTitle}</div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
          {data.contact?.email && <div>{data.contact.email}</div>}
          {data.contact?.phone && <div>{data.contact.phone}</div>}
          {data.contact?.location && <div>{data.contact.location}</div>}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-widest pt-1">
          Profile
        </div>
        <div className="col-span-9 mb-10 text-sm leading-relaxed text-gray-700">
          {data.summary}
        </div>

        {data.workExperience?.length > 0 && (
          <>
            <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-widest pt-1">
              Experience
            </div>
            <div className="col-span-9 mb-10 space-y-8">
              {data.workExperience.map((work: any) => (
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
          </>
        )}
        
        {data.projects?.length > 0 && (
          <>
            <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-widest pt-1">
              Projects
            </div>
            <div className="col-span-9 mb-10 space-y-8">
              {data.projects.map((proj: any) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="font-medium text-gray-900">{proj.name}</div>
                    {proj.url && <div className="text-xs text-gray-400">{proj.url}</div>}
                  </div>
                  {proj.description && <div className="text-sm text-gray-600 mb-1">{proj.description}</div>}
                  {proj.technologies?.length > 0 && <div className="text-xs text-gray-400 font-mono mb-2">{proj.technologies.join(" · ")}</div>}
                  {proj.bullets?.length > 0 && (
                    <ul className="list-disc list-outside ml-4 text-sm text-gray-600 space-y-1 mt-2">
                      {proj.bullets.map((b: string, i: number) => b && <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {data.education?.length > 0 && (
          <>
            <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-widest pt-1">
              Education
            </div>
            <div className="col-span-9 mb-10 space-y-4">
              {data.education.map((edu: any) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <div className="font-medium text-gray-900">{edu.degree} {edu.field && `, ${edu.field}`}</div>
                    <div className="text-xs text-gray-400">{edu.startDate} – {edu.endDate}</div>
                  </div>
                  <div className="text-sm text-gray-500">{edu.institution}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {data.skills?.length > 0 && (
          <>
            <div className="col-span-3 text-xs font-medium text-gray-400 uppercase tracking-widest pt-1">
              Skills
            </div>
            <div className="col-span-9 text-sm text-gray-600 leading-relaxed">
              {data.skills.join(", ")}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
