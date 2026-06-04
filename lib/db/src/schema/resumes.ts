import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const resumesTable = pgTable("resumes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("Untitled Resume"),
  template: text("template").notNull().default("classic"),
  fullName: text("full_name"),
  jobTitle: text("job_title"),
  summary: text("summary"),
  photoUrl: text("photo_url"),
  contact: jsonb("contact"),
  workExperience: jsonb("work_experience").$type<WorkExperienceEntry[]>(),
  education: jsonb("education").$type<EducationEntry[]>(),
  skills: jsonb("skills").$type<string[]>(),
  projects: jsonb("projects").$type<ProjectEntry[]>(),
  certifications: jsonb("certifications").$type<CertificationEntry[]>(),
  achievements: jsonb("achievements").$type<AchievementEntry[]>(),
  languages: jsonb("languages").$type<LanguageEntry[]>(),
  customSections: jsonb("custom_sections").$type<CustomSection[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export interface ContactInfo {
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  linkedin?: string | null;
  website?: string | null;
  github?: string | null;
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

export interface CertificationEntry {
  id: string;
  name: string;
  issuer?: string | null;
  date?: string | null;
  url?: string | null;
}

export interface AchievementEntry {
  id: string;
  title: string;
  description?: string | null;
}

export interface LanguageEntry {
  id: string;
  name: string;
  level: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string | null;
  date?: string | null;
  description?: string | null;
  bullets?: string[];
}

export interface CustomSection {
  id: string;
  heading: string;
  items: CustomSectionItem[];
}

export type Resume = typeof resumesTable.$inferSelect;
