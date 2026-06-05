export default function PreviewPanel({ data, hiddenSections, accentColor, fontFamily }: { data: any; hiddenSections: Set<string>; accentColor: string; fontFamily: string }) {
  const template = data.template || "classic";
  const props = { data, hiddenSections, accentColor, fontFamily };

  return (
    <div style={{ fontFamily }}>
      {template === "classic"   && <ClassicTemplate   {...props} />}
      {template === "modern"    && <ModernTemplate    {...props} />}
      {template === "minimal"   && <MinimalTemplate   {...props} />}
      {template === "executive" && <ExecutiveTemplate {...props} />}
    </div>
  );
}

function Sec({ isHidden, children }: { isHidden: boolean; children: React.ReactNode }) {
  if (isHidden) return null;
  return <>{children}</>;
}

/* ═══════════════════════════════════════
   CLASSIC
═══════════════════════════════════════ */
function ClassicTemplate({ data, hiddenSections, accentColor }: any) {
  const hid = (k: string) => hiddenSections.has(k);
  return (
    <div className="w-[8.5in] min-h-[11in] bg-white text-black p-[0.75in] shadow-xl print-content">
      <div className="text-center border-b-2 pb-5 mb-6" style={{ borderColor: accentColor }}>
        {data.photoUrl && <img src={data.photoUrl} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4" style={{ borderColor: accentColor }} />}
        <h1 className="text-4xl font-bold uppercase tracking-wide mb-2" style={{ color: accentColor }}>{data.fullName || "Your Name"}</h1>
        {data.jobTitle && <div className="text-xl text-gray-600 italic mb-3">{data.jobTitle}</div>}
        <div className="text-sm flex flex-wrap justify-center gap-x-2 text-gray-500">
          {data.contact?.email    && <span>{data.contact.email}</span>}
          {data.contact?.phone    && <><span>•</span><span>{data.contact.phone}</span></>}
          {data.contact?.location && <><span>•</span><span>{data.contact.location}</span></>}
          {data.contact?.linkedin && <><span>•</span><span>{data.contact.linkedin}</span></>}
          {data.contact?.website  && <><span>•</span><span>{data.contact.website}</span></>}
          {data.contact?.github   && <><span>•</span><span>{data.contact.github}</span></>}
        </div>
      </div>

      <Sec isHidden={hid("summary") || !data.summary}>
        <div className="mb-6"><p className="text-sm leading-relaxed">{data.summary}</p></div>
      </Sec>

      <Sec isHidden={hid("experience") || !data.workExperience?.length}>
        <ClassicSection title="Experience" accentColor={accentColor}>
          {data.workExperience?.map((w: any) => (
            <div key={w.id} className="mb-4">
              <div className="flex justify-between items-baseline mb-0.5">
                <div className="font-bold">{w.title}</div>
                <div className="text-sm text-gray-500">{w.startDate} – {w.current ? "Present" : w.endDate}</div>
              </div>
              <div className="italic text-gray-600 text-sm mb-2">{w.company}{w.location && `, ${w.location}`}</div>
              {w.bullets?.length > 0 && <ul className="list-disc list-outside ml-4 text-sm space-y-1">{w.bullets.map((b: string, i: number) => b && <li key={i}>{b}</li>)}</ul>}
            </div>
          ))}
        </ClassicSection>
      </Sec>

      <Sec isHidden={hid("projects") || !data.projects?.length}>
        <ClassicSection title="Projects" accentColor={accentColor}>
          {data.projects?.map((p: any) => (
            <div key={p.id} className="mb-4">
              <div className="flex justify-between items-baseline mb-0.5">
                <div className="font-bold">{p.name}</div>
                {p.url && <div className="text-sm" style={{ color: accentColor }}>{p.url}</div>}
              </div>
              {p.description && <div className="italic text-gray-600 text-sm mb-1">{p.description}</div>}
              {p.technologies?.length > 0 && <div className="text-sm text-gray-500 mb-1">Tech: {p.technologies.join(", ")}</div>}
              {p.bullets?.length > 0 && <ul className="list-disc list-outside ml-4 text-sm space-y-1">{p.bullets.map((b: string, i: number) => b && <li key={i}>{b}</li>)}</ul>}
            </div>
          ))}
        </ClassicSection>
      </Sec>

      <Sec isHidden={hid("education") || !data.education?.length}>
        <ClassicSection title="Education" accentColor={accentColor}>
          {data.education?.map((e: any) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <div className="font-bold">{e.institution}</div>
                <div className="text-sm text-gray-500">{e.startDate} – {e.current ? "Present" : e.endDate}</div>
              </div>
              <div className="text-sm">{e.degree}{e.field && ` in ${e.field}`}{e.gpa && ` (GPA: ${e.gpa})`}</div>
            </div>
          ))}
        </ClassicSection>
      </Sec>

      <Sec isHidden={hid("skills") || !data.skills?.length}>
        <ClassicSection title="Skills" accentColor={accentColor}>
          <div className="text-sm leading-relaxed">{data.skills?.join(" • ")}</div>
        </ClassicSection>
      </Sec>

      <Sec isHidden={hid("certifications") || !data.certifications?.length}>
        <ClassicSection title="Certifications" accentColor={accentColor}>
          {data.certifications?.map((c: any) => (
            <div key={c.id} className="flex justify-between text-sm mb-1">
              <span><strong>{c.name}</strong>, {c.issuer}</span>
              <span className="text-gray-500">{c.date}</span>
            </div>
          ))}
        </ClassicSection>
      </Sec>

      <Sec isHidden={hid("achievements") || !data.achievements?.length}>
        <ClassicSection title="Achievements" accentColor={accentColor}>
          <ul className="list-disc list-outside ml-4 text-sm space-y-1">
            {data.achievements?.map((a: any) => <li key={a.id}><strong>{a.title}</strong>{a.description && `: ${a.description}`}</li>)}
          </ul>
        </ClassicSection>
      </Sec>

      <Sec isHidden={hid("languages") || !data.languages?.length}>
        <ClassicSection title="Languages" accentColor={accentColor}>
          <div className="text-sm">{data.languages?.map((l: any) => `${l.name} (${l.level})`).join(" • ")}</div>
        </ClassicSection>
      </Sec>

      {data.customSections?.map((s: any) => (
        <Sec key={s.id} isHidden={hid(`custom-${s.id}`)}>
          <ClassicSection title={s.heading} accentColor={accentColor}>
            {s.items?.map((item: any) => (
              <div key={item.id} className="mb-3">
                <div className="flex justify-between items-baseline mb-0.5">
                  <div className="font-bold">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.date}</div>
                </div>
                {item.subtitle && <div className="italic text-gray-600 text-sm mb-1">{item.subtitle}</div>}
                {item.description && <div className="text-sm text-gray-700">{item.description}</div>}
              </div>
            ))}
          </ClassicSection>
        </Sec>
      ))}
    </div>
  );
}

