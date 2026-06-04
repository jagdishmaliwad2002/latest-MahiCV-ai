import { Router } from "express";
import { db } from "@workspace/db";
import { resumesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  GetResumeParams,
  UpdateResumeParams,
  UpdateResumeBody,
  DeleteResumeParams,
  DuplicateResumeParams,
  CreateResumeBody,
} from "@workspace/api-zod";

const router = Router();

router.get("/resumes", async (req, res) => {
  try {
    const resumes = await db.select().from(resumesTable).orderBy(resumesTable.updatedAt);
    res.json(resumes.map(formatResume));
  } catch (err) {
    req.log.error({ err }, "Failed to list resumes");
    res.status(500).json({ error: "Failed to list resumes" });
  }
});

router.post("/resumes", async (req, res): Promise<void> => {
  const parsed = CreateResumeBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request body" }); return; }
  try {
    const [resume] = await db.insert(resumesTable).values({
      title: parsed.data.title,
      template: parsed.data.template ?? "classic",
      workExperience: [], education: [], skills: [], projects: [],
      certifications: [], achievements: [], languages: [], customSections: [],
    }).returning();
    res.status(201).json(formatResume(resume));
  } catch (err) {
    req.log.error({ err }, "Failed to create resume");
    res.status(500).json({ error: "Failed to create resume" });
  }
});

router.get("/resumes/:id", async (req, res): Promise<void> => {
  const parsed = GetResumeParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const [resume] = await db.select().from(resumesTable).where(eq(resumesTable.id, parsed.data.id));
    if (!resume) { res.status(404).json({ error: "Resume not found" }); return; }
    res.json(formatResume(resume));
  } catch (err) {
    req.log.error({ err }, "Failed to get resume");
    res.status(500).json({ error: "Failed to get resume" });
  }
});

router.patch("/resumes/:id", async (req, res): Promise<void> => {
  const paramsParsed = UpdateResumeParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) { res.status(400).json({ error: "Invalid ID" }); return; }
  const bodyParsed = UpdateResumeBody.safeParse(req.body);
  if (!bodyParsed.success) { res.status(400).json({ error: "Invalid request body" }); return; }
  try {
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    const b = bodyParsed.data;
    if (b.title !== undefined) updateData.title = b.title;
    if (b.template !== undefined) updateData.template = b.template;
    if (b.fullName !== undefined) updateData.fullName = b.fullName;
    if (b.jobTitle !== undefined) updateData.jobTitle = b.jobTitle;
    if (b.summary !== undefined) updateData.summary = b.summary;
    if (b.photoUrl !== undefined) updateData.photoUrl = b.photoUrl;
    if (b.contact !== undefined) updateData.contact = b.contact;
    if (b.workExperience !== undefined) updateData.workExperience = b.workExperience;
    if (b.education !== undefined) updateData.education = b.education;
    if (b.skills !== undefined) updateData.skills = b.skills;
    if (b.projects !== undefined) updateData.projects = b.projects;
    if (b.certifications !== undefined) updateData.certifications = b.certifications;
    if (b.achievements !== undefined) updateData.achievements = b.achievements;
    if (b.languages !== undefined) updateData.languages = b.languages;
    if (b.customSections !== undefined) updateData.customSections = b.customSections;

    const [resume] = await db.update(resumesTable).set(updateData)
      .where(eq(resumesTable.id, paramsParsed.data.id)).returning();
    if (!resume) { res.status(404).json({ error: "Resume not found" }); return; }
    res.json(formatResume(resume));
  } catch (err) {
    req.log.error({ err }, "Failed to update resume");
    res.status(500).json({ error: "Failed to update resume" });
  }
});

router.delete("/resumes/:id", async (req, res): Promise<void> => {
  const parsed = DeleteResumeParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const [deleted] = await db.delete(resumesTable).where(eq(resumesTable.id, parsed.data.id)).returning();
    if (!deleted) { res.status(404).json({ error: "Resume not found" }); return; }
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete resume");
    res.status(500).json({ error: "Failed to delete resume" });
  }
});

router.post("/resumes/:id/duplicate", async (req, res): Promise<void> => {
  const parsed = DuplicateResumeParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const [original] = await db.select().from(resumesTable).where(eq(resumesTable.id, parsed.data.id));
    if (!original) { res.status(404).json({ error: "Resume not found" }); return; }
    const { id: _id, createdAt: _ca, updatedAt: _ua, title, ...rest } = original;
    const [copy] = await db.insert(resumesTable).values({ ...rest, title: `${title} (Copy)` }).returning();
    res.status(201).json(formatResume(copy));
  } catch (err) {
    req.log.error({ err }, "Failed to duplicate resume");
    res.status(500).json({ error: "Failed to duplicate resume" });
  }
});

function formatResume(r: typeof resumesTable.$inferSelect) {
  return {
    id: r.id,
    title: r.title,
    template: r.template,
    fullName: r.fullName ?? null,
    jobTitle: r.jobTitle ?? null,
    summary: r.summary ?? null,
    photoUrl: r.photoUrl ?? null,
    contact: r.contact ?? null,
    workExperience: r.workExperience ?? [],
    education: r.education ?? [],
    skills: r.skills ?? [],
    projects: r.projects ?? [],
    certifications: r.certifications ?? [],
    achievements: r.achievements ?? [],
    languages: r.languages ?? [],
    customSections: r.customSections ?? [],
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export default router;
