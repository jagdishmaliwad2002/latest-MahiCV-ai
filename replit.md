# ResumeAI — CV Builder

AI-powered CV builder that lets users create, edit, and manage professional resumes with Groq-powered AI assistance.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/cv-builder run dev` — run the frontend (port 22723)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `GROQ_API_KEY` — Groq API key for AI features

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- AI: Groq (llama-3.3-70b-versatile)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all API contracts)
- `lib/db/src/schema/resumes.ts` — Drizzle schema for resumes table
- `artifacts/api-server/src/routes/resumes.ts` — Resume CRUD routes
- `artifacts/api-server/src/routes/ai.ts` — AI generation routes (summary, bullet, skills)
- `artifacts/cv-builder/src/` — React frontend

## Architecture decisions

- All resume data (work experience, education, skills, projects) stored as JSONB in a single `resumes` table for flexibility
- Groq API used for AI features: generate summary, improve bullet points, suggest skills
- OpenAPI-first: spec gates codegen which generates all React Query hooks and Zod schemas
- Live preview renders in 3 template styles: Classic, Modern, Minimal
- PDF export via `window.print()` with print-specific CSS

## Product

- Dashboard to manage multiple resumes
- Resume builder with live preview (Classic/Modern/Minimal templates)
- AI-powered summary generation, bullet point improvement, and skill suggestions
- Template selector page
- PDF download via browser print

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- Always run `pnpm run typecheck:libs` after changing lib schemas so api-server sees updated exports
- Groq model: `llama-3.3-70b-versatile`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