function ClassicSection({ title, accentColor, children }: { title: string; accentColor: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-bold uppercase tracking-wider border-b mb-4 pb-1" style={{ borderColor: accentColor }}>{title}</h2>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════
   MODERN
═══════════════════════════════════════ */
function ModernTemplate({ data, hiddenSections, accentColor }: any) {
  const hid = (k: string) => hiddenSections.has(k);
  return (
    <div className="w-[8.5in] min-h-[11in] bg-white text-slate-800 shadow-xl print-content flex flex-col">
      <div className="text-white p-[0.75in] pb-10" style={{ backgroundColor: accentColor }}>
        <div className="flex items-center gap-6">
          {data.photoUrl && <img src={data.photoUrl} alt="Profile" className="w-28 h-28 rounded-xl object-cover shadow-lg border-4 border-white/30 shrink-0" />}
          <div>
            <h1 className="text-4xl font-black mb-1 tracking-tight">{data.fullName || "Your Name"}</h1>
            {data.jobTitle && <div className="text-xl font-medium text-white/85">{data.jobTitle}</div>}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm mt-5 text-white/75">
          {data.contact?.email    && <span>{data.contact.email}</span>}
          {data.contact?.phone    && <span>{data.contact.phone}</span>}
          {data.contact?.location && <span>{data.contact.location}</span>}
          {data.contact?.linkedin && <span>{data.contact.linkedin}</span>}
          {data.contact?.website  && <span>{data.contact.website}</span>}
          {data.contact?.github   && <span>{data.contact.github}</span>}
        </div>
      </div>

      <div className="flex-1 p-[0.75in] pt-8">
        <Sec isHidden={hid("summary") || !data.summary}>
          <div className="mb-8">
            <ModernH title="Profile" accentColor={accentColor} />
            <p className="text-sm leading-relaxed text-slate-600">{data.summary}</p>
          </div>
        </Sec>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-7">
            <Sec isHidden={hid("experience") || !data.workExperience?.length}>
              <div>
                <ModernH title="Experience" accentColor={accentColor} />
                <div className="space-y-5">
                  {data.workExperience?.map((w: any) => (
                    <div key={w.id}>
                      <div className="font-bold text-slate-900 text-sm">{w.title}</div>
                      <div className="text-sm font-medium mb-0.5" style={{ color: accentColor }}>{w.company}</div>
                      <div className="text-xs text-slate-400 mb-2">{w.startDate} – {w.current ? "Present" : w.endDate}</div>
                      {w.bullets?.length > 0 && <ul className="list-disc list-outside ml-4 text-sm text-slate-600 space-y-1">{w.bullets.map((b: string, i: number) => b && <li key={i}>{b}</li>)}</ul>}
                    </div>
                  ))}
                </div>
              </div>
            </Sec>

            <Sec isHidden={hid("projects") || !data.projects?.length}>
              <div>
                <ModernH title="Projects" accentColor={accentColor} />
                <div className="space-y-5">
                  {data.projects?.map((p: any) => (
                    <div key={p.id}>
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                        {p.url && <div className="text-xs" style={{ color: accentColor }}>{p.url}</div>}
                      </div>
                      {p.description && <div className="text-sm text-slate-600 my-1">{p.description}</div>}
                      {p.technologies?.length > 0 && <div className="text-xs text-slate-400 mb-1 font-mono">{p.technologies.join(" / ")}</div>}
                      {p.bullets?.length > 0 && <ul className="list-disc list-outside ml-4 text-sm text-slate-600 space-y-1">{p.bullets.map((b: string, i: number) => b && <li key={i}>{b}</li>)}</ul>}
                    </div>
                  ))}
                </div>
              </div>
            </Sec>

            {data.customSections?.map((s: any) => (
              <Sec key={s.id} isHidden={hid(`custom-${s.id}`)}>
                <div>
                  <ModernH title={s.heading} accentColor={accentColor} />
                  <div className="space-y-4">
                    {s.items?.map((item: any) => (
                      <div key={item.id}>
                        <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                        {item.subtitle && <div className="text-sm font-medium mb-0.5" style={{ color: accentColor }}>{item.subtitle}</div>}
                        {item.date && <div className="text-xs text-slate-400 mb-1">{item.date}</div>}
                        {item.description && <div className="text-sm text-slate-600">{item.description}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </Sec>
            ))}
          </div>

          <div className="space-y-7">
            <Sec isHidden={hid("skills") || !data.skills?.length}>
              <div>
                <ModernH title="Skills" accentColor={accentColor} />
                <div className="flex flex-wrap gap-1.5">
                  {data.skills?.map((s: string, i: number) => <span key={i} className="text-white px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: accentColor }}>{s}</span>)}
                </div>
              </div>
            </Sec>

            <Sec isHidden={hid("education") || !data.education?.length}>
              <div>
                <ModernH title="Education" accentColor={accentColor} />
                <div className="space-y-3">
                  {data.education?.map((e: any) => (
                    <div key={e.id}>
                      <div className="font-bold text-sm">{e.degree}</div>
                      <div className="text-xs text-slate-600">{e.institution}</div>
                      <div className="text-xs mt-0.5" style={{ color: accentColor }}>{e.startDate} – {e.current ? "Present" : e.endDate}</div>
                      {e.gpa && <div className="text-xs text-slate-400">GPA: {e.gpa}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </Sec>

            <Sec isHidden={hid("certifications") || !data.certifications?.length}>
              <div>
                <ModernH title="Certifications" accentColor={accentColor} />
                <div className="space-y-2">
                  {data.certifications?.map((c: any) => (
                    <div key={c.id}>
                      <div className="font-bold text-xs">{c.name}</div>
                      <div className="text-xs text-slate-500">{c.issuer}</div>
                      <div className="text-xs text-slate-400">{c.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Sec>

            <Sec isHidden={hid("achievements") || !data.achievements?.length}>
              <div>
                <ModernH title="Achievements" accentColor={accentColor} />
                <div className="space-y-2">
                  {data.achievements?.map((a: any) => (
                    <div key={a.id}>
                      <div className="font-bold text-xs">{a.title}</div>
                      {a.description && <div className="text-xs text-slate-500 mt-0.5">{a.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </Sec>

            <Sec isHidden={hid("languages") || !data.languages?.length}>
              <div>
                <ModernH title="Languages" accentColor={accentColor} />
                <div className="space-y-1.5">
                  {data.languages?.map((l: any) => (
                    <div key={l.id} className="flex justify-between items-center">
                      <span className="text-xs font-medium">{l.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Sec>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModernH({ title, accentColor }: { title: string; accentColor: string }) {
  return (
    <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
      <span className="w-5 h-0.5 inline-block shrink-0" style={{ backgroundColor: accentColor }} />
      {title}
    </h2>
  );
}

/* ═══════════════════════════════════════
   MINIMAL
═══════════════════════════════════════ */
function MinimalTemplate({ data, hiddenSections, accentColor }: any) {
  const hid = (k: string) => hiddenSections.has(k);
  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <>
      <div className="col-span-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest pt-1">{label}</div>
      <div className="col-span-9 mb-8">{children}</div>
    </>
  );

  return (
    <div className="w-[8.5in] min-h-[11in] bg-white text-gray-900 p-[1in] shadow-xl print-content">
      <header className="mb-10 flex items-center gap-8">
        {data.photoUrl && <img src={data.photoUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover shrink-0" style={{ border: `3px solid ${accentColor}` }} />}
        <div className="flex-1">
          <h1 className="text-3xl font-light mb-1 tracking-wide" style={{ color: accentColor }}>{data.fullName || "Your Name"}</h1>
          {data.jobTitle && <div className="text-sm text-gray-400 mb-3 tracking-widest uppercase">{data.jobTitle}</div>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
            {data.contact?.email    && <span>{data.contact.email}</span>}
            {data.contact?.phone    && <span>{data.contact.phone}</span>}
            {data.contact?.location && <span>{data.contact.location}</span>}
            {data.contact?.linkedin && <span>{data.contact.linkedin}</span>}
            {data.contact?.github   && <span>{data.contact.github}</span>}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-x-6">
        {!hid("summary") && data.summary && <Row label="Profile"><p className="text-sm leading-relaxed text-gray-600">{data.summary}</p></Row>}
        {!hid("experience") && data.workExperience?.length > 0 && (
          <Row label="Experience">
            <div className="space-y-6">
              {data.workExperience.map((w: any) => (
                <div key={w.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="font-medium text-gray-900 text-sm">{w.title} <span className="text-gray-400 font-normal">at</span> {w.company}</div>
                    <div className="text-xs text-gray-400">{w.startDate} – {w.current ? "Present" : w.endDate}</div>
                  </div>
                  {w.bullets?.length > 0 && <ul className="list-disc list-outside ml-4 text-sm text-gray-500 space-y-1 mt-1">{w.bullets.map((b: string, i: number) => b && <li key={i}>{b}</li>)}</ul>}
                </div>
              ))}
            </div>
          </Row>
        )}
        {!hid("projects") && data.projects?.length > 0 && (
          <Row label="Projects">
            <div className="space-y-5">
              {data.projects.map((p: any) => (
                <div key={p.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="font-medium text-sm">{p.name}</div>
                    {p.url && <div className="text-xs text-gray-400">{p.url}</div>}
                  </div>
                  {p.description && <div className="text-sm text-gray-500 mb-1">{p.description}</div>}
                  {p.technologies?.length > 0 && <div className="text-xs text-gray-400">{p.technologies.join(" · ")}</div>}
                </div>
              ))}
            </div>
          </Row>
        )}
        {!hid("education") && data.education?.length > 0 && (
          <Row label="Education">
            <div className="space-y-4">
              {data.education.map((e: any) => (
                <div key={e.id}>
                  <div className="flex justify-between items-baseline">
                    <div className="font-medium text-sm">{e.institution}</div>
                    <div className="text-xs text-gray-400">{e.startDate} – {e.current ? "Present" : e.endDate}</div>
                  </div>
                  <div className="text-sm text-gray-500">{e.degree}{e.field && ` · ${e.field}`}{e.gpa && ` · GPA ${e.gpa}`}</div>
                </div>
              ))}
            </div>
          </Row>
        )}
        {!hid("skills") && data.skills?.length > 0 && (
          <Row label="Skills"><div className="text-sm text-gray-600 leading-relaxed">{data.skills.join(" · ")}</div></Row>
        )}
        {!hid("certifications") && data.certifications?.length > 0 && (
          <Row label="Certs">
            <div className="space-y-2">
              {data.certifications.map((c: any) => (
                <div key={c.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{c.name}, <span className="text-gray-400">{c.issuer}</span></span>
                  <span className="text-gray-400 text-xs">{c.date}</span>
                </div>
              ))}
            </div>
          </Row>
        )}
        {!hid("achievements") && data.achievements?.length > 0 && (
          <Row label="Awards">
            <ul className="list-disc list-outside ml-4 text-sm text-gray-600 space-y-1">
              {data.achievements.map((a: any) => <li key={a.id}><span className="font-medium">{a.title}</span>{a.description && ` — ${a.description}`}</li>)}
            </ul>
          </Row>
        )}
        {!hid("languages") && data.languages?.length > 0 && (
          <Row label="Languages">
            <div className="text-sm text-gray-600">{data.languages.map((l: any) => `${l.name} (${l.level})`).join(" · ")}</div>
          </Row>
        )}
        {data.customSections?.map((s: any) => !hid(`custom-${s.id}`) && (
          <Row key={s.id} label={s.heading}>
            <div className="space-y-4">
              {s.items?.map((item: any) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <div className="font-medium text-sm">{item.title}</div>
                    {item.date && <div className="text-xs text-gray-400">{item.date}</div>}
                  </div>
                  {item.subtitle && <div className="text-xs text-gray-400 mb-1">{item.subtitle}</div>}
                  {item.description && <div className="text-sm text-gray-500">{item.description}</div>}
                </div>
              ))}
            </div>
          </Row>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   EXECUTIVE  (matches uploaded PDF style)
   • Name left + contact icons right
   • UPPERCASE section headers with accent rule
   • Skill category detection (bold "Label:" prefix)
   • Two-column Education + Achievements footer
═══════════════════════════════════════ */
function ExecutiveTemplate({ data, hiddenSections, accentColor }: any) {
  const hid = (k: string) => hiddenSections.has(k);

  /* Detect "Category: item1, item2" skill format */
  const hasCategorySkills = data.skills?.some((s: string) => s.includes(":"));

  return (
    <div className="w-[8.5in] min-h-[11in] bg-white text-black shadow-xl print-content" style={{ padding: "0.6in 0.65in", fontSize: "9.8pt", lineHeight: 1.45 }}>

      {/* ── Header ── */}
      <div className="flex justify-between items-start mb-2">
        <div>
          {data.photoUrl && (
            <img src={data.photoUrl} alt="Profile" className="w-16 h-16 rounded object-cover mb-2" style={{ border: `2px solid ${accentColor}` }} />
          )}
          <h1 style={{ fontSize: "26pt", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.5px" }}>{data.fullName || "Your Name"}</h1>
          {data.jobTitle && (
            <div style={{ fontSize: "10.5pt", fontWeight: 600, letterSpacing: "2px", color: "#444", textTransform: "uppercase", marginTop: "4px" }}>
              {data.jobTitle}
            </div>
          )}
        </div>

        {/* Contact block — right side with emoji icons */}
        <div style={{ textAlign: "right", fontSize: "8.8pt", lineHeight: 1.8, color: "#444", marginTop: "4px", minWidth: "220px" }}>
          {data.contact?.phone    && <div>📞 {data.contact.phone}</div>}
          {data.contact?.email    && <div>📧 {data.contact.email}</div>}
          {data.contact?.github   && <div>🔗 {data.contact.github}</div>}
          {data.contact?.website  && <div>🌐 {data.contact.website}</div>}
          {data.contact?.linkedin && <div>💼 {data.contact.linkedin}</div>}
          {data.contact?.location && <div>📍 {data.contact.location}</div>}
        </div>
      </div>

      {/* Accent rule */}
      <div style={{ height: "2.5px", backgroundColor: accentColor, marginBottom: "10px" }} />

      {/* ── Summary ── */}
      <Sec isHidden={hid("summary") || !data.summary}>
        <p style={{ marginBottom: "14px", color: "#333" }}>{data.summary}</p>
      </Sec>

      {/* ── Technical Skills ── */}
      <Sec isHidden={hid("skills") || !data.skills?.length}>
        <ExecSection title="Technical Skills" accentColor={accentColor}>
          {hasCategorySkills ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {data.skills.map((s: string, i: number) => {
                const colonIdx = s.indexOf(":");
                if (colonIdx > -1) {
                  const cat = s.slice(0, colonIdx).trim();
                  const vals = s.slice(colonIdx + 1).trim();
                  return (
                    <div key={i} style={{ display: "flex", gap: "6px" }}>
                      <span style={{ fontWeight: 700, minWidth: "170px", flexShrink: 0 }}>{cat}:</span>
                      <span style={{ color: "#333" }}>{vals}</span>
                    </div>
                  );
                }
                return <span key={i} style={{ color: "#333" }}>{s}</span>;
              })}
            </div>
          ) : (
            <div style={{ color: "#333" }}>{data.skills.join(" • ")}</div>
          )}
        </ExecSection>
      </Sec>

      {/* ── Key Projects ── */}
      <Sec isHidden={hid("projects") || !data.projects?.length}>
        <ExecSection title="Key Projects" accentColor={accentColor}>
          {data.projects?.map((p: any) => (
            <div key={p.id} style={{ marginBottom: "10px" }}>
              <div style={{ fontWeight: 700 }}>
                {p.name}
                {p.description && <span style={{ fontWeight: 400, color: "#555" }}> — {p.description}</span>}
              </div>
              {p.technologies?.length > 0 && (
                <div style={{ color: "#555", marginBottom: "3px" }}>
                  <span style={{ fontWeight: 600 }}>Technologies: </span>{p.technologies.join(", ")}
                </div>
              )}
              {p.bullets?.length > 0 && (
                <ul style={{ paddingLeft: "16px", margin: "2px 0 0" }}>
                  {p.bullets.map((b: string, i: number) => b && <li key={i} style={{ listStyleType: "disc", color: "#333", marginBottom: "2px" }}>{b}</li>)}
                </ul>
              )}
              {p.url && <div style={{ color: accentColor, fontSize: "8.5pt" }}>{p.url}</div>}
            </div>
          ))}
        </ExecSection>
      </Sec>

      {/* ── Professional Experience ── */}
      <Sec isHidden={hid("experience") || !data.workExperience?.length}>
        <ExecSection title="Professional Experience" accentColor={accentColor}>
          {data.workExperience?.map((w: any) => (
            <div key={w.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700 }}>{w.title}{w.company && <span style={{ fontWeight: 400 }}> — {w.company}</span>}</span>
                <span style={{ color: "#555", fontSize: "8.8pt", flexShrink: 0, marginLeft: "8px" }}>{w.startDate} – {w.current ? "Present" : w.endDate}</span>
              </div>
              {w.location && <div style={{ color: "#666", fontSize: "8.5pt" }}>{w.location}</div>}
              {w.bullets?.length > 0 && (
                <ul style={{ paddingLeft: "16px", margin: "3px 0 0" }}>
                  {w.bullets.map((b: string, i: number) => b && <li key={i} style={{ listStyleType: "disc", color: "#333", marginBottom: "2px" }}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </ExecSection>
      </Sec>

      {/* ── Certifications ── */}
      <Sec isHidden={hid("certifications") || !data.certifications?.length}>
        <ExecSection title="Certifications" accentColor={accentColor}>
          {data.certifications?.map((c: any) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
              <span><strong>{c.name}</strong>, {c.issuer}</span>
              <span style={{ color: "#666", fontSize: "8.5pt" }}>{c.date}</span>
            </div>
          ))}
        </ExecSection>
      </Sec>

      {/* ── Languages ── */}
      <Sec isHidden={hid("languages") || !data.languages?.length}>
        <ExecSection title="Languages" accentColor={accentColor}>
          <div>{data.languages?.map((l: any) => `${l.name} (${l.level})`).join(" • ")}</div>
        </ExecSection>
      </Sec>

      {/* Custom Sections */}
      {data.customSections?.map((s: any) => (
        <Sec key={s.id} isHidden={hid(`custom-${s.id}`)}>
          <ExecSection title={s.heading} accentColor={accentColor}>
            {s.items?.map((item: any) => (
              <div key={item.id} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{item.title}</strong>
                  {item.date && <span style={{ color: "#666", fontSize: "8.5pt" }}>{item.date}</span>}
                </div>
                {item.subtitle && <div style={{ color: "#555", fontStyle: "italic" }}>{item.subtitle}</div>}
                {item.description && <div style={{ color: "#444" }}>{item.description}</div>}
              </div>
            ))}
          </ExecSection>
        </Sec>
      ))}

      {/* ── Two-column footer: Education + Achievements ── */}
      {(!hid("education") && data.education?.length > 0) || (!hid("achievements") && data.achievements?.length > 0) ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "6px" }}>
          <Sec isHidden={hid("education") || !data.education?.length}>
            <ExecSection title="Education" accentColor={accentColor}>
              {data.education?.map((e: any) => (
                <div key={e.id} style={{ marginBottom: "6px" }}>
                  <div style={{ fontWeight: 700 }}>{e.degree}{e.field && ` (${e.field})`}</div>
                  <div>{e.institution}</div>
                  {e.gpa && <div style={{ color: "#666" }}>CGPA: {e.gpa}</div>}
                  <div style={{ color: "#666", fontSize: "8.5pt" }}>{e.startDate}{e.endDate || e.current ? ` – ${e.current ? "Present" : e.endDate}` : ""}</div>
                </div>
              ))}
            </ExecSection>
          </Sec>

          <Sec isHidden={hid("achievements") || !data.achievements?.length}>
            <ExecSection title="Key Strengths & Achievements" accentColor={accentColor}>
              <ul style={{ paddingLeft: "16px" }}>
                {data.achievements?.map((a: any) => (
                  <li key={a.id} style={{ listStyleType: "disc", marginBottom: "3px" }}>
                    <strong>{a.title}</strong>{a.description && `: ${a.description}`}
                  </li>
                ))}
              </ul>
            </ExecSection>
          </Sec>
        </div>
      ) : null}
    </div>
  );
}

function ExecSection({ title, accentColor, children }: { title: string; accentColor: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <h2 style={{ fontSize: "10pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "4px" }}>{title}</h2>
      <div style={{ height: "1.5px", backgroundColor: accentColor, marginBottom: "7px" }} />
      {children}
    </div>
  );
}
