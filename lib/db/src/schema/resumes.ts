import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const resumesTable = pgTable("resumes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("Untitled Resume"),
  template: text("template").notNull().default("classic"),
  fullName: text("full_name"),
  jobTitle: text("job_title"),
  summary: text("summary"),
  contact: jsonb("contact"),
  workExperience: jsonb("work_experience").$type<WorkExperienceEntry[]>(),
  education: jsonb("education").$type<EducationEntry[]>(),
  skills: jsonb("skills").$type<string[]>(),
  projects: jsonb("projects").$type<ProjectEntry[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export interface ContactInfo {
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  linkedin?: string | null;
  website?: string | null;
}

export interface WorkExperienceEntry {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  location?: string | null;
  bullets?: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field?: string | null;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  gpa?: string | null;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description?: string | null;
  url?: string | null;
  technologies?: string[];
  bullets?: string[];
}

export const insertResumeSchema = createInsertSchema(resumesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumesTable.$inferSelect;
